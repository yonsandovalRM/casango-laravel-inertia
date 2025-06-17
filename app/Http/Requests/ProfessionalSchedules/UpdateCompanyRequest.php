<?php

namespace App\Http\Requests\ProfessionalSchedules;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfessionalSchedulesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'schedules' => 'nullable|array',
            'schedules.*.day_of_week' => 'required|string|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'schedules.*.open_time' => [
                'required_if:schedules.*.is_open,true',
                'string',
                'regex:/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/',
            ],
            'schedules.*.close_time' => [
                'required_if:schedules.*.is_open,true',
                'string',
                'regex:/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/',
                'after:schedules.*.open_time',
            ],
            'schedules.*.break_start_time' => [
                'nullable',
                'string',
                'regex:/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/',
                'required_with:schedules.*.break_end_time',
            ],
            'schedules.*.break_end_time' => [
                'nullable',
                'string',
                'regex:/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/',
                'required_with:schedules.*.break_start_time',
                'after:schedules.*.break_start_time',
            ],
            'schedules.*.is_open' => 'required|boolean',
            'schedules.*.has_break' => 'required|boolean',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $schedules = $this->input('schedules', []);

            foreach ($schedules as $index => $schedule) {
                // Si has_break es false, no debería haber tiempos de descanso
                if (isset($schedule['has_break']) && $schedule['has_break'] === false) {
                    if (!empty($schedule['break_start_time']) || !empty($schedule['break_end_time'])) {
                        $validator->errors()->add(
                            "schedules.$index.has_break",
                            'Cuando has_break es false, no deben existir horarios de descanso.'
                        );
                    }
                }

                // Si has_break es true, deben existir ambos horarios de descanso
                if (isset($schedule['has_break']) && $schedule['has_break'] === true) {
                    if (empty($schedule['break_start_time']) || empty($schedule['break_end_time'])) {
                        $validator->errors()->add(
                            "schedules.$index.has_break",
                            'Cuando has_break es true, deben especificarse ambos horarios de descanso.'
                        );
                    }
                }

                // Validar que el descanso esté dentro del horario laboral
                if (
                    !empty($schedule['break_start_time']) && !empty($schedule['break_end_time']) &&
                    !empty($schedule['open_time']) && !empty($schedule['close_time'])
                ) {
                    $open = strtotime($schedule['open_time']);
                    $close = strtotime($schedule['close_time']);
                    $breakStart = strtotime($schedule['break_start_time']);
                    $breakEnd = strtotime($schedule['break_end_time']);

                    if ($breakStart < $open || $breakEnd > $close) {
                        $validator->errors()->add(
                            "schedules.$index.break_start_time",
                            'El horario de descanso debe estar dentro del horario laboral.'
                        );
                    }
                }
            }
        });
    }
}
