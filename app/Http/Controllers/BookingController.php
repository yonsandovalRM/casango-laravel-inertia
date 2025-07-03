<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Http\Requests\Bookings\StoreBookingRequest;
use App\Http\Requests\Bookings\UpdateBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Professional;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display a listing of client bookings with filters.
     */
    public function client(Request $request)
    {
        $user = User::find(Auth::user()->id);

        // Obtener filtros de la query string
        $filters = $request->only([
            'search',
            'status',
            'service',
            'date_from',
            'date_to',
            'sort_by',
            'sort_direction'
        ]);

        // Aplicar valores por defecto
        $filters = array_merge([
            'search' => '',
            'status' => 'all',
            'service' => 'all',
            'date_from' => now()->format('Y-m-d'),
            'date_to' => now()->format('Y-m-d'),
            'sort_by' => 'date',
            'sort_direction' => 'asc'
        ], $filters);

        // Construir query base
        $bookingsQuery = Booking::with(['professional.user', 'service', 'client'])
            ->where('client_id', $user->id);

        // Aplicar filtros
        $this->applyBookingFilters($bookingsQuery, $filters);

        // Aplicar ordenamiento
        $this->applySorting($bookingsQuery, $filters['sort_by'], $filters['sort_direction']);

        $bookings = $bookingsQuery->get();

        // Obtener servicios únicos para el filtro
        $services = Service::whereHas('bookings', function ($query) use ($user) {
            $query->where('client_id', $user->id);
        })->select('id', 'name')->get();

        return Inertia::render('bookings/client', [
            'bookings' => BookingResource::collection($bookings)->toArray(request()),
            'filters' => $filters,
            'services' => $services,
        ]);
    }

    /**
     * Display a listing of professional bookings with filters.
     */
    public function professional(Request $request)
    {
        $user = User::find(Auth::user()->id);

        // Obtener filtros de la query string
        $filters = $request->only([
            'search',
            'status',
            'service',
            'date_from',
            'date_to',
            'sort_by',
            'sort_direction'
        ]);

        // Aplicar valores por defecto
        $filters = array_merge([
            'search' => '',
            'status' => 'all',
            'service' => 'all',
            'date_from' => '',
            'date_to' => '',
            'sort_by' => 'date',
            'sort_direction' => 'asc'
        ], $filters);

        // Construir query base
        $bookingsQuery = Booking::with(['client', 'service', 'professional.user'])
            ->where('professional_id', $user->id);

        // Aplicar filtros
        $this->applyBookingFilters($bookingsQuery, $filters);

        // Aplicar ordenamiento
        $this->applySorting($bookingsQuery, $filters['sort_by'], $filters['sort_direction']);

        $bookings = $bookingsQuery->get();

        // Obtener servicios únicos para el filtro
        $services = Service::whereHas('bookings', function ($query) use ($user) {
            $query->where('professional_id', $user->id);
        })->select('id', 'name')->get();

        return Inertia::render('bookings/professional', [
            'bookings' => BookingResource::collection($bookings)->toArray(request()),
            'filters' => $filters,
            'services' => $services,
        ]);
    }

    /**
     * Apply booking filters to the query.
     */
    private function applyBookingFilters($query, array $filters)
    {
        // Filtro de búsqueda
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->whereHas('service', function ($serviceQuery) use ($search) {
                    $serviceQuery->where('name', 'like', "%{$search}%");
                })
                    ->orWhereHas('professional.user', function ($professionalQuery) use ($search) {
                        $professionalQuery->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('client', function ($clientQuery) use ($search) {
                        $clientQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        // Filtro de estado
        if ($filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        // Filtro de servicio
        if ($filters['service'] !== 'all') {
            $query->where('service_id', $filters['service']);
        }

        // Filtro de fecha desde
        if (!empty($filters['date_from'])) {
            $query->where('date', '>=', $filters['date_from']);
        }

        // Filtro de fecha hasta
        if (!empty($filters['date_to'])) {
            $query->where('date', '<=', $filters['date_to']);
        }
    }

    /**
     * Apply sorting to the query.
     */
    private function applySorting($query, string $sortBy, string $sortDirection)
    {
        $allowedSortFields = ['date', 'time', 'status', 'total', 'created_at'];
        $allowedDirections = ['asc', 'desc'];

        if (in_array($sortBy, $allowedSortFields) && in_array($sortDirection, $allowedDirections)) {
            if ($sortBy === 'date') {
                $query->orderBy('date', $sortDirection)
                    ->orderBy('time', $sortDirection);
            } else {
                $query->orderBy($sortBy, $sortDirection);
            }
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookingRequest $request)
    {
        $client = User::where('email', $request->client['email'])->firstOrFail();

        // Obtener el profesional con el servicio específico y sus datos pivot
        $professional = Professional::findOrFail($request->professional);

        // Cargar el servicio específico con los datos pivot
        $service = $professional->services()
            ->where('services.id', $request->service)
            ->firstOrFail();

        $discount = 0; // TODO: Implementar descuento mediante cupones o promociones

        $booking = Booking::create([
            'client_id' => $client->id,
            'professional_id' => $professional->id,
            'service_id' => $service->id,
            'date' => $request->date,
            'time' => $request->time,
            'notes' => $request->client['notes'] ?? null,
            'status' => BookingStatus::STATUS_PENDING,
            'price' => $service->pivot->price,
            'duration' => $service->pivot->duration,
            'discount' => $discount,
            'total' => $service->pivot->price - $discount,
            'phone' => $request->client['phone'],
            'payment_status' => PaymentStatus::STATUS_PENDING,
        ]);

        return redirect()->back()->with('success', __('booking.created'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookingRequest $request, Booking $booking)
    {
        $booking->update($request->validated());

        return redirect()->back()->with('success', __('booking.updated'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        //
    }
}
