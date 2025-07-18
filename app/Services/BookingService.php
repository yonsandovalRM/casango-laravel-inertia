<?php

namespace App\Services;

use App\Enums\BookingDeliveryType;
use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Enums\ServiceType;
use App\Models\Booking;
use App\Models\Professional;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class BookingService
{
    public function __construct(
        private BookingFormService $bookingFormService,
        private VideoCallService $videoCallService
    ) {}

    /**
     * Crear una nueva reserva
     */
    public function createBooking(array $data): Booking
    {
        return DB::transaction(function () use ($data) {
            // Buscar cliente
            $client = User::where('email', $data['client']['email'])->firstOrFail();

            // Obtener profesional y servicio
            $professional = Professional::findOrFail($data['professional']);
            $service = $professional->services()
                ->where('services.id', $data['service'])
                ->firstOrFail();

            // Validar compatibilidad del tipo de entrega con el servicio
            $this->validateDeliveryTypeCompatibility($service, $data['delivery_type'] ?? null);

            // Verificar disponibilidad
            $this->validateAvailability($professional, $data['date'], $data['time'], $service);

            // Calcular precios
            $discount = $data['discount'] ?? 0;
            $price = $service->pivot->price ?? $service->price;
            $total = $price - $discount;

            // Crear reserva
            $booking = Booking::create([
                'client_id' => $client->id,
                'professional_id' => $professional->id,
                'service_id' => $service->id,
                'date' => $data['date'],
                'time' => $data['time'],
                'notes' => $data['client']['notes'] ?? null,
                'status' => BookingStatus::STATUS_PENDING,
                'price' => $price,
                'duration' => $service->pivot->duration ?? $service->duration,
                'discount' => $discount,
                'total' => $total,
                'phone' => $data['client']['phone'],
                'payment_status' => PaymentStatus::STATUS_PENDING,
                'delivery_type' => $data['delivery_type'] ?? BookingDeliveryType::IN_PERSON->value,
            ]);

            // Generar link de videollamada si es necesario
            if ($booking->delivery_type === BookingDeliveryType::VIDEO_CALL->value) {
                $videoLink = $this->videoCallService->generateVideoCallLink($booking);
                $booking->update(['video_call_link' => $videoLink]);
            }

            // Inicializar formularios
            $this->bookingFormService->initializeBookingForms($booking);

            return $booking->load(['client', 'professional.user', 'service']);
        });
    }

    /**
     * Actualizar una reserva
     */
    public function updateBooking(Booking $booking, array $data): Booking
    {
        return DB::transaction(function () use ($booking, $data) {
            // Si se cambia el tipo de entrega
            if (isset($data['delivery_type']) && $data['delivery_type'] !== $booking->delivery_type) {
                $this->handleDeliveryTypeChange($booking, $data['delivery_type']);
            }

            // Si se reagenda la reserva
            if (isset($data['date']) || isset($data['time'])) {
                $this->validateReschedule($booking, $data['date'] ?? $booking->date, $data['time'] ?? $booking->time);
            }

            $booking->update(array_filter($data, fn($value) => $value !== null));

            return $booking->fresh(['client', 'professional.user', 'service']);
        });
    }

    /**
     * Cambiar estado de una reserva
     */
    public function changeBookingStatus(Booking $booking, string $status): Booking
    {
        $oldStatus = $booking->status;
        $booking->update(['status' => $status]);

        // Lógica adicional según el cambio de estado
        $this->handleStatusChange($booking, $oldStatus, $status);

        return $booking->fresh();
    }

    /**
     * Reagendar una reserva
     */
    public function rescheduleBooking(Booking $booking, string $date, string $time): Booking
    {
        $this->validateReschedule($booking, $date, $time);

        return DB::transaction(function () use ($booking, $date, $time) {
            $booking->update([
                'date' => $date,
                'time' => $time,
                'status' => BookingStatus::STATUS_RESCHEDULED
            ]);

            return $booking->fresh();
        });
    }

    /**
     * Obtener reservas con filtros
     */
    public function getFilteredBookings(array $filters, ?string $professionalId = null, ?string $clientId = null): Collection
    {
        $query = Booking::with(['professional.user', 'service', 'client']);

        // Filtrar por profesional o cliente
        if ($professionalId) {
            $query->where('professional_id', $professionalId);
        }

        if ($clientId) {
            $query->where('client_id', $clientId);
        }

        // Aplicar filtros
        $this->applyFilters($query, $filters);

        // Aplicar ordenamiento
        $this->applySorting($query, $filters['sort_by'] ?? 'date', $filters['sort_direction'] ?? 'desc');

        return $query->get();
    }

    /**
     * Obtener reservas para calendario
     */
    public function getCalendarBookings(string $professionalId, array $filters = []): Collection
    {
        $defaultFilters = [
            'status' => 'all',
            'date_from' => now()->startOfWeek()->format('Y-m-d'),
            'date_to' => now()->endOfWeek()->format('Y-m-d'),
        ];

        $filters = array_merge($defaultFilters, $filters);

        $query = Booking::with(['client', 'service', 'professional.user'])
            ->where('professional_id', $professionalId);

        // Aplicar filtros de fecha
        if (!empty($filters['date_from'])) {
            $query->where('date', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->where('date', '<=', $filters['date_to']);
        }

        // Aplicar filtro de estado
        if ($filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('date')->orderBy('time')->get();
    }

    /**
     * Validar compatibilidad del tipo de entrega con el servicio
     */
    private function validateDeliveryTypeCompatibility(Service $service, ?string $deliveryType): void
    {
        if (!$deliveryType) {
            return;
        }

        $serviceType = ServiceType::from($service->service_type);
        $bookingDeliveryType = BookingDeliveryType::from($deliveryType);

        if ($bookingDeliveryType === BookingDeliveryType::VIDEO_CALL && !$serviceType->allowsVideoCall()) {
            throw new \Exception(__('booking.service_does_not_support_video_calls'));
        }

        if ($bookingDeliveryType === BookingDeliveryType::IN_PERSON && !$serviceType->allowsInPerson()) {
            throw new \Exception(__('booking.service_does_not_support_in_person'));
        }
    }

    /**
     * Validar disponibilidad para la reserva
     */
    private function validateAvailability(Professional $professional, string $date, string $time, Service $service): void
    {
        $existingBooking = Booking::where('professional_id', $professional->id)
            ->where('date', $date)
            ->where('time', $time)
            ->where('status', '!=', BookingStatus::STATUS_CANCELLED)
            ->first();

        if ($existingBooking) {
            throw new \Exception(__('booking.time_slot_not_available'));
        }

        // TODO: Verificar también horarios de trabajo y excepciones
        // Se puede integrar con AvailabilityService
    }

    /**
     * Validar reagendamiento
     */
    private function validateReschedule(Booking $booking, string $date, string $time): void
    {
        $existingBooking = Booking::where('professional_id', $booking->professional_id)
            ->where('date', $date)
            ->where('time', $time)
            ->where('status', '!=', BookingStatus::STATUS_CANCELLED)
            ->where('id', '!=', $booking->id)
            ->first();

        if ($existingBooking) {
            throw new \Exception(__('booking.time_slot_not_available'));
        }
    }

    /**
     * Manejar cambio de tipo de entrega
     */
    private function handleDeliveryTypeChange(Booking $booking, string $newDeliveryType): void
    {
        $this->validateDeliveryTypeCompatibility($booking->service, $newDeliveryType);

        if ($newDeliveryType === BookingDeliveryType::VIDEO_CALL->value && !$booking->video_call_link) {
            // Generar link de videollamada
            $videoLink = $this->videoCallService->generateVideoCallLink($booking);
            $booking->video_call_link = $videoLink;
        } elseif ($newDeliveryType === BookingDeliveryType::IN_PERSON->value) {
            // Limpiar link de videollamada
            $booking->video_call_link = null;
        }
    }

    /**
     * Manejar cambios de estado
     */
    private function handleStatusChange(Booking $booking, string $oldStatus, string $newStatus): void
    {
        // Lógica específica según el cambio de estado
        switch ($newStatus) {
            case BookingStatus::STATUS_CONFIRMED:
                // Enviar notificaciones, etc.
                break;
            case BookingStatus::STATUS_CANCELLED:
                // Limpiar recursos, notificar, etc.
                break;
            case BookingStatus::STATUS_COMPLETED:
                // Procesar pago, enviar seguimiento, etc.
                break;
        }
    }

    /**
     * Aplicar filtros a la consulta
     */
    private function applyFilters(Builder $query, array $filters): void
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
        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        // Filtro de servicio
        if (!empty($filters['service']) && $filters['service'] !== 'all') {
            $query->where('service_id', $filters['service']);
        }

        // Filtro de tipo de entrega
        if (!empty($filters['delivery_type']) && $filters['delivery_type'] !== 'all') {
            $query->where('delivery_type', $filters['delivery_type']);
        }

        // Filtros de fecha
        if (!empty($filters['date_from'])) {
            $query->where('date', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->where('date', '<=', $filters['date_to']);
        }
    }

    /**
     * Aplicar ordenamiento
     */
    private function applySorting(Builder $query, string $sortBy, string $sortDirection): void
    {
        $allowedSortFields = ['date', 'time', 'status', 'total', 'created_at'];
        $allowedDirections = ['asc', 'desc'];

        if (in_array($sortBy, $allowedSortFields) && in_array($sortDirection, $allowedDirections)) {
            if ($sortBy === 'date') {
                $query->orderBy('date', $sortDirection)->orderBy('time', $sortDirection);
            } else {
                $query->orderBy($sortBy, $sortDirection);
            }
        }
    }
}
