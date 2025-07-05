<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class FormTemplateField extends Model
{
    use HasUuid;
    protected $fillable = [
        'label',
        'placeholder',
        'type',
        'options',
        'required',
        'order',
        'form_template_id',
    ];

    public function template()
    {
        return $this->belongsTo(FormTemplate::class);
    }
}
