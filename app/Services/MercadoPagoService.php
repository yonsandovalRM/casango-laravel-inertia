<?php

namespace App\Services;

use App\Enums\SubscriptionStatus;
use App\Events\SubscriptionCreated;
use App\Events\SubscriptionUpdated;
use App\Events\PaymentFailed;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MercadoPagoService
{
    protected $accessToken;
    protected $preapprovalUrl;
    protected $webhookSecret;

    public function __construct()
    {
        $this->accessToken = config('mercadopago.access_token');
        $this->preapprovalUrl = config('mercadopago.preapproval_url');
        $this->webhookSecret = config('mercadopago.webhook_secret');
    }

    public function createSubscription(Tenant $tenant, Plan $plan, string $billing = 'monthly'): ?string
    {
        // Si es plan gratuito, crear suscripción local directamente
        if ($plan->is_free) {
            return $this->createFreeSubscription($tenant, $plan);
        }

        $price = $billing === 'monthly' ? $plan->price_monthly : $plan->price_annual;

        $payload = [
            'reason' => "Suscripción al plan {$plan->name} - {$tenant->name}",
            'auto_recurring' => [
                'frequency' => 1,
                'frequency_type' => $billing === 'monthly' ? 'months' : 'years',
                'transaction_amount' => $price,
                'currency_id' => config('mercadopago.currency.default'),
            ],
            'back_url' => route('tenant.subscription.success'),
            'payer_email' => $tenant->email,
            'external_reference' => $tenant->id,
            'notification_url' => route('webhook.mercadopago'),
        ];

        try {
            $response = Http::withToken($this->accessToken)
                ->timeout(30)
                ->post($this->preapprovalUrl, $payload);

            if ($response->successful() && isset($response->json()['init_point'])) {
                $subscription = $this->createLocalSubscription(
                    $tenant,
                    $plan,
                    $billing,
                    $response->json()
                );

                event(new SubscriptionCreated($subscription));

                return $response->json()['init_point'];
            }

            Log::error('Error creating MercadoPago subscription', [
                'tenant_id' => $tenant->id,
                'plan_id' => $plan->id,
                'response' => $response->body()
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Exception creating MercadoPago subscription', [
                'tenant_id' => $tenant->id,
                'plan_id' => $plan->id,
                'exception' => $e->getMessage()
            ]);

            return null;
        }
    }

    protected function createFreeSubscription(Tenant $tenant, Plan $plan): string
    {
        $subscription = Subscription::on('central')->updateOrCreate(
            ['tenant_id' => $tenant->id],
            [
                'plan_id' => $plan->id,
                'status' => SubscriptionStatus::ACTIVE,
                'price' => 0,
                'currency' => $plan->currency,
                'billing_cycle' => 'monthly',
                'starts_at' => now(),
                'is_active' => true,
            ]
        );

        event(new SubscriptionCreated($subscription));

        // Retornar URL local para plan gratuito
        return route('tenant.subscription.success');
    }

    protected function createLocalSubscription(
        Tenant $tenant,
        Plan $plan,
        string $billing,
        array $mpResponse
    ): Subscription {
        $price = $billing === 'monthly' ? $plan->price_monthly : $plan->price_annual;

        return Subscription::on('central')->updateOrCreate(
            ['tenant_id' => $tenant->id],
            [
                'plan_id' => $plan->id,
                'mercadopago_id' => $mpResponse['id'],
                'mercadopago_status' => $mpResponse['status'],
                'status' => $plan->trial_days > 0 ? SubscriptionStatus::TRIAL : SubscriptionStatus::PENDING,
                'price' => $price,
                'currency' => $plan->currency,
                'billing_cycle' => $billing,
                'trial_ends_at' => $plan->trial_days > 0 ? now()->addDays($plan->trial_days) : null,
                'is_active' => $plan->trial_days > 0,
            ]
        );
    }

    public function handleWebhook(array $data): void
    {
        // Validar firma del webhook
        if (!$this->validateWebhookSignature($data)) {
            Log::warning('Invalid webhook signature', $data);
            return;
        }

        if ($data['type'] !== 'preapproval') {
            return;
        }

        try {
            $mercadopagoId = $data['data']['id'];
            $subscriptionData = $this->getSubscription($mercadopagoId);

            if (!$subscriptionData) {
                Log::warning('Could not fetch subscription data from MercadoPago', [
                    'mercadopago_id' => $mercadopagoId
                ]);
                return;
            }

            // Buscar suscripción en la base de datos central
            $subscription = Subscription::on('central')
                ->where('mercadopago_id', $mercadopagoId)
                ->first();

            if (!$subscription) {
                Log::warning('Local subscription not found', [
                    'mercadopago_id' => $mercadopagoId
                ]);
                return;
            }

            $this->updateSubscriptionFromWebhook($subscription, $subscriptionData);
        } catch (\Exception $e) {
            Log::error('Error processing webhook', [
                'data' => $data,
                'exception' => $e->getMessage()
            ]);
        }
    }

    protected function updateSubscriptionFromWebhook(
        Subscription $subscription,
        array $subscriptionData
    ): void {
        $oldStatus = $subscription->status;
        $mpStatus = $subscriptionData['status'];

        $newStatus = match ($mpStatus) {
            'authorized' => SubscriptionStatus::ACTIVE,
            'paused' => SubscriptionStatus::PAUSED,
            'cancelled' => SubscriptionStatus::CANCELLED,
            'pending' => SubscriptionStatus::PENDING,
            default => $subscription->status,
        };

        $updateData = [
            'mercadopago_status' => $mpStatus,
            'status' => $newStatus,
            'last_payment_date' => $mpStatus === 'authorized' ? now() : $subscription->last_payment_date,
        ];

        // Manejar activación
        if ($newStatus === SubscriptionStatus::ACTIVE && $oldStatus !== SubscriptionStatus::ACTIVE) {
            $updateData['starts_at'] = $subscription->starts_at ?? now();
            $updateData['is_active'] = true;
            $updateData['failed_payment_attempts'] = 0;
            $updateData['grace_period_ends_at'] = null;

            // Calcular próxima fecha de facturación
            $updateData['next_billing_date'] = $this->calculateNextBillingDate($subscription);
        }

        // Manejar fallo de pago
        if ($newStatus === SubscriptionStatus::PAUSED && $oldStatus === SubscriptionStatus::ACTIVE) {
            $subscription->incrementFailedAttempts();
            event(new PaymentFailed($subscription));
        }

        $subscription->update($updateData);

        event(new SubscriptionUpdated($subscription, $oldStatus));
    }

    protected function calculateNextBillingDate(Subscription $subscription): Carbon
    {
        $baseDate = $subscription->last_payment_date ?? now();

        return $subscription->billing_cycle === 'monthly'
            ? $baseDate->addMonth()
            : $baseDate->addYear();
    }

    protected function validateWebhookSignature(array $data): bool
    {
        if (!$this->webhookSecret) {
            return true; // Si no hay secret configurado, no validar
        }

        $signature = request()->header('X-Signature');
        if (!$signature) {
            return false;
        }

        $expectedSignature = hash_hmac('sha256', json_encode($data), $this->webhookSecret);

        return hash_equals($expectedSignature, $signature);
    }

    public function cancelSubscription(Subscription $subscription): bool
    {
        // Si es plan gratuito, cancelar localmente
        if ($subscription->plan->is_free || !$subscription->mercadopago_id) {
            $subscription->cancel();
            return true;
        }

        try {
            $response = Http::withToken($this->accessToken)
                ->timeout(30)
                ->put("{$this->preapprovalUrl}/{$subscription->mercadopago_id}", [
                    'status' => 'cancelled'
                ]);

            if ($response->successful() || $response->status() === 404) {
                $subscription->cancel();
                return true;
            }

            Log::error('Error cancelling subscription in MercadoPago', [
                'subscription_id' => $subscription->id,
                'response' => $response->body()
            ]);

            return false;
        } catch (\Exception $e) {
            Log::error('Exception cancelling subscription in MercadoPago', [
                'subscription_id' => $subscription->id,
                'exception' => $e->getMessage()
            ]);

            return false;
        }
    }

    public function getSubscription(string $mercadopagoId): ?array
    {
        try {
            $response = Http::withToken($this->accessToken)
                ->timeout(30)
                ->get("{$this->preapprovalUrl}/{$mercadopagoId}");

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('Error fetching subscription from MercadoPago', [
                'mercadopago_id' => $mercadopagoId,
                'exception' => $e->getMessage()
            ]);

            return null;
        }
    }

    /**
     * Buscar suscripción por tenant ID en la base de datos central
     */
    public function getSubscriptionByTenant(string $tenantId): ?Subscription
    {
        return Subscription::on('central')
            ->where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->with('plan')
            ->first();
    }

    /**
     * Obtener suscripciones que están por vencer
     */
    public function getExpiringSubscriptions(int $days = 3): \Illuminate\Database\Eloquent\Collection
    {
        return Subscription::on('central')
            ->where('is_active', true)
            ->where('trial_ends_at', '>=', now())
            ->where('trial_ends_at', '<=', now()->addDays($days))
            ->with(['tenant', 'plan'])
            ->get();
    }

    /**
     * Obtener suscripciones en período de gracia
     */
    public function getGracePeriodSubscriptions(): \Illuminate\Database\Eloquent\Collection
    {
        return Subscription::on('central')
            ->where('status', SubscriptionStatus::PAUSED)
            ->whereNotNull('grace_period_ends_at')
            ->where('grace_period_ends_at', '>', now())
            ->with(['tenant', 'plan'])
            ->get();
    }

    /**
     * Procesar suscripciones vencidas
     */
    public function processExpiredSubscriptions(): void
    {
        // Procesar trials vencidos
        $expiredTrials = Subscription::on('central')
            ->where('status', SubscriptionStatus::TRIAL)
            ->where('trial_ends_at', '<', now())
            ->get();

        foreach ($expiredTrials as $subscription) {
            $subscription->update([
                'status' => SubscriptionStatus::EXPIRED,
                'is_active' => false,
            ]);
        }

        // Procesar períodos de gracia vencidos
        $expiredGracePeriods = Subscription::on('central')
            ->where('status', SubscriptionStatus::PAUSED)
            ->whereNotNull('grace_period_ends_at')
            ->where('grace_period_ends_at', '<', now())
            ->get();

        foreach ($expiredGracePeriods as $subscription) {
            $subscription->update([
                'status' => SubscriptionStatus::CANCELLED,
                'is_active' => false,
            ]);
        }
    }
}
