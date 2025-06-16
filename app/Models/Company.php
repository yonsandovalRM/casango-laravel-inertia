<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{

    use HasFactory, HasUuid;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'phone2',
        'address',
        'city',
        'country',
        'logo',
        'cover_image',
        'currency',
        'timezone',
        'locale',
    ];

    public function schedules()
    {
        return $this->hasMany(CompanySchedule::class);
    }
}
