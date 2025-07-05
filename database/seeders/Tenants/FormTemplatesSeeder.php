<?php

namespace Database\Seeders\Tenants;

use Illuminate\Database\Seeder;
use App\Models\FormTemplate;
use App\Models\FormTemplateField;

class FormTemplatesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Template 1: Formulario de Barbería
        $barberTemplate = FormTemplate::create([
            'name' => 'Ficha de Cliente - Barbería',
            'description' => 'Formulario de registro y preferencias para clientes de barbería',
            'visibility' => 'team',
        ]);

        $barberFields = [
            [
                'label' => 'Nombre completo',
                'type' => 'text',
                'placeholder' => 'Ingrese su nombre completo',
                'required' => true,
                'options' => null,
                'order' => 0,
            ],
            [
                'label' => 'Teléfono',
                'type' => 'phone',
                'placeholder' => '+56 9 1234 5678',
                'required' => true,
                'options' => null,
                'order' => 1,
            ],
            [
                'label' => 'Email',
                'type' => 'email',
                'placeholder' => 'ejemplo@correo.com',
                'required' => false,
                'options' => null,
                'order' => 2,
            ],
            [
                'label' => 'Tipo de cabello',
                'type' => 'select',
                'placeholder' => null,
                'required' => true,
                'options' => json_encode([
                    'Liso',
                    'Ondulado',
                    'Rizado',
                    'Muy rizado',
                    'Graso',
                    'Seco',
                    'Mixto'
                ]),
                'order' => 3,
            ],
            [
                'label' => 'Servicios de interés',
                'type' => 'checkbox',
                'placeholder' => null,
                'required' => true,
                'options' => json_encode([
                    'Corte de cabello',
                    'Barba',
                    'Bigote',
                    'Cejas',
                    'Lavado',
                    'Tratamiento capilar',
                    'Afeitado clásico',
                    'Arreglo de patillas'
                ]),
                'order' => 4,
            ],
            [
                'label' => 'Frecuencia de visita',
                'type' => 'radio',
                'placeholder' => null,
                'required' => true,
                'options' => json_encode([
                    'Semanal',
                    'Quincenal',
                    'Mensual',
                    'Cada 2 meses',
                    'Ocasional'
                ]),
                'order' => 5,
            ],
            [
                'label' => '¿Tiene alguna alergia o sensibilidad?',
                'type' => 'switch',
                'placeholder' => null,
                'required' => false,
                'options' => null,
                'order' => 6,
            ],
            [
                'label' => 'Detalles de alergias',
                'type' => 'textarea',
                'placeholder' => 'Especifique alergias o sensibilidades a productos',
                'required' => false,
                'options' => null,
                'order' => 7,
            ],
            [
                'label' => 'Preferencias de estilo',
                'type' => 'textarea',
                'placeholder' => 'Describe tu estilo preferido o comparte referencias',
                'required' => false,
                'options' => null,
                'order' => 8,
            ],
            [
                'label' => 'Horario preferido',
                'type' => 'select',
                'placeholder' => null,
                'required' => false,
                'options' => json_encode([
                    'Mañana (9:00 - 12:00)',
                    'Tarde (12:00 - 17:00)',
                    'Noche (17:00 - 20:00)',
                    'Sin preferencia'
                ]),
                'order' => 9,
            ],
            [
                'label' => 'Observaciones adicionales',
                'type' => 'textarea',
                'placeholder' => 'Cualquier información adicional que considere relevante',
                'required' => false,
                'options' => null,
                'order' => 10,
            ]
        ];

        foreach ($barberFields as $field) {
            FormTemplateField::create([
                'form_template_id' => $barberTemplate->id,
                ...$field
            ]);
        }

        // Template 2: Ficha Médica
        $medicalTemplate = FormTemplate::create([
            'name' => 'Ficha Médica - Consulta General',
            'description' => 'Formulario completo para registro de consulta médica general',
            'visibility' => 'private',
        ]);

        $medicalFields = [
            [
                'label' => 'Presión arterial',
                'type' => 'text',
                'placeholder' => '120/80 mmHg',
                'required' => true,
                'options' => null,
                'order' => 0,
            ],
            [
                'label' => 'Frecuencia cardíaca',
                'type' => 'number',
                'placeholder' => '72 bpm',
                'required' => true,
                'options' => null,
                'order' => 1,
            ],
            [
                'label' => 'Temperatura',
                'type' => 'number',
                'placeholder' => '36.5°C',
                'required' => true,
                'options' => null,
                'order' => 2,
            ],
            [
                'label' => 'Peso',
                'type' => 'number',
                'placeholder' => 'Peso en kg',
                'required' => true,
                'options' => null,
                'order' => 3,
            ],
            [
                'label' => 'Talla',
                'type' => 'number',
                'placeholder' => 'Altura en cm',
                'required' => true,
                'options' => null,
                'order' => 4,
            ],
            [
                'label' => 'Motivo de consulta',
                'type' => 'textarea',
                'placeholder' => 'Describa el motivo principal de la consulta',
                'required' => true,
                'options' => null,
                'order' => 5,
            ],
            [
                'label' => 'Observaciones generales',
                'type' => 'textarea',
                'placeholder' => 'Observaciones generales del paciente',
                'required' => false,
                'options' => null,
                'order' => 6,
            ],
            [
                'label' => 'Dolor localizado',
                'type' => 'select',
                'placeholder' => null,
                'required' => false,
                'options' => json_encode([
                    'Sin dolor',
                    'Cabeza',
                    'Cuello',
                    'Pecho',
                    'Abdomen',
                    'Espalda',
                    'Brazos',
                    'Piernas',
                    'Articulaciones',
                    'Otro'
                ]),
                'order' => 7,
            ],
            [
                'label' => 'Diagnóstico clínico',
                'type' => 'textarea',
                'placeholder' => 'Diagnóstico médico preliminar o confirmado',
                'required' => true,
                'options' => null,
                'order' => 8,
            ],
            [
                'label' => 'Observaciones médicas',
                'type' => 'textarea',
                'placeholder' => 'Observaciones específicas del diagnóstico',
                'required' => false,
                'options' => null,
                'order' => 9,
            ],
            [
                'label' => 'Prescripción médica',
                'type' => 'textarea',
                'placeholder' => 'Medicamentos recetados, dosis y frecuencia',
                'required' => false,
                'options' => null,
                'order' => 10,
            ],
            [
                'label' => 'Recomendaciones generales',
                'type' => 'textarea',
                'placeholder' => 'Recomendaciones de cuidado, dieta, actividad física, etc.',
                'required' => false,
                'options' => null,
                'order' => 11,
            ],
            [
                'label' => 'Derivación a especialista',
                'type' => 'select',
                'placeholder' => null,
                'required' => false,
                'options' => json_encode([
                    'No requiere derivación',
                    'Cardiología',
                    'Neurología',
                    'Traumatología',
                    'Gastroenterología',
                    'Dermatología',
                    'Ginecología',
                    'Urología',
                    'Oftalmología',
                    'Otorrinolaringología',
                    'Psiquiatría',
                    'Endocrinología',
                    'Otro especialista'
                ]),
                'order' => 12,
            ],
            [
                'label' => 'Fecha de control sugerido',
                'type' => 'date',
                'placeholder' => null,
                'required' => false,
                'options' => null,
                'order' => 13,
            ]
        ];

        foreach ($medicalFields as $field) {
            FormTemplateField::create([
                'form_template_id' => $medicalTemplate->id,
                ...$field
            ]);
        }

        $this->command->info('✅ Templates creados exitosamente:');
        $this->command->info("   - Ficha de Cliente - Barbería ({$barberTemplate->fields->count()} campos)");
        $this->command->info("   - Ficha Médica - Consulta General ({$medicalTemplate->fields->count()} campos)");
    }
}
