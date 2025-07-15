<?php

namespace App\Http\Middleware;

use App\Helpers\SubscriptionHelper;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckFeatureLimit
{
    public function handle(Request $request, Closure $next, string $limitType, ?string $currentCountParam = null): Response
    {
        if (!function_exists('tenant') || !tenant()) {
            // En contexto central, permitir acceso
            return $next($request);
        }

        $subscription = tenant()->subscriptions()->where('is_active', true)->first();

        if (!$subscription || !$subscription->canAccess()) {
            return $this->redirectToSubscription($request, 'Tu suscripción no permite acceder a esta funcionalidad.');
        }

        // Si se especifica un parámetro para contar elementos actuales
        if ($currentCountParam) {
            $currentCount = $request->get($currentCountParam, 0);
            if (!SubscriptionHelper::checkLimit($limitType, $currentCount)) {
                $remaining = SubscriptionHelper::getRemainingCount($limitType, $currentCount);
                return $this->redirectToSubscription(
                    $request,
                    "Has alcanzado el límite de tu plan. Tienes {$remaining} elementos disponibles. Actualiza tu plan para continuar."
                );
            }
        }

        return $next($request);
    }

    protected function redirectToSubscription(Request $request, string $message): Response
    {
        if ($request->expectsJson()) {
            return response()->json([
                'message' => $message,
                'redirect' => route('tenant.subscription.index')
            ], 403);
        }

        return redirect()->route('tenant.subscription.index')
            ->with('error', $message);
    }
}
