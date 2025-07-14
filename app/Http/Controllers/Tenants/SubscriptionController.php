<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Services\MercadoPagoService;
use App\Http\Resources\SubscriptionStatusResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    protected $mercadoPagoService;
    protected $user;

    public function __construct(MercadoPagoService $mercadoPagoService)
    {
        $this->mercadoPagoService = $mercadoPagoService;
        $this->user = User::find(Auth::user()->id);
    }

    public function index()
    {
        $tenant = tenant();
        $subscription = $tenant->subscriptions()->where('is_active', true)->with('plan')->first();
        $plans = Plan::where('active', true)->get();

        return Inertia::render('tenants/subscription/index', [
            'subscription' => $subscription ? new SubscriptionStatusResource($subscription) : null,
            'plans' => $plans,
            'canManage' => $subscription ? $this->user->can('manage', $subscription) : true,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'billing' => 'required|in:monthly,annual'
        ]);

        // $this->authorize('create', \App\Models\Subscription::class);

        $plan = Plan::findOrFail($request->plan_id);
        $tenant = tenant();

        // Cancelar suscripción actual si existe
        $currentSubscription = $tenant->subscriptions()->where('is_active', true)->first();
        if ($currentSubscription && !$currentSubscription->plan->is_free) {
            $this->mercadoPagoService->cancelSubscription($currentSubscription);
        }

        $paymentLink = $this->mercadoPagoService->createSubscription(
            $tenant,
            $plan,
            $request->billing
        );

        if ($paymentLink) {
            return Inertia::location($paymentLink);
        }

        return back()->withErrors(['error' => 'No se pudo generar el link de pago. Por favor, intenta de nuevo.']);
    }

    public function success(Request $request)
    {
        $tenant = tenant();
        $subscription = $tenant->subscriptions()->where('is_active', true)->with('plan')->first();

        return Inertia::render('tenants/subscription/success', [
            'subscription' => $subscription ? new SubscriptionStatusResource($subscription) : null,
        ]);
    }

    public function cancel()
    {
        $tenant = tenant();
        $subscription = $tenant->subscriptions()->where('is_active', true)->first();

        if (!$subscription) {
            return back()->withErrors(['error' => 'No tienes una suscripción activa para cancelar.']);
        }

        //$this->authorize('cancel', $subscription);

        $success = $this->mercadoPagoService->cancelSubscription($subscription);

        if ($success) {
            return back()->with('success', 'Tu suscripción ha sido cancelada. Seguirás teniendo acceso hasta el final de tu ciclo de facturación.');
        }

        return back()->withErrors(['error' => 'No se pudo cancelar la suscripción. Por favor, contacta a soporte.']);
    }

    public function reactivate()
    {
        $tenant = tenant();
        $subscription = $tenant->subscriptions()->latest()->first();

        if (!$subscription) {
            return back()->withErrors(['error' => 'No se encontró una suscripción para reactivar.']);
        }

        //$this->authorize('reactivate', $subscription);

        // Para planes gratuitos, reactivar directamente
        if ($subscription->plan->is_free) {
            $subscription->activate();
            return back()->with('success', 'Tu suscripción ha sido reactivada.');
        }

        // Para planes de pago, redirigir a MercadoPago
        $paymentLink = $this->mercadoPagoService->createSubscription(
            $tenant,
            $subscription->plan,
            $subscription->billing_cycle
        );

        if ($paymentLink) {
            return Inertia::location($paymentLink);
        }

        return back()->withErrors(['error' => 'No se pudo procesar la reactivación. Por favor, intenta de nuevo.']);
    }

    public function changePlan(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'billing' => 'required|in:monthly,annual'
        ]);

        $tenant = tenant();
        $currentSubscription = $tenant->subscriptions()->where('is_active', true)->first();

        if (!$currentSubscription) {
            return back()->withErrors(['error' => 'No tienes una suscripción activa.']);
        }

        // $this->authorize('manage', $currentSubscription);

        $newPlan = Plan::findOrFail($request->plan_id);

        // Si es el mismo plan, no hacer nada
        if ($currentSubscription->plan_id === $newPlan->id) {
            return back()->with('info', 'Ya tienes este plan activo.');
        }

        // Manejar cambio a plan gratuito
        if ($newPlan->is_free) {
            // Cancelar suscripción actual
            if ($currentSubscription->mercadopago_id) {
                $this->mercadoPagoService->cancelSubscription($currentSubscription);
            }

            // Crear nueva suscripción gratuita
            $this->mercadoPagoService->createSubscription($tenant, $newPlan);

            return back()->with('success', 'Has cambiado al plan gratuito exitosamente.');
        }

        // Para planes de pago, crear nueva suscripción
        $paymentLink = $this->mercadoPagoService->createSubscription(
            $tenant,
            $newPlan,
            $request->billing
        );

        if ($paymentLink) {
            return Inertia::location($paymentLink);
        }

        return back()->withErrors(['error' => 'No se pudo procesar el cambio de plan. Por favor, intenta de nuevo.']);
    }
}
