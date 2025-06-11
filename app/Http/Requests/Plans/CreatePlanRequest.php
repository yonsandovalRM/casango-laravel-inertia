<?php

namespace App\Http\Requests\Plans;

use Illuminate\Foundation\Http\FormRequest;

class CreatePlanRequest extends FormRequest
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
            'name' => 'required|string|max:255|unique:plans,name',
            'description' => 'required|string|max:255',
            'price_monthly' => 'required|numeric',
            'price_annual' => 'required|numeric',
            'currency' => 'required|string|max:3',
            'features' => 'required|array',
            'features.*' => 'required|string|max:255',
            'is_free' => 'required|boolean',
            'is_popular' => 'required|boolean',
            'trial_days' => 'required|integer|min:0',
        ];
    }
}
