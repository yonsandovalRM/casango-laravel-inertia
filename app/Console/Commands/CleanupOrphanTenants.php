<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use App\Models\Tenant;
use Illuminate\Console\Command;

class CleanupOrphanTenants extends Command
{
    protected $signature = 'tenants:cleanup-orphans {--dry-run : Show what would be deleted without actually deleting}';
    protected $description = 'Clean up tenants without subscriptions or with failed setup';

    public function handle(): int
    {
        $this->info('Looking for orphan tenants...');

        // Tenants sin suscripciones
        $tenantsWithoutSubs = Tenant::whereDoesntHave('subscriptions')->get();

        // Tenants con suscripciones pero sin usuarios (setup fallido)
        $tenantsWithoutUsers = Tenant::whereHas('subscriptions')
            ->get()
            ->filter(function ($tenant) {
                return $tenant->run(function () {
                    return \App\Models\User::count() === 0;
                });
            });

        $orphans = $tenantsWithoutSubs->merge($tenantsWithoutUsers);

        if ($orphans->isEmpty()) {
            $this->info('No orphan tenants found.');
            return self::SUCCESS;
        }

        $this->warn("Found {$orphans->count()} orphan tenants:");

        foreach ($orphans as $tenant) {
            $this->line("- {$tenant->id} ({$tenant->name})");
        }

        if ($this->option('dry-run')) {
            $this->info('This was a dry run. Use without --dry-run to actually delete.');
            return self::SUCCESS;
        }

        if (!$this->confirm('Do you want to delete these tenants?')) {
            $this->info('Operation cancelled.');
            return self::SUCCESS;
        }

        foreach ($orphans as $tenant) {
            try {
                // Eliminar suscripciones asociadas
                $tenant->subscriptions()->delete();

                // Eliminar tenant
                $tenant->delete();

                $this->info("Deleted tenant: {$tenant->id}");
            } catch (\Exception $e) {
                $this->error("Failed to delete tenant {$tenant->id}: {$e->getMessage()}");
            }
        }

        $this->info('Cleanup completed.');
        return self::SUCCESS;
    }
}
