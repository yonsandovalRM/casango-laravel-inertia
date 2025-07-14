<?php

namespace App\Console\Commands;

use App\Enums\SubscriptionStatus;
use App\Events\PaymentFailed;
use App\Models\Subscription;
use App\Mail\TrialExpiringMail;
use App\Mail\GracePeriodExpiringMail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class ManageSubscriptionLifecycle extends Command
{
    protected $signature = 'subscriptions:manage-lifecycle';
    protected $description = 'Manages subscription lifecycle: trials, grace periods, suspensions';

    public function handle(): int
    {
        $this->info('Managing subscription lifecycle...');

        $this->handleTrialExpirations();
        $this->handleGracePeriodExpirations();
        $this->sendUpcomingExpirationNotifications();

        $this->info('Subscription lifecycle management completed.');
        return self::SUCCESS;
    }

    protected function handleTrialExpirations(): void
    {
        $expiredTrials = Subscription::where('status', SubscriptionStatus::TRIAL)
            ->where('trial_ends_at', '<', now())
            ->get();

        foreach ($expiredTrials as $subscription) {
            $this->line("Processing expired trial for tenant: {$subscription->tenant_id}");

            if ($subscription->plan->is_free) {
                $subscription->activate();
                $this->info("Activated free plan for tenant: {$subscription->tenant_id}");
            } else {
                $subscription->update(['status' => SubscriptionStatus::TRIAL_EXPIRED]);
                $this->info("Marked trial as expired for tenant: {$subscription->tenant_id}");
            }
        }
    }

    protected function handleGracePeriodExpirations(): void
    {
        $expiredGracePeriods = Subscription::where('status', SubscriptionStatus::ON_GRACE_PERIOD)
            ->where('grace_period_ends_at', '<', now())
            ->get();

        foreach ($expiredGracePeriods as $subscription) {
            $this->line("Suspending subscription for tenant: {$subscription->tenant_id}");
            $subscription->suspend();
        }
    }

    protected function sendUpcomingExpirationNotifications(): void
    {
        $reminderDays = config('mercadopago.subscription.reminder_days_before_trial_end', 3);

        // Notificaciones de trial próximo a expirar
        $trialExpiringSoon = Subscription::where('status', SubscriptionStatus::TRIAL)
            ->whereBetween('trial_ends_at', [
                now()->addDays($reminderDays - 1),
                now()->addDays($reminderDays)
            ])
            ->get();

        foreach ($trialExpiringSoon as $subscription) {
            Mail::to($subscription->tenant->email)
                ->send(new TrialExpiringMail($subscription));
        }

        // Notificaciones de período de gracia próximo a expirar
        $gracePeriodExpiringSoon = Subscription::where('status', SubscriptionStatus::ON_GRACE_PERIOD)
            ->whereBetween('grace_period_ends_at', [
                now()->addDays(1),
                now()->addDays(2)
            ])
            ->get();

        foreach ($gracePeriodExpiringSoon as $subscription) {
            Mail::to($subscription->tenant->email)
                ->send(new GracePeriodExpiringMail($subscription));
        }
    }
}
