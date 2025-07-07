<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use App\Traits\HandlesMercadoPago;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\PaymentSetupReminder;
use App\Mail\PaymentDueReminder;

class ProcessSubscriptions extends Command
{
    use HandlesMercadoPago;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:process';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process subscriptions and handle payment reminders';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Processing subscriptions...');

        // Procesar recordatorios de configuración de pago
        $this->processPaymentSetupReminders();

        // Procesar recordatorios de vencimiento
        $this->processPaymentDueReminders();

        // Verificar estados de preaprobaciones
        $this->checkPreapprovalStatuses();

        // Procesar suscripciones vencidas
        $this->processExpiredSubscriptions();

        $this->info('Subscriptions processed successfully.');
    }

    /**
     * Procesar recordatorios de configuración de pago
     */
    private function processPaymentSetupReminders()
    {
        $subscriptions = Subscription::where('payment_status', 'pending')
            ->whereNull('payment_setup_reminder_sent_at')
            ->where('trial_ends_at', '<=', now()->addDays(3))
            ->with('tenant')
            ->get();

        foreach ($subscriptions as $subscription) {
            $this->info("Sending payment setup reminder for subscription: {$subscription->id}");

            try {
                // Crear preaprobación si no existe
                if (!$subscription->mp_preapproval_id) {
                    $this->createPreapproval($subscription);
                }

                // Enviar email de recordatorio
                Mail::to($subscription->tenant->email)
                    ->send(new PaymentSetupReminder($subscription));

                $subscription->update([
                    'payment_setup_reminder_sent_at' => now()
                ]);

                $this->info("Payment setup reminder sent successfully.");
            } catch (\Exception $e) {
                $this->error("Failed to send payment setup reminder: {$e->getMessage()}");
                Log::error('Payment setup reminder failed', [
                    'subscription_id' => $subscription->id,
                    'error' => $e->getMessage()
                ]);
            }
        }
    }

    /**
     * Procesar recordatorios de vencimiento
     */
    private function processPaymentDueReminders()
    {
        $subscriptions = Subscription::where('payment_status', 'pending_payment_method')
            ->whereNull('payment_due_reminder_sent_at')
            ->where('trial_ends_at', '<=', now()->addDay())
            ->with('tenant')
            ->get();

        foreach ($subscriptions as $subscription) {
            $this->info("Sending payment due reminder for subscription: {$subscription->id}");

            try {
                Mail::to($subscription->tenant->email)
                    ->send(new PaymentDueReminder($subscription));

                $subscription->update([
                    'payment_due_reminder_sent_at' => now()
                ]);

                $this->info("Payment due reminder sent successfully.");
            } catch (\Exception $e) {
                $this->error("Failed to send payment due reminder: {$e->getMessage()}");
                Log::error('Payment due reminder failed', [
                    'subscription_id' => $subscription->id,
                    'error' => $e->getMessage()
                ]);
            }
        }
    }

    /**
     * Verificar estados de preaprobaciones
     */
    private function checkPreapprovalStatuses()
    {
        $subscriptions = Subscription::whereNotNull('mp_preapproval_id')
            ->whereIn('payment_status', ['pending_payment_method', 'active'])
            ->get();

        foreach ($subscriptions as $subscription) {
            $this->info("Checking preapproval status for subscription: {$subscription->id}");

            try {
                $this->checkPreapprovalStatus($subscription);
                $this->info("Preapproval status checked successfully.");
            } catch (\Exception $e) {
                $this->error("Failed to check preapproval status: {$e->getMessage()}");
                Log::error('Preapproval status check failed', [
                    'subscription_id' => $subscription->id,
                    'error' => $e->getMessage()
                ]);
            }
        }
    }

    /**
     * Procesar suscripciones vencidas
     */
    private function processExpiredSubscriptions()
    {
        $expiredSubscriptions = Subscription::where('trial_ends_at', '<', now())
            ->where('payment_status', 'pending')
            ->where('is_active', true)
            ->get();

        foreach ($expiredSubscriptions as $subscription) {
            $this->info("Processing expired subscription: {$subscription->id}");

            try {
                $subscription->update([
                    'is_active' => false,
                    'payment_status' => 'expired'
                ]);

                $this->info("Subscription marked as expired.");
            } catch (\Exception $e) {
                $this->error("Failed to process expired subscription: {$e->getMessage()}");
                Log::error('Expired subscription processing failed', [
                    'subscription_id' => $subscription->id,
                    'error' => $e->getMessage()
                ]);
            }
        }
    }
}
