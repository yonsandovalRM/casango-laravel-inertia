<?php

namespace App\Http\Resources;

use App\Services\TimezoneService;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray($request)
    {
        $timezoneService = app(TimezoneService::class);
        return [
            'id' => $this->id,
            'client' => UserResource::make($this->client)->toArray(request()),
            'professional' => ProfessionalResource::make($this->professional)->toArray(request()),
            'service' => ServiceResource::make($this->service)->toArray(request()),
            'price' => $this->price,
            'discount' => $this->discount,
            'total' => $this->total,
            'date' => $this->date,
            'time' => $this->time,
            'notes' => $this->notes,
            'status' => $this->status,
            'phone' => $this->phone,
            'payment_status' => $this->payment_status,
            'created_at' => $timezoneService->formatForFrontend($this->created_at),
            'updated_at' => $timezoneService->formatForFrontend($this->updated_at),
        ];
    }
}
