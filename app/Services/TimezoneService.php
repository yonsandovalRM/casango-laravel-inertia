<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\Company;

class TimezoneService
{
    protected $company;
    protected $timezone;

    public function __construct()
    {
        $this->company = Company::first();
        $this->timezone = $this->company?->timezone ?? config('app.timezone', 'UTC');
    }

    /**
     * Obtener el timezone de la compañía
     */
    public function getTimezone(): string
    {
        return $this->timezone;
    }

    /**
     * Obtener la fecha/hora actual en timezone de compañía
     */
    public function now(): Carbon
    {
        return Carbon::now($this->timezone);
    }

    /**
     * Obtener solo la fecha actual en timezone de compañía
     */
    public function today(): Carbon
    {
        return $this->now()->startOfDay();
    }

    /**
     * Convertir UTC a timezone de compañía
     */
    public function toCompanyTime($dateTime): ?Carbon
    {
        if (!$dateTime) {
            return null;
        }

        return Carbon::parse($dateTime)->utc()->setTimezone($this->timezone);
    }

    /**
     * Convertir de timezone de compañía a UTC
     */
    public function toUtc($dateTime): ?Carbon
    {
        if (!$dateTime) {
            return null;
        }

        return Carbon::parse($dateTime, $this->timezone)->utc();
    }

    /**
     * Formatear fecha para el frontend
     */
    public function formatForFrontend($dateTime, $format = 'Y-m-d H:i:s'): ?string
    {
        if (!$dateTime) {
            return null;
        }

        return $this->toCompanyTime($dateTime)->format($format);
    }

    /**
     * Parsear fecha del frontend para guardar en DB
     */
    public function parseFromFrontend($dateTime): ?Carbon
    {
        if (!$dateTime) {
            return null;
        }

        return $this->toUtc($dateTime);
    }

    /**
     * Crear Carbon instance con timezone de compañía
     */
    public function createFromFormat($format, $time): Carbon
    {
        return Carbon::createFromFormat($format, $time, $this->timezone);
    }

    /**
     * Verificar si una fecha está en el rango de hoy (timezone compañía)
     */
    public function isToday($dateTime): bool
    {
        if (!$dateTime) {
            return false;
        }

        $date = $this->toCompanyTime($dateTime);
        return $date->isToday();
    }

    /**
     * Obtener información del timezone para el frontend
     */
    public function getTimezoneInfo(): array
    {
        $now = $this->now();

        return [
            'timezone' => $this->timezone,
            'offset' => $now->format('P'),
            'offset_seconds' => $now->getOffset(),
            'current_time' => $now->format('Y-m-d H:i:s'),
            'current_date' => $now->format('Y-m-d'),
        ];
    }
}
