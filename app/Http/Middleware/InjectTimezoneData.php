<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\TimezoneService;
use Inertia\Inertia;

class InjectTimezoneData
{
    protected $timezoneService;

    public function __construct(TimezoneService $timezoneService)
    {
        $this->timezoneService = $timezoneService;
    }

    public function handle(Request $request, Closure $next)
    {
        // Solo inyectar en rutas de tenant
        if (function_exists('tenant') || tenant()) {
            Inertia::share([
                'timezone' => $this->timezoneService->getTimezoneInfo()
            ]);
        }

        return $next($request);
    }
}
