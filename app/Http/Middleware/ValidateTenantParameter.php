<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateTenantParameter
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $tenantId = $request->get('tenant');

        if (!$tenantId) {
            return redirect()->route('home')->withErrors(['error' => 'Tenant requerido']);
        }

        // Validar que el tenant existe
        $tenant = Tenant::find($tenantId);
        if (!$tenant) {
            return redirect()->route('home')->withErrors(['error' => 'Tenant no válido']);
        }

        // Guardar el tenant en la sesión para uso posterior
        $request->session()->put('oauth_tenant_id', $tenantId);

        return $next($request);
    }
}
