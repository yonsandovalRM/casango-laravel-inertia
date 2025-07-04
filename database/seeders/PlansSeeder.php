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
        Plan::create([
            'name' => 'Básico',
            'description' => 'Plan personal, ideal para profesionales independientes',
            'price_monthly' => 8990,
            'price_annual' => 89900,
            'currency' => 'CLP',
            'features' => ['Hasta 500 citas/mes', '1 profesional', 'Recordatorios email'],
            'is_free' => false,
            'is_popular' => true,
            'trial_days' => 14,
        ]);

        Plan::create([
            'name' => 'Pro',
            'description' => 'Plan profesional, ideal centros pequeños',
            'price_monthly' => 19990,
            'price_annual' => 199900,
            'currency' => 'CLP',
            'features' => ['Citas ilimitadas', '5 profesionales', 'WhatsApp + Email', 'Videollamadas'],
            'is_free' => false,
            'is_popular' => false,
            'trial_days' => 14,
        ]);

        Plan::create([
            'name' => 'Empresarial',
            'description' => 'Plan empresarial, ideal para centros grandes',
            'price_monthly' => 39990,
            'price_annual' => 399900,
            'currency' => 'CLP',
            'features' => ['Todo ilimitado', 'Soporte prioritario', 'Videollamadas', 'WhatsApp + Email'],
            'is_free' => false,
            'is_popular' => false,
            'trial_days' => 0,
        ]);
    }
}
