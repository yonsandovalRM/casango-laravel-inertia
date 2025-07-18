<?php

namespace App\Http\Requests\Professionals;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfessionalRequest extends FormRequest
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
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'bio' => 'nullable|string',
            'title' => 'nullable|string',
            'profession' => 'nullable|string',
            'specialty' => 'nullable|string',
            'is_company_schedule' => 'nullable|boolean',
        ];
    }
}
