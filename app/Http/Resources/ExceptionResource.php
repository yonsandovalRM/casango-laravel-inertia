<?php

namespace App\Http\Resources;

use App\Traits\TimezoneResourceTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExceptionResource extends JsonResource
{
    use TimezoneResourceTrait;

    protected $timezoneFields = [
        'created_at',
        'updated_at',
        'date',
        'start_time',
        'end_time',
    ];

    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'date' => $this->date,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'reason' => $this->reason,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
