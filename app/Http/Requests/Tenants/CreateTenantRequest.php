<?php

namespace App\Http\Requests\Tenants;

use App\Models\Tenant;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateTenantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'subdomain' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-z0-9]+([a-z0-9\-]*[a-z0-9])?$/',
                function ($attribute, $value, $fail) {
                    $domain = $value . '.' . config('tenancy.central_domains')[0];
                    if (Tenant::whereHas('domains', function ($query) use ($domain) {
                        $query->where('domain', $domain);
                    })->exists()) {
                        $fail('Este subdominio ya está en uso.');
                    }
                }
            ],
            'owner_name' => ['required', 'string', 'max:255'],
            'owner_email' => ['required', 'email', 'max:255'],
            'owner_password' => ['required', 'string', 'min:8', 'confirmed'],
            'owner_password_confirmation' => ['required', 'string'],
            'plan_id' => ['required', 'exists:plans,id'],
            'tenant_category_id' => ['required', 'string', 'max:100', Rule::exists('tenant_categories', 'id')],
            'billing' => ['required', 'in:monthly,annual'],
        ];
    }

    public function messages(): array
    {
        return [
            'subdomain.regex' => 'El subdominio solo puede contener letras minúsculas, números y guiones.',
            'owner_password.confirmed' => 'Las contraseñas no coinciden.',
        ];
    }
}
