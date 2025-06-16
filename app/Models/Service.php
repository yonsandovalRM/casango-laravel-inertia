<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\HasUuid;

class Service extends Model
{

    use HasFactory, SoftDeletes, HasUuid;

    protected $fillable = [
        'name',
        'description',
        'notes',
        'category',
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
}
