<?php

namespace App\Console\Commands\Subscriptions;

use Illuminate\Console\Command;
use App\Models\Subscription;

class ProcessDailySubscriptions extends Command
{
    protected $signature = 'subscriptions:process-daily';
    protected $description = 'Process daily subscription tasks (cleanup, reports)';

    public function handle()
    {
        $this->info('[Daily] Starting subscription processing...');

        // 1. Limpieza de suscripciones vencidas
        $this->cleanupExpiredSubscriptions();

        // 2. Manejo de períodos de gracia
        $this->handleGracePeriods();

        // 2. Generar reportes (opcional)
        $this->generateDailyReports();

        $this->info('[Daily] Subscription processing completed.');
    }

    private function cleanupExpiredSubscriptions(): void
    {
        $this->info('Cleaning up expired subscriptions...');

        $count = Subscription::where('trial_ends_at', '<', now())
            ->where('payment_status', 'pending')
            ->where('is_active', true)
            ->update([
                'is_active' => false,
                'payment_status' => 'expired'
            ]);

        $this->info("Marked $count subscriptions as expired");
    }

    private function generateDailyReports(): void
    {
        $this->info('Generating daily reports...');
        // Lógica para generar reportes diarios
        // Ejemplo: Enviar email con resumen al administrador
    }

    private function handleGracePeriods(): void
    {
        $this->info('Processing grace periods...');

        $graceSubscriptions = Subscription::where('payment_status', Subscription::STATUS_PAST_DUE)
            ->where('ends_at', '>', now()->subDays(config('subscription.grace_period_days')))
            ->get();

        foreach ($graceSubscriptions as $sub) {
            $daysLeft = $sub->ends_at->diffInDays(now());

            // Suspender después del período de gracia
            if ($sub->ends_at < now()) {
                $sub->suspend();
                $this->info("Suspended subscription #{$sub->id} (grace period expired)");
            }
        }
    }
}
