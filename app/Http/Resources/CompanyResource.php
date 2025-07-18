<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'tagline' => $this->tagline,
            'description' => $this->description,
            'logo' => $this->logo,
            'cover_image' => $this->cover_image,
            'currency' => $this->currency,
            'timezone' => $this->timezone,
            'locale' => $this->locale,
            'allows_video_calls' => $this->allows_video_calls ?? false,
            'schedules' => $this->schedules ? CompanyScheduleResource::collection($this->whenLoaded('schedules'))->toArray(request()) : [],
            'schedule' => $this->getDailySchedulesArray(),
            'grouped_schedule' => $this->getGroupedSchedule(),
        ];
    }
}
