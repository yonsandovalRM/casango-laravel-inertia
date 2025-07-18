<?php

namespace App\Http\Resources;

use App\Enums\ServiceType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $serviceType = ServiceType::from($this->service_type);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'notes' => $this->notes,
            'category' => new CategoryResource($this->category)->toArray(request()),
            'professionals_count' => $this->professionals->count(),
            'price' => $this->price,
            'duration' => $this->duration,
            'preparation_time' => $this->preparation_time,
            'post_service_time' => $this->post_service_time,
            'service_type' => $this->service_type,
            'service_type_label' => $serviceType->label(),
            'service_type_icon' => $serviceType->icon(),
            'service_type_description' => $serviceType->description(),
            'allows_in_person' => $serviceType->allowsInPerson(),
            'allows_video_call' => $serviceType->allowsVideoCall(),
            'is_active' => $this->is_active,
        ];
    }
}
