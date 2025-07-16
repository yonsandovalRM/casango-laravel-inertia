<?php

namespace App\Traits;

use App\Services\TimezoneService;

trait TimezoneResourceTrait
{
    /**
     * Campos que son solo TIME (no necesitan conversión de timezone)
     */
    protected function getTimeOnlyResourceFields(): array
    {
        return [
            'open_time',
            'close_time',
            'break_start_time',
            'break_end_time',
        ];
    }
    /**
     * Transforma automáticamente campos de fecha/hora al timezone de empresa
     */
    protected function transformTimezoneFields(array $data): array
    {
        $timezoneFields = $this->getResourceTimezoneFields();

        foreach ($timezoneFields as $field) {
            if (isset($data[$field]) && !empty($data[$field])) {

                // Si es un campo de solo TIME, solo formatear
                if (in_array($field, $this->getTimeOnlyResourceFields())) {
                    $data[$field] = $this->formatTimeOnlyField($data[$field]);
                } else {
                    // Campos DATETIME normales
                    $data[$field . '_utc'] = $data[$field];
                    $data[$field] = TimezoneService::formatForDisplay(
                        $data[$field],
                        $this->getFieldFormat($field)
                    );

                    // Formatos adicionales solo para campos DATETIME
                    $data[$field . '_date'] = TimezoneService::formatForDisplay($data[$field . '_utc'], 'Y-m-d');
                    $data[$field . '_time'] = TimezoneService::formatForDisplay($data[$field . '_utc'], 'H:i');
                    $data[$field . '_datetime'] = TimezoneService::formatForDisplay($data[$field . '_utc'], 'Y-m-d H:i:s');
                    $data[$field . '_human'] = TimezoneService::toCompanyTimezone($data[$field . '_utc'])->diffForHumans();
                }
            }
        }

        return $data;
    }

    /**
     * Formatear campos de solo TIME
     */
    private function formatTimeOnlyField($value): string
    {
        if (empty($value)) {
            return '';
        }

        // Si es un objeto Carbon, extraer solo la hora
        if ($value instanceof \Carbon\Carbon) {
            return $value->format('H:i');
        }

        // Si es string, validar y formatear
        if (preg_match('/^\d{2}:\d{2}(:\d{2})?$/', $value)) {
            $parts = explode(':', $value);
            return sprintf('%02d:%02d', $parts[0], $parts[1]);
        }

        return $value;
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
