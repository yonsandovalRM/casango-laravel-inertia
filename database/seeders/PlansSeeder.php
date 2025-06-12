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
            'name' => 'Plan 1',
            'description' => 'Plan 1 description',
            'price_monthly' => 100,
            'price_annual' => 1000,
            'currency' => 'CLP',
            'features' => ['Feature 1', 'Feature 2', 'Feature 3'],
            'is_free' => false,
            'is_popular' => true,
            'trial_days' => 30,
        ]);

        Plan::create([
            'name' => 'Plan 2',
            'description' => 'Plan 2 description',
            'price_monthly' => 200,
            'price_annual' => 2000,
            'currency' => 'CLP',
            'features' => ['Feature 1', 'Feature 2', 'Feature 3'],
            'is_free' => false,
            'is_popular' => false,
            'trial_days' => 30,
        ]);

        Plan::create([
            'name' => 'Plan 3',
            'description' => 'Plan 3 description',
            'price_monthly' => 300,
            'price_annual' => 3000,
            'currency' => 'CLP',
            'features' => ['Feature 1', 'Feature 2', 'Feature 3'],
            'is_free' => false,
            'is_popular' => false,
            'trial_days' => 30,
        ]);
    }
}

