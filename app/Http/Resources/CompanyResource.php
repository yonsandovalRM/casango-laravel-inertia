<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'phone2' => $this->phone2,
            'address' => $this->address,
            'city' => $this->city,
            'country' => $this->country,
            'logo' => $this->logo,
            'cover_image' => $this->cover_image,
            'currency' => $this->currency,
            'timezone' => $this->timezone,
            'language' => $this->language,
            'schedules' => CompanyScheduleResource::collection($this->whenLoaded('schedules'))->toArray(request()),
        ];
    }
}