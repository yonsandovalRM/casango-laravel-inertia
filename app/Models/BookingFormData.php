<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingFormData extends Model
{
    protected $fillable = [
        'booking_id',
        'form_template_id',
        'data', // JSON con todas las respuestas
        'is_visible_to_team'
    ];

    protected $casts = [
        'data' => 'array'
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(FormTemplate::class, 'form_template_id');
    }
}
