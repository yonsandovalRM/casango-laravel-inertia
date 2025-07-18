<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Http\Requests\Bookings\StoreBookingRequest;
use App\Http\Requests\Bookings\UpdateBookingRequest;
use App\Http\Resources\BookingResource;
use App\Http\Resources\ProfessionalResource;
use App\Models\Booking;
use App\Models\FormTemplate;
use App\Models\Professional;
use App\Models\Service;
use App\Models\User;
use App\Models\UserProfileData;
use App\Services\BookingFormService;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function __construct(
        private BookingFormService $bookingFormService,
        private BookingService $bookingService
    ) {}

    /**
     * Mostrar reservas del profesional
     */
    public function index()
    {
        try {
            $user = User::find(Auth::user()->id);
            $professional = Professional::where('user_id', $user->id)->firstOrFail();

            $bookings = $this->bookingService->getFilteredBookings([], $professional->id);

            return Inertia::render('bookings/index', [
                'professional' => ProfessionalResource::make($professional)->toArray(request()),
                'bookings' => BookingResource::collection($bookings)->toArray(request()),
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Mostrar detalle de reserva
     */
    public function show(Booking $booking)
    {
        try {
            // Obtener template de perfil de usuario
            $userProfileTemplate = FormTemplate::userProfile()
                ->active()
                ->with(['fields' => function ($query) {
                    $query->orderBy('order');
                }])
                ->first();

            if (!$userProfileTemplate) {
                abort(404, __('booking.user_profile_template_not_found'));
            }

            // Obtener templates de booking forms
            $bookingFormTemplates = FormTemplate::bookingForm()
                ->active()
                ->with(['fields' => function ($query) {
                    $query->orderBy('order');
                }])
                ->orderBy('name')
                ->get();

            // Preparar datos del cliente
            $clientData = $this->prepareClientData($booking, $userProfileTemplate);

            // Obtener datos de formularios
            $bookingFormsData = $this->bookingFormService->getBookingFormsData($booking);
            $bookingHistory = $this->bookingFormService->getBookingHistoryWithForms($booking);

            return Inertia::render('bookings/show', [
                'user_profile_data' => $clientData['user_profile_data'],
                'booking_forms_data' => $bookingFormsData,
                'user_profile_template' => $userProfileTemplate,
                'booking_forms_templates' => $bookingFormTemplates,
                'booking_history' => $bookingHistory,
                'booking' => BookingResource::make($booking)->toArray(request()),
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Crear nueva reserva
     */
    public function store(StoreBookingRequest $request)
    {
        try {
            $this->bookingService->createBooking($request->validated());
            return redirect()->back()->with('success', __('booking.created'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    /**
     * Actualizar reserva
     */
    public function update(UpdateBookingRequest $request, Booking $booking)
    {
        try {
            $this->bookingService->updateBooking($booking, $request->validated());
            return redirect()->back()->with('success', __('booking.updated'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    /**
     * Historial de reservas del cliente
     */
    public function historyClient(Request $request)
    {
        try {
            $user = User::find(Auth::user()->id);
            $filters = $this->getFiltersFromRequest($request);

            $bookings = $this->bookingService->getFilteredBookings($filters, null, $user->id);

            // Obtener servicios para filtros
            $services = Service::whereHas('bookings', function ($query) use ($user) {
                $query->where('client_id', $user->id);
            })->select('id', 'name')->get();

            return Inertia::render('bookings/history-client', [
                'bookings' => BookingResource::collection($bookings)->toArray(request()),
                'filters' => $filters,
                'services' => $services,
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Historial de reservas del profesional
     */
    public function historyProfessional(Request $request)
    {
        try {
            $user = User::find(Auth::user()->id);
            $professional = Professional::where('user_id', $user->id)->firstOrFail();
            $filters = $this->getFiltersFromRequest($request);

            $bookings = $this->bookingService->getFilteredBookings($filters, $professional->id);

            // Obtener servicios para filtros
            $services = Service::whereHas('bookings', function ($query) use ($professional) {
                $query->where('professional_id', $professional->id);
            })->select('id', 'name')->get();

            return Inertia::render('bookings/history-professional', [
                'bookings' => BookingResource::collection($bookings)->toArray(request()),
                'filters' => $filters,
                'services' => $services,
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Datos para calendario
     */
    public function calendar(Request $request)
    {
        try {
            $user = User::find(Auth::user()->id);
            $professional = Professional::where('user_id', $user->id)->firstOrFail();

            $filters = $request->only(['status', 'date_from', 'date_to']);
            $bookings = $this->bookingService->getCalendarBookings($professional->id, $filters);

            return response()->json([
                'bookings' => BookingResource::collection($bookings),
                'filters' => array_merge([
                    'status' => 'all',
                    'date_from' => now()->startOfWeek()->format('Y-m-d'),
                    'date_to' => now()->endOfWeek()->format('Y-m-d'),
                ], $filters)
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Confirmar reserva
     */
    public function confirm(Booking $booking)
    {
        try {
            $this->bookingService->changeBookingStatus($booking, BookingStatus::STATUS_CONFIRMED);
            return back()->with('success', __('booking.confirmed_successfully'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Cancelar reserva
     */
    public function cancel(Booking $booking)
    {
        try {
            $this->bookingService->changeBookingStatus($booking, BookingStatus::STATUS_CANCELLED);
            return back()->with('success', __('booking.cancelled_successfully'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Completar reserva
     */
    public function complete(Booking $booking)
    {
        try {
            $this->bookingService->changeBookingStatus($booking, BookingStatus::STATUS_COMPLETED);
            return back()->with('success', __('booking.completed_successfully'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Marcar como no show
     */
    public function noShow(Booking $booking)
    {
        try {
            $this->bookingService->changeBookingStatus($booking, BookingStatus::STATUS_NO_SHOW);
            return back()->with('success', __('booking.no_show_marked'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Reagendar reserva
     */
    public function reschedule(Request $request, Booking $booking)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
        ]);

        try {
            $this->bookingService->rescheduleBooking($booking, $request->date, $request->time);
            return back()->with('success', __('booking.rescheduled_successfully'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Guardar datos de formulario de perfil
     */
    public function storeFormDataUserProfile(Request $request, Booking $booking)
    {
        try {
            $template = FormTemplate::where('type', 'user_profile')
                ->where('is_active', true)
                ->with('fields')
                ->firstOrFail();

            $validator = $this->validateFormData($request->all(), $template);

            if ($validator->fails()) {
                return back()->withErrors($validator)->withInput();
            }

            $client = $booking->client;
            UserProfileData::updateOrCreate([
                'user_id' => $client->id,
                'form_template_id' => $template->id,
            ], [
                'data' => $request->all()
            ]);

            return back()->with('success', __('booking.user_profile_updated'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    /**
     * Guardar datos de formulario de reserva
     */
    public function storeFormDataBookingForm(Request $request, Booking $booking, $templateId)
    {
        try {
            $this->bookingFormService->saveBookingFormData($booking, $templateId, $request->all());

            $template = FormTemplate::find($templateId);
            $templateName = $template ? $template->name : 'formulario';

            return back()->with('success', __('booking.form_updated', ['form' => $templateName]));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    /**
     * Clonar datos de formularios
     */
    public function cloneFormData(Request $request, Booking $booking)
    {
        $request->validate([
            'source_booking_id' => 'required|exists:bookings,id'
        ]);

        try {
            $sourceBooking = Booking::find($request->source_booking_id);

            if ($sourceBooking->client_id !== $booking->client_id) {
                return back()->withErrors(['error' => 'No puedes clonar datos de otro cliente']);
            }

            $this->bookingFormService->cloneBookingFormsData($sourceBooking, $booking);
            return back()->with('success', 'Datos de formularios clonados exitosamente');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al clonar datos: ' . $e->getMessage()]);
        }
    }

    /**
     * Exportar datos de formularios
     */
    public function exportFormData(Booking $booking)
    {
        try {
            $exportData = $this->bookingFormService->exportBookingFormsData($booking);
            $filename = "booking_forms_data_{$booking->id}_{$booking->date}.json";

            return response()->json($exportData)
                ->header('Content-Disposition', "attachment; filename=\"{$filename}\"")
                ->header('Content-Type', 'application/json');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al exportar datos: ' . $e->getMessage()]);
        }
    }

    // Métodos helper privados

    /**
     * Preparar datos del cliente
     */
    private function prepareClientData(Booking $booking, FormTemplate $userProfileTemplate): array
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
     * Obtener filtros de la request
     */
    private function getFiltersFromRequest(Request $request): array
    {
        $filters = $request->only([
            'search',
            'status',
            'service',
            'delivery_type',
            'date_from',
            'date_to',
            'sort_by',
            'sort_direction'
        ]);

        return array_merge([
            'search' => '',
            'status' => 'all',
            'service' => 'all',
            'delivery_type' => 'all',
            'date_from' => now()->format('Y-m-d'),
            'date_to' => now()->format('Y-m-d'),
            'sort_by' => 'date',
            'sort_direction' => 'desc'
        ], $filters);
    }

    /**
     * Inicializar datos del formulario
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
}
