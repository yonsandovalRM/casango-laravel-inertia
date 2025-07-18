<?php

namespace App\Http\Requests\Services;

use App\Enums\ServiceType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServicesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:services,name,' . $this->service->id,
            'description' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:255',
            'category_id' => 'nullable|uuid|exists:categories,id',
            'price' => 'nullable|numeric|min:0',
            'duration' => 'nullable|integer|min:1',
            'preparation_time' => 'nullable|integer|min:0',
            'post_service_time' => 'nullable|integer|min:0',
            'service_type' => [
                'nullable',
                'string',
                Rule::in(array_column(ServiceType::cases(), 'value'))
            ],
            'is_active' => 'nullable|boolean',
        ];
    }
}
