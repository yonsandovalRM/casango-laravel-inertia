<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasUuid;

    protected $fillable = [
        'name',
        'description',
        'price_monthly',
        'price_annual',
        'currency',
        'features',
        'is_free',
        'is_popular',
        'trial_days',
    ];

    protected $casts = [
        'features' => 'array',
        'is_free' => 'boolean',
        'is_popular' => 'boolean',
    ];
}


