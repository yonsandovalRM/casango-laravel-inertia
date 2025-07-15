<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\BookingFormData;
use App\Models\FormTemplate;
use App\Models\UserProfileData;
use Illuminate\Support\Facades\Validator;

class BookingFormService
{
    /**
     * Inicializa todos los formularios activos para una reserva
     */
    public function initializeBookingForms(Booking $booking): array
    {
        $activeTemplates = FormTemplate::bookingForm()
            ->active()
            ->with(['fields' => function ($query) {
                $query->orderBy('order');
            }])
            ->get();

        $formsData = [];

        foreach ($activeTemplates as $template) {
            $bookingFormData = BookingFormData::firstOrCreate([
                'booking_id' => $booking->id,
                'form_template_id' => $template->id,
            ], [
                'data' => $this->initializeFormData($template),
                'is_visible_to_team' => true,
            ]);

            $formsData[] = [
                'template' => $template,
                'data' => $bookingFormData
            ];
        }

        return $formsData;
    }

    /**
     * Obtiene todos los formularios de una reserva organizados por template
     */
    public function getBookingFormsData(Booking $booking): array
    {
        $activeTemplates = FormTemplate::bookingForm()
            ->active()
            ->with(['fields' => function ($query) {
                $query->orderBy('order');
            }])
            ->get();

        $formsData = [];

        foreach ($activeTemplates as $template) {
            $bookingFormData = $booking->bookingFormData()
                ->where('form_template_id', $template->id)
                ->first();

            if (!$bookingFormData) {
                // Crear registro vacío si no existe
                $bookingFormData = BookingFormData::create([
                    'booking_id' => $booking->id,
                    'form_template_id' => $template->id,
                    'data' => $this->initializeFormData($template),
                    'is_visible_to_team' => true,
                ]);
            }

            $formsData[] = [
                'template' => $template,
                'data' => $bookingFormData
            ];
        }

        return $formsData;
    }

    /**
     * Guarda los datos de un formulario específico
     */
    public function saveBookingFormData(Booking $booking, string $templateId, array $data): bool
    {
        $template = FormTemplate::where('id', $templateId)
            ->where('type', 'booking_form')
            ->where('is_active', true)
            ->with('fields')
            ->first();

        if (!$template) {
            throw new \Exception('Template no encontrado o no activo');
        }

        // Validar datos
        $validator = $this->validateFormData($data, $template);

        if ($validator->fails()) {
            throw new \Exception('Datos de formulario inválidos: ' . $validator->errors()->first());
        }

        // Guardar o actualizar datos
        BookingFormData::updateOrCreate([
            'booking_id' => $booking->id,
            'form_template_id' => $template->id,
        ], [
            'data' => $data,
            'is_visible_to_team' => true,
        ]);

        return true;
    }

