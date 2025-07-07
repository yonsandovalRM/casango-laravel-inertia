<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Procesar suscripciones cada hora
        $schedule->command('subscriptions:process')
            ->hourly()
            ->withoutOverlapping()
            ->runInBackground();

        // Verificar estados de preaprobaciones cada 30 minutos
        $schedule->command('subscriptions:check-preapprovals')
            ->everyThirtyMinutes()
            ->withoutOverlapping()
            ->runInBackground();

        // Limpiar suscripciones vencidas diariamente
        $schedule->command('subscriptions:cleanup')
            ->daily()
            ->at('02:00')
            ->withoutOverlapping();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
