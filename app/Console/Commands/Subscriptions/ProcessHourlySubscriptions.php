<?php

namespace App\Console\Commands\Subscriptions;

use App\Mail\PaymentDueReminder;
use App\Mail\PaymentSetupReminder;
use App\Models\Subscription;
use Illuminate\Console\Command;
use App\Traits\HandlesMercadoPago;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;


class ProcessHourlySubscriptions extends Command
{
    use HandlesMercadoPago;

    protected $signature = 'subscriptions:process-hourly';
    protected $description = 'Process hourly subscription tasks (payment reminders, status checks)';

    public function handle()
    {
        $this->info('[Hourly] Starting subscription processing...');

        // 1. Recordatorios de configuración de pago
        $this->processPaymentSetupReminders();

        // 2. Recordatorios de pago pendiente
        $this->processPaymentDueReminders();

        // 3. Verificación de preaprobaciones (también se ejecuta cada 30 minutos por separado)
        $this->checkPreapprovalStatuses();

        $this->info('[Hourly] Subscription processing completed.');
    }

    private function processPaymentSetupReminders(): void
    {
        $this->info('Processing payment setup reminders...');

        Subscription::where('payment_status', 'pending')
            ->whereNull('payment_setup_reminder_sent_at')
            ->where('trial_ends_at', '<=', now()->addDays(3))
            ->with('tenant')
            ->each(function ($subscription) {
                try {
                    if (!$subscription->mp_preapproval_id) {
                        $this->createPreapproval($subscription);
                    }

                    Mail::to($subscription->tenant->email)
                        ->send(new PaymentSetupReminder($subscription));

                    $subscription->update(['payment_setup_reminder_sent_at' => now()]);
                    $this->info("Sent setup reminder for subscription #{$subscription->id}");
                } catch (\Exception $e) {
                    $this->logError($e, $subscription, 'payment setup reminder');
                }
            });
    }

    private function processPaymentDueReminders(): void
    {
        $this->info('Processing payment due reminders...');

        Subscription::where('payment_status', 'pending_payment_method')
            ->whereNull('payment_due_reminder_sent_at')
            ->where('trial_ends_at', '<=', now()->addDay())
            ->with('tenant')
            ->each(function ($subscription) {
                try {
                    Mail::to($subscription->tenant->email)
                        ->send(new PaymentDueReminder($subscription));

                    $subscription->update(['payment_due_reminder_sent_at' => now()]);
                    $this->info("Sent due reminder for subscription #{$subscription->id}");
                } catch (\Exception $e) {
                    $this->logError($e, $subscription, 'payment due reminder');
                }
            });
    }

    private function checkPreapprovalStatuses(): void
    {
        $this->info('Checking preapproval statuses...');

        Subscription::whereNotNull('mp_preapproval_id')
            ->whereIn('payment_status', ['pending_payment_method', 'is_active'])
            ->each(function ($subscription) {
                try {
                    $this->checkPreapprovalStatus($subscription);
                    $this->info("Checked status for subscription #{$subscription->id}");
                } catch (\Exception $e) {
                    $this->logError($e, $subscription, 'preapproval status check');
                }
            });
    }

    private function logError(\Exception $e, $subscription, string $action): void
    {
        $this->error("Failed $action for subscription #{$subscription->id}: {$e->getMessage()}");
        Log::error("Subscription $action failed", [
            'subscription_id' => $subscription->id,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
    }

    private function processGracePeriodReminders(): void
    {
        $this->info('Processing grace period reminders...');

        Subscription::where('payment_status', Subscription::STATUS_PAST_DUE)
            ->where('ends_at', '>', now())
            ->whereNull('grace_period_reminder_sent_at')
            ->with('tenant')
            ->each(function ($subscription) {
                $daysLeft = $subscription->ends_at->diffInDays(now());

                if ($daysLeft <= 3) {
                    // TODO: Enviar recordatorio de período de gracia
                    /* Mail::to($subscription->tenant->email)
                    ->send(new GracePeriodReminder($subscription, $daysLeft)); */

                    $subscription->update(['grace_period_reminder_sent_at' => now()]);
                }
            });
    }
}
