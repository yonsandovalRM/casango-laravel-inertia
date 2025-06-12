<?php

namespace App\Http\Requests\Tenants;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTenantRequest extends FormRequest
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
            'subdomain' => 'required|string|max:63',
            'owner_name' => 'required|string|max:255',
            'owner_email' => 'required|email|max:255',
            'plan_id' => 'required|string|exists:plans,id',
            'category' => 'required|string|max:255',
        ];
    }
}
