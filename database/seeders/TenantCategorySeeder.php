<?php

namespace Database\Seeders;

use App\Models\TenantCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TenantCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        TenantCategory::create([
            'name' => 'Salud y Bienestar',
            'description' => 'Médicos, dentistas, psicólogos, fisioterapeutas, nutricionistas.',
            'is_active' => true,
        ]);

        TenantCategory::create([
            'name' => 'Belleza y Cuidado Personal',
            'description' => 'Peluqueros, esteticistas, barberos, tatuadores, masajistas.',
            'is_active' => true,
        ]);

        TenantCategory::create([
            'name' => 'Servicios Técnicos',
            'description' => 'Electricistas, plomeros, técnicos de TI, mecánicos.',
            'is_active' => false,
        ]);

        TenantCategory::create([
            'name' => 'Consultoría y Negocios',
            'description' => 'Abogados, contadores, coaches, mentores financieros.',
            'is_active' => true,
        ]);

        TenantCategory::create([
            'name' => 'Fitness y Deportes',
            'description' => 'Entrenadores personales, instructores de yoga, gimnasios.',
            'is_active' => true,
        ]);

        TenantCategory::create([
            'name' => 'Educación y Tutorías',
            'description' => 'Profesores, tutores académicos, instructores de idiomas.',
            'is_active' => true,
        ]);

        TenantCategory::create([
            'name' => 'Eventos y Entretenimiento',
            'description' => 'Fotógrafos, DJs, organizadores de eventos, chefs a domicilio.',
            'is_active' => true,
        ]);
    }
}
