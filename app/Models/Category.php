<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class Category extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'is_active',
        'sort_order',
        'color',
        'icon',
        'metadata'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $attributes = [
        'is_active' => true,
        'sort_order' => 0,
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        // Auto-asignar orden al crear
        static::creating(function (Category $category) {
            if (is_null($category->sort_order)) {
                $category->sort_order = static::max('sort_order') + 1;
            }
        });

        // Actualizar estadísticas después de cambios
        static::saved(function (Category $category) {
            $category->updateStatistics();
        });
    }

    /**
     * Relación con servicios.
     */
    public function services()
    {
        return $this->hasMany(Service::class);
    }

    /**
     * Relación con estadísticas.
     */
    public function stats()
    {
        return $this->hasMany(CategoryStat::class);
    }

    /**
     * Obtener estadística más reciente.
     */
    public function latestStat()
    {
        return $this->hasOne(CategoryStat::class)->latest('stats_date');
    }

    /**
     * Scopes
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeInactive(Builder $query): Builder
    {
        return $query->where('is_active', false);
    }

    public function scopeWithServices(Builder $query): Builder
    {
        return $query->whereHas('services');
    }

    public function scopeWithoutServices(Builder $query): Builder
    {
        return $query->whereDoesntHave('services');
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where('name', 'LIKE', "%{$search}%")
            ->orWhere('description', 'LIKE', "%{$search}%");
    }

    public function scopeByStatus(Builder $query, string $status): Builder
    {
        return match ($status) {
            'active' => $query->active(),
            'inactive' => $query->inactive(),
            default => $query
        };
    }

    /**
     * Accessors
     */
    public function getStatusLabelAttribute(): string
    {
        return $this->is_active ? 'Activa' : 'Inactiva';
    }

    public function getStatusColorAttribute(): string
    {
        return $this->is_active ? 'success' : 'muted';
    }

    public function getHasServicesAttribute(): bool
    {
        return $this->services()->exists();
    }

    public function getPerformanceScoreAttribute(): int
    {
        $score = 0;

        // Puntos por estar activa
        if ($this->is_active) {
            $score += 30;
        }

        // Puntos por tener servicios - usar relación en lugar de atributo
        $servicesCount = $this->services_count ?? $this->services()->count();
        if ($servicesCount > 0) {
            $score += min($servicesCount * 10, 50);
        }

        // Puntos por antigüedad
        if ($this->created_at) {
            $daysOld = $this->created_at->diffInDays(now());
            $score += min($daysOld / 10, 20);
        }

        return min($score, 100);
    }

    public function getCreatedAtHumanAttribute(): ?string
    {
        return $this->created_at?->diffForHumans();
    }

    public function getUpdatedAtHumanAttribute(): ?string
    {
        return $this->updated_at?->diffForHumans();
    }

    /**
     * Métodos de utilidad
     */
    public function activate(): bool
    {
        return $this->update(['is_active' => true]);
    }

    public function deactivate(): bool
    {
        // Verificar si se puede desactivar
        if ($this->services()->where('is_active', true)->exists()) {
            throw new \Exception('No se puede desactivar una categoría con servicios activos');
        }

        return $this->update(['is_active' => false]);
    }

    public function toggleStatus(): bool
    {
        if ($this->is_active) {
            return $this->deactivate();
        } else {
            return $this->activate();
        }
    }

    public function duplicate(array $overrides = []): static
    {
        $attributes = $this->toArray();
        unset($attributes['id'], $attributes['created_at'], $attributes['updated_at']);

        $attributes['name'] = $overrides['name'] ?? $attributes['name'] . ' (Copia)';
        $attributes = array_merge($attributes, $overrides);

        return static::create($attributes);
    }

    public function updateStatistics(): void
    {
        $today = Carbon::today();

        $stats = [
            'services_count' => $this->services()->count(),
            'active_services_count' => $this->services()->where('is_active', true)->count(),
            'bookings_count' => $this->getBookingsCount(),
            'total_revenue' => $this->getTotalRevenue(),
            'stats_date' => $today,
        ];

        CategoryStat::updateOrCreate(
            [
                'category_id' => $this->id,
                'stats_date' => $today,
            ],
            $stats
        );
    }

    public function getBookingsCount(): int
    {
        // Implementar lógica para contar bookings de servicios de esta categoría
        return 0; // Placeholder
    }

    public function getTotalRevenue(): float
    {
        // Implementar lógica para calcular ingresos de servicios de esta categoría
        return 0.0; // Placeholder
    }

    /**
     * Métodos estáticos para estadísticas
     */
    public static function getGlobalStats(): array
    {
        $categoriesWithServicesCount = Category::whereHas('services')->withCount('services')->get();
        $avgServices = $categoriesWithServicesCount->isEmpty()
            ? 0
            : round($categoriesWithServicesCount->avg('services_count'), 1);

        return [
            'total_categories' => static::count(),
            'active_categories' => static::active()->count(),
            'inactive_categories' => static::inactive()->count(),
            'categories_with_services' => static::withServices()->count(),
            'empty_categories' => static::withoutServices()->count(),
            'recent_categories' => static::where('created_at', '>=', Carbon::now()->subDays(30))->count(),
            'avg_services_per_category' => $avgServices,
        ];
    }

    public static function getMostUsed(): ?array
    {
        $category = static::withCount('services')
            ->orderBy('services_count', 'desc')
            ->first();

        if (!$category) {
            return null;
        }

        return [
            'name' => $category->name,
            'services_count' => $category->services_count
        ];
    }

    public static function getServicesDistribution(): \Illuminate\Support\Collection
    {
        $colors = [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6',
            '#06b6d4',
            '#84cc16',
            '#f97316',
            '#ec4899',
            '#6366f1'
        ];

        return static::withCount('services')
            ->get()
            ->filter(function ($category) {
                return $category->services_count > 0;
            })
            ->sortByDesc('services_count')
            ->take(10)
            ->values()
            ->map(function ($category, $index) use ($colors) {
                return [
                    'name' => $category->name,
                    'value' => $category->services_count,
                    'color' => $colors[$index % count($colors)],
                ];
            });
    }

    public static function getMonthlyGrowth(): \Illuminate\Support\Collection
    {
        return static::selectRaw("TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as count")
            ->where('created_at', '>=', Carbon::now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'count' => (int) $item->count,
                ];
            });
    }

    /**
     * Método para exportar datos
     */
    public function toExportArray(): array
    {
        return [
            'ID' => $this->id,
            'Nombre' => $this->name,
            'Descripción' => $this->description,
            'Estado' => $this->status_label,
            'Servicios' => $this->services_count ?? $this->services()->count(),
            'Orden' => $this->sort_order,
            'Puntuación' => $this->performance_score,
            'Fecha de Creación' => $this->created_at?->format('Y-m-d H:i:s'),
            'Última Actualización' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
