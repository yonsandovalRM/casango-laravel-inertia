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
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;



class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = User::find(Auth::user()->id);
        $bookings = [];

        if ($user->hasRole('professional')) {
            $bookings = Booking::where('professional_id', $user->id)->get();
        } else {
            $bookings = Booking::where('client_id', $user->id)->get();
        }
        return Inertia::render('bookings/index', [
            'bookings' => BookingResource::collection($bookings)->toArray(request()),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookingRequest $request, Booking $booking)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        //
    }
}
