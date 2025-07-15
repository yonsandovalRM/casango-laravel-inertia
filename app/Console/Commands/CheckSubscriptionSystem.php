<?php

namespace App\Console\Commands;

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use Illuminate\Console\Command;

class CheckSubscriptionSystem extends Command
{
    protected $signature = 'subscription:check-system';
    protected $description = 'Check subscription system health';

    public function handle(): int
    {
        $this->info('Checking subscription system...');

        // Verificar configuración
        $this->checkConfiguration();

        // Verificar planes
        $this->checkPlans();

        // Verificar suscripciones
        $this->checkSubscriptions();

        // Verificar tenants
        $this->checkTenants();

        $this->info('System check completed!');
        return self::SUCCESS;
    }

    private function checkConfiguration(): void
    {
        $this->line('Checking configuration...');

        $required = [
            'MP_ACCESS_TOKEN',
            'MP_WEBHOOK_SECRET',
            'SUBSCRIPTION_GRACE_PERIOD_DAYS',
            'SUBSCRIPTION_MAX_FAILED_ATTEMPTS'
        ];

        foreach ($required as $env) {
            if (empty(env($env))) {
                $this->error("Missing environment variable: {$env}");
            } else {
                $this->info("✓ {$env} is configured");
            }
        }
    }

    private function checkPlans(): void
    {
        $this->line('Checking plans...');

        $plans = Plan::all();
        $this->info("Found {$plans->count()} plans");

        $hasFreePlan = $plans->where('is_free', true)->count() > 0;
        $hasPopularPlan = $plans->where('is_popular', true)->count() > 0;

        if (!$hasFreePlan) {
            $this->warn('No free plan found');
        } else {
            $this->info('✓ Free plan available');
        }

        if (!$hasPopularPlan) {
            $this->warn('No popular plan marked');
        } else {
            $this->info('✓ Popular plan marked');
        }
    }

    private function checkSubscriptions(): void
    {
        $this->line('Checking subscriptions...');

        $subscriptions = Subscription::all();
        $this->info("Found {$subscriptions->count()} subscriptions");

        $byStatus = $subscriptions->groupBy('status');
        foreach ($byStatus as $status => $subs) {
            $this->line("  - {$status}: {$subs->count()}");
        }

        $expired = $subscriptions->filter(fn($s) => $s->gracePeriodExpired() || $s->trialExpired());
        if ($expired->count() > 0) {
            $this->warn("Found {$expired->count()} expired subscriptions");
        }
    }

    private function checkTenants(): void
    {
        $this->line('Checking tenants...');

        $tenants = Tenant::all();
        $this->info("Found {$tenants->count()} tenants");

        $withoutSub = $tenants->filter(function ($tenant) {
            return $tenant->subscriptions()->where('is_active', true)->count() === 0;
        });

        if ($withoutSub->count() > 0) {
            $this->warn("Found {$withoutSub->count()} tenants without active subscriptions");
        } else {
            $this->info('✓ All tenants have active subscriptions');
        }
    }
}
