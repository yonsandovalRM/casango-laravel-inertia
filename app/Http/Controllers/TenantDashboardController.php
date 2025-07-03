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

        return redirect()->route('home');
    }

    private function clientDashboard($user)
    {
        $bookings = Booking::where('client_id', $user->id)
            ->with(['service', 'professional.user'])
            ->orderBy('date', 'desc')
            ->get();

        $stats = $this->getStatsClient($bookings);

        return Inertia::render('tenant-pages/client-dashboard', [
            'client' => $user,
            'bookings' => BookingResource::collection($bookings)->toArray(request()),
            'stats' => $stats,
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

        return Inertia::render('tenant-pages/professional-dashboard', [
            'professional' => $professional,
            'bookings' => BookingResource::collection($bookings)->toArray(request()),
            'stats' => $stats,
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

        return Inertia::render('tenant-pages/owner-dashboard', [
            'owner' => $user,
            'stats' => $stats,
            'recentBookings' => BookingResource::collection($recentBookings)->toArray(request()),
            'topServices' => $topServices,
            'topProfessionals' => $topProfessionals,
        ]);
    }

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

        return [
            'totalBookings' => $bookings->count(),
            'upcomingBookings' => $upcomingBookings->count(),
            'favoriteServices' => $serviceStats->toArray(),
            'totalSpent' => $totalSpent,
            'monthlySpent' => $monthlySpent,
            'completedBookings' => $bookings->where('status', 'completed')->count(),
            'cancelledBookings' => $bookings->where('status', 'cancelled')->count(),
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
        ];
    }
}
