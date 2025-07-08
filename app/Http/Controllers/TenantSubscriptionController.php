<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlanResource;
use App\Http\Resources\SubscriptionResource;
use App\Models\Subscription;
use App\Models\Plan;
use App\Traits\HandlesMercadoPago;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TenantSubscriptionController extends Controller
{
    use HandlesMercadoPago;

    public function index()
    {
        $tenant = tenant();

        $subscription = Subscription::on('pgsql')
            ->with('plan')
            ->where('tenant_id', $tenant->id)
            ->first();

        $plans = Plan::on('pgsql')->get();

        // Generar URL de pago si es necesario
        $paymentUrl = null;
        if ($subscription && $this->needsPaymentSetup($subscription)) {
            $paymentUrl = $this->getPaymentUrl($subscription);
        }

        return Inertia::render('tenant-pages/subscription/index', [
            'subscription' => $subscription ? SubscriptionResource::make($subscription)->toArray(request()) : null,
            'plans' => PlanResource::collection($plans)->toArray(request()),
            'paymentUrl' => $paymentUrl,
            'subscriptionStatus' => $subscription ? $this->getSubscriptionStatusData($subscription) : null,
        ]);
    }

    /**
     * Configurar método de pago para la suscripción
     */
    public function setupPayment(Request $request)
    {
        $tenant = tenant();
        $subscription = Subscription::where('tenant_id', $tenant->id)->first();

        if (!$subscription) {
            return response()->json(['error' => 'Subscription not found'], 404);
        }

        // Verificar el estado actual antes de crear nueva preaprobación
        if ($subscription->mp_preapproval_id) {
            $currentStatus = $this->checkPreapprovalStatus($subscription);
            if ($currentStatus === 'authorized') {
                return response()->json([
                    'message' => 'Payment method already configured',
                    'subscription_id' => $subscription->id,
                ]);
            }
        }

        $paymentUrl = $this->getPaymentUrl($subscription);

        if (!$paymentUrl) {
            return response()->json(['error' => 'Failed to create payment URL'], 500);
        }

        return response()->json([
            'payment_url' => $paymentUrl,
            'subscription_id' => $subscription->id,
        ]);
    }

    /**
     * Obtener estado actual de la suscripción
     */
    public function getStatus()
    {
        $tenant = tenant();
        $subscription = Subscription::on('pgsql')->with('plan')
            ->where('tenant_id', $tenant->id)
            ->first();

        if (!$subscription) {
            return response()->json(['error' => 'Subscription not found'], 404);
        }

        // Verificar estado actual en MercadoPago
        $mpStatus = null;
        if ($subscription->mp_preapproval_id) {
            $mpStatus = $this->checkPreapprovalStatus($subscription);
        }

        return response()->json($this->getSubscriptionStatusData($subscription, $mpStatus));
    }

    /**
     * Crear nueva suscripción
     */
    public function create(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'is_monthly' => 'boolean',
        ]);

        $tenant = tenant();
        $plan = Plan::on('pgsql')->findOrFail($request->plan_id);

        // Verificar si ya tiene una suscripción activa
        $existingSubscription = Subscription::on('pgsql')->where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->first();

        if ($existingSubscription) {
            return response()->json(['error' => 'You already have an active subscription'], 400);
        }

        DB::beginTransaction();
        try {
            // Crear nueva suscripción
            $subscription = Subscription::on('pgsql')->create([
                'tenant_id' => $tenant->id,
                'plan_id' => $plan->id,
                'price' => $request->is_monthly ? $plan->price_monthly : $plan->price_annual,
                'currency' => $plan->currency,
                'trial_ends_at' => now()->addDays($plan->trial_days ?? 14),
                'is_monthly' => $request->is_monthly ?? true,
                'is_active' => true,
                'payment_status' => Subscription::STATUS_PENDING,
            ]);

            // Generar URL de pago solo si no es un plan gratuito
            $paymentUrl = null;
            if (!$plan->is_free) {
                $paymentUrl = $this->getPaymentUrl($subscription);
                if (!$paymentUrl) {
                    DB::rollBack();
                    return response()->json(['error' => 'Failed to create payment URL'], 500);
                }
            } else {
                // Para planes gratuitos, activar inmediatamente
                $subscription->update([
                    'payment_status' => Subscription::STATUS_ACTIVE,
                    'ends_at' => null, // Sin fecha de vencimiento para planes gratuitos
                ]);
            }

            DB::commit();

            return response()->json([
                'subscription' => SubscriptionResource::make($subscription->load('plan'))->toArray(request()),
                'payment_url' => $paymentUrl,
                'message' => 'Subscription created successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating subscription', [
                'tenant_id' => $tenant->id,
                'plan_id' => $plan->id,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Failed to create subscription'], 500);
        }
    }

    /**
     * Actualizar suscripción (cambiar plan)
     */
    public function update(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'is_monthly' => 'boolean',
        ]);

        $tenant = tenant();
        $subscription = Subscription::on('pgsql')->where('tenant_id', $tenant->id)->first();

        if (!$subscription) {
            return response()->json(['error' => 'Subscription not found'], 404);
        }

        $newPlan = Plan::on('pgsql')->findOrFail($request->plan_id);
        $isMonthly = $request->is_monthly ?? $subscription->is_monthly;

        DB::beginTransaction();
        try {
            // Cancelar preaprobación actual si existe
            if ($subscription->mp_preapproval_id && !$newPlan->is_free) {
                $this->cancelPreapproval($subscription);
            }

            // Actualizar suscripción
            $subscription->update([
                'plan_id' => $newPlan->id,
                'price' => $isMonthly ? $newPlan->price_monthly : $newPlan->price_annual,
                'is_monthly' => $isMonthly,
                'payment_status' => $newPlan->is_free ? Subscription::STATUS_ACTIVE : Subscription::STATUS_PENDING,
                'mp_preapproval_id' => null,
                'mp_init_point' => null,
            ]);

            // Crear nueva preaprobación si no es gratuito
            $paymentUrl = null;
            if (!$newPlan->is_free) {
                $paymentUrl = $this->getPaymentUrl($subscription);
            }

            DB::commit();

            return response()->json([
                'subscription' => SubscriptionResource::make($subscription->load('plan'))->toArray(request()),
                'payment_url' => $paymentUrl,
                'message' => 'Subscription updated successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating subscription', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Failed to update subscription'], 500);
        }
    }

    /**
     * Renovar suscripción
     */
    public function renew(Request $request)
    {
        $tenant = tenant();
        $subscription = Subscription::on('pgsql')->where('tenant_id', $tenant->id)->first();

        if (!$subscription) {
            return response()->json(['error' => 'Subscription not found'], 404);
        }

        // Si la suscripción está activa y no ha expirado, no se puede renovar
        if ($subscription->isActive() && !$subscription->isExpired()) {
            return response()->json(['error' => 'Subscription is already active'], 400);
        }

        DB::beginTransaction();
        try {
            // Reactivar suscripción
            $subscription->update([
                'is_active' => true,
                'payment_status' => $subscription->plan->is_free ? Subscription::STATUS_ACTIVE : Subscription::STATUS_PENDING,
                'ends_at' => null,
            ]);

            // Generar URL de pago si no es gratuito
            $paymentUrl = null;
            if (!$subscription->plan->is_free) {
                $paymentUrl = $this->getPaymentUrl($subscription);
            }

            DB::commit();

            return response()->json([
                'subscription' => SubscriptionResource::make($subscription->load('plan'))->toArray(request()),
                'payment_url' => $paymentUrl,
                'message' => 'Subscription renewed successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error renewing subscription', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Failed to renew subscription'], 500);
        }
    }

    /**
     * Cancelar suscripción
     */
    public function cancel(Request $request)
    {
        $tenant = tenant();
        $subscription = Subscription::on('pgsql')->where('tenant_id', $tenant->id)->first();

        if (!$subscription) {
            return response()->json(['error' => 'Subscription not found'], 404);
        }

        if (!$subscription->canBeCancelled()) {
            return response()->json(['error' => 'Subscription cannot be cancelled'], 400);
        }

        DB::beginTransaction();
        try {
            // Cancelar preaprobación en MercadoPago
            if ($subscription->mp_preapproval_id) {
                $cancelled = $this->cancelPreapproval($subscription);
                if (!$cancelled) {
                    DB::rollBack();
                    return response()->json(['error' => 'Failed to cancel payment method'], 500);
                }
            }

            // Actualizar suscripción
            $subscription->update([
                'payment_status' => Subscription::STATUS_CANCELLED,
                'is_active' => false,
            ]);

            DB::commit();

            return response()->json(['message' => 'Subscription cancelled successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error cancelling subscription', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Failed to cancel subscription'], 500);
        }
    }

    /**
     * Obtener datos del estado de la suscripción
     */
    private function getSubscriptionStatusData($subscription, ?string $mpStatus = null): array
    {
        if (!$subscription) {
            return [];
        }
        $subscription = Subscription::on('pgsql')->find($subscription->id);
        return [
            'status' => $subscription->payment_status,
            'status_label' => $subscription->status_label,
            'status_color' => $subscription->status_color,
            'mp_status' => $mpStatus,
            'is_active' => $subscription->isActive(),
            'is_in_trial' => $subscription->isInTrial(),
            'is_trial_expired' => $subscription->isTrialExpired(),
            'is_expired' => $subscription->isExpired(),
            'needs_payment_setup' => $this->needsPaymentSetup($subscription),
            'trial_days_remaining' => $subscription->getTrialDaysRemaining(),
            'trial_ends_at' => $subscription->trial_ends_at,
            'ends_at' => $subscription->ends_at,
            'next_billing_date' => $subscription->getNextBillingDate(),
            'current_price' => $subscription->getCurrentPrice(),
            'plan_name' => $subscription->plan->name,
            'is_monthly' => $subscription->is_monthly,
            'can_cancel' => $subscription->canBeCancelled(),
            'can_upgrade' => $subscription->canBeUpgraded(),
            'can_downgrade' => $subscription->canBeDowngraded(),
        ];
    }
}
