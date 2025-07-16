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

    /**
     * Campos específicos de timezone para horarios
     */
    protected $timezoneFields = [
        'open_time',
        'close_time',
        'break_start_time',
        'break_end_time',
    ];

    protected $casts = [
        'is_open' => 'boolean',
        'has_break' => 'boolean',
        'open_time' => 'datetime:H:i',
        'close_time' => 'datetime:H:i',
        'break_start_time' => 'datetime:H:i',
        'break_end_time' => 'datetime:H:i',
    ];

    public function professional()
    {
        return $this->belongsTo(Professional::class);
    }
}
