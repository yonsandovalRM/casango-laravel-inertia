<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Professional;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TenantDashboardController extends Controller
{
    public function index()
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('client')) {

            $bookings = Booking::where('client_id', $user->id)->get();
            $stats = $this->getStatsClient($bookings);
            return Inertia::render('tenant-pages/client-dashboard', [
                'client' => $user,
                'bookings' => BookingResource::collection($bookings)->toArray(request()),
                'stats' => $stats,
            ]);
        }

        if ($user->hasRole('professional')) {
            $professional = Professional::where('user_id', $user->id)->with('user')->first();

            $bookings = Booking::where('professional_id', $professional->id)->get();

            $stats = $this->getStatsProfessional($bookings);
            return Inertia::render('tenant-pages/professional-dashboard', [
                'professional' => $professional,
                'bookings' => BookingResource::collection($bookings)->toArray(request()),
                'stats' => $stats,
            ]);
        }

        return redirect()->route('home');
    }

    private function getStatsClient($bookings)
    {
        return [
            'totalBookings' => $bookings->count(),
            'upcomingBookings' => $bookings->where('date', '>=', now())->count(),
            'favoriteServices' => $bookings->pluck('service_id')->unique()->toArray(),
            'totalSpent' => $bookings->sum('total'),
        ];
    }

    private function getStatsProfessional($bookings)
    {
        return [
            'totalBookings' => $bookings->count(),
            'todayBookings' => $bookings->where('date', '>=', now())->count(),
            'monthlyRevenue' => $bookings->sum('total'),
            'completionRate' => $bookings->sum('total'),
        ];
    }
}
