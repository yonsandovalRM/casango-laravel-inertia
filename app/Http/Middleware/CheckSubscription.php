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

        // Permite el acceso a la página de suscripción incluso sin una suscripción activa.
        if ($request->routeIs('tenant.subscription.*')) {
            return $next($request);
        }

        if (!$tenant->subscription || !$tenant->subscription->isActive()) {
            // Si es una petición de Inertia, redirige con Inertia.
            if ($request->inertia()) {
                return redirect()->route('tenant.subscription.index')->with('warning', 'Necesitas una suscripción activa para acceder a este recurso.');
            }
            abort(403, 'SUSCRIPCIÓN REQUERIDA.');
        }

        return $next($request);
    }
}
