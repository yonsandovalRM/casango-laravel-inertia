<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Professional;
use App\Models\User;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class TenantDashboardController extends Controller
{
    public function index()
    {
        $user = User::find(Auth::user()->id);

        if ($user->hasRole('client')) {
            return $this->clientDashboard($user);
        }

        if ($user->hasRole('professional')) {
            return $this->professionalDashboard($user);
        }

        if ($user->hasRole('owner')) {
            return $this->ownerDashboard($user);
        }

        if ($user->hasRole('admin')) {
            return $this->adminDashboard($user);
        }

        return redirect()->route('home');
    }

    private function clientDashboard($user)
    {
        $bookings = Booking::where('client_id', $user->id)
            ->with(['service', 'professional.user'])
            ->orderBy('date', 'desc')
            ->get();

        $stats = $this->getStatsClient($bookings);
        $chartData = $this->getClientChartData($bookings);
        $upcomingBookings = $this->getUpcomingBookings($bookings);
        $favoriteServices = $this->getFavoriteServices($bookings);

        return Inertia::render('tenant-pages/client-dashboard', [
            'client' => $user,
            'bookings' => BookingResource::collection($bookings)->toArray(request()),
            'stats' => $stats,
            'chartData' => $chartData,
            'upcomingBookings' => $upcomingBookings,
            'favoriteServices' => $favoriteServices,
        ]);
    }

    private function professionalDashboard($user)
    {
        $professional = Professional::where('user_id', $user->id)->with('user')->first();

        $bookings = Booking::where('professional_id', $professional->id)
            ->with(['service', 'client'])
            ->orderBy('date', 'desc')
            ->get();

        $stats = $this->getStatsProfessional($bookings);
        $chartData = $this->getProfessionalChartData($bookings);
        $todaySchedule = $this->getTodaySchedule($bookings);
        $weeklyStats = $this->getWeeklyStats($bookings);

        return Inertia::render('tenant-pages/professional-dashboard', [
            'professional' => $professional,
            'bookings' => BookingResource::collection($bookings)->toArray(request()),
            'stats' => $stats,
            'chartData' => $chartData,
            'todaySchedule' => $todaySchedule,
            'weeklyStats' => $weeklyStats,
        ]);
    }

    private function ownerDashboard($user)
    {
        // Estadísticas generales del negocio
        $totalBookings = Booking::count();
        $totalRevenue = Booking::where('status', 'completed')->sum('total');
        $totalProfessionals = Professional::count();
        $totalClients = User::role('client')->count();

        // Estadísticas del mes actual
        $currentMonth = Carbon::now()->startOfMonth();
        $monthlyBookings = Booking::where('created_at', '>=', $currentMonth)->count();
        $monthlyRevenue = Booking::where('created_at', '>=', $currentMonth)
            ->where('status', 'completed')
            ->sum('total');

        // Comparación con el mes anterior
        $previousMonth = Carbon::now()->subMonth()->startOfMonth();
        $previousMonthEnd = Carbon::now()->subMonth()->endOfMonth();

        $previousMonthBookings = Booking::whereBetween('created_at', [$previousMonth, $previousMonthEnd])->count();
        $previousMonthRevenue = Booking::whereBetween('created_at', [$previousMonth, $previousMonthEnd])
            ->where('status', 'completed')
            ->sum('total');

        // Calcular porcentajes de cambio
        $bookingsGrowth = $previousMonthBookings > 0
            ? (($monthlyBookings - $previousMonthBookings) / $previousMonthBookings) * 100
            : 0;

        $revenueGrowth = $previousMonthRevenue > 0
            ? (($monthlyRevenue - $previousMonthRevenue) / $previousMonthRevenue) * 100
            : 0;

        // Reservas recientes
        $recentBookings = Booking::with(['service', 'client', 'professional.user'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Top servicios
        $topServices = Service::withCount(['bookings' => function ($query) use ($currentMonth) {
            $query->where('created_at', '>=', $currentMonth);
        }])
            ->orderBy('bookings_count', 'desc')
            ->limit(5)
            ->get();

        // Top profesionales
        $topProfessionals = Professional::with('user')
            ->withCount(['bookings' => function ($query) use ($currentMonth) {
                $query->where('created_at', '>=', $currentMonth);
            }])
            ->withSum(['bookings' => function ($query) use ($currentMonth) {
                $query->where('created_at', '>=', $currentMonth)
                    ->where('status', 'completed');
            }], 'total')
            ->orderBy('bookings_count', 'desc')
            ->limit(5)
            ->get();

        $stats = [
            'totalBookings' => $totalBookings,
            'totalRevenue' => $totalRevenue,
            'totalProfessionals' => $totalProfessionals,
            'totalClients' => $totalClients,
            'monthlyBookings' => $monthlyBookings,
            'monthlyRevenue' => $monthlyRevenue,
            'bookingsGrowth' => round($bookingsGrowth, 1),
            'revenueGrowth' => round($revenueGrowth, 1),
            'avgBookingValue' => $monthlyBookings > 0 ? round($monthlyRevenue / $monthlyBookings, 2) : 0,
            'completionRate' => $totalBookings > 0
                ? round((Booking::where('status', 'completed')->count() / $totalBookings) * 100, 1)
                : 0,
        ];

        $chartData = $this->getOwnerChartData();
        $performanceMetrics = $this->getPerformanceMetrics();

        return Inertia::render('tenant-pages/owner-dashboard', [
            'owner' => $user,
            'stats' => $stats,
            'recentBookings' => BookingResource::collection($recentBookings)->toArray(request()),
            'topServices' => $topServices,
            'topProfessionals' => $topProfessionals,
            'chartData' => $chartData,
            'performanceMetrics' => $performanceMetrics,
        ]);
    }

    private function adminDashboard($user)
    {
        // Estadísticas administrativas completas
        $totalBookings = Booking::count();
        $totalRevenue = Booking::where('status', 'completed')->sum('total');
        $totalProfessionals = Professional::count();
        $totalClients = User::role('client')->count();
        $totalServices = Service::count();

        // Estadísticas del mes actual
        $currentMonth = Carbon::now()->startOfMonth();
        $monthlyStats = [
            'bookings' => Booking::where('created_at', '>=', $currentMonth)->count(),
            'revenue' => Booking::where('created_at', '>=', $currentMonth)
                ->where('status', 'completed')
                ->sum('total'),
            'newClients' => User::role('client')->where('created_at', '>=', $currentMonth)->count(),
        ];

        // Análisis de rendimiento
        $completionRate = $totalBookings > 0
            ? round((Booking::where('status', 'completed')->count() / $totalBookings) * 100, 1)
            : 0;

        $cancellationRate = $totalBookings > 0
            ? round((Booking::where('status', 'cancelled')->count() / $totalBookings) * 100, 1)
            : 0;

        // Servicios más populares
        $popularServices = Service::withCount('bookings')
            ->orderBy('bookings_count', 'desc')
            ->limit(10)
            ->get();

        // Profesionales por rendimiento
        $professionalPerformance = Professional::with('user')
            ->withCount('bookings')
            ->withSum('bookings', 'total')
            ->orderBy('bookings_count', 'desc')
            ->get();

        // Análisis de horarios
        $busyHours = $this->getBusyHoursAnalysis();

        // Tendencias y predicciones
        $trends = $this->getTrends();

        $stats = [
            'totalBookings' => $totalBookings,
            'totalRevenue' => $totalRevenue,
            'totalProfessionals' => $totalProfessionals,
            'totalClients' => $totalClients,
            'totalServices' => $totalServices,
            'monthlyStats' => $monthlyStats,
            'completionRate' => $completionRate,
            'cancellationRate' => $cancellationRate,
            'avgBookingValue' => $totalBookings > 0 ? round($totalRevenue / $totalBookings, 2) : 0,
        ];

        return Inertia::render('tenant-pages/admin-dashboard', [
            'admin' => $user,
            'stats' => $stats,
            'popularServices' => $popularServices,
            'professionalPerformance' => $professionalPerformance,
            'busyHours' => $busyHours,
            'trends' => $trends,
            'chartData' => $this->getAdminChartData(),
        ]);
    }

    // Métodos auxiliares para estadísticas específicas

    private function getStatsClient($bookings)
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();

        // Próximas reservas confirmadas
        $upcomingBookings = $bookings->filter(function ($booking) use ($now) {
            return Carbon::parse($booking->date)->gte($now) && $booking->status === 'confirmed';
        });

        // Servicios más utilizados
        $serviceStats = $bookings->where('status', 'completed')
            ->groupBy('service_id')
            ->map(function ($group) {
                return [
                    'service_name' => $group->first()->service->name,
                    'count' => $group->count(),
                    'total_spent' => $group->sum('total')
                ];
            })
            ->sortByDesc('count')
            ->take(3)
            ->values();

        // Total gastado (solo reservas completadas)
        $totalSpent = $bookings->where('status', 'completed')->sum('total');

        // Gasto del mes actual
        $monthlySpent = $bookings->filter(function ($booking) use ($startOfMonth) {
            return Carbon::parse($booking->created_at)->gte($startOfMonth) && $booking->status === 'completed';
        })->sum('total');

        // Tasa de satisfacción simulada
        $satisfactionRate = 92; // Esto podría venir de una tabla de reviews

        return [
            'totalBookings' => $bookings->count(),
            'upcomingBookings' => $upcomingBookings->count(),
            'favoriteServices' => $serviceStats->toArray(),
            'totalSpent' => $totalSpent,
            'monthlySpent' => $monthlySpent,
            'completedBookings' => $bookings->where('status', 'completed')->count(),
            'cancelledBookings' => $bookings->where('status', 'cancelled')->count(),
            'satisfactionRate' => $satisfactionRate,
            'avgBookingValue' => $bookings->where('status', 'completed')->count() > 0
                ? round($totalSpent / $bookings->where('status', 'completed')->count(), 2)
                : 0,
        ];
    }

    private function getStatsProfessional($bookings)
    {
        $now = Carbon::now();
        $today = $now->copy()->startOfDay();
        $endOfToday = $now->copy()->endOfDay();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfWeek = $now->copy()->startOfWeek();

        // Reservas de hoy
        $todayBookings = $bookings->filter(function ($booking) use ($today, $endOfToday) {
            $bookingDate = Carbon::parse($booking->date . ' ' . $booking->time);
            return $bookingDate->between($today, $endOfToday);
        });

        // Reservas de esta semana
        $weekBookings = $bookings->filter(function ($booking) use ($startOfWeek) {
            return Carbon::parse($booking->date)->gte($startOfWeek);
        });

        // Ingresos del mes (solo completadas)
        $monthlyRevenue = $bookings->filter(function ($booking) use ($startOfMonth) {
            return Carbon::parse($booking->created_at)->gte($startOfMonth) && $booking->status === 'completed';
        })->sum('total');

        // Tasa de finalización
        $completedBookings = $bookings->where('status', 'completed')->count();
        $completionRate = $bookings->count() > 0 ? round(($completedBookings / $bookings->count()) * 100, 1) : 0;

        // Próximas citas
        $upcomingBookings = $bookings->filter(function ($booking) use ($now) {
            return Carbon::parse($booking->date)->gte($now) && in_array($booking->status, ['confirmed', 'pending']);
        });

        // Cliente más frecuente
        $topClient = $bookings->groupBy('client_id')
            ->map(function ($group) {
                return [
                    'client_name' => $group->first()->client->name,
                    'booking_count' => $group->count()
                ];
            })
            ->sortByDesc('booking_count')
            ->first();

        return [
            'totalBookings' => $bookings->count(),
            'todayBookings' => $todayBookings->count(),
            'weekBookings' => $weekBookings->count(),
            'monthlyRevenue' => $monthlyRevenue,
            'completionRate' => $completionRate,
            'upcomingBookings' => $upcomingBookings->count(),
            'avgBookingValue' => $completedBookings > 0 ? round($monthlyRevenue / $completedBookings, 2) : 0,
            'cancelledRate' => $bookings->count() > 0
                ? round(($bookings->where('status', 'cancelled')->count() / $bookings->count()) * 100, 1)
                : 0,
            'topClient' => $topClient,
            'clientSatisfaction' => 95, // Esto vendría de reviews
        ];
    }

    private function getClientChartData($bookings)
    {
        // Datos para gráfico de gastos mensuales
        $monthlySpending = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthStart = $month->copy()->startOfMonth();
            $monthEnd = $month->copy()->endOfMonth();

            $monthlySpending[] = [
                'month' => $month->format('M'),
                'spent' => $bookings->filter(function ($booking) use ($monthStart, $monthEnd) {
                    $bookingDate = Carbon::parse($booking->created_at);
                    return $bookingDate->between($monthStart, $monthEnd) && $booking->status === 'completed';
                })->sum('total'),
                'bookings' => $bookings->filter(function ($booking) use ($monthStart, $monthEnd) {
                    $bookingDate = Carbon::parse($booking->created_at);
                    return $bookingDate->between($monthStart, $monthEnd);
                })->count(),
            ];
        }

        return $monthlySpending;
    }

    private function getProfessionalChartData($bookings)
    {
        // Ingresos y citas por mes
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthStart = $month->copy()->startOfMonth();
            $monthEnd = $month->copy()->endOfMonth();

            $monthlyData[] = [
                'month' => $month->format('M'),
                'revenue' => $bookings->filter(function ($booking) use ($monthStart, $monthEnd) {
                    $bookingDate = Carbon::parse($booking->created_at);
                    return $bookingDate->between($monthStart, $monthEnd) && $booking->status === 'completed';
                })->sum('total'),
                'bookings' => $bookings->filter(function ($booking) use ($monthStart, $monthEnd) {
                    $bookingDate = Carbon::parse($booking->created_at);
                    return $bookingDate->between($monthStart, $monthEnd);
                })->count(),
            ];
        }

        return $monthlyData;
    }

    private function getOwnerChartData()
    {
        // Datos para múltiples gráficos del owner
        $monthlyData = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthStart = $month->copy()->startOfMonth();
            $monthEnd = $month->copy()->endOfMonth();

            $monthlyData[] = [
                'month' => $month->format('M Y'),
                'revenue' => Booking::whereBetween('created_at', [$monthStart, $monthEnd])
                    ->where('status', 'completed')
                    ->sum('total'),
                'bookings' => Booking::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
                'newClients' => User::role('client')->whereBetween('created_at', [$monthStart, $monthEnd])->count(),
            ];
        }

        return $monthlyData;
    }

    private function getAdminChartData()
    {
        // Datos completos para admin
        return [
            'monthly' => $this->getOwnerChartData(),
            'hourly' => $this->getHourlyDistribution(),
            'services' => $this->getServiceDistribution(),
        ];
    }

    private function getUpcomingBookings($bookings)
    {
        return $bookings->filter(function ($booking) {
            return Carbon::parse($booking->date)->gte(Carbon::now())
                && in_array($booking->status, ['confirmed', 'pending']);
        })->take(5)->values();
    }

    private function getFavoriteServices($bookings)
    {
        return $bookings->where('status', 'completed')
            ->groupBy('service_id')
            ->map(function ($group) {
                return [
                    'service' => $group->first()->service,
                    'count' => $group->count(),
                    'total_spent' => $group->sum('total')
                ];
            })
            ->sortByDesc('count')
            ->take(3)
            ->values();
    }

    private function getTodaySchedule($bookings)
    {
        $today = Carbon::today();
        return $bookings->filter(function ($booking) use ($today) {
            return Carbon::parse($booking->date)->isSameDay($today);
        })->sortBy('time')->values();
    }

    private function getWeeklyStats($bookings)
    {
        $startOfWeek = Carbon::now()->startOfWeek();
        $weekBookings = $bookings->filter(function ($booking) use ($startOfWeek) {
            return Carbon::parse($booking->date)->gte($startOfWeek);
        });

        return [
            'totalBookings' => $weekBookings->count(),
            'completedBookings' => $weekBookings->where('status', 'completed')->count(),
            'revenue' => $weekBookings->where('status', 'completed')->sum('total'),
            'busyDay' => $this->getBusiestDay($weekBookings),
        ];
    }

    private function getPerformanceMetrics()
    {
        return [
            'customerRetention' => 78,
            'averageSessionTime' => 45,
            'bookingConversion' => 85,
            'professionalUtilization' => 82,
        ];
    }

    private function getBusyHoursAnalysis()
    {
        return Booking::select(DB::raw('HOUR(time) as hour'), DB::raw('COUNT(*) as bookings'))
            ->groupBy('hour')
            ->orderBy('hour')
            ->get()
            ->map(function ($item) {
                return [
                    'hour' => $item->hour . ':00',
                    'bookings' => $item->bookings
                ];
            });
    }

    private function getTrends()
    {
        // Análisis de tendencias simples
        $currentMonth = Carbon::now()->startOfMonth();
        $previousMonth = Carbon::now()->subMonth()->startOfMonth();

        $currentBookings = Booking::where('created_at', '>=', $currentMonth)->count();
        $previousBookings = Booking::whereBetween('created_at', [
            $previousMonth,
            Carbon::now()->subMonth()->endOfMonth()
        ])->count();

        $trend = $previousBookings > 0
            ? (($currentBookings - $previousBookings) / $previousBookings) * 100
            : 0;

        return [
            'bookingTrend' => round($trend, 1),
            'predictedGrowth' => round($trend * 1.2, 1), // Predicción simple
            'seasonality' => $this->getSeasonalityData(),
        ];
    }

    private function getHourlyDistribution()
    {
        return $this->getBusyHoursAnalysis();
    }

    private function getServiceDistribution()
    {
        return Service::withCount('bookings')
            ->get()
            ->map(function ($service) {
                return [
                    'name' => $service->name,
                    'bookings' => $service->bookings_count,
                    'percentage' => 0, // Calcular después
                ];
            });
    }

    private function getBusiestDay($bookings)
    {
        $dayCount = $bookings->groupBy(function ($booking) {
            return Carbon::parse($booking->date)->format('l');
        })->map->count();

        return $dayCount->keys()->first() ?? 'Lunes';
    }

    private function getSeasonalityData()
    {
        // Datos de estacionalidad por mes
        return collect(range(1, 12))->map(function ($month) {
            return [
                'month' => Carbon::create()->month($month)->format('M'),
                'factor' => rand(80, 120) / 100, // Factor de estacionalidad simulado
            ];
        });
    }
}
