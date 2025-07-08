<?php

namespace Database\Seeders\Tenants;

use App\Models\FormTemplate;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class FormTemplatesSeeder extends Seeder
{
    public function run(): void
    {
        $form_template = FormTemplate::create([
            'name' => 'Perfil de Usuario',
            'description' => 'Datos básicos del usuario',
            'is_active' => true,
            'type' => 'user_profile',
        ]);

        $form_template->fields()->createMany([
            [
                'label' => 'Fecha de nacimiento',
                'name' => 'birthdate',
                'type' => 'date',
                'is_required' => false,
                'order' => 4
            ],
            [
                'label' => 'Género',
                'name' => 'gender',
                'type' => 'select',
                'options' => json_encode(['Masculino', 'Femenino', 'Otro', 'Prefiero no decir']),
                'is_required' => false,
                'order' => 5
            ],
            [
                'label' => 'Dirección',
                'name' => 'address',
                'type' => 'textarea',
                'is_required' => false,
                'order' => 6
            ]
        ]);

        $form_template = FormTemplate::create([
            'name' => 'Cita en Peluquería',
            'description' => 'Formulario para agendar servicios de peluquería',
            'is_active' => false,
            'type' => 'booking_form',
        ]);

        $form_template->fields()->createMany([
            [
                'label' => 'Descripción adicional',
                'name' => 'description',
                'type' => 'textarea',
                'placeholder' => 'Ej: "Quiero un corte pixie" o "Alergia a productos con amoníaco"',
                'is_required' => false,
                'order' => 5
            ],
            [
                'label' => 'Foto de referencia',
                'name' => 'reference_photo',
                'type' => 'file',
                'is_required' => false,
                'order' => 6
            ]
        ]);

        $form_template = FormTemplate::create([
            'name' => 'Cita Legal',
            'description' => 'Formulario para agendar consultas legales',
            'is_active' => false,
            'type' => 'booking_form',
        ]);

        $form_template->fields()->createMany([

            [
                'label' => 'Área legal',
                'name' => 'legal_area',
                'type' => 'select',
                'options' => json_encode([
                    'Derecho Familiar',
                    'Derecho Penal',
                    'Derecho Laboral',
                    'Propiedad Intelectual',
                    'Contratos',
                    'Inmobiliario'
                ]),
                'is_required' => true,
                'order' => 3
            ],
            [
                'label' => 'Descripción del caso',
                'name' => 'case_description',
                'type' => 'textarea',
                'placeholder' => 'Describa brevemente su situación legal',
                'is_required' => true,
                'order' => 4
            ],
            [
                'label' => 'Documentos adjuntos',
                'name' => 'legal_documents',
                'type' => 'file',
                'is_required' => false,
                'order' => 5
            ]
        ]);

        $form_template = FormTemplate::create([
            'name' => 'Historial Clínico',
            'description' => 'Datos médicos complementarios para la cita',
            'is_active' => true,
            'type' => 'booking_form',
        ]);

        $form_template->fields()->createMany([
            [
                'label' => 'Motivo de consulta',
                'name' => 'reason',
                'type' => 'textarea',
                'placeholder' => 'Describa el motivo principal de la consulta',
                'is_required' => true,
                'order' => 1
            ],
            [
                'label' => 'Síntomas',
                'name' => 'symptoms',
                'type' => 'textarea',
                'placeholder' => 'Enumere los síntomas (ej: fiebre, dolor de cabeza, etc.)',
                'order' => 2
            ],
            [
                'label' => 'Alergias conocidas',
                'name' => 'allergies',
                'type' => 'text',
                'placeholder' => 'Ej: Penicilina, aspirina, látex...',
                'order' => 3
            ],
            [
                'label' => 'Medicamentos actuales',
                'name' => 'current_meds',
                'type' => 'textarea',
                'placeholder' => 'Lista de medicamentos y dosis',
                'order' => 4
            ],
            [
                'label' => 'Antecedentes médicos',
                'name' => 'medical_history',
                'type' => 'textarea',
                'placeholder' => 'Enfermedades crónicas, cirugías previas, etc.',
                'order' => 5
            ],
            [
                'label' => 'Examen físico',
                'name' => 'physical_exam',
                'type' => 'textarea',
                'placeholder' => 'Signos vitales y hallazgos (ej: TA: 120/80, FC: 72)',
                'order' => 6
            ],
            [
                'label' => 'Diagnóstico preliminar',
                'name' => 'diagnosis',
                'type' => 'textarea',
                'placeholder' => 'Diagnóstico o impresión clínica',
                'order' => 7
            ],
            [
                'label' => 'Tratamiento indicado',
                'name' => 'treatment',
                'type' => 'textarea',
                'placeholder' => 'Medicamentos, terapias o recomendaciones',
                'order' => 8
            ],
            [
                'label' => 'Exámenes solicitados',
                'name' => 'required_tests',
                'type' => 'textarea',
                'placeholder' => 'Laboratorios, imágenes, etc.',
                'order' => 9
            ],
            [
                'label' => 'Archivos adjuntos',
                'name' => 'medical_files',
                'type' => 'file',
                'order' => 10
            ]
        ]);

        $form_template = FormTemplate::create([
            'name' => 'Preferencias de Corte',
            'description' => 'Detalles específicos para el servicio de barbería',
            'is_active' => true,
            'type' => 'booking_form',
        ]);

        $form_template->fields()->createMany([
            [
                'label' => 'Tipo de servicio',
                'name' => 'service_type',
                'type' => 'select',
                'options' => json_encode([
                    'Corte de cabello',
                    'Corte y barba',
                    'Afeitado clásico',
                    'Arreglo de barba',
                    'Tinte/Restauración de color',
                    'Tratamiento capilar'
                ]),
                'is_required' => true,
                'order' => 1
            ],
            [
                'label' => 'Estilo deseado',
                'name' => 'style_preference',
                'type' => 'textarea',
                'placeholder' => 'Ej: "Fade alto", "Barba perfilada", "Corte militar"',
                'order' => 2
            ],
            [
                'label' => 'Productos a usar',
                'name' => 'product_preference',
                'type' => 'text',
                'placeholder' => 'Ej: "Pomada matte", "Aceite para barba de sandía"',
                'order' => 3
            ],
            [
                'label' => 'Alergias o sensibilidades',
                'name' => 'allergies',
                'type' => 'text',
                'placeholder' => 'Ej: Alergia al alcohol en lociones, piel sensible',
                'order' => 4
            ],
            [
                'label' => 'Foto de referencia',
                'name' => 'reference_photo',
                'type' => 'file',
                'order' => 5
            ],
            [
                'label' => '¿Desea servicio adicional?',
                'name' => 'add_ons',
                'type' => 'checkbox',
                'options' => json_encode([
                    'Mascarilla capilar',
                    'Exfoliación facial',
                    'Depilación con cera (cejas/nariz)',
                    'Masaje relajante'
                ]),
                'is_required' => false,
                'order' => 6
            ]
        ]);
    }
}
