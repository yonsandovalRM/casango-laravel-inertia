<?php

namespace App\Http\Controllers;


use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Estadísticas generales usando Query Builder
        $stats = [
            'total_tenants' => DB::table('tenants')->count(),
            'total_users' => DB::table('users')->count(),
            'total_plans' => DB::table('plans')->count(),
            'active_subscriptions' => DB::table('subscriptions')
                                    ->where('is_active', true)
                                    ->count(),
            'trialing_subscriptions' => DB::table('subscriptions')
                                      ->whereNotNull('trial_ends_at')
                                      ->where('trial_ends_at', '>', now())
                                      ->count(),
        ];

        // Distribución de tenants por plan
        $stats['tenants_by_plan'] = DB::table('plans')
            ->leftJoin('tenants', 'tenants.plan_id', '=', 'plans.id')
            ->select(
                'plans.name as plan_name',
                DB::raw('COUNT(tenants.id) as tenants_count'),
                DB::raw('ROUND(COUNT(tenants.id) * 100.0 / GREATEST('.$stats['total_tenants'].', 1), 2) as percentage')
            )
            ->groupBy('plans.id', 'plans.name')
            ->orderByDesc('tenants_count')
            ->get();

        // Distribución de suscripciones por estado de pago
        $stats['subscriptions_by_payment_status'] = DB::table('subscriptions')
            ->select(
                'payment_status',
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('payment_status')
            ->get();

        // Crecimiento de tenants (últimos 6 meses) - Versión PostgreSQL
        $stats['tenants_growth'] = DB::table('tenants')
            ->select(
                DB::raw("to_char(created_at, 'YYYY-MM') as month"),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Planes populares
        $stats['popular_plans'] = DB::table('plans')
            ->where('is_popular', true)
            ->leftJoin('subscriptions', function($join) {
                $join->on('subscriptions.plan_id', '=', 'plans.id')
                     ->where('subscriptions.is_active', true);
            })
            ->select(
                'plans.*',
                DB::raw('COUNT(subscriptions.id) as subscriptions_count')
            )
            ->groupBy('plans.id')
            ->get();

        // Ingresos estimados (mensuales y anuales)
        $stats['estimated_revenue'] = [
            'monthly' => DB::table('subscriptions')
                        ->where('is_active', true)
                        ->where('is_monthly', true)
                        ->sum('price'),
            'annual' => DB::table('subscriptions')
                       ->where('is_active', true)
                       ->where('is_monthly', false)
                       ->sum('price'),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
        ]);
    }
}