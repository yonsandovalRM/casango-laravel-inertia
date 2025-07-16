<?php

namespace App\Http\Resources;

use App\Traits\TimezoneResourceTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfessionalScheduleResource extends JsonResource
{
    use TimezoneResourceTrait;

    protected $timezoneFields = [
        'open_time',
        'close_time',
        'break_start_time',
        'break_end_time',
    ];

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'day_of_week' => $this->day_of_week,
            'open_time' => $this->open_time,
            'close_time' => $this->close_time,
            'break_start_time' => $this->break_start_time,
            'break_end_time' => $this->break_end_time,
            'is_open' => $this->is_open ?? true,
            'has_break' => $this->has_break ?? false,
        ];
    }
}
