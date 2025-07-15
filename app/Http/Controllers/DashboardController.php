<?php

namespace App\Http\Controllers;

use App\Services\DashboardDataService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected DashboardDataService $dashboardService;

    public function __construct(DashboardDataService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function index()
    {
        // Usar el servicio para obtener todas las estadísticas
        $dashboardData = $this->dashboardService->getMainDashboardStats();

        // Datos adicionales
        $recentTenants = $this->dashboardService->getRecentTenants();
        $tenantsByCategory = $this->dashboardService->getTenantsByCategory();
        $subscriptionStats = $this->dashboardService->getSubscriptionStats();

        // Consolidar estadísticas principales
        $stats = array_merge(
            $dashboardData['overview'],
            $dashboardData['growth']['monthly'],
            [
                'tenantsGrowth' => $dashboardData['growth']['growth']['tenants'],
                'usersGrowth' => $dashboardData['growth']['growth']['users'],
                'subscriptionsGrowth' => $dashboardData['growth']['growth']['subscriptions'],
                'totalRevenue' => $dashboardData['revenue']['total'],
                'monthlyRevenue' => $dashboardData['revenue']['monthly'],
                'revenueGrowth' => $dashboardData['revenue']['growth'],
                'conversionRate' => $dashboardData['revenue']['conversionRate'],
                'avgRevenuePerTenant' => $dashboardData['revenue']['avgPerTenant'],
                'freePlansCount' => $dashboardData['plans']['distribution']['free'],
                'paidPlansCount' => $dashboardData['plans']['distribution']['paid'],
                'freeSubscriptions' => $dashboardData['plans']['distribution']['free'],
                'paidSubscriptions' => $dashboardData['plans']['distribution']['paid'],
                // Manejar los estados de suscripción con valores por defecto
                'activeSubscriptions' => $subscriptionStats['active'] ?? 0,
                'trialSubscriptions' => $subscriptionStats['trial'] ?? 0,
                'cancelledSubscriptions' => $subscriptionStats['cancelled'] ?? 0,
                'suspendedSubscriptions' => $subscriptionStats['suspended'] ?? 0,
                'onGracePeriodSubscriptions' => $subscriptionStats['on_grace_period'] ?? 0,
                'pausedSubscriptions' => $subscriptionStats['paused'] ?? 0,
            ]
        );

        return Inertia::render('main-dashboard', [
            'stats' => $stats,
            'chartData' => $dashboardData['charts'],
            'topPlans' => $dashboardData['plans']['topPlans'],
            'recentTenants' => $recentTenants,
            'tenantsByCategory' => $tenantsByCategory,
            'subscriptionStats' => $subscriptionStats,
            'performance' => $dashboardData['revenue'],
        ]);
    }
}
