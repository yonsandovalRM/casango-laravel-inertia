<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Http\Requests\Bookings\StoreBookingRequest;
use App\Http\Requests\Bookings\UpdateBookingRequest;
use App\Http\Resources\BookingResource;
use App\Http\Resources\ProfessionalResource;
use App\Models\Booking;
use App\Models\BookingFormData;
use App\Models\FormTemplate;
use App\Models\Professional;
use App\Models\Service;
use App\Models\User;
use App\Models\UserProfileData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    public function index()
    {
        $user = User::find(Auth::user()->id);
        $professional = Professional::where('user_id', $user->id)->firstOrFail();

        $bookings = Booking::where('professional_id', $professional->id)
            ->where('status', BookingStatus::STATUS_PENDING)
            ->orWhere('status', BookingStatus::STATUS_CONFIRMED)
            ->get();

        return Inertia::render('bookings/index', [
            'professional' => ProfessionalResource::make($professional)->toArray(request()),
            'bookings' => BookingResource::collection($bookings)->toArray(request()),
        ]);
    }

    public function show(Booking $booking)
    {
        // Obtener templates activos con sus campos ordenados
        $templates = $this->getActiveTemplates();

        // Verificar que ambos templates existen
        $this->validateTemplatesExist($templates);

        // Preparar datos del cliente
        $clientData = $this->prepareClientData($booking, $templates['user_profile']);

        // Preparar datos de la reserva
        $bookingData = $this->prepareBookingData($booking, $templates['booking_form']);

        // Obtener historial de reservas del cliente
        $bookingHistory = $this->getClientBookingHistory($booking, $templates['booking_form']);

        return Inertia::render('bookings/show', [
            'user_profile_data' => $clientData['user_profile_data'],
            'booking_form_data' => $bookingData['booking_form_data'],
            'user_profile_template' => $templates['user_profile'],
            'booking_form_template' => $templates['booking_form'],
            'booking_history' => $bookingHistory,
            'booking' => BookingResource::make($booking)->toArray(request()),
        ]);
    }

    /**
     * Obtiene los templates activos con sus campos ordenados
     */
    protected function getActiveTemplates(): array
    {
        $withOrderedFields = function ($query) {
            $query->orderBy('order');
        };

        return [
            'user_profile' => FormTemplate::userProfile()
                ->active()
                ->with(['fields' => $withOrderedFields])
                ->first(),

            'booking_form' => FormTemplate::bookingForm()
                ->active()
                ->with(['fields' => $withOrderedFields])
                ->first()
        ];
    }

    /**
     * Valida que ambos templates existan
     */
    protected function validateTemplatesExist(array $templates): void
    {
        if (!$templates['user_profile'] || !$templates['booking_form']) {
            abort(404, __('booking.templates_not_found'));
        }
    }

    /**
     * Prepara los datos del cliente
     */
    protected function prepareClientData(Booking $booking, FormTemplate $userProfileTemplate): array
    {
        $client = $booking->client;

        $userProfileData = UserProfileData::firstOrCreate([
            'user_id' => $client->id,
            'form_template_id' => $userProfileTemplate->id,
        ], [
            'data' => $this->initializeFormData($userProfileTemplate)
        ]);

        return [
            'user_profile_data' => $userProfileData,
            'client' => $client
        ];
    }

    /**
     * Prepara los datos de la reserva
     */
    protected function prepareBookingData(Booking $booking, FormTemplate $bookingFormTemplate): array
    {
        $bookingFormData = BookingFormData::firstOrCreate([
            'booking_id' => $booking->id,
            'form_template_id' => $bookingFormTemplate->id,
        ], [
            'data' => $this->initializeFormData($bookingFormTemplate),
            'is_visible_to_team' => true,
        ]);

        return [
            'booking_form_data' => $bookingFormData
        ];
    }

    /**
     * Obtiene el historial de reservas del cliente
     */
    protected function getClientBookingHistory(Booking $currentBooking, FormTemplate $bookingFormTemplate)
    {
        $bookingHistory = Booking::where('client_id', $currentBooking->client_id)
            ->where('id', '!=', $currentBooking->id)
            ->where('status', '!=', BookingStatus::STATUS_CANCELLED)
            ->where('date', '<', $currentBooking->date)
            ->with([
                'service',
                'professional.user',
                'bookingFormData' => function ($query) use ($bookingFormTemplate) {
                    $query->where('form_template_id', $bookingFormTemplate->id);
                }
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        return $bookingHistory->map(function ($historyBooking) use ($bookingFormTemplate) {
            return $this->mapBookingHistoryItem($historyBooking, $bookingFormTemplate);
        });
    }

    /**
     * Mapea un item del historial de reservas
     */
    protected function mapBookingHistoryItem(Booking $historyBooking, FormTemplate $bookingFormTemplate): array
    {
        $historyData = $historyBooking->toArray();
        $historyData['mapped_form_data'] = $this->mapFormData($historyBooking, $bookingFormTemplate);


        return $historyData;
    }

    /**
     * Mapea los datos del formulario de una reserva
     */
    protected function mapFormData(Booking $booking, FormTemplate $template): array
    {
        if (!$booking->bookingFormData || !$booking->bookingFormData->data) {
            return [];
        }

        $formData = $booking->bookingFormData->data;
        $mappedData = [];

        if (is_array($formData) && !empty($formData)) {
            foreach ($formData as $fieldName => $fieldValue) {
                if (!is_numeric($fieldName)) {
                    $field = $template->fields->firstWhere('name', $fieldName);
                    $value = is_array($fieldValue) ? ($fieldValue['value'] ?? $fieldValue) : $fieldValue;

                    $mappedData[] = [
                        'name' => $fieldName,
                        'label' => $field ? $field->label : $fieldName,
                        'value' => $value,
                        'type' => $field ? $field->type : 'text'
                    ];
                }
            }
        }

        return $mappedData;
    }



    public function storeFormDataUserProfile(Request $request, Booking $booking)
    {
        $template = FormTemplate::where('type', 'user_profile')
            ->where('is_active', true)
            ->with('fields')
            ->firstOrFail();

        // Validar datos dinámicamente
        $validator = $this->validateFormData($request->all(), $template);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $client = $booking->client;
        $userProfileData = UserProfileData::where('user_id', $client->id)
            ->where('form_template_id', $template->id)
            ->first();

        if ($userProfileData) {
            $userProfileData->update([
                'data' => $request->all()
            ]);
        } else {
            UserProfileData::create([
                'user_id' => $client->id,
                'form_template_id' => $template->id,
                'data' => $request->all()
            ]);
        }

        return back()->with('success', 'Perfil de usuario actualizado correctamente');
    }

    public function storeFormDataBookingForm(Request $request, Booking $booking)
    {
        $template = FormTemplate::where('type', 'booking_form')
            ->where('is_active', true)
            ->with('fields')
            ->firstOrFail();

        // Validar datos dinámicamente
        $validator = $this->validateFormData($request->all(), $template);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $bookingFormData = BookingFormData::where('booking_id', $booking->id)
            ->where('form_template_id', $template->id)
            ->first();

        if ($bookingFormData) {
            $bookingFormData->update([
                'data' => $request->all()
            ]);
        } else {
            BookingFormData::create([
                'booking_id' => $booking->id,
                'form_template_id' => $template->id,
                'data' => $request->all(),
                'is_visible_to_team' => true
            ]);
        }

        return back()->with('success', 'Datos de reserva actualizados correctamente');
    }

    /**
     * Inicializar datos del formulario con valores por defecto
     */
    private function initializeFormData(FormTemplate $template): array
    {
        $data = [];

        foreach ($template->fields as $field) {
            $data[$field->name] = $field->default_value ?? '';
        }

        return $data;
    }

    /**
     * Validar datos del formulario dinámicamente
     */
    private function validateFormData(array $data, FormTemplate $template)
    {
        $rules = [];
        $messages = [];

        foreach ($template->fields as $field) {
            $fieldRules = [];

            if ($field->is_required) {
                $fieldRules[] = 'required';
            }

            // Agregar reglas específicas por tipo de campo
            switch ($field->type) {
                case 'email':
                    $fieldRules[] = 'email';
                    break;
                case 'number':
                    $fieldRules[] = 'numeric';
                    break;
                case 'date':
                    $fieldRules[] = 'date';
                    break;
                case 'time':
                    $fieldRules[] = 'date_format:H:i';
                    break;
                case 'tel':
                    $fieldRules[] = 'string|max:20';
                    break;
                case 'url':
                    $fieldRules[] = 'url';
                    break;
                case 'select':
                    if ($field->options) {
                        $fieldRules[] = 'in:' . implode(',', $field->options);
                    }
                    break;
                case 'checkbox':
                    $fieldRules[] = 'boolean';
                    break;
                case 'file':
                    $fieldRules[] = 'file|max:10240'; // 10MB max
                    break;
            }

            if (!empty($fieldRules)) {
                $rules[$field->name] = implode('|', $fieldRules);
            }

            // Mensajes personalizados
            if ($field->is_required) {
                $messages[$field->name . '.required'] = "El campo {$field->label} es obligatorio";
            }
        }

        return Validator::make($data, $rules, $messages);
    }

    // ... resto de métodos existentes sin cambios

    /**
     * Display a listing of client bookings with filters.
     */
    public function historyClient(Request $request)
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
            'sort_direction' => 'desc'
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

        return Inertia::render('bookings/history-client', [
            'bookings' => BookingResource::collection($bookings)->toArray(request()),
            'filters' => $filters,
            'services' => $services,
        ]);
    }

    /**
     * Display a listing of professional bookings with filters.
     */
    public function historyProfessional(Request $request)
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
            'sort_direction' => 'desc'
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

        return Inertia::render('bookings/history-professional', [
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
