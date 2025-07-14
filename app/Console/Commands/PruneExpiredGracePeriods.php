<?php

namespace App\Console\Commands;

use App\Enums\SubscriptionStatus;
use App\Models\Subscription;
use App\Services\MercadoPagoService;
use Illuminate\Console\Command;

class PruneExpiredGracePeriods extends Command
{
    protected $signature = 'subscriptions:prune-grace-periods';
    protected $description = 'Cancels subscriptions that have exceeded their grace period.';

    protected $mercadoPagoService;

    public function __construct(MercadoPagoService $mercadoPagoService)
    {
        parent::__construct();
        $this->mercadoPagoService = $mercadoPagoService;
    }

    public function handle(): int
    {
        $this->info('Buscando suscripciones con periodo de gracia vencido...');

        $expiredSubscriptions = Subscription::where('status', SubscriptionStatus::ON_GRACE_PERIOD)
            ->where('grace_period_ends_at', '<', now())
            ->get();

        if ($expiredSubscriptions->isEmpty()) {
            $this->info('No se encontraron suscripciones vencidas.');
            return self::SUCCESS;
        }

        $this->info("Se encontraron {$expiredSubscriptions->count()} suscripciones para cancelar.");

        foreach ($expiredSubscriptions as $subscription) {
            $this->line("Cancelando suscripción ID: {$subscription->id} para el tenant: {$subscription->tenant_id}");

            // El método cancelSubscription se encarga de actualizar el estado local y en MP.
            $success = $this->mercadoPagoService->cancelSubscription($subscription);

            if ($success) {
                $this->info("Suscripción {$subscription->id} cancelada exitosamente.");
            } else {
                $this->error("Falló la cancelación de la suscripción {$subscription->id}. Revisa los logs.");
            }
        }

        $this->info('Proceso de limpieza de periodos de gracia finalizado.');
        return self::SUCCESS;
    }
}
