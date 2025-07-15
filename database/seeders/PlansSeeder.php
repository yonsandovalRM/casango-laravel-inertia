<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlansSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Solo crear si no existen planes
        if (Plan::count() > 0) {
            return;
        }

        $plans = [
            [
                'name' => 'Gratuito',
                'description' => 'Perfecto para comenzar',
                'price_monthly' => 0,
                'price_annual' => 0,
                'currency' => 'CLP',
                'is_free' => true,
                'is_popular' => false,
                'trial_days' => 0,
                'active' => true,
                'features' => [
                    '1 profesional',
                    '5 servicios',
                    '50 citas por mes',
                    'Calendario básico',
                    'Soporte por email'
                ]
            ],
            [
                'name' => 'Starter',
                'description' => 'Para negocios en crecimiento',
                'price_monthly' => 19990,
                'price_annual' => 199900,
                'currency' => 'CLP',
                'is_free' => false,
                'is_popular' => true,
                'trial_days' => 14,
                'active' => true,
                'features' => [
                    '3 profesionales',
                    '20 servicios',
                    '300 citas por mes',
                    'Calendario avanzado',
                    'Reportes básicos',
                    'Recordatorios automáticos',
                    'Soporte prioritario'
                ]
            ],
            [
                'name' => 'Profesional',
                'description' => 'Para negocios establecidos',
                'price_monthly' => 39990,
                'price_annual' => 399900,
                'currency' => 'CLP',
                'is_free' => false,
                'is_popular' => false,
                'trial_days' => 14,
                'active' => true,
                'features' => [
                    '10 profesionales',
                    'Servicios ilimitados',
                    'Citas ilimitadas',
                    'Reportes avanzados',
                    'Branding personalizado',
                    'Integración WhatsApp',
                    'API acceso',
                    'Soporte telefónico'
                ]
            ]
        ];

        foreach ($plans as $planData) {
            Plan::create($planData);
        }
    }
}
