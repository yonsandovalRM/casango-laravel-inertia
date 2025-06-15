<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanySchedule extends Model
{
    use HasFactory, HasUuid;

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

    protected $casts = [
        'is_open' => 'boolean',
        'has_break' => 'boolean',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

   /*  public function getDayOfWeekAttribute($value)
    {
        return __('company.day_of_week.' . $value);
    } */
}
