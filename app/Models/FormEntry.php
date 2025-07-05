<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class FormEntry extends Model
{
    use HasUuid;
    protected $fillable = [
        'form_template_id',
        'booking_id',
        'professional_id',
        'filled_at',
    ];

    public function template()
    {
        return $this->belongsTo(FormTemplate::class);
    }

    public function fields()
    {
        return $this->hasMany(FormEntryField::class);
    }

    public function professional()
    {
        return $this->belongsTo(Professional::class, 'professional_id');
    }
}
