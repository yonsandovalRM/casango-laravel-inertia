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
            'is_company_schedule' => $this->is_company_schedule,
            'user' => new UserResource($this->user)->only('id', 'name', 'email'),
            'exceptions' => ExceptionResource::collection($this->exceptions)->toArray(request()),
        ];
    }
}
