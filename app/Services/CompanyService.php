<?php

namespace App\Services;

use App\Models\Company;
use App\Models\CompanySchedule;
use Illuminate\Support\Facades\DB;

class CompanyService
{
    /**
     * Obtener información de la empresa con horarios
     */
    public function getCompanyWithSchedules(): ?Company
    {
        return Company::with('schedules')->first();
    }

    /**
     * Actualizar información de la empresa
     */
    public function updateCompany(array $data): Company
    {
        return DB::transaction(function () use ($data) {
            $company = Company::first();

            if (!$company) {
                throw new \Exception(__('company.not_found'));
            }

            // Extraer schedules de los datos
            $schedules = $data['schedules'] ?? [];
            unset($data['schedules']);

            // Actualizar datos de la empresa
            $company->update($data);

            // Actualizar horarios si se proporcionaron
            if (!empty($schedules)) {
                $this->updateSchedules($company, $schedules);
            }

            return $company->fresh('schedules');
        });
    }

    /**
     * Actualizar configuración de videollamadas
     */
    public function updateVideoCallSettings(bool $allowsVideoCalls): Company
    {
        $company = Company::first();

        if (!$company) {
            throw new \Exception(__('company.not_found'));
        }

        $company->update(['allows_video_calls' => $allowsVideoCalls]);

        // Si se deshabilitan las videollamadas, actualizar servicios afectados
        if (!$allowsVideoCalls) {
            $this->handleVideoCallDisabling();
        }

        return $company->fresh();
    }

    /**
     * Actualizar horarios de la empresa
     */
    private function updateSchedules(Company $company, array $schedules): void
    {
        // Eliminar horarios existentes
        $company->schedules()->delete();

        // Crear nuevos horarios
        foreach ($schedules as $schedule) {
            $company->schedules()->create([
                'day_of_week' => $schedule['day_of_week'],
                'open_time' => $schedule['open_time'] ?? null,
                'close_time' => $schedule['close_time'] ?? null,
                'break_start_time' => $schedule['break_start_time'] ?? null,
                'break_end_time' => $schedule['break_end_time'] ?? null,
                'is_open' => $schedule['is_open'] ?? false,
                'has_break' => $schedule['has_break'] ?? false,
            ]);
        }
    }

    /**
     * Manejar deshabilitación de videollamadas
     */
    private function handleVideoCallDisabling(): void
    {
        // Actualizar servicios que solo eran videollamada a presencial
        DB::table('services')
            ->where('service_type', 'video_call')
            ->update(['service_type' => 'in_person']);

        // Actualizar servicios híbridos a presencial
        DB::table('services')
            ->where('service_type', 'hybrid')
            ->update(['service_type' => 'in_person']);

        // Actualizar reservas futuras de videollamada a presencial
        DB::table('bookings')
            ->where('delivery_type', 'video_call')
            ->where('date', '>=', now()->format('Y-m-d'))
            ->whereIn('status', ['pending', 'confirmed'])
            ->update([
                'delivery_type' => 'in_person',
                'video_call_link' => null,
            ]);
    }

    /**
     * Obtener configuración completa de la empresa
     */
    public function getCompanyConfiguration(): array
    {
        $company = $this->getCompanyWithSchedules();

        if (!$company) {
            return $this->getDefaultConfiguration();
        }
        return [
            'basic_info' => [
                'name' => $company->name,
                'email' => $company->email,
                'tagline' => $company->tagline,
                'description' => $company->description,
                'logo' => $company->logo,
                'cover_image' => $company->cover_image,
            ],
            'localization' => [
                'currency' => $company->currency,
                'timezone' => $company->timezone,
                'locale' => $company->locale,
            ],
            'features' => [
                'allows_video_calls' => $company->allows_video_calls ?? false,
            ],
            'schedules' => $company->schedules,
            'formatted_schedules' => $company->getDailySchedulesArray(),
            'grouped_schedule' => $company->getGroupedSchedule(),
        ];
    }

    /**
     * Obtener configuración por defecto
     */
    private function getDefaultConfiguration(): array
    {
        return [
            'basic_info' => [
                'name' => config('app.name'),
                'email' => null,
                'tagline' => null,
                'description' => null,
                'logo' => null,
                'cover_image' => null,
            ],
            'localization' => [
                'currency' => 'CLP',
                'timezone' => 'America/Santiago',
                'locale' => 'es-CL',
            ],
            'features' => [
                'allows_video_calls' => false,
            ],
            'schedules' => [],
            'formatted_schedules' => [],
            'grouped_schedule' => [],
        ];
    }

    /**
     * Verificar si la empresa permite videollamadas
     */
    public function allowsVideoCalls(): bool
    {
        $company = Company::first();
        return $company?->allows_video_calls ?? false;
    }

    /**
     * Obtener horario de trabajo para un día específico
     */
    public function getScheduleForDay(string $dayOfWeek): ?CompanySchedule
    {
        $company = Company::first();

        if (!$company) {
            return null;
        }

        return $company->schedules()->where('day_of_week', $dayOfWeek)->first();
    }

    /**
     * Verificar si la empresa está abierta en una fecha/hora específica
     */
    public function isOpenAt(\Carbon\Carbon $dateTime): bool
    {
        $dayOfWeek = strtolower($dateTime->format('l'));
        $schedule = $this->getScheduleForDay($dayOfWeek);

        if (!$schedule || !$schedule->is_open) {
            return false;
        }

        $time = $dateTime->format('H:i:s');

        // Verificar si está dentro del horario de apertura
        if ($time < $schedule->open_time || $time > $schedule->close_time) {
            return false;
        }

        // Verificar si está en horario de descanso
        if (
            $schedule->has_break &&
            $time >= $schedule->break_start_time &&
            $time <= $schedule->break_end_time
        ) {
            return false;
        }

        return true;
    }
}
