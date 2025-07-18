<?php

namespace App\Http\Requests\Services;

use App\Enums\ServiceType;
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
        return [
            'name' => 'required|string|max:255|unique:services,name',
            'description' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:255',
            'category_id' => 'required|uuid|exists:categories,id',
            'price' => 'nullable|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'preparation_time' => 'nullable|integer|min:0',
            'post_service_time' => 'nullable|integer|min:0',
            'service_type' => [
                'required',
                'string',
                Rule::in(array_column(ServiceType::cases(), 'value'))
            ],
            'is_active' => 'required|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'service_type.required' => 'El tipo de servicio es obligatorio',
            'service_type.in' => 'El tipo de servicio seleccionado no es válido',
            'duration.min' => 'La duración debe ser al menos 1 minuto',
            'price.min' => 'El precio no puede ser negativo',
        ];
    }
}
