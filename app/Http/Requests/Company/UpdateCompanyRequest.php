<?php

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string', 'max:2000'],
            'currency' => ['required', 'string', 'in:CLP,USD,EUR'],
            'timezone' => ['required', 'string', 'timezone'],
            'locale' => ['required', 'string', 'in:es-CL,en-US'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            'cover_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:5120'],
            'schedules' => ['required', 'array', 'size:7'],
            'schedules.*.day_of_week' => ['required', 'string', 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'],
            'schedules.*.is_open' => ['required', 'boolean'],
            'schedules.*.open_time' => ['required_if:schedules.*.is_open,true', 'nullable', 'date_format:H:i:s'],
            'schedules.*.close_time' => ['required_if:schedules.*.is_open,true', 'nullable', 'date_format:H:i:s'],
            'schedules.*.has_break' => ['boolean'],
            'schedules.*.break_start_time' => ['nullable', 'date_format:H:i:s'],
            'schedules.*.break_end_time' => ['nullable', 'date_format:H:i:s'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => __('company.validation.name_required'),
            'email.required' => __('company.validation.email_required'),
            'email.email' => __('company.validation.email_invalid'),
            'currency.in' => __('company.validation.currency_invalid'),
            'timezone.timezone' => __('company.validation.timezone_invalid'),
            'logo.image' => __('company.validation.logo_must_be_image'),
            'logo.max' => __('company.validation.logo_too_large'),
            'cover_image.image' => __('company.validation.cover_image_must_be_image'),
            'cover_image.max' => __('company.validation.cover_image_too_large'),
            'schedules.required' => __('company.validation.schedules_required'),
            'schedules.size' => __('company.validation.schedules_must_have_seven_days'),
        ];
    }

    protected function prepareForValidation()
    {
        // Ensure we have schedules for all 7 days
        $daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        $schedules = $this->input('schedules', []);

        // Fill missing days with default values
        foreach ($daysOfWeek as $day) {
            $found = false;
            foreach ($schedules as $schedule) {
                if ($schedule['day_of_week'] === $day) {
                    $found = true;
                    break;
                }
            }

            if (!$found) {
                $schedules[] = [
                    'day_of_week' => $day,
                    'is_open' => false,
                    'open_time' => null,
                    'close_time' => null,
                    'has_break' => false,
                    'break_start_time' => null,
                    'break_end_time' => null,
                ];
            }
        }

        $this->merge(['schedules' => $schedules]);
    }
}
