<?php

namespace App\Traits;

use App\Models\Subscription;
use App\Models\Tenant;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

trait HandlesMercadoPago
{
    /**
     * Crear preaprobación en MercadoPago
     */
    public function createPreapproval(Subscription $subscription): ?string
    {
        try {
            $tenant = $subscription->tenant;
            $plan = $subscription->plan;

            $preapprovalData = [
                'reason' => "Suscripción {$plan->name} - {$tenant->name}",
                'external_reference' => $subscription->id,
                'payer_email' => app()->isProduction()
                    ? $tenant->email
                    : 'test_user_1821087495@testuser.com', // Email de prueba, se debe reemplazar por el email real del usuario
                'card_token_id' => null, // Se puede implementar después para tarjetas guardadas
                'auto_recurring' => [
                    'frequency' => $subscription->is_monthly ? 1 : 12,
                    'frequency_type' => 'months',
                    'start_date' => $subscription->trial_ends_at && $subscription->trial_ends_at->isFuture()
                        ? $subscription->trial_ends_at->format('Y-m-d\TH:i:s.v\Z')  // Si hay trial futuro
                        : now()->addDay()->format('Y-m-d\TH:i:s.v\Z'),  // Si no hay trial o ya pasó
                    'end_date' => null,
                    'transaction_amount' => $subscription->is_monthly ? $plan->price_monthly : $plan->price_annual,
                    'currency_id' => strtoupper($plan->currency),
                ],
                'back_url' => route('tenants.payment.success', ['subscription' => $subscription->id]),
                'back_urls' => [
                    'success' => route('tenants.payment.success', ['subscription' => $subscription->id]),
                    'failure' => route('tenants.payment.failure', ['subscription' => $subscription->id]),
                    'pending' => route('tenants.payment.pending', ['subscription' => $subscription->id]),
                ],
                'notification_url' => route('tenants.payment.webhook'),
                'status' => 'pending',
            ];

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('mercadopago.access_token'),
                'Content-Type' => 'application/json',
            ])->post(config('mercadopago.preapproval_url'), $preapprovalData);

            if ($response->successful()) {
                $data = $response->json();

                // Actualizar la suscripción con el ID de preaprobación
                $subscription->update([
                    'mp_preapproval_id' => $data['id'],
                    'mp_init_point' => $data['init_point'],
                    'payment_status' => 'pending_payment_method',
                ]);

                Log::info('Preapproval created successfully', [
                    'subscription_id' => $subscription->id,
                    'preapproval_id' => $data['id'],
                ]);

                return $data['init_point'];
            }

            Log::error('Failed to create preapproval', [
                'subscription_id' => $subscription->id,
                'response' => $response->json(),
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Error creating preapproval', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Verificar el estado de una preaprobación
     */
    public function checkPreapprovalStatus(Subscription $subscription): ?string
    {
        if (!$subscription->mp_preapproval_id) {
            return null;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('mercadopago.access_token'),
            ])->get(config('mercadopago.preapproval_url') . '/' . $subscription->mp_preapproval_id);

            if ($response->successful()) {
                $data = $response->json();
                $status = $data['status'];

                // Actualizar el estado de la suscripción
                $this->updateSubscriptionStatus($subscription, $status);

                return $status;
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Error checking preapproval status', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Actualizar el estado de la suscripción basado en MercadoPago
     */
    private function updateSubscriptionStatus(Subscription $subscription, string $mpStatus): void
    {
        $statusMap = [
            'pending' => 'pending_payment_method',
            'authorized' => 'active',
            'paused' => 'suspended',
            'cancelled' => 'cancelled',
            'past_due' => 'past_due',

        ];

        $newStatus = $statusMap[$mpStatus] ?? $subscription->payment_status;

        if ($newStatus !== $subscription->payment_status) {
            $subscription->update(['payment_status' => $newStatus]);

            // Si se activa, actualizar la fecha de vencimiento
            if ($newStatus === 'active') {
                $this->updateSubscriptionEndDate($subscription);
            }
        }
    }

    /**
     * Actualizar fecha de vencimiento de la suscripción
     */
    private function updateSubscriptionEndDate(Subscription $subscription): void
    {
        $endDate = $subscription->is_monthly
            ? now()->addMonth()
            : now()->addYear();

        $subscription->update(['ends_at' => $endDate]);
    }

    /**
     * Procesar webhook de MercadoPago
     */
    public function processWebhook(array $data): bool
    {
        try {
            if (!isset($data['data']['id']) || $data['type'] !== 'subscription_preapproval') {
                return false;
            }

            $preapprovalId = $data['data']['id'];
            $subscription = Subscription::where('mp_preapproval_id', $preapprovalId)->first();

            if (!$subscription) {
                Log::warning('Subscription not found for preapproval', ['preapproval_id' => $preapprovalId]);
                return false;
            }

            // Verificar el estado actual
            $this->checkPreapprovalStatus($subscription);

            return true;
        } catch (\Exception $e) {
            Log::error('Error processing webhook', [
                'error' => $e->getMessage(),
                'data' => $data,
            ]);
            return false;
        }
    }

    /**
     * Cancelar preaprobación
     */
    public function cancelPreapproval(Subscription $subscription): bool
    {
        if (!$subscription->mp_preapproval_id) {
            return false;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('mercadopago.access_token'),
                'Content-Type' => 'application/json',
            ])->put(config('mercadopago.preapproval_url') . '/' . $subscription->mp_preapproval_id, [
                'status' => 'cancelled'
            ]);

            if ($response->successful()) {
                $subscription->update([
                    'payment_status' => 'cancelled',
                    'is_active' => false,
                ]);

                Log::info('Preapproval cancelled successfully', [
                    'subscription_id' => $subscription->id,
                ]);

                return true;
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Error cancelling preapproval', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Verificar si la suscripción necesita configurar el pago
     */
    public function needsPaymentSetup(Subscription $subscription): bool
    {
        return $subscription->trial_ends_at <= now()->addDays(3) &&
            $subscription->payment_status === 'pending';
    }

    /**
     * Obtener URL de pago para la suscripción
     */
    public function getPaymentUrl(Subscription $subscription): ?string
    {
        if ($subscription->mp_init_point) {
            return $subscription->mp_init_point;
        }

        return $this->createPreapproval($subscription);
    }

    public function reactivateSubscription(Subscription $subscription): ?string
    {
        if ($subscription->payment_status !== Subscription::STATUS_SUSPENDED) {
            return null;
        }

        // Crear nueva preaprobación
        $url = $this->createPreapproval($subscription);

        $subscription->update([
            'payment_status' => Subscription::STATUS_PENDING_PAYMENT_METHOD,
            'is_active' => true
        ]);

        return $url;
    }
}
