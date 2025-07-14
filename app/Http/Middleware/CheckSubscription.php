<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscription
{
    public function handle(Request $request, Closure $next): Response
    {
        $tenant = tenant();

        if (!$tenant) {
            abort(404, 'Tenant not found');
        }

        // Permitir acceso a rutas de suscripción y auth
        if ($this->shouldBypass($request)) {
            return $next($request);
        }

        $subscription = $tenant->subscriptions()->where('is_active', true)->first();

        // Si no tiene suscripción, redirigir a configuración
        if (!$subscription) {
            return $this->redirectToSubscription($request, 'No tienes una suscripción activa.');
        }

        // Verificar si puede acceder
        if (!$subscription->canAccess()) {
            $message = $this->getAccessDeniedMessage($subscription);
            return $this->redirectToSubscription($request, $message);
        }

        // Agregar notificaciones si está próximo a expirar
        $this->addExpirationWarnings($subscription);

        return $next($request);
    }

    protected function shouldBypass(Request $request): bool
    {
        $bypassRoutes = [
            'tenant.subscription.*',
            'login*',
            'register*',
            'password.*',
            'verification.*',
            'logout',
        ];

        foreach ($bypassRoutes as $pattern) {
            if ($request->routeIs($pattern)) {
                return true;
            }
        }

        return false;
    }

    protected function redirectToSubscription(Request $request, string $message): Response
    {
        if ($request->expectsJson()) {
            return response()->json([
                'message' => $message,
                'redirect' => route('tenant.subscription.index')
            ], 403);
        }

        if ($request->inertia()) {
            return redirect()->route('tenant.subscription.index')
                ->with('error', $message);
        }

        abort(403, $message);
    }

    protected function getAccessDeniedMessage($subscription): string
    {
        if ($subscription->trialExpired() && !$subscription->plan->is_free) {
            return 'Tu período de prueba ha expirado. Suscríbete para continuar usando el servicio.';
        }

        if ($subscription->gracePeriodExpired()) {
            return 'Tu período de gracia ha expirado. Actualiza tu método de pago para reactivar tu cuenta.';
        }

        if ($subscription->needsPayment()) {
            return 'Tu suscripción requiere pago para continuar.';
        }

        return 'No tienes acceso a este recurso. Verifica tu suscripción.';
    }

    protected function addExpirationWarnings($subscription): void
    {
        $daysUntilExpiry = $subscription->daysUntilExpiry();
        $reminderDays = config('mercadopago.subscription.reminder_days_before_trial_end', 3);

        if ($subscription->onTrial() && $daysUntilExpiry <= $reminderDays && $daysUntilExpiry > 0) {
            session()->flash('warning', "Tu período de prueba expira en {$daysUntilExpiry} días. Suscríbete para continuar.");
        }

        if ($subscription->onGracePeriod() && $daysUntilExpiry <= 2 && $daysUntilExpiry > 0) {
            session()->flash('error', "Tu período de gracia expira en {$daysUntilExpiry} días. Actualiza tu método de pago urgentemente.");
        }
    }
}
