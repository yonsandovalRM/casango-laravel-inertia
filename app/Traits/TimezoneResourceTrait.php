<?php

namespace App\Traits;

use App\Services\TimezoneService;

trait TimezoneResourceTrait
{
    /**
     * Transforma automáticamente campos de fecha/hora al timezone de empresa
     */
    protected function transformTimezoneFields(array $data): array
    {
        $timezoneFields = $this->getResourceTimezoneFields();

        foreach ($timezoneFields as $field) {
            if (isset($data[$field]) && !empty($data[$field])) {
                // Valor original en UTC (para referencias si es necesario)
                $data[$field . '_utc'] = $data[$field];

                // Valor convertido al timezone de empresa
                $data[$field] = TimezoneService::formatForDisplay(
                    $data[$field],
                    $this->getFieldFormat($field)
                );

                // Formatos adicionales útiles para el frontend
                $data[$field . '_date'] = TimezoneService::formatForDisplay($data[$field . '_utc'], 'Y-m-d');
                $data[$field . '_time'] = TimezoneService::formatForDisplay($data[$field . '_utc'], 'H:i');
                $data[$field . '_datetime'] = TimezoneService::formatForDisplay($data[$field . '_utc'], 'Y-m-d H:i:s');
                $data[$field . '_human'] = TimezoneService::toCompanyTimezone($data[$field . '_utc'])->diffForHumans();
            }
        }

        return $data;
    }

    /**
     * Define qué campos deben ser transformados por timezone
     */
    protected function getResourceTimezoneFields(): array
    {
        return $this->timezoneFields ?? [
            'created_at',
            'updated_at',
            'date',
            'time',
            'start_time',
            'end_time',
            'trial_ends_at',
            'ends_at',
            'starts_at',
            'expires_at'
        ];
    }

    /**
     * Define formato específico para cada campo
     */
    protected function getFieldFormat(string $field): string
    {
        $formats = [
            'date' => 'Y-m-d',
            'time' => 'H:i',
            'start_time' => 'H:i',
            'end_time' => 'H:i',
            'open_time' => 'H:i',
            'close_time' => 'H:i',
            'break_start_time' => 'H:i',
            'break_end_time' => 'H:i',
        ];

        return $formats[$field] ?? 'Y-m-d H:i:s';
    }

    /**
     * Override del método toArray para aplicar transformaciones
     */
    public function toArray($request): array
    {
        $data = parent::toArray($request);

        return $this->transformTimezoneFields($data);
    }
}
