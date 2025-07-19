<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class CategoryStat extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'category_id',
        'services_count',
        'active_services_count',
        'bookings_count',
        'total_revenue',
        'stats_date',
    ];

    protected $casts = [
        'services_count' => 'integer',
        'active_services_count' => 'integer',
        'bookings_count' => 'integer',
        'total_revenue' => 'decimal:2',
        'stats_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relación con categoría.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Scopes
     */
    public function scopeForDate($query, Carbon $date)
    {
        return $query->whereDate('stats_date', $date);
    }

    public function scopeForDateRange($query, Carbon $start, Carbon $end)
    {
        return $query->whereBetween('stats_date', [$start, $end]);
    }

    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('stats_date', '>=', Carbon::now()->subDays($days));
    }

    /**
     * Métodos estáticos para generar estadísticas
     */
    public static function generateDailyStats(): void
    {
        $today = Carbon::today();

        Category::chunk(100, function ($categories) use ($today) {
            foreach ($categories as $category) {
                $category->updateStatistics();
            }
        });
    }

    public static function getAggregatedStats(Carbon $start, Carbon $end): array
    {
        $stats = self::forDateRange($start, $end)
            ->selectRaw('
                SUM(services_count) as total_services,
                SUM(active_services_count) as total_active_services,
                SUM(bookings_count) as total_bookings,
                SUM(total_revenue) as total_revenue,
                AVG(services_count) as avg_services_per_category
            ')
            ->first();

        return [
            'total_services' => $stats->total_services ?? 0,
            'total_active_services' => $stats->total_active_services ?? 0,
            'total_bookings' => $stats->total_bookings ?? 0,
            'total_revenue' => $stats->total_revenue ?? 0,
            'avg_services_per_category' => round($stats->avg_services_per_category ?? 0, 1),
        ];
    }
}
