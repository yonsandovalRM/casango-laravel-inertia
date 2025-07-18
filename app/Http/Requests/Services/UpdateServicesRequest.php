<?php

namespace App\Http\Requests\Services;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServicesRequest extends FormRequest
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
            'name' => 'required|string|max:255|unique:services,name,' . $this->service->id,
            'description' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:255',
            'category_id' => 'nullable|uuid|exists:categories,id',
            'price' => 'nullable|numeric',
            'duration' => 'nullable|integer',
            'preparation_time' => 'nullable|integer',
            'post_service_time' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ];
    }
}
