<?php

namespace App\Services;

use App\Enums\SubscriptionStatus;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MercadoPagoService
{
    protected $accessToken;
    protected $preapprovalUrl;

    public function __construct()
    {
        $this->accessToken = config('mercadopago.access_token');
        $this->preapprovalUrl = config('mercadopago.preapproval_url');
    }

    public function createSubscription(Tenant $tenant, Plan $plan): ?string
    {
        $payload = [
            'reason' => "Suscripción al plan {$plan->name}",
            'auto_recurring' => [
                'frequency' => 1,
                'frequency_type' => 'months',
                'transaction_amount' => $plan->price,
                'currency_id' => config('mercadopago.currency.default'),
            ],
            'back_url' => route('tenant.subscription.success'), // Asumiendo que tienes una ruta nombrada
            'payer_email' => $tenant->user->email, // Asumiendo que el tenant tiene un usuario asociado
            'external_reference' => $tenant->id,
        ];

        try {
            $response = Http::withToken($this->accessToken)
                ->post($this->preapprovalUrl, $payload);

            if ($response->successful() && isset($response->json()['init_point'])) {
                // Crear registro de suscripción local en estado pendiente
                Subscription::updateOrCreate(
                    ['tenant_id' => $tenant->id],
                    [
                        'plan_id' => $plan->id,
                        'mercadopago_id' => $response->json()['id'],
                        'mercadopago_status' => $response->json()['status'],
                        'status' => SubscriptionStatus::PENDING,
                    ]
                );

                return $response->json()['init_point'];
            }

            Log::error('Error al crear suscripción en Mercado Pago', ['response' => $response->body()]);
            return null;
        } catch (\Exception $e) {
            Log::error('Excepción al crear suscripción en Mercado Pago', ['exception' => $e->getMessage()]);
            return null;
        }
    }

    public function getSubscription(string $mercadopagoId): ?array
    {
        try {
            $response = Http::withToken($this->accessToken)
                ->get("{$this->preapprovalUrl}/{$mercadopagoId}");

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('Error al obtener suscripción de Mercado Pago', ['exception' => $e->getMessage()]);
            return null;
        }
    }

    public function handleWebhook(array $data): void
    {
        if ($data['type'] !== 'preapproval') {
            return;
        }

        $mercadopagoId = $data['data']['id'];
        $subscriptionData = $this->getSubscription($mercadopagoId);

        if (!$subscriptionData) {
            return;
        }

        $subscription = Subscription::where('mercadopago_id', $mercadopagoId)->first();

        if ($subscription) {
            $mercadopagoStatus = $subscriptionData['status'];
            $newStatus = match ($mercadopagoStatus) {
                'authorized' => SubscriptionStatus::ACTIVE,
                'paused' => SubscriptionStatus::ON_GRACE_PERIOD,
                'cancelled' => SubscriptionStatus::CANCELLED,
                default => $subscription->status,
            };

            $subscription->update([
                'mercadopago_status' => $mercadopagoStatus,
                'status' => $newStatus,
                'starts_at' => $subscription->starts_at ?? now(),
                'grace_period_ends_at' => ($newStatus === SubscriptionStatus::ON_GRACE_PERIOD)
                    ? now()->addDays(config('mercadopago.subscription.grace_period_days'))
                    : null,
            ]);
        }
    }

    public function cancelSubscription(Subscription $subscription): bool
    {
        try {
            $response = Http::withToken($this->accessToken)
                ->put("{$this->preapprovalUrl}/{$subscription->mercadopago_id}", [
                    'status' => 'cancelled'
                ]);

            if ($response->successful() || $response->status() === 404) { // 404 puede significar que ya no existe en MP
                $subscription->update([
                    'status' => SubscriptionStatus::CANCELLED,
                    'mercadopago_status' => 'cancelled',
                    'ends_at' => now(),
                    'grace_period_ends_at' => null,
                ]);
                return true;
            }

            Log::error('Error al cancelar suscripción en Mercado Pago', [
                'subscription_id' => $subscription->id,
                'response' => $response->body()
            ]);
            return false;
        } catch (\Exception $e) {
            Log::error('Excepción al cancelar suscripción en Mercado Pago', [
                'subscription_id' => $subscription->id,
                'exception' => $e->getMessage()
            ]);
            return false;
        }
    }
}
