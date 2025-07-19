<?php

namespace App\Http\Requests\Categories;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
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
            'name' => [
                'required',
                'string',
                'min:2',
                'max:100',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\_\.\,]+$/',
                Rule::unique('categories', 'name')
                    ->where(function ($query) {
                        return $query->whereNull('deleted_at');
                    })
            ],
            'is_active' => 'required|boolean',
            'description' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer|min:0|max:9999',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la categoría es obligatorio.',
            'name.min' => 'El nombre debe tener al menos 2 caracteres.',
            'name.max' => 'El nombre no puede exceder los 100 caracteres.',
            'name.regex' => 'El nombre solo puede contener letras, espacios, guiones, puntos y comas.',
            'name.unique' => 'Ya existe una categoría con este nombre.',
            'is_active.required' => 'Debe especificar si la categoría está activa.',
            'is_active.boolean' => 'El estado debe ser verdadero o falso.',
            'description.max' => 'La descripción no puede exceder los 500 caracteres.',
            'sort_order.integer' => 'El orden debe ser un número entero.',
            'sort_order.min' => 'El orden no puede ser negativo.',
            'sort_order.max' => 'El orden no puede exceder 9999.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => trim($this->name),
            'description' => $this->description ? trim($this->description) : null,
            'is_active' => $this->boolean('is_active', true),
            'sort_order' => $this->sort_order ? (int) $this->sort_order : 0,
        ]);
    }

    /**
     * Get the validated data from the request with additional processing.
     */
    public function validatedWithDefaults(): array
    {
        $validated = $this->validated();

        // Capitalizar primera letra de cada palabra
        $validated['name'] = ucwords(strtolower($validated['name']));

        return $validated;
    }
}
