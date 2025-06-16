<?php

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanyRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:255',
            'phone2' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'currency' => 'nullable|string|max:255',
            'timezone' => 'nullable|string|max:255',
            'locale' => 'nullable|string|max:255',
            'schedules' => 'nullable|array',
            'schedules.*.day_of_week' => 'required|string|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'schedules.*.open_time' => [
                'required_if:schedules.*.is_open,true',
                'string',
                'regex:/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/', // Ahora acepta con o sin segundos
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
