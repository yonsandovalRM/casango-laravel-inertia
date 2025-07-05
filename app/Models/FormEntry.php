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
        'client_id',
        'professional_id',
        'filled_at',
        'visibility',
    ];

    protected $casts = [
        'filled_at' => 'datetime',
        'visibility' => 'string',
    ];

    public function template()
    {
        return $this->belongsTo(FormTemplate::class, 'form_template_id');
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function professional()
    {
        return $this->belongsTo(Professional::class);
    }

    public function fields()
    {
        return $this->hasMany(FormEntryField::class);
    }

    /**
     * Obtener el valor de un campo específico
     */
    public function getFieldValue($fieldLabel)
    {
        $field = $this->fields()->where('field_label', $fieldLabel)->first();
        return $field ? $field->value : null;
    }

    /**
     * Obtener todos los campos como array asociativo
     */
    public function getFieldsAsArray()
    {
        $fieldsArray = [];
        foreach ($this->fields as $field) {
            $fieldsArray[$field->field_label] = $field->value;
        }
        return $fieldsArray;
    }

    /**
     * Crear o actualizar campos de la entrada
     */
    public function updateFields(array $fields)
    {
        // Eliminar campos existentes
        $this->fields()->delete();

        // Crear nuevos campos
        foreach ($fields as $field) {
            FormEntryField::create([
                'form_entry_id' => $this->id,
                'field_label' => $field['label'],
                'value' => $field['value'] ?? null,
            ]);
        }
    }

    /**
     * Scope para obtener entradas de un cliente específico
     */
    public function scopeForClient($query, $clientId)
    {
        return $query->where('client_id', $clientId);
    }

    /**
     * Scope para obtener entradas de un profesional específico
     */
    public function scopeForProfessional($query, $professionalId)
    {
        return $query->where('professional_id', $professionalId);
    }
}
