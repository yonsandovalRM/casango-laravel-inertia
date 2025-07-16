<?php

namespace App\Models;

use App\Traits\HasTimezone;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Exception extends Model
{
    use HasUuid, HasTimezone;

    protected $fillable = [
        'professional_id',
        'date',
        'start_time',
        'end_time',
        'reason'
    ];

    /**
     * Campos específicos de timezone para excepciones
     */
    protected $timezoneFields = [
        'created_at',
        'updated_at',
        'date',
        'start_time',
        'end_time',
    ];

    protected $casts = [
        'date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
    ];

    public function professional()
    {
        return $this->belongsTo(Professional::class);
    }

    /**
     * Scope para excepciones de una fecha específica
     */
    public function scopeForDate($query, $date)
    {
        return $this->scopeWhereDateEqualsInTimezone($query, 'date', $date);
    }
}
