<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Professional extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'user_id',
        'photo',
        'bio',
        'title',
        'is_full_time',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
