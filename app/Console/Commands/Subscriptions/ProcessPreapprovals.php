<?php

namespace App\Console\Commands\Subscriptions;

use Illuminate\Console\Command;
use App\Traits\HandlesMercadoPago;
use App\Models\Subscription;
use Illuminate\Support\Facades\Log;


class ProcessPreapprovals extends Command
{
    use HandlesMercadoPago;

    protected $signature = 'subscriptions:check-preapprovals';
    protected $description = 'Check and update MercadoPago preapproval statuses';

    public function handle()
    {
        $this->info('[Preapprovals] Starting status check...');

        Subscription::whereNotNull('mp_preapproval_id')
            ->whereIn('payment_status', ['pending_payment_method', 'is_active'])
            ->each(function ($subscription) {
                try {
                    $this->checkPreapprovalStatus($subscription);
                    $this->info("Checked status for subscription #{$subscription->id}");
                } catch (\Exception $e) {
                    $this->error("Failed to check status for #{$subscription->id}: {$e->getMessage()}");
                    Log::error('Preapproval check failed', [
                        'subscription_id' => $subscription->id,
                        'error' => $e->getMessage()
                    ]);
                }
            });

        $this->info('[Preapprovals] Status check completed');
    }
}
