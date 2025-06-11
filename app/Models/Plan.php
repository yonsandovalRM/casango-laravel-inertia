<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
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


