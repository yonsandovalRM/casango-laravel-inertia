<?php

namespace App\Traits;

use Carbon\Carbon;
use App\Models\Company;

trait HasCompanyTimezone
{
    /**
     * Obtener el timezone de la compañía
     */
    protected function getCompanyTimezone(): string
    {
        $company = Company::first();
        return $company?->timezone ?? config('app.timezone', 'UTC');
    }

    /**
     * Convertir fecha UTC de DB a timezone de compañía
     */
    public function toCompanyTimezone($field)
    {
        if (!$this->$field) {
            return null;
        }

        return Carbon::parse($this->$field)
            ->utc()
            ->setTimezone($this->getCompanyTimezone());
    }

    /**
     * Convertir fecha de timezone de compañía a UTC para guardar en DB
     */
    public function fromCompanyTimezone($dateTime, $timezone = null)
    {
        if (!$dateTime) {
            return null;
        }

        $timezone = $timezone ?? $this->getCompanyTimezone();

        return Carbon::parse($dateTime, $timezone)->utc();
    }

    /**
     * Scope para filtrar por fecha en timezone de compañía
     */
    public function scopeWhereCompanyDate($query, $field, $operator, $date)
    {
        $companyTimezone = $this->getCompanyTimezone();

        // Convertir fecha de compañía a UTC para buscar en DB
        $startOfDay = Carbon::parse($date, $companyTimezone)->utc()->startOfDay();
        $endOfDay = Carbon::parse($date, $companyTimezone)->utc()->endOfDay();

        if ($operator === '=') {
            return $query->whereBetween($field, [$startOfDay, $endOfDay]);
        }

        $dateInUtc = Carbon::parse($date, $companyTimezone)->utc();
        return $query->where($field, $operator, $dateInUtc);
    }

    /**
     * Scope para filtrar por rango de fechas en timezone de compañía
     */
    public function scopeWhereBetweenCompanyDates($query, $field, $startDate, $endDate)
    {
        $companyTimezone = $this->getCompanyTimezone();

        $startUtc = Carbon::parse($startDate, $companyTimezone)->utc()->startOfDay();
        $endUtc = Carbon::parse($endDate, $companyTimezone)->utc()->endOfDay();

        return $query->whereBetween($field, [$startUtc, $endUtc]);
    }
}
