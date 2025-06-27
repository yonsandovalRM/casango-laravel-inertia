<?php

namespace App\Http\Requests\Bookings;

use Illuminate\Foundation\Http\FormRequest;

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
            'client_id' => 'required|uuid|exists:users,id',
            'professional_id' => 'required|uuid|exists:users,id',
            'service_id' => 'required|uuid|exists:services,id',
            'coupon_code' => 'nullable|string', // TODO: Implementar validacion de cupones |exists:coupons,code
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
        ];
    }
}
