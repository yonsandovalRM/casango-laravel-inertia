<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Services\MercadoPagoService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    protected $mercadoPagoService;

    public function __construct(MercadoPagoService $mercadoPagoService)
    {
        $this->mercadoPagoService = $mercadoPagoService;
    }

    public function index()
    {
        $tenant = tenant();
        $subscription = $tenant->subscription()->with('plan')->first();
        $plans = Plan::where('active', true)->get();

        return Inertia::render('tenants/subscription/index', [
            'subscription' => $subscription,
            'plans' => $plans,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['plan_id' => 'required|exists:plans,id']);

        $plan = Plan::find($request->plan_id);
        $tenant = tenant();

        $paymentLink = $this->mercadoPagoService->createSubscription($tenant, $plan);

        if ($paymentLink) {
            return Inertia::location($paymentLink);
        }

        return back()->with('error', 'No se pudo generar el link de pago. Por favor, intenta de nuevo.');
    }

    public function success(Request $request)
    {
        // Opcional: Puedes mostrar un mensaje de éxito aquí.
        // La lógica principal se maneja por webhooks para mayor fiabilidad.
        return redirect()->route('tenant.subscription.index')
            ->with('success', '¡Proceso de suscripción iniciado! El estado se actualizará en breve.');
    }

    public function destroy()
    {
        $tenant = tenant();
        $subscription = $tenant->subscription;

        if ($subscription && !$subscription->isCancelled()) {
            $success = $this->mercadoPagoService->cancelSubscription($subscription);
            if ($success) {
                return back()->with('success', 'Tu suscripción ha sido cancelada. Seguirás teniendo acceso hasta el final de tu ciclo de facturación.');
            }
            return back()->with('error', 'No se pudo cancelar la suscripción. Por favor, contacta a soporte.');
        }

        return back()->with('info', 'No tienes una suscripción activa para cancelar.');
    }
}
