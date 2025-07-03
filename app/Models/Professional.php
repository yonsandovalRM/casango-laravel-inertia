<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Professional extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'user_id',
        'photo',
        'bio',
        'title',
        'profession',
        'specialty',
        'is_company_schedule',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(ProfessionalSchedule::class);
    }

    public function exceptions(): HasMany
    {
        return $this->hasMany(Exception::class);
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class)
            ->withPivot('duration', 'price')
            ->withTimestamps();
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    // Métodos de utilidad para estadísticas
    public function getMonthlyRevenue($month = null)
    {
        $startOfMonth = $month ? \Carbon\Carbon::parse($month)->startOfMonth() : \Carbon\Carbon::now()->startOfMonth();

        return $this->bookings()
            ->where('created_at', '>=', $startOfMonth)
            ->where('status', 'completed')
            ->sum('total');
    }

    public function getCompletionRate()
    {
        $totalBookings = $this->bookings()->count();
        if ($totalBookings === 0) return 0;

        $completedBookings = $this->bookings()->where('status', 'completed')->count();
        return round(($completedBookings / $totalBookings) * 100, 1);
    }

    public function getTodayBookings()
    {
        $today = \Carbon\Carbon::today();

        return $this->bookings()
            ->whereDate('date', $today)
            ->orderBy('time')
            ->get();
    }
}
