<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\Company;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class TimezoneService
{
    protected static ?string $companyTimezone = null;

    /**
     * Obtiene el timezone de la empresa con cache
     */
    public static function getCompanyTimezone(): string
    {
        if (static::$companyTimezone !== null) {
            return static::$companyTimezone;
        }

        try {
            if (function_exists('tenancy') && tenancy()->initialized) {
                $cacheKey = 'company_timezone_' . tenant('id');

                static::$companyTimezone = Cache::remember($cacheKey, 3600, function () {
                    $company = Company::first();
                    return $company?->timezone ?? config('app.timezone', 'UTC');
                });
            } else {
                static::$companyTimezone = config('app.timezone', 'UTC');
            }
        } catch (\Exception $e) {
            Log::warning('Error getting company timezone: ' . $e->getMessage());
            static::$companyTimezone = config('app.timezone', 'UTC');
        }

        return static::$companyTimezone;
    }

    /**
     * Limpia el cache del timezone
     */
    public static function clearTimezoneCache(): void
    {
        static::$companyTimezone = null;

        if (function_exists('tenancy') && tenancy()->initialized) {
            $cacheKey = 'company_timezone_' . tenant('id');
            Cache::forget($cacheKey);
        }
    }

    /**
     * Convierte cualquier fecha/hora al timezone de la empresa
     */
    public static function toCompanyTimezone($datetime): ?Carbon
    {
        if (empty($datetime)) {
            return null;
        }

        $carbon = $datetime instanceof Carbon ? $datetime : Carbon::parse($datetime);

        return $carbon->setTimezone(static::getCompanyTimezone());
    }

    /**
     * Convierte cualquier fecha/hora a UTC
     */
    public static function toUtc($datetime, ?string $fromTimezone = null): ?Carbon
    {
        if (empty($datetime)) {
            return null;
        }

        $carbon = $datetime instanceof Carbon ? $datetime : Carbon::parse($datetime);
        $fromTimezone = $fromTimezone ?? static::getCompanyTimezone();

        // Si no tiene timezone específico, asumir el timezone origen
        if ($carbon->timezone->getName() === 'UTC' || $carbon->timezone->getName() === date_default_timezone_get()) {
            $carbon = $carbon->setTimezone($fromTimezone);
        }

        return $carbon->utc();
    }

    /**
     * Obtiene "ahora" en el timezone de la empresa
     */
    public static function now(): Carbon
    {
        return Carbon::now(static::getCompanyTimezone());
    }

    /**
     * Obtiene "hoy" en el timezone de la empresa
     */
    public static function today(): Carbon
    {
        return Carbon::today(static::getCompanyTimezone());
    }

    /**
     * Obtiene "ayer" en el timezone de la empresa
     */
    public static function yesterday(): Carbon
    {
        return Carbon::yesterday(static::getCompanyTimezone());
    }

    /**
     * Obtiene "mañana" en el timezone de la empresa
     */
    public static function tomorrow(): Carbon
    {
        return Carbon::tomorrow(static::getCompanyTimezone());
    }

    /**
     * Inicio del día en timezone de empresa, convertido a UTC para queries
     */
    public static function startOfDayUtc($date = null): Carbon
    {
        $date = $date ?? static::today();
        $startOfDay = static::toCompanyTimezone($date)->startOfDay();

        return static::toUtc($startOfDay);
    }

    /**
     * Final del día en timezone de empresa, convertido a UTC para queries
     */
    public static function endOfDayUtc($date = null): Carbon
    {
        $date = $date ?? static::today();
        $endOfDay = static::toCompanyTimezone($date)->endOfDay();

        return static::toUtc($endOfDay);
    }

    /**
     * Convierte rango de fechas del frontend (company timezone) a UTC para queries
     */
    public static function dateRangeToUtc($startDate, $endDate): array
    {
        $start = static::toUtc($startDate . ' 00:00:00');
        $end = static::toUtc($endDate . ' 23:59:59');

        return [$start, $end];
    }

    /**
     * Formatea una fecha para mostrar en el frontend
     */
    public static function formatForDisplay($datetime, string $format = 'Y-m-d H:i'): ?string
    {
        if (empty($datetime)) {
            return null;
        }

        return static::toCompanyTimezone($datetime)->format($format);
    }

    /**
     * Parsea una fecha del frontend (en timezone de empresa) y la convierte a UTC
     */
    public static function parseFromFrontend($datetime): ?Carbon
    {
        if (empty($datetime)) {
            return null;
        }

        // Crear Carbon en timezone de empresa y convertir a UTC
        $carbon = Carbon::parse($datetime, static::getCompanyTimezone());

        return $carbon->utc();
    }

    /**
     * Convierte horarios de trabajo para el día (considerando timezone)
     */
    public static function getWorkingHoursForDate($date, $openTime, $closeTime): array
    {
        $companyDate = static::toCompanyTimezone($date);

        $start = Carbon::parse($companyDate->format('Y-m-d') . ' ' . $openTime, static::getCompanyTimezone());
        $end = Carbon::parse($companyDate->format('Y-m-d') . ' ' . $closeTime, static::getCompanyTimezone());

        return [
            'start_utc' => $start->utc(),
            'end_utc' => $end->utc(),
            'start_display' => $start->format('H:i'),
            'end_display' => $end->format('H:i'),
            'date_display' => $companyDate->format('Y-m-d')
        ];
    }

    /**
     * Valida si una fecha/hora está disponible considerando timezone
     */
    public static function isDateTimeAvailable($datetime, $openTime, $closeTime): bool
    {
        $companyDateTime = static::toCompanyTimezone($datetime);
        $timeOnly = $companyDateTime->format('H:i');

        return $timeOnly >= $openTime && $timeOnly <= $closeTime;
    }

    /**
     * Obtiene lista de timezones válidos para selección
     */
    public static function getTimezoneList(): array
    {
        $timezones = [];

        foreach (timezone_identifiers_list() as $timezone) {
            $dt = new \DateTime('now', new \DateTimeZone($timezone));
            $offset = $dt->format('P');

            $timezones[$timezone] = "(UTC{$offset}) {$timezone}";
        }

        return $timezones;
    }

    /**
     * Obtiene timezones comunes para Latinoamérica
     */
    public static function getCommonTimezones(): array
    {
        return [
            'America/Santiago' => '(UTC-03:00) Santiago',
            'America/Argentina/Buenos_Aires' => '(UTC-03:00) Buenos Aires',
            'America/Sao_Paulo' => '(UTC-03:00) São Paulo',
            'America/Lima' => '(UTC-05:00) Lima',
            'America/Bogota' => '(UTC-05:00) Bogotá',
            'America/Mexico_City' => '(UTC-06:00) Ciudad de México',
            'America/New_York' => '(UTC-05:00) Nueva York',
            'America/Los_Angeles' => '(UTC-08:00) Los Ángeles',
            'Europe/Madrid' => '(UTC+01:00) Madrid',
            'UTC' => '(UTC+00:00) UTC',
        ];
    }

    /**
     * Debug: información del timezone actual
     */
    public static function getTimezoneDebugInfo(): array
    {
        $companyTimezone = static::getCompanyTimezone();
        $now = Carbon::now();

        return [
            'company_timezone' => $companyTimezone,
            'server_timezone' => config('app.timezone'),
            'php_timezone' => date_default_timezone_get(),
            'current_utc' => $now->utc()->toDateTimeString(),
            'current_company' => $now->setTimezone($companyTimezone)->toDateTimeString(),
            'offset' => $now->setTimezone($companyTimezone)->format('P'),
            'is_dst' => $now->setTimezone($companyTimezone)->dst,
        ];
    }
}
