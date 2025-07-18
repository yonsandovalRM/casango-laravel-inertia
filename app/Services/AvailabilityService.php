<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Company;
use App\Models\Professional;
use App\Models\Service;
use Carbon\Carbon;

class AvailabilityService
{
    /**
     * Obtener profesionales disponibles para un servicio en una fecha específica
     */
    public function getAvailableProfessionals(string $serviceId, string $date): array
    {
        $parsedDate = Carbon::parse($date);
        $dayOfWeek = strtolower($parsedDate->format('l'));

        $professionals = Professional::with(['user', 'services', 'schedules', 'exceptions'])
            ->whereHas('services', function ($query) use ($serviceId) {
                $query->where('service_id', $serviceId);
            })
            ->get();

        $availableProfessionals = [];

        foreach ($professionals as $professional) {
            if ($this->isProfessionalAvailableOnDate($professional, $parsedDate, $dayOfWeek)) {
                $availableProfessionals[] = [
                    'id' => $professional->id,
                    'user' => $professional->user,
                    'photo' => $professional->photo,
                    'bio' => $professional->bio,
                    'title' => $professional->title,
                ];
            }
        }

        return [
            'professionals' => $availableProfessionals,
            'date' => $parsedDate->format('Y-m-d'),
            'service_id' => $serviceId,
        ];
    }

    /**
     * Obtener disponibilidad de un profesional específico
     */
    public function getProfessionalAvailability(string $professionalId, string $serviceId, string $date): array
    {
        $professional = Professional::with(['schedules', 'exceptions', 'services'])
            ->findOrFail($professionalId);

        $service = Service::findOrFail($serviceId);
        $parsedDate = Carbon::parse($date);
        $dayOfWeek = strtolower($parsedDate->format('l'));

        $professionalService = $professional->services()
            ->where('service_id', $service->id)
            ->first();

        if (!$professionalService) {
            throw new \Exception(__('availability.professional_service_not_found'));
        }

        $duration = $professionalService->pivot->duration ?? $service->duration;
        $price = $professionalService->pivot->price ?? $service->price;

        $workingHours = $this->getWorkingHours($professional, $dayOfWeek);

        if (!$workingHours) {
            return [
                'time_blocks' => [],
                'message' => __('availability.professional_not_available_for_date')
            ];
        }

        $timeBlocks = $this->generateAllTimeBlocks(
            $professional,
            $parsedDate,
            $workingHours,
            $duration,
            $service->preparation_time ?? 0,
            $service->post_service_time ?? 0
        );

        return [
            'time_blocks' => $timeBlocks,
            'professional' => [
                'id' => $professional->id,
                'name' => $professional->user->name,
                'photo' => $professional->photo,
            ],
            'service' => [
                'id' => $service->id,
                'name' => $service->name,
                'duration' => $duration,
                'price' => $price,
            ],
            'date' => $parsedDate->format('Y-m-d'),
        ];
    }

    /**
     * Verificar si un profesional está disponible en una fecha específica
     */
    private function isProfessionalAvailableOnDate(Professional $professional, Carbon $date, string $dayOfWeek): bool
    {
        $workingHours = $this->getWorkingHours($professional, $dayOfWeek);

        if (!$workingHours) {
            return false;
        }

        return !$professional->exceptions()
            ->whereDate('date', $date->format('Y-m-d'))
            ->exists();
    }

    /**
     * Obtener horario de trabajo del profesional o de la empresa
     */
    private function getWorkingHours(Professional $professional, string $dayOfWeek): ?array
    {
        if ($professional->is_company_schedule) {
            $company = Company::with('schedules')->first();
            $schedule = $company->schedules()->where('day_of_week', $dayOfWeek)->first();
        } else {
            $schedule = $professional->schedules()->where('day_of_week', $dayOfWeek)->first();
        }

        if (!$schedule || !$schedule->is_open) {
            return null;
        }

        return [
            'open_time' => $schedule->open_time,
            'close_time' => $schedule->close_time,
            'has_break' => $schedule->has_break,
            'break_start_time' => $schedule->break_start_time,
            'break_end_time' => $schedule->break_end_time,
        ];
    }

