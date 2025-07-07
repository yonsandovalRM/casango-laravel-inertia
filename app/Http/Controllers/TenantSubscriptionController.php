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
        $subscription = Subscription::with('plan')
            ->where('tenant_id', $tenant->id)
            ->first();

        if (!$subscription) {
            return response()->json(['error' => 'Subscription not found'], 404);
        }

        // Verificar estado actual en MercadoPago
        $mpStatus = $this->checkPreapprovalStatus($subscription);

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
        $plan = Plan::findOrFail($request->plan_id);

        // Verificar si ya tiene una suscripción activa
        $existingSubscription = Subscription::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->first();

        if ($existingSubscription) {
            return response()->json(['error' => 'You already have an active subscription'], 400);
        }

        // Crear nueva suscripción
        $subscription = Subscription::create([
            'tenant_id' => $tenant->id,
            'plan_id' => $plan->id,
            'price' => $request->is_monthly ? $plan->price_monthly : $plan->price_annual,
            'currency' => $plan->currency,
            'trial_ends_at' => now()->addDays($plan->trial_days ?? 14),
            'is_monthly' => $request->is_monthly ?? true,
            'is_active' => true,
            'payment_status' => Subscription::STATUS_PENDING,
        ]);

        // Generar URL de pago
        $paymentUrl = $this->getPaymentUrl($subscription);

        return response()->json([
            'subscription' => SubscriptionResource::make($subscription)->toArray(request()),
            'payment_url' => $paymentUrl,
            'message' => 'Subscription created successfully',
        ]);
    }

    /**
     * Cancelar suscripción
     */
    public function cancel(Request $request)
    {
        $tenant = tenant();
        $subscription = Subscription::where('tenant_id', $tenant->id)->first();

        if (!$subscription) {
            return response()->json(['error' => 'Subscription not found'], 404);
        }

        if ($this->cancelPreapproval($subscription)) {
            return response()->json(['message' => 'Subscription cancelled successfully']);
        }

        return response()->json(['error' => 'Failed to cancel subscription'], 500);
    }

    /**
     * Obtener datos del estado de la suscripción
     */
    private function getSubscriptionStatusData(Subscription $subscription, ?string $mpStatus = null): array
    {
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
        ];
    }

    public function show()
    {
        return view('tenants.subscription.show');
    }

    public function edit()
    {
        return view('tenants.subscription.edit');
    }
}
