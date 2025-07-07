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
}
