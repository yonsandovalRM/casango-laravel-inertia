<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FormTemplate extends Model
{
    protected $fillable = [
        'name',
        'description',
        'type', // 'user_profile' o 'appointment_form'
        'is_active'
    ];

    public function fields(): HasMany
    {
        return $this->hasMany(FormField::class);
    }
}
