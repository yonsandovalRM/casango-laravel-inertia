<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FormTemplate extends Model
{
    use HasUuid;
    protected $fillable = [
        'name',
        'description',
        'type', // 'user_profile' o 'booking_form'
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function fields(): HasMany
    {
        return $this->hasMany(FormField::class);
    }

    public function bookingFormData(): HasMany
    {
        return $this->hasMany(BookingFormData::class);
    }

    public function userProfileData(): HasMany
    {
        return $this->hasMany(UserProfileData::class);
    }

    // Scope para obtener solo templates activos
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope para obtener templates por tipo
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeUserProfile($query)
    {
        return $query->where('type', 'user_profile');
    }

    public function scopeBookingForm($query)
    {
        return $query->where('type', 'booking_form');
    }
}
