<?php

namespace App\Http\Requests\Bookings;

use App\Enums\BookingDeliveryType;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service' => [
                'required',
                'uuid',
                Rule::exists('services', 'id')->where(function ($query) {
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
                'after_or_equal:today'
            ],
            'time' => [
                'required',
                'date_format:H:i',
            ],
            'delivery_type' => [
                'required',
                'string',
                Rule::in(array_column(BookingDeliveryType::cases(), 'value'))
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
            'discount' => 'nullable|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'delivery_type.required' => 'El tipo de servicio (presencial o videollamada) es obligatorio',
            'delivery_type.in' => 'El tipo de servicio seleccionado no es válido',
            'client.name.required' => 'El nombre del cliente es obligatorio',
            'client.email.exists' => 'El correo no está registrado en nuestro sistema',
            'time.date_format' => 'Formato de hora inválido (HH:MM)',
            'date.after_or_equal' => 'No puedes agendar en fechas pasadas',
        ];
    }
}
