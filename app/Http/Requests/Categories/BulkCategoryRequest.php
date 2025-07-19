<?php

namespace App\Http\Requests\Categories;

use Illuminate\Foundation\Http\FormRequest;

class BulkCategoryRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'category_ids' => 'required|array|min:1|max:50',
            'category_ids.*' => 'required|string|exists:categories,id',
            'action' => 'required|in:delete,activate,deactivate,export',
            'force_delete' => 'sometimes|boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'category_ids.required' => 'Debe seleccionar al menos una categoría.',
            'category_ids.min' => 'Debe seleccionar al menos una categoría.',
            'category_ids.max' => 'No puede seleccionar más de 50 categorías a la vez.',
            'category_ids.*.exists' => 'Una o más categorías seleccionadas no existen.',
            'action.required' => 'Debe especificar una acción.',
            'action.in' => 'La acción especificada no es válida.',
        ];
    }
}
