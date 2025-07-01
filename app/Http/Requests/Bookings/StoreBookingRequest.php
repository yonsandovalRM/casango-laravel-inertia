<?php

namespace App\Http\Requests\Bookings;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBookingRequest extends FormRequest
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
            'service' => [
                'required',
                'uuid',
                Rule::exists('services', 'id')->where(function ($query) {
                    // Si necesitas condiciones adicionales para el servicio
                    $query->where('is_active', true);
                }),
            ],
            'professional' => [
                'required',
                'uuid',
                Rule::exists('professionals', 'id'),
            ],
            'date' => [
                'required',
                'date',
                'after_or_equal:today' // Para evitar fechas pasadas
            ],
            'time' => [
                'required',
                'date_format:H:i',
                function ($attribute, $value, $fail) {
                    // Validar horario laboral (ejemplo: 8:00-18:00)
                    $hour = (int) explode(':', $value)[0];
                    if ($hour < 8 || $hour > 18) {
                        $fail('El horario debe estar entre 8:00 y 18:00.');
                    }
                }
            ],
            'client' => 'required|array',
            'client.name' => 'required|string|max:255',
            'client.email' => [
                'required',
                'email',
                Rule::exists('users', 'email'),
            ],
            'client.phone' => 'required|string|max:20',
            'client.notes' => 'nullable|string|max:500',
        ];
    }

    /**
     * Custom validation messages
     */
    public function messages(): array
    {
        return [
            'client.name.required' => 'El nombre del cliente es obligatorio',
            'client.email.exists' => 'El correo no está registrado en nuestro sistema',
            'time.date_format' => 'Formato de hora inválido (HH:MM)',
            'date.after_or_equal' => 'No puedes agendar en fechas pasadas',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        // Opcional: formatear datos antes de validar
        $this->merge([
            'date' => $this->date ? date('Y-m-d', strtotime($this->date)) : null,
            'phone' => preg_replace('/[^0-9]/', '', $this->client['phone']),
        ]);
    }
}

/* {
    "service": "e4997d63-8de5-4e26-b96c-a8995a57d80f",
    "professional": "2a937507-7a27-4c1b-904a-d1ab99b5385a",
    "date": "2025-06-30",
    "time": "09:00",
    "client": {
        "name": "",
        "email": "",
        "phone": "9888988777",
        "notes": ""
    }
} */