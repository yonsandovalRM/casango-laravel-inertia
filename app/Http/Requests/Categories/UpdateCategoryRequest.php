<?php

namespace App\Http\Requests\Categories;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
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
                    ->ignore($this->category->id)
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
            'is_active' => $this->boolean('is_active'),
            'sort_order' => $this->sort_order ? (int) $this->sort_order : $this->category->sort_order ?? 0,
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

    /**
     * Check if the category can be safely updated.
     */
    public function canDeactivate(): bool
    {
        if ($this->is_active === false && $this->category->is_active === true) {
            // Verificar si tiene servicios activos
            return $this->category->services()->where('is_active', true)->count() === 0;
        }

        return true;
    }

    /**
     * Get warning message if deactivation might affect services.
     */
    public function getDeactivationWarning(): ?string
    {
        if ($this->is_active === false && $this->category->is_active === true) {
            $activeServicesCount = $this->category->services()->where('is_active', true)->count();

            if ($activeServicesCount > 0) {
                return "Esta categoría tiene {$activeServicesCount} servicio(s) activo(s). Desactivarla podría afectar su visibilidad.";
            }
        }

        return null;
    }
}