    /**
     * Obtiene el historial de reservas con todos sus formularios
     */
    public function getBookingHistoryWithForms(Booking $currentBooking): array
    {
        $activeTemplates = FormTemplate::bookingForm()
            ->active()
            ->with(['fields' => function ($query) {
                $query->orderBy('order');
            }])
            ->get();

        $bookingHistory = Booking::where('client_id', $currentBooking->client_id)
            ->where('id', '!=', $currentBooking->id)
            ->where('status', '!=', 'cancelled')
            ->where('date', '<', $currentBooking->date)
            ->with([
                'service',
                'professional.user',
                'bookingFormData' => function ($query) use ($activeTemplates) {
                    $query->whereIn('form_template_id', $activeTemplates->pluck('id'))
                        ->with('template.fields');
                }
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        return $bookingHistory->map(function ($historyBooking) use ($activeTemplates) {
            $historyData = $historyBooking->toArray();
            $historyData['forms_data'] = [];

            foreach ($activeTemplates as $template) {
                $formData = $historyBooking->bookingFormData
                    ->where('form_template_id', $template->id)
                    ->first();

                $historyData['forms_data'][] = [
                    'template' => $template,
                    'mapped_form_data' => $formData ? $this->mapFormDataToFields($formData, $template) : [],
                    'has_data' => (bool) $formData && !empty($formData->data)
                ];
            }

            return $historyData;
        })->toArray();
    }

    /**
     * Mapea los datos del formulario a campos legibles
     */
    public function mapFormDataToFields($bookingFormData, FormTemplate $template): array
    {
        if (!$bookingFormData || !$bookingFormData->data) {
            return [];
        }

        $formData = $bookingFormData->data;
        $mappedData = [];

        if (is_array($formData) && !empty($formData)) {
            foreach ($formData as $fieldName => $fieldValue) {
                if (!is_numeric($fieldName)) {
                    $field = $template->fields->firstWhere('name', $fieldName);
                    $value = is_array($fieldValue) ? ($fieldValue['value'] ?? $fieldValue) : $fieldValue;

                    $mappedData[] = [
                        'name' => $fieldName,
                        'label' => $field ? $field->label : $fieldName,
                        'value' => $value,
                        'type' => $field ? $field->type : 'text'
                    ];
                }
            }
        }

        return $mappedData;
    }

    /**
     * Inicializa los datos del formulario con valores por defecto
     */
    private function initializeFormData(FormTemplate $template): array
    {
        $data = [];

        foreach ($template->fields as $field) {
            $data[$field->name] = $field->default_value ?? '';
        }

        return $data;
    }

    /**
     * Valida los datos del formulario dinámicamente
     */
    private function validateFormData(array $data, FormTemplate $template)
    {
        $rules = [];
        $messages = [];

        foreach ($template->fields as $field) {
            $fieldRules = [];

            if ($field->is_required) {
                $fieldRules[] = 'required';
            }

            // Agregar reglas específicas por tipo de campo
            switch ($field->type) {
                case 'email':
                    $fieldRules[] = 'email';
                    break;
                case 'number':
                    $fieldRules[] = 'numeric';
                    break;
                case 'date':
                    $fieldRules[] = 'date';
                    break;
                case 'time':
                    $fieldRules[] = 'date_format:H:i';
                    break;
                case 'tel':
                    $fieldRules[] = 'string|max:20';
                    break;
                case 'url':
                    $fieldRules[] = 'url';
                    break;
                case 'select':
                    if ($field->options) {
                        $fieldRules[] = 'in:' . implode(',', $field->options);
                    }
                    break;
                case 'checkbox':
                    $fieldRules[] = 'boolean';
                    break;
                case 'file':
                    $fieldRules[] = 'file|max:10240'; // 10MB max
                    break;
            }

            if (!empty($fieldRules)) {
                $rules[$field->name] = implode('|', $fieldRules);
            }

            // Mensajes personalizados
            if ($field->is_required) {
                $messages[$field->name . '.required'] = "El campo {$field->label} es obligatorio";
            }
        }

        return Validator::make($data, $rules, $messages);
    }



    /**
     * Clona los datos de formularios de una reserva a otra
     */
    public function cloneBookingFormsData(Booking $sourceBooking, Booking $targetBooking): bool
    {
        $sourceFormData = $sourceBooking->bookingFormData;

        foreach ($sourceFormData as $formData) {
            // Verificar que el template siga activo
            if ($formData->template && $formData->template->is_active) {
                BookingFormData::updateOrCreate([
                    'booking_id' => $targetBooking->id,
                    'form_template_id' => $formData->form_template_id,
                ], [
                    'data' => $formData->data,
                    'is_visible_to_team' => $formData->is_visible_to_team,
                ]);
            }
        }

        return true;
    }

    /**
     * Exporta todos los datos de formularios de una reserva
     */
    public function exportBookingFormsData(Booking $booking): array
    {
        $formsData = $this->getBookingFormsData($booking);
        $exportData = [];

        foreach ($formsData as $formWithTemplate) {
            $template = $formWithTemplate['template'];
            $data = $formWithTemplate['data'];

            $exportData[$template->name] = [
                'template_info' => [
                    'id' => $template->id,
                    'name' => $template->name,
                    'description' => $template->description,
                ],
                'fields_data' => $this->mapFormDataToFields($data, $template),
                'raw_data' => $data->data ?? [],
                'last_updated' => $data->updated_at ?? null
            ];
        }

        return $exportData;
    }

    /**
     * Verifica si hay templates órfanos (sin datos en ninguna reserva)
     */
    public function getOrphanedTemplates(): array
    {
        $activeTemplates = FormTemplate::bookingForm()->active()->get();
        $orphanedTemplates = [];

        foreach ($activeTemplates as $template) {
            $hasData = BookingFormData::where('form_template_id', $template->id)->exists();

            if (!$hasData) {
                $orphanedTemplates[] = $template;
            }
        }

        return $orphanedTemplates;
    }

    /**
     * Obtiene métricas de uso de templates
     */
    public function getTemplateUsageMetrics(): array
    {
        $activeTemplates = FormTemplate::bookingForm()->active()->get();
        $metrics = [];

        foreach ($activeTemplates as $template) {
            $totalUsage = BookingFormData::where('form_template_id', $template->id)->count();
            $recentUsage = BookingFormData::where('form_template_id', $template->id)
                ->where('updated_at', '>=', now()->subDays(30))
                ->count();

            $metrics[] = [
                'template_id' => $template->id,
                'template_name' => $template->name,
                'total_usage' => $totalUsage,
                'recent_usage_30_days' => $recentUsage,
                'avg_fields_per_form' => $template->fields->count(),
                'last_used' => BookingFormData::where('form_template_id', $template->id)
                    ->latest('updated_at')
                    ->value('updated_at')
            ];
        }

        return $metrics;
    }
}
