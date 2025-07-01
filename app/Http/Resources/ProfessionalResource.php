<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfessionalResource extends JsonResource
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
            'photo' => $this->photo,
            'bio' => $this->bio,
            'title' => $this->title,
            'profession' => $this->profession,
            'specialty' => $this->specialty,
            'is_company_schedule' => $this->is_company_schedule,
            'user' => new UserResource($this->user)->only('id', 'name', 'email'),
            'exceptions' => $this->whenLoaded('exceptions', fn() => ExceptionResource::collection($this->exceptions)->toArray($request)),
            'services' => $this->whenLoaded('services', function () {
                return $this->services->map(function ($service) {
                    return [
                        'id' => $service->id,
                        'name' => $service->name,
                        'description' => $service->description,
                        'notes' => $service->notes,
                        'category_id' => $service->category_id,
                        'preparation_time' => $service->preparation_time,
                        'post_service_time' => $service->post_service_time,
                        'is_active' => $service->is_active,
                        'price' => $service->pivot->price ?? $service->price,
                        'duration' => $service->pivot->duration ?? $service->duration,
                    ];
                });
            }),
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}
