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
        $subscription = Subscription::on('pgsql')->where('tenant_id', $tenant->id)->first();

        if (!$subscription) {
            return back()->with('error', 'Suscripción no encontrada');
        }

        // Verificar el estado actual antes de crear nueva preaprobación
        if ($subscription->mp_preapproval_id) {
            $currentStatus = $this->checkPreapprovalStatus($subscription);
            if ($currentStatus === 'authorized') {
                return back()->with('success', 'Método de pago ya configurado');
            }
        }

        $paymentUrl = $this->getPaymentUrl($subscription);

        if (!$paymentUrl) {
            return back()->with('error', 'Error al crear la URL de pago');
        }

        return Inertia::location($paymentUrl);
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
            return back()->with('error', 'Ya tienes una suscripción activa');
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
            if (!$plan->is_free) {
                $paymentUrl = $this->getPaymentUrl($subscription);
                if (!$paymentUrl) {
                    DB::rollBack();
                    return back()->with('error', 'Error al crear la URL de pago');
                }

                DB::commit();
                return Inertia::location($paymentUrl);
            } else {
                // Para planes gratuitos, activar inmediatamente
                $subscription->update([
                    'payment_status' => Subscription::STATUS_ACTIVE,
                    'ends_at' => null, // Sin fecha de vencimiento para planes gratuitos
                ]);

                DB::commit();
                return back()->with('success', 'Suscripción creada exitosamente');
            }
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating subscription', [
                'tenant_id' => $tenant->id,
                'plan_id' => $plan->id,
                'error' => $e->getMessage(),
            ]);
            return back()->with('error', 'Error al crear la suscripción');
        }
    }

    /**
     * Actualizar suscripción (cambiar plan)
     */
    public function update(Request $request)
    {
        $request->validate([
            'plan_id' => 'required',
            'is_monthly' => 'boolean',
        ]);

        $tenant = tenant();
        $subscription = Subscription::on('pgsql')->where('tenant_id', $tenant->id)->first();

        if (!$subscription) {
            return back()->with('error', 'Suscripción no encontrada');
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
                'is_active' => true,
            ]);

            // Crear nueva preaprobación si no es gratuito
            if (!$newPlan->is_free) {
                $paymentUrl = $this->getPaymentUrl($subscription);
                if (!$paymentUrl) {
                    DB::rollBack();
                    return back()->with('error', 'Error al crear la URL de pago');
                }

                DB::commit();
                return Inertia::location($paymentUrl);
            }

            DB::commit();
            return back()->with('success', 'Suscripción actualizada exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating subscription', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);
            return back()->with('error', 'Error al actualizar la suscripción');
        }
    }

    /**
     * Upgrade de suscripción a un plan superior
     */
    public function upgrade(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'is_monthly' => 'boolean',
        ]);

        $tenant = tenant();
        $subscription = Subscription::on('pgsql')->where('tenant_id', $tenant->id)->first();

        if (!$subscription) {
            return back()->with('error', 'Suscripción no encontrada');
        }

        $newPlan = Plan::on('pgsql')->findOrFail($request->plan_id);

        // Verificar que sea un upgrade
        if (!$this->isUpgrade($subscription->plan, $newPlan)) {
            return back()->with('error', 'El plan seleccionado no es un upgrade');
        }

        return $this->performPlanChange($subscription, $newPlan, $request->is_monthly, 'upgrade');
    }

    /**
     * Downgrade de suscripción a un plan inferior
     */
    public function downgrade(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'is_monthly' => 'boolean',
        ]);

        $tenant = tenant();
        $subscription = Subscription::on('pgsql')->where('tenant_id', $tenant->id)->first();

        if (!$subscription) {
            return back()->with('error', 'Suscripción no encontrada');
        }

        $newPlan = Plan::on('pgsql')->findOrFail($request->plan_id);

        // Verificar que sea un downgrade
        if (!$this->isDowngrade($subscription->plan, $newPlan)) {
            return back()->with('error', 'El plan seleccionado no es un downgrade');
        }

        return $this->performPlanChange($subscription, $newPlan, $request->is_monthly, 'downgrade');
    }

    /**
     * Renovar suscripción
     */
    public function renew(Request $request)
    {
        $tenant = tenant();
        $subscription = Subscription::on('pgsql')->where('tenant_id', $tenant->id)->first();

        if (!$subscription) {
            return back()->with('error', 'Suscripción no encontrada');
        }

        // Si la suscripción está activa y no ha expirado, no se puede renovar
        if ($subscription->isActive() && !$subscription->isExpired()) {
            return back()->with('error', 'La suscripción ya está activa');
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
            if (!$subscription->plan->is_free) {
                $paymentUrl = $this->getPaymentUrl($subscription);
                if (!$paymentUrl) {
                    DB::rollBack();
                    return back()->with('error', 'Error al crear la URL de pago');
                }

                DB::commit();
                return Inertia::location($paymentUrl);
            }

            DB::commit();
            return back()->with('success', 'Suscripción renovada exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error renewing subscription', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);
            return back()->with('error', 'Error al renovar la suscripción');
        }
    }

    /**
     * Reactivar suscripción cancelada
     */
    public function reactivate(Request $request)
    {
        $tenant = tenant();
        $subscription = Subscription::on('pgsql')->where('tenant_id', $tenant->id)->first();

        if (!$subscription) {
            return back()->with('error', 'Suscripción no encontrada');
        }

        if ($subscription->payment_status !== Subscription::STATUS_CANCELLED) {
            return back()->with('error', 'La suscripción no está cancelada');
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
            if (!$subscription->plan->is_free) {
                $paymentUrl = $this->getPaymentUrl($subscription);
                if (!$paymentUrl) {
                    DB::rollBack();
                    return back()->with('error', 'Error al crear la URL de pago');
                }

                DB::commit();
                return Inertia::location($paymentUrl);
            }

            DB::commit();
            return back()->with('success', 'Suscripción reactivada exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error reactivating subscription', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);
            return back()->with('error', 'Error al reactivar la suscripción');
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
            return back()->with('error', 'Suscripción no encontrada');
        }

        if (!$subscription->canBeCancelled()) {
            return back()->with('error', 'La suscripción no puede ser cancelada');
        }

        DB::beginTransaction();
        try {
            // Cancelar preaprobación en MercadoPago
            if ($subscription->mp_preapproval_id) {
                $cancelled = $this->cancelPreapproval($subscription);
                if (!$cancelled) {
                    DB::rollBack();
                    return back()->with('error', 'Error al cancelar el método de pago');
                }
            }

            // Actualizar suscripción
            $subscription->update([
                'payment_status' => Subscription::STATUS_CANCELLED,
                'is_active' => false,
            ]);

            DB::commit();
            return back()->with('success', 'Suscripción cancelada exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error cancelling subscription', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);
            return back()->with('error', 'Error al cancelar la suscripción');
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
            'can_reactivate' => $subscription->payment_status === Subscription::STATUS_CANCELLED,
        ];
    }

    /**
     * Realizar cambio de plan
     */
    private function performPlanChange($subscription, $newPlan, $isMonthly, $type)
    {
        $isMonthly = $isMonthly ?? $subscription->is_monthly;

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
                'is_active' => true,
            ]);

            // Crear nueva preaprobación si no es gratuito
            if (!$newPlan->is_free) {
                $paymentUrl = $this->getPaymentUrl($subscription);
                if (!$paymentUrl) {
                    DB::rollBack();
                    return back()->with('error', 'Error al crear la URL de pago');
                }

                DB::commit();
                return Inertia::location($paymentUrl);
            }

            DB::commit();

            $message = $type === 'upgrade' ? 'Upgrade realizado exitosamente' : 'Downgrade realizado exitosamente';
            return back()->with('success', $message);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error performing {$type}", [
                'subscription_id' => $subscription->id,
                'new_plan_id' => $newPlan->id,
                'error' => $e->getMessage(),
            ]);
            return back()->with('error', "Error al realizar {$type}");
        }
    }

    /**
     * Verificar si es un upgrade
     */
    private function isUpgrade($currentPlan, $newPlan)
    {
        // Implementar lógica de comparación de planes
        // Por ejemplo, comparar precios o nivel de plan
        return $newPlan->price_monthly > $currentPlan->price_monthly;
    }

    /**
     * Verificar si es un downgrade
     */
    private function isDowngrade($currentPlan, $newPlan)
    {
        // Implementar lógica de comparación de planes
        // Por ejemplo, comparar precios o nivel de plan
        return $newPlan->price_monthly < $currentPlan->price_monthly;
    }
}
