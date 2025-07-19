<?php

namespace App\Http\Requests\Services;

use App\Enums\ServiceType;
use App\Models\Company;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServicesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $company = Company::first();
        $allowsVideoCalls = $company?->allows_video_calls ?? false;

        $serviceTypeRules = ['required', 'string'];

        if ($allowsVideoCalls) {
            $serviceTypeRules[] = Rule::in([
                ServiceType::IN_PERSON->value,
                ServiceType::VIDEO_CALL->value,
                ServiceType::HYBRID->value,
            ]);
        } else {
            $serviceTypeRules[] = Rule::in([ServiceType::IN_PERSON->value]);
        }

        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'notes' => ['nullable', 'string', 'max:500'],
            'category_id' => ['required', 'uuid', 'exists:categories,id'],
            'price' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'duration' => ['required', 'integer', 'min:5', 'max:480'],
            'preparation_time' => ['nullable', 'integer', 'min:0', 'max:120'],
            'post_service_time' => ['nullable', 'integer', 'min:0', 'max:120'],
            'service_type' => $serviceTypeRules,
            'is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => __('validation.required', ['attribute' => __('services.form.name')]),
            'name.max' => __('validation.max.string', ['attribute' => __('services.form.name'), 'max' => 255]),
            'description.max' => __('validation.max.string', ['attribute' => __('services.form.description'), 'max' => 1000]),
            'notes.max' => __('validation.max.string', ['attribute' => __('services.form.notes'), 'max' => 500]),
            'category_id.required' => __('validation.required', ['attribute' => __('services.form.category')]),
            'category_id.exists' => __('validation.exists', ['attribute' => __('services.form.category')]),
            'price.numeric' => __('validation.numeric', ['attribute' => __('services.form.price')]),
            'price.min' => __('validation.min.numeric', ['attribute' => __('services.form.price'), 'min' => 0]),
            'duration.required' => __('validation.required', ['attribute' => __('services.form.duration')]),
            'duration.integer' => __('validation.integer', ['attribute' => __('services.form.duration')]),
            'duration.min' => __('validation.min.numeric', ['attribute' => __('services.form.duration'), 'min' => 5]),
            'duration.max' => __('validation.max.numeric', ['attribute' => __('services.form.duration'), 'max' => 480]),
            'service_type.required' => __('validation.required', ['attribute' => __('services.form.service_type')]),
            'service_type.in' => __('validation.in', ['attribute' => __('services.form.service_type')]),
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'preparation_time' => $this->preparation_time ?? 0,
            'post_service_time' => $this->post_service_time ?? 0,
            'is_active' => $this->boolean('is_active', true),
        ]);
    }
}
