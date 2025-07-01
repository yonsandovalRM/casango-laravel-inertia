<?php

namespace App\Http\Controllers;

use App\Models\Professional;
use App\Models\Service;
use App\Models\Company;
use App\Models\Booking;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AvailabilityController extends Controller
{
    /**
     * Obtener todos los profesionales disponibles para un servicio en una fecha específica
     */
    public function getAvailableProfessionals(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date|after_or_equal:today',
        ]);

        $serviceId = $request->service_id;
        $date = Carbon::parse($request->date);
        $dayOfWeek = strtolower($date->format('l')); // monday, tuesday, etc.

        // Obtener profesionales que ofrecen este servicio
        $professionals = Professional::with(['user', 'services', 'schedules', 'exceptions'])
            ->whereHas('services', function ($query) use ($serviceId) {
                $query->where('service_id', $serviceId);
            })
            ->get();

        $availableProfessionals = [];

        foreach ($professionals as $professional) {
            if ($this->isProfessionalAvailableOnDate($professional, $date, $dayOfWeek)) {
                $availableProfessionals[] = [
                    'id' => $professional->id,
                    'user' => $professional->user,
                    'photo' => $professional->photo,
                    'bio' => $professional->bio,
                    'title' => $professional->title,
                ];
            }
        }

        return response()->json([
            'professionals' => $availableProfessionals,
            'date' => $date->format('Y-m-d'),
            'service_id' => $serviceId,
        ]);
    }

    /**
     * Obtener bloques de tiempo para un profesional específico (disponibles y no disponibles)
     */
    public function getProfessionalAvailability(Request $request)
    {
        $request->validate([
            'professional_id' => 'required|exists:professionals,id',
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date|after_or_equal:today',
        ]);

        $professional = Professional::with(['schedules', 'exceptions', 'services'])
            ->findOrFail($request->professional_id);

        $service = Service::findOrFail($request->service_id);
        $date = Carbon::parse($request->date);
        $dayOfWeek = strtolower($date->format('l')); // monday, tuesday, etc.

        // Obtener duración y precio del servicio para este profesional
        $professionalService = $professional->services()
            ->where('service_id', $service->id)
            ->first();

        if (!$professionalService) {
            return response()->json(['error' => 'Professional does not offer this service'], 404);
        }

        $duration = $professionalService->pivot->duration ?? $service->duration;
        $price = $professionalService->pivot->price ?? $service->price;

        // Obtener horario de trabajo para este día
        $workingHours = $this->getWorkingHours($professional, $dayOfWeek);

        if (!$workingHours) {
            return response()->json(['time_blocks' => [], 'message' => 'Professional not available on this day']);
        }

        // Generar todos los bloques de tiempo posibles (disponibles y no disponibles)
        $timeBlocks = $this->generateAllTimeBlocks(
            $professional,
            $date,
            $workingHours,
            $duration,
            $service->preparation_time ?? 0,
            $service->post_service_time ?? 0
        );

        return response()->json([
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
            'date' => $date->format('Y-m-d'),
        ]);
    }

    /**
     * Verificar si un profesional está disponible en una fecha específica
     */
    private function isProfessionalAvailableOnDate($professional, $date, $dayOfWeek)
    {
        // Verificar si tiene horario de trabajo para este día
        $workingHours = $this->getWorkingHours($professional, $dayOfWeek);

        if (!$workingHours) {
            return false;
        }

        // Verificar si tiene excepciones para esta fecha
        $hasException = $professional->exceptions()
            ->whereDate('date', $date->format('Y-m-d'))
            ->exists();

        return !$hasException;
    }

    /**
     * Obtener horario de trabajo según si usa horario de company o personalizado
     */
    private function getWorkingHours($professional, $dayOfWeek)
    {
        if ($professional->is_company_schedule) {
            // Usar horario de la empresa
            $company = Company::with('schedules')->first();
            $schedule = $company->schedules()->where('day_of_week', $dayOfWeek)->first();
        } else {
            // Usar horario personalizado del profesional
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
     * Generar TODOS los bloques de tiempo (disponibles y no disponibles)
     */
    private function generateAllTimeBlocks($professional, $date, $workingHours, $serviceDuration, $preparationTime = 0, $postServiceTime = 0)
    {
        $totalServiceTime = $serviceDuration + $preparationTime + $postServiceTime;

        // Convertir horarios a Carbon
        $startTime = Carbon::parse($date->format('Y-m-d') . ' ' . $workingHours['open_time']);
        $endTime = Carbon::parse($date->format('Y-m-d') . ' ' . $workingHours['close_time']);

        $timeBlocks = [
            'morning' => [],
            'afternoon' => []
        ];

        // Obtener reservas existentes para este día
        $existingBookings = Booking::where('professional_id', $professional->id)
            ->with('service')
            ->whereDate('date', $date->format('Y-m-d'))
            ->where('status', '!=', 'cancelled')
            ->get();

        // Obtener excepciones para este día
        $exceptions = $professional->exceptions()
            ->whereDate('date', $date->format('Y-m-d'))
            ->get();

        $currentTime = $startTime->copy();

        while ($currentTime->copy()->addMinutes($totalServiceTime) <= $endTime) {
            $isAvailable = true;
            $reason = null;

            // Verificar si está en horario de descanso
            if ($workingHours['has_break'] && $this->isInBreakTime($currentTime, $totalServiceTime, $workingHours)) {
                if ($this->serviceWouldOverlapBreak($currentTime, $totalServiceTime, $workingHours)) {
                    $isAvailable = false;
                    $reason = 'break_time';

                    // Avanzar al final del descanso si el servicio no cabe antes
                    $breakEnd = Carbon::parse($date->format('Y-m-d') . ' ' . $workingHours['break_end_time']);
                    $currentTime = $breakEnd->copy();
                    continue;
                }
            }

            // Verificar si hay conflictos con reservas existentes
            if ($this->hasBookingConflict($currentTime, $totalServiceTime, $existingBookings)) {
                $isAvailable = false;
                $reason = 'existing_booking';
            }

            // Verificar si hay conflictos con excepciones
            if ($this->hasExceptionConflict($currentTime, $totalServiceTime, $exceptions)) {
                $isAvailable = false;
                $reason = 'exception';
            }

            $timeSlot = [
                'time' => $currentTime->format('H:i'),
                'available' => $isAvailable,
                'reason' => $reason,
                'period' => $currentTime->format('H') < 12 ? 'morning' : 'afternoon'
            ];

            if ($timeSlot['period'] === 'morning') {
                $timeBlocks['morning'][] = $timeSlot;
            } else {
                $timeBlocks['afternoon'][] = $timeSlot;
            }

            // Avanzar exactamente la duración total del servicio
            $currentTime->addMinutes($totalServiceTime);
        }

        return $timeBlocks;
    }

    /**
     * Verificar si el tiempo está en horario de descanso o si el servicio se solaparía con el descanso
     */
    private function isInBreakTime($time, $serviceDuration, $workingHours)
    {
        if (!$workingHours['has_break']) {
            return false;
        }

        $serviceEndTime = $time->copy()->addMinutes($serviceDuration);
        $breakStart = Carbon::parse($time->format('Y-m-d') . ' ' . $workingHours['break_start_time']);
        $breakEnd = Carbon::parse($time->format('Y-m-d') . ' ' . $workingHours['break_end_time']);

        // Verificar si el servicio se solaparía con el horario de descanso
        return $time < $breakEnd && $serviceEndTime > $breakStart;
    }

    /**
     * Verificar si el servicio se solaparía con el horario de descanso
     */
    private function serviceWouldOverlapBreak($startTime, $serviceDuration, $workingHours)
    {
        if (!$workingHours['has_break']) {
            return false;
        }

        $serviceEndTime = $startTime->copy()->addMinutes($serviceDuration);
        $breakStart = Carbon::parse($startTime->format('Y-m-d') . ' ' . $workingHours['break_start_time']);
        $breakEnd = Carbon::parse($startTime->format('Y-m-d') . ' ' . $workingHours['break_end_time']);

        return $startTime < $breakEnd && $serviceEndTime > $breakStart;
    }

    /**
     * Verificar conflictos con reservas existentes
     */
    private function hasBookingConflict($startTime, $serviceDuration, $bookings)
    {
        $endTime = $startTime->copy()->addMinutes($serviceDuration);

        foreach ($bookings as $booking) {
            $bookingStart = Carbon::parse($booking->date . ' ' . $booking->time);

            // Obtener la duración del servicio de la reserva (incluyendo tiempos adicionales)
            $service = $booking->service;
            $bookingDuration = $service->duration + ($service->preparation_time ?? 0) + ($service->post_service_time ?? 0);
            $bookingEnd = $bookingStart->copy()->addMinutes($bookingDuration);

            // Verificar solapamiento
            if ($startTime < $bookingEnd && $endTime > $bookingStart) {
                return true;
            }
        }

        return false;
    }

    /**
     * Verificar conflictos con excepciones
     */
    private function hasExceptionConflict($startTime, $serviceDuration, $exceptions)
    {
        $endTime = $startTime->copy()->addMinutes($serviceDuration);

        foreach ($exceptions as $exception) {
            $exceptionStart = Carbon::parse($exception->date . ' ' . $exception->start_time);
            $exceptionEnd = Carbon::parse($exception->date . ' ' . $exception->end_time);

            // Verificar solapamiento
            if ($startTime < $exceptionEnd && $endTime > $exceptionStart) {
                return true;
            }
        }

        return false;
    }
}
