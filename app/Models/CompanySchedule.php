<?php

namespace App\Models;

use App\Traits\HasTimezone;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanySchedule extends Model
{
    use HasFactory, HasUuid, HasTimezone;

    protected $fillable = [
        'company_id',
        'day_of_week',
        'open_time',
        'close_time',
        'break_start_time',
        'break_end_time',
        'is_open',
        'has_break',
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

    /**
     * Campos que son solo TIME (HH:MM)
     */
    protected $timeOnlyFields = [
        'open_time',
        'close_time',
        'break_start_time',
        'break_end_time',
    ];

    protected $casts = [
        'is_open' => 'boolean',
        'has_break' => 'boolean',
    ];

    protected $appends = ['formatted_schedule'];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Obtener horarios formateados para un día específico
     */
    public function getWorkingHoursForDate($date): array
    {
        return \App\Services\TimezoneService::getWorkingHoursForDate(
            $date,
            $this->formatForFrontend('open_time'),
            $this->formatForFrontend('close_time')
        );
    }
}