    /**
     * Generar todos los bloques de tiempo disponibles y no disponibles
     */
    private function generateAllTimeBlocks(
        Professional $professional,
        Carbon $date,
        array $workingHours,
        int $serviceDuration,
        int $preparationTime = 0,
        int $postServiceTime = 0
    ): array {
        $totalServiceTime = $serviceDuration + $preparationTime + $postServiceTime;

        $startTime = Carbon::parse($date->format('Y-m-d') . ' ' . $workingHours['open_time']);
        $endTime = Carbon::parse($date->format('Y-m-d') . ' ' . $workingHours['close_time']);

        $timeBlocks = [
            'morning' => [],
            'afternoon' => []
        ];

        $existingBookings = $this->getExistingBookings($professional, $date);
        $exceptions = $this->getProfessionalExceptions($professional, $date);

        $currentTime = $startTime->copy();

        while ($currentTime->copy()->addMinutes($totalServiceTime) <= $endTime) {
            $availability = $this->checkTimeSlotAvailability(
                $currentTime,
                $totalServiceTime,
                $workingHours,
                $existingBookings,
                $exceptions,
                $date
            );

            if (!$availability['available'] && $availability['reason'] === 'break_time') {
                $breakEnd = Carbon::parse($date->format('Y-m-d') . ' ' . $workingHours['break_end_time']);
                $currentTime = $breakEnd->copy();
                continue;
            }

            $timeSlot = [
                'time' => $currentTime->format('H:i'),
                'available' => $availability['available'],
                'reason' => $availability['reason'],
                'period' => $currentTime->format('H') < 12 ? 'morning' : 'afternoon'
            ];

            if ($timeSlot['period'] === 'morning') {
                $timeBlocks['morning'][] = $timeSlot;
            } else {
                $timeBlocks['afternoon'][] = $timeSlot;
            }

            $currentTime->addMinutes($totalServiceTime);
        }

        return $timeBlocks;
    }

    /**
     * Verificar disponibilidad de un slot de tiempo específico
     */
    private function checkTimeSlotAvailability(
        Carbon $currentTime,
        int $totalServiceTime,
        array $workingHours,
        $existingBookings,
        $exceptions,
        Carbon $date
    ): array {
        // Verificar horario de descanso
        if ($this->isInBreakTime($currentTime, $totalServiceTime, $workingHours, $date)) {
            return ['available' => false, 'reason' => 'break_time'];
        }

        // Verificar conflictos con reservas existentes
        if ($this->hasBookingConflict($currentTime, $totalServiceTime, $existingBookings)) {
            return ['available' => false, 'reason' => 'existing_booking'];
        }

        // Verificar conflictos con excepciones
        if ($this->hasExceptionConflict($currentTime, $totalServiceTime, $exceptions)) {
            return ['available' => false, 'reason' => 'exception'];
        }

        return ['available' => true, 'reason' => null];
    }

    /**
     * Obtener reservas existentes para el profesional en la fecha
     */
    private function getExistingBookings(Professional $professional, Carbon $date)
    {
        return Booking::where('professional_id', $professional->id)
            ->with('service')
            ->whereDate('date', $date->format('Y-m-d'))
            ->where('status', '!=', 'cancelled')
            ->get();
    }

    /**
     * Obtener excepciones del profesional para la fecha
     */
    private function getProfessionalExceptions(Professional $professional, Carbon $date)
    {
        return $professional->exceptions()
            ->whereDate('date', $date->format('Y-m-d'))
            ->get();
    }

    /**
     * Verificar si el tiempo está en horario de descanso
     */
    private function isInBreakTime(Carbon $time, int $serviceDuration, array $workingHours, Carbon $date): bool
    {
        if (!$workingHours['has_break']) {
            return false;
        }

        $serviceEndTime = $time->copy()->addMinutes($serviceDuration);
        $breakStart = Carbon::parse($date->format('Y-m-d') . ' ' . $workingHours['break_start_time']);
        $breakEnd = Carbon::parse($date->format('Y-m-d') . ' ' . $workingHours['break_end_time']);

        return $time < $breakEnd && $serviceEndTime > $breakStart;
    }

    /**
     * Verificar conflictos con reservas existentes
     */
    private function hasBookingConflict(Carbon $startTime, int $serviceDuration, $bookings): bool
    {
        $endTime = $startTime->copy()->addMinutes($serviceDuration);

        foreach ($bookings as $booking) {
            $bookingStart = Carbon::parse($booking->date . ' ' . $booking->time);
            $service = $booking->service;
            $bookingDuration = $service->duration + ($service->preparation_time ?? 0) + ($service->post_service_time ?? 0);
            $bookingEnd = $bookingStart->copy()->addMinutes($bookingDuration);

            if ($startTime < $bookingEnd && $endTime > $bookingStart) {
                return true;
            }
        }

        return false;
    }

    /**
     * Verificar conflictos con excepciones
     */
    private function hasExceptionConflict(Carbon $startTime, int $serviceDuration, $exceptions): bool
    {
        $endTime = $startTime->copy()->addMinutes($serviceDuration);

        foreach ($exceptions as $exception) {
            $exceptionStart = Carbon::parse($exception->date . ' ' . $exception->start_time);
            $exceptionEnd = Carbon::parse($exception->date . ' ' . $exception->end_time);

            if ($startTime < $exceptionEnd && $endTime > $exceptionStart) {
                return true;
            }
        }

        return false;
    }
}
