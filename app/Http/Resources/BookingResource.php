<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'client' => new UserResource($this->client),
            'professional' => new ProfessionalResource($this->professional),
            'service' => new ServiceResource($this->service),
            'price' => $this->price,
            'discount' => $this->discount,
            'total' => $this->total,
            'date' => $this->date,
            'time' => $this->time,
            'notes' => $this->notes,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
        ];
    }
}
