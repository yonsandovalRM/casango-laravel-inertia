<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormField extends Model
{
    use HasUuid;
    protected $fillable = [
        'form_template_id',
        'label',
        'name',
        'type', // text, textarea, date, time, select, checkbox, radio, file, etc.
        'options', // JSON para select, radio, checkbox
        'placeholder',
        'validation_rules',
        'order',
        'is_required',
        'default_value',
    ];

    protected $casts = [
        'options' => 'array',
        'is_required' => 'boolean'
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(FormTemplate::class, 'form_template_id');
    }
}
