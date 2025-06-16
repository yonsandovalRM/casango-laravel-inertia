<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
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
            'description' => $this->description,
            'notes' => $this->notes,
            'category' => new CategoryResource($this->category)->toArray(request()),
            'price' => $this->price,
            'duration' => $this->duration,
            'preparation_time' => $this->preparation_time,
            'post_service_time' => $this->post_service_time,
            'is_active' => $this->is_active,
        ];
    }
}
