<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class FormTemplateField extends Model
{
    use HasUuid;

    protected $fillable = [
        'form_template_id',
        'label',
        'placeholder',
        'type',
        'options',
        'required',
        'order',
        'is_active',
    ];

    protected $casts = [
        'options' => 'array',
        'required' => 'boolean',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    public function template()
    {
        return $this->belongsTo(FormTemplate::class);
    }

    /**
     * Scope para obtener solo campos activos
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope para obtener campos ordenados
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    /**
     * Verificar si el campo tiene entradas asociadas
     */
    public function hasEntries()
    {
        return FormEntryField::where('field_label', $this->label)
            ->whereHas('entry', function ($query) {
                $query->where('form_template_id', $this->form_template_id);
            })
            ->exists();
    }

    /**
     * Obtener el número de entradas que usan este campo
     */
    public function getEntriesCount()
    {
        return FormEntryField::where('field_label', $this->label)
            ->whereHas('entry', function ($query) {
                $query->where('form_template_id', $this->form_template_id);
            })
            ->count();
    }
}
