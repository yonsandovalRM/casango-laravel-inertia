<?php

namespace App\Services;

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardDataService
{
    /**
     * Obtiene todas las estadísticas para el dashboard principal
     */
    public function getMainDashboardStats(): array
    {
        return [
            'overview' => $this->getOverviewStats(),
            'growth' => $this->getGrowthStats(),
            'revenue' => $this->getRevenueStats(),
            'plans' => $this->getPlanStats(),
            'charts' => $this->getChartData(),
        ];
    }

    /**
     * Estadísticas generales
     */
    private function getOverviewStats(): array
    {
        return [
            'totalTenants' => Tenant::count(),
            'totalUsers' => User::count(),
            'totalPlans' => Plan::count(),
            'totalSubscriptions' => Subscription::count(),
            'activeTenants' => Tenant::whereHas('subscriptions', function ($query) {
                $query->where('status', 'active');
            })->count(),
            'trialTenants' => Tenant::whereHas('subscriptions', function ($query) {
                $query->where('status', 'trial');
            })->count(),
        ];
    }

    /**
     * Estadísticas de crecimiento mensual
     */
    private function getGrowthStats(): array
    {
        $currentMonth = Carbon::now()->startOfMonth();
        $previousMonth = Carbon::now()->subMonth()->startOfMonth();
        $previousMonthEnd = Carbon::now()->subMonth()->endOfMonth();

        // Datos del mes actual
        $monthlyTenants = Tenant::where('created_at', '>=', $currentMonth)->count();
        $monthlyUsers = User::where('created_at', '>=', $currentMonth)->count();
        $monthlySubscriptions = Subscription::where('created_at', '>=', $currentMonth)->count();

        // Datos del mes anterior
        $previousMonthTenants = Tenant::whereBetween('created_at', [$previousMonth, $previousMonthEnd])->count();
        $previousMonthUsers = User::whereBetween('created_at', [$previousMonth, $previousMonthEnd])->count();
        $previousMonthSubscriptions = Subscription::whereBetween('created_at', [$previousMonth, $previousMonthEnd])->count();

        return [
            'monthly' => [
                'tenants' => $monthlyTenants,
                'users' => $monthlyUsers,
                'subscriptions' => $monthlySubscriptions,
            ],
            'growth' => [
                'tenants' => $this->calculateGrowthRate($monthlyTenants, $previousMonthTenants),
                'users' => $this->calculateGrowthRate($monthlyUsers, $previousMonthUsers),
                'subscriptions' => $this->calculateGrowthRate($monthlySubscriptions, $previousMonthSubscriptions),
            ],
        ];
    }

    /**
     * Estadísticas de ingresos
     */
    private function getRevenueStats(): array
    {
        $currentMonth = Carbon::now()->startOfMonth();
        $previousMonth = Carbon::now()->subMonth()->startOfMonth();
        $previousMonthEnd = Carbon::now()->subMonth()->endOfMonth();

        $totalRevenue = Subscription::where('status', 'active')->sum('price');
        $monthlyRevenue = Subscription::where('created_at', '>=', $currentMonth)
            ->where('status', 'active')
            ->sum('price');

        $previousMonthRevenue = Subscription::whereBetween('created_at', [$previousMonth, $previousMonthEnd])
            ->where('status', 'active')
            ->sum('price');

        $totalTenants = Tenant::count();
        $totalSubscriptions = Subscription::count();

        return [
            'total' => $totalRevenue,
            'monthly' => $monthlyRevenue,
            'growth' => $this->calculateGrowthRate($monthlyRevenue, $previousMonthRevenue),
            'avgPerTenant' => $totalTenants > 0 ? $totalRevenue / $totalTenants : 0,
            'conversionRate' => $totalTenants > 0 ? ($totalSubscriptions / $totalTenants) * 100 : 0,
        ];
    }

    /**
     * Estadísticas de planes
     */
    private function getPlanStats(): array
    {
        $currentMonth = Carbon::now()->startOfMonth();

        // Top planes más populares
        $topPlans = Plan::withCount(['subscriptions' => function ($query) use ($currentMonth) {
            $query->where('created_at', '>=', $currentMonth);
        }])
            ->orderBy('subscriptions_count', 'desc')
            ->limit(5)
            ->get();

        // Distribución free vs paid
        $freeSubscriptions = Subscription::whereHas('plan', function ($query) {
            $query->where('is_free', true);
        })->count();

        $paidSubscriptions = Subscription::whereHas('plan', function ($query) {
            $query->where('is_free', false);
        })->count();

        return [
            'topPlans' => $topPlans,
            'distribution' => [
                'free' => $freeSubscriptions,
                'paid' => $paidSubscriptions,
            ],
        ];
    }

    /**
     * Datos para gráficos - últimos 6 meses
     */
    private function getChartData(): array
    {
        $chartData = [];

        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthStart = $month->copy()->startOfMonth();
            $monthEnd = $month->copy()->endOfMonth();

            $chartData[] = [
                'month' => $month->format('M Y'),
                'shortMonth' => $month->format('M'),
                'tenants' => Tenant::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
                'subscriptions' => Subscription::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
                'revenue' => Subscription::whereBetween('created_at', [$monthStart, $monthEnd])
                    ->where('status', 'active')
                    ->sum('price'),
                'users' => User::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
            ];
        }

        return $chartData;
    }

    /**
     * Obtiene datos para el dashboard de tenant (owner)
     */
    public function getTenantDashboardStats(): array
    {
        // Esta función se puede usar para generar stats más detallados 
        // para los dashboards de tenant si es necesario
        return [
            'performance' => $this->getTenantPerformanceData(),
            'predictions' => $this->getPredictiveAnalytics(),
        ];
    }

    /**
     * Datos de rendimiento para tenant
     */
    private function getTenantPerformanceData(): array
    {
        // Aquí podrías agregar lógica específica del tenant
        // usando el contexto de tenancy
        return [
            'efficiency' => 85,
            'satisfaction' => 92,
            'retention' => 78,
            'growth_potential' => 'high',
        ];
    }

    /**
     * Análisis predictivo simple
     */
    private function getPredictiveAnalytics(): array
    {
        $currentMonth = Carbon::now()->startOfMonth();
        $lastMonthRevenue = Subscription::where('created_at', '>=', $currentMonth)
            ->where('status', 'active')
            ->sum('price');

        // Predicción simple basada en tendencia
        $growthRate = 0.15; // 15% de crecimiento estimado
        $predictedRevenue = $lastMonthRevenue * (1 + $growthRate);

        return [
            'nextMonthRevenue' => $predictedRevenue,
            'growthTrend' => 'positive',
            'recommendations' => [
                'Incrementar servicios premium',
                'Mejorar retención de clientes',
                'Optimizar horarios de mayor demanda'
            ],
        ];
    }

    /**
     * Obtiene tenants recientes con información adicional
     */
    public function getRecentTenants(int $limit = 10): array
    {
        return Tenant::with(['plan', 'subscriptions' => function ($query) {
            $query->latest()->first();
        }])
            ->latest()
            ->limit($limit)
            ->get()
            ->map(function ($tenant) {
                return [
                    'id' => $tenant->id,
                    'name' => $tenant->name,
                    'category' => $tenant->category,
                    'created_at' => $tenant->created_at,
                    'plan' => $tenant->plan,
                    'status' => $this->getTenantStatus($tenant),
                    'daysActive' => $tenant->created_at->diffInDays(now()),
                ];
            })
            ->toArray();
    }

    /**
     * Obtiene distribución de tenants por categoría
     */
    public function getTenantsByCategory(): array
    {
        return Tenant::select('category', DB::raw('count(*) as count'))
            ->whereNotNull('category')
            ->groupBy('category')
            ->orderBy('count', 'desc')
            ->limit(5)
            ->get()
            ->toArray();
    }

    /**
     * Obtiene estadísticas de suscripciones por estado
     */
    public function getSubscriptionStats(): array
    {
        $stats = Subscription::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        $result = [];
        foreach ($stats as $stat) {
            // Convertir el enum a string para usar como clave
            $statusKey = $stat->status instanceof \BackedEnum
                ? $stat->status->value
                : (string) $stat->status;

            $result[$statusKey] = $stat->count;
        }

        return $result;
    }

    /**
     * Debug: Obtiene todos los estados únicos de suscripción en la DB
     */
    public function debugSubscriptionStatuses(): array
    {
        $statuses = Subscription::select('status')
            ->distinct()
            ->get()
            ->map(function ($item) {
                return [
                    'raw' => $item->status,
                    'type' => gettype($item->status),
                    'class' => get_class($item->status),
                    'value' => $item->status instanceof \BackedEnum ? $item->status->value : (string) $item->status,
                ];
            })
            ->toArray();

        return $statuses;
    }

    /**
     * Obtiene estadísticas de suscripciones con nombres legibles
     */
    public function getSubscriptionStatsWithLabels(): array
    {
        $stats = $this->getSubscriptionStats();

        return [
            'active' => [
                'count' => $stats['active'] ?? 0,
                'label' => 'Activas',
                'color' => '#10B981'
            ],
            'trial' => [
                'count' => $stats['trial'] ?? 0,
                'label' => 'En Prueba',
                'color' => '#3B82F6'
            ],
            'cancelled' => [
                'count' => $stats['cancelled'] ?? 0,
                'label' => 'Canceladas',
                'color' => '#EF4444'
            ],
            'suspended' => [
                'count' => $stats['suspended'] ?? 0,
                'label' => 'Suspendidas',
                'color' => '#F59E0B'
            ],
            'on_grace_period' => [
                'count' => $stats['on_grace_period'] ?? 0,
                'label' => 'Período de Gracia',
                'color' => '#8B5CF6'
            ],
            'paused' => [
                'count' => $stats['paused'] ?? 0,
                'label' => 'Pausadas',
                'color' => '#6B7280'
            ],
        ];
    }

    /**
     * Calcula la tasa de crecimiento
     */
    private function calculateGrowthRate(int $current, int $previous): float
    {
        if ($previous === 0) {
            return $current > 0 ? 100 : 0;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }

    /**
     * Determina el estado de un tenant
     */
    private function getTenantStatus($tenant): string
    {
        $activeSubscription = $tenant->subscriptions()
            ->where('status', 'active')
            ->first();

        if ($activeSubscription) {
            return 'active';
        }

        $trialSubscription = $tenant->subscriptions()
            ->where('status', 'trial')
            ->first();

        if ($trialSubscription) {
            return 'trial';
        }

        return 'inactive';
    }
}
