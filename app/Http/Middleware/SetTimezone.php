<?php

namespace App\Http\Middleware;

use App\Services\TimezoneService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetTimezone
{
    public function handle(Request $request, Closure $next): Response
    {
        // Establecer timezone para la aplicación basado en la empresa
        if (function_exists('tenancy') && tenancy()->initialized) {
            $companyTimezone = TimezoneService::getCompanyTimezone();

            // Establecer timezone por defecto para Carbon y PHP
            date_default_timezone_set($companyTimezone);

            // Agregar timezone info a los headers de respuesta para debug
            $response = $next($request);

            if ($response instanceof \Illuminate\Http\JsonResponse) {
                $response->header('X-Company-Timezone', $companyTimezone);
                $response->header('X-Server-Time', now()->toISOString());
            }

            return $response;
        }

        return $next($request);
    }
}
