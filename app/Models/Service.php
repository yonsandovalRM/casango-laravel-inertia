<?php

namespace App\Models;

use App\Enums\ServiceType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory, SoftDeletes, HasUuid;

    protected $fillable = [
        'name',
        'description',
        'notes',
        'category_id',
        'price',
        'duration',
        'preparation_time',
        'post_service_time',
        'service_type',
        'is_active',
    ];

    protected $casts = [
        'price' => 'float',
        'duration' => 'integer',
        'preparation_time' => 'integer',
        'post_service_time' => 'integer',
        'service_type' => ServiceType::class,
        'is_active' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function professionals(): BelongsToMany
    {
        return $this->belongsToMany(Professional::class)
            ->withPivot('duration', 'price')
            ->withTimestamps();
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    // Scopes para filtrar por tipo de servicio
    public function scopeInPerson($query)
    {
        return $query->whereIn('service_type', [
            ServiceType::IN_PERSON->value,
            ServiceType::HYBRID->value
        ]);
    }

    public function scopeVideoCall($query)
    {
        return $query->whereIn('service_type', [
            ServiceType::VIDEO_CALL->value,
            ServiceType::HYBRID->value
        ]);
    }

    public function scopeByType($query, ServiceType $type)
    {
        return $query->where('service_type', $type->value);
    }

    // Métodos helper
    public function allowsInPerson(): bool
    {
        return $this->service_type->allowsInPerson();
    }

    public function allowsVideoCall(): bool
    {
        return $this->service_type->allowsVideoCall();
    }

    public function isHybrid(): bool
    {
        return $this->service_type === ServiceType::HYBRID;
    }
}
