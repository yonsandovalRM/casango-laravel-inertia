<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class ProfessionalSchedule extends Model
{
    use HasUuid;

    protected $fillable = [
        'professional_id',
        'day_of_week',
        'open_time',
        'close_time',
        'is_open',
        'has_break',
        'break_start_time',
        'break_end_time',
    ];

    public function professional()
    {
        return $this->belongsTo(Professional::class);
    }
}
