<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class FormTemplate extends Model
{
    use HasUuid;

    protected $fillable = [
        'company_id',
        'name',
        'description',

    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function fields()
    {
        return $this->hasMany(FormTemplateField::class);
    }

    public function activeFields()
    {
        return $this->hasMany(FormTemplateField::class)->where('is_active', true);
    }

    public function entries()
    {
        return $this->hasMany(FormEntry::class);
    }

    /**
     * Obtener los campos activos ordenados
     */
    public function getActiveFieldsOrdered()
    {
        return $this->activeFields()->orderBy('order')->get();
    }

    /**
     * Actualizar campos del template de forma segura
     */
    public function updateFields(array $fields)
    {
        // Marcar todos los campos como inactivos primero
        $this->fields()->update(['active' => false]);

        foreach ($fields as $index => $fieldData) {
            // Buscar si el campo ya existe por label
            $existingField = $this->fields()
                ->where('label', $fieldData['label'])
                ->first();

            if ($existingField) {
                // Reactivar y actualizar el campo existente
                $existingField->update([
                    'active' => true,
                    'type' => $fieldData['type'],
                    'placeholder' => $fieldData['placeholder'] ?? null,
                    'required' => $fieldData['required'] ?? false,
                    'options' => $fieldData['options'] ?? null,
                    'order' => $index,
                ]);
            } else {
                // Crear nuevo campo
                FormTemplateField::create([
                    'form_template_id' => $this->id,
                    'label' => $fieldData['label'],
                    'type' => $fieldData['type'],
                    'placeholder' => $fieldData['placeholder'] ?? null,
                    'required' => $fieldData['required'] ?? false,
                    'options' => $fieldData['options'] ?? null,
                    'order' => $index,
                    'is_active' => true,
                ]);
            }
        }
    }

    /**
     * Obtener todas las entradas de un cliente específico
     */
    public function getClientEntries($clientId)
    {
        return $this->entries()
            ->where('client_id', $clientId)
            ->with('fields')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Obtener la última entrada de un cliente
     */
    public function getLastClientEntry($clientId)
    {
        return $this->entries()
            ->where('client_id', $clientId)
            ->with('fields')
            ->latest()
            ->first();
    }
}
