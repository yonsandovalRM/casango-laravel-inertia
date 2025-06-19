<?php

namespace App\Models;

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
        'is_active',
    ];


    protected $casts = [
        'price' => 'float',
        'duration' => 'integer',
        'preparation_time' => 'integer',
        'post_service_time' => 'integer',
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
}
