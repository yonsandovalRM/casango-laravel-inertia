<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray($request)
    {
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
        ];
    }
}
