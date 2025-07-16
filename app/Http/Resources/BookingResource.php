<?php

namespace App\Http\Resources;

use App\Traits\TimezoneResourceTrait;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    use TimezoneResourceTrait;

    /**
     * Campos específicos de timezone para BookingResource
     */
    protected $timezoneFields = [
        'created_at',
        'updated_at',
        'date',
        'time'
    ];


    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'client' => UserResource::make($this->client)->toArray($request),
            'professional' => ProfessionalResource::make($this->professional)->toArray($request),
            'service' => ServiceResource::make($this->service)->toArray($request),
            'price' => $this->price,
            'discount' => $this->discount,
            'total' => $this->total,
            'date' => $this->date,
            'time' => $this->time,
            'notes' => $this->notes,
            'status' => $this->status,
            'phone' => $this->phone,
            'payment_status' => $this->payment_status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            // Campos adicionales útiles para el frontend
            'formatted_datetime' => $this->formatForFrontend('date', 'Y-m-d') . ' ' . $this->formatForFrontend('time', 'H:i'),
            'is_today' => $this->formatForFrontend('date', 'Y-m-d') === \App\Services\TimezoneService::today()->format('Y-m-d'),
        ];
    }
}
