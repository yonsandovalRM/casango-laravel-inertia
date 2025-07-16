<?php

namespace App\Traits;

use Carbon\Carbon;
use App\Models\Company;
use Illuminate\Support\Facades\Log;

/**
 * Trait HasTimezone
 *
 * Este trait maneja la conversión de fechas y horas entre el timezone de la empresa y UTC.
 * Permite manejar automáticamente los campos de fecha en modelos Eloquent.
 */

trait HasTimezone
{
    /**
     * Campos de fecha que deben ser transformados
     */
    protected function getTimezoneFields(): array
    {
        return $this->timezoneFields ?? [
            'created_at',
            'updated_at',
            'date',
            'time',
            'start_time',
            'end_time',
            'open_time',
            'close_time',
            'break_start_time',
            'break_end_time',
            'trial_ends_at',
            'ends_at',
            'starts_at',
            'next_billing_date',
            'last_payment_date',
            'expires_at',
            'email_verified_at'
        ];
    }

    /**
     * Obtiene el timezone de la empresa actual
     */
    protected function getCompanyTimezone(): string
    {
        try {
            if (function_exists('tenancy') && tenancy()->initialized) {
                $company = Company::first();
                return $company?->timezone ?? config('app.timezone', 'UTC');
            }
        } catch (\Exception $e) {
            Log::warning('Error getting company timezone: ' . $e->getMessage());
        }

        return config('app.timezone', 'UTC');
    }

    /**
     * Convierte una fecha/hora de timezone de empresa a UTC para guardar en BD
     */
    public function toUtc($value, string $field = null): ?Carbon
    {
        if (empty($value)) {
            return null;
        }

        $carbon = $value instanceof Carbon ? $value : Carbon::parse($value);
        $companyTimezone = $this->getCompanyTimezone();

        // Si ya está en UTC, retornar tal como está
        if ($carbon->timezone->getName() === 'UTC') {
            return $carbon;
        }

        // Si no tiene timezone específico, asumir que está en timezone de empresa
        if ($carbon->timezone->getName() === 'UTC' || $carbon->timezone->getName() === date_default_timezone_get()) {
            $carbon = $carbon->setTimezone($companyTimezone);
        }

        return $carbon->utc();
    }

    /**
     * Convierte una fecha/hora de UTC a timezone de empresa para mostrar
     */
    public function fromUtc($value): ?Carbon
    {
        if (empty($value)) {
            return null;
        }

        $carbon = $value instanceof Carbon ? $value : Carbon::parse($value);
        $companyTimezone = $this->getCompanyTimezone();

        // Asegurar que esté en UTC primero
        if ($carbon->timezone->getName() !== 'UTC') {
            $carbon = $carbon->utc();
        }

        return $carbon->setTimezone($companyTimezone);
    }

    /**
     * Override del mutator para campos de fecha automáticamente
     */
    public function setAttribute($key, $value)
    {
        if (in_array($key, $this->getTimezoneFields()) && !empty($value)) {
            $value = $this->toUtc($value, $key);
        }

        return parent::setAttribute($key, $value);
    }

    /**
     * Override del accessor para campos de fecha automáticamente
     */
    public function getAttribute($key)
    {
        $value = parent::getAttribute($key);

        if (in_array($key, $this->getTimezoneFields()) && !empty($value)) {
            return $this->fromUtc($value);
        }

        return $value;
    }

    /**
     * Convierte una fecha específica al timezone de empresa (para usar en queries)
     */
    public function convertToCompanyTimezone($date): Carbon
    {
        if (empty($date)) {
            return Carbon::now($this->getCompanyTimezone());
        }

        $carbon = $date instanceof Carbon ? $date : Carbon::parse($date);
        return $carbon->setTimezone($this->getCompanyTimezone());
    }

    /**
     * Para queries con fechas - convierte de company timezone a UTC
     */
    public function scopeWhereDateInTimezone($query, string $field, $operator, $value = null)
    {
        if ($value === null) {
            $value = $operator;
            $operator = '=';
        }

        $utcValue = $this->toUtc($value, $field);

        return $query->where($field, $operator, $utcValue);
    }

    /**
     * Para queries de rango de fechas
     */
    public function scopeWhereDateBetweenInTimezone($query, string $field, $start, $end)
    {
        $utcStart = $this->toUtc($start, $field);
        $utcEnd = $this->toUtc($end, $field);

        return $query->whereBetween($field, [$utcStart, $utcEnd]);
    }

    /**
     * Para queries de fecha específica (solo la fecha, sin hora)
     */
    public function scopeWhereDateEqualsInTimezone($query, string $field, $date)
    {
        $companyDate = $this->convertToCompanyTimezone($date);
        $startOfDay = $this->toUtc($companyDate->startOfDay(), $field);
        $endOfDay = $this->toUtc($companyDate->copy()->endOfDay(), $field);

        return $query->whereBetween($field, [$startOfDay, $endOfDay]);
    }

    /**
     * Para obtener todos los registros de "hoy" en timezone de empresa
     */
    public function scopeToday($query, string $field = 'date')
    {
        $today = Carbon::today($this->getCompanyTimezone());
        return $this->scopeWhereDateEqualsInTimezone($query, $field, $today);
    }

    /**
     * Para obtener registros de esta semana
     */
    public function scopeThisWeek($query, string $field = 'created_at')
    {
        $timezone = $this->getCompanyTimezone();
        $startOfWeek = Carbon::now($timezone)->startOfWeek();
        $endOfWeek = Carbon::now($timezone)->endOfWeek();

        return $this->scopeWhereDateBetweenInTimezone($query, $field, $startOfWeek, $endOfWeek);
    }

    /**
     * Para obtener registros de este mes
     */
    public function scopeThisMonth($query, string $field = 'created_at')
    {
        $timezone = $this->getCompanyTimezone();
        $startOfMonth = Carbon::now($timezone)->startOfMonth();
        $endOfMonth = Carbon::now($timezone)->endOfMonth();

        return $this->scopeWhereDateBetweenInTimezone($query, $field, $startOfMonth, $endOfMonth);
    }

    /**
     * Formatear fecha para mostrar en el frontend
     */
    public function formatForFrontend($field, string $format = 'Y-m-d H:i:s'): ?string
    {
        $value = $this->getAttribute($field);

        if (empty($value)) {
            return null;
        }

        return $this->fromUtc($value)->format($format);
    }

    /**
     * Obtener múltiples campos formateados para frontend
     */
    public function getFormattedTimezoneFields(array $fields): array
    {
        $fields = $fields ?? $this->getTimezoneFields();
        $formatted = [];

        foreach ($fields as $field) {
            if ($this->hasAttribute($field)) {
                $formatted[$field] = $this->formatForFrontend($field);
                $formatted[$field . '_formatted'] = $this->formatForFrontend($field, 'd/m/Y H:i');
                $formatted[$field . '_date_only'] = $this->formatForFrontend($field, 'Y-m-d');
                $formatted[$field . '_time_only'] = $this->formatForFrontend($field, 'H:i');
            }
        }

        return $formatted;
    }
}
