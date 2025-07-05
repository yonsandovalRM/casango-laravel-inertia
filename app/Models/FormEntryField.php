<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class FormEntryField extends Model
{
    use HasUuid;
    protected $fillable = [
        'form_entry_id',
        'field_label',
        'value',
    ];

    protected $casts = [
        'options' => 'array',
        'required' => 'boolean',
        'order' => 'integer',
    ];
    public function entry()
    {
        return $this->belongsTo(FormEntry::class);
    }
}
