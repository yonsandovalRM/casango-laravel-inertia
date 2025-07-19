<?php

namespace App\Http\Controllers;

use App\Http\Requests\Categories\BulkCategoryRequest;
use App\Http\Requests\Categories\StoreCategoryRequest;
use App\Http\Requests\Categories\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\Service;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource with statistics.
     */
    public function index()
    {
        // Obtener categorías con conteo de servicios
        $categories = Category::withCount(['services' => function ($query) {
            $query->where('is_active', true);
        }])
            ->withCount('services as total_services_count')
            ->orderBy('name')
            ->get();

        // Estadísticas generales
        $stats = [
            'total_categories' => Category::count(),
            'active_categories' => Category::where('is_active', true)->count(),
            'inactive_categories' => Category::where('is_active', false)->count(),
            'categories_with_services' => Category::whereHas('services')->count(),
            'empty_categories' => Category::whereDoesntHave('services')->count(),
            'total_services' => Service::count(),
            'avg_services_per_category' => $this->getAverageServicesPerCategory(),
            'most_used_category' => $this->getMostUsedCategory(),
            'recent_categories' => Category::where('created_at', '>=', now()->subDays(30))->count(),
        ];

        // Datos para gráficos
        $chartData = [
            'categories_by_status' => [
                ['name' => 'Activas', 'value' => $stats['active_categories'], 'color' => '#10b981'],
                ['name' => 'Inactivas', 'value' => $stats['inactive_categories'], 'color' => '#ef4444'],
            ],
            'services_distribution' => $this->getServicesDistribution(),
            'monthly_growth' => $this->getMonthlyGrowth(),
        ];

        return Inertia::render('categories/index', [
            'categories' => CategoryResource::collection($categories)->toArray(request()),
            'stats' => $stats,
            'chartData' => $chartData,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        $category = Category::create($request->validated());

        return redirect()
            ->route('categories.index')
            ->with('success', __('category.created'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());

        return redirect()
            ->route('categories.index')
            ->with('success', __('category.updated'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        // Verificar si tiene servicios asociados
        if ($category->services()->count() > 0) {
            return redirect()
                ->route('categories.index')
                ->with('error', __('category.cannot_delete_with_services'));
        }

        $category->delete();

        return redirect()
            ->route('categories.index')
            ->with('success', __('category.deleted'));
    }

    /**
     * Store category inline (for forms).
     */
    public function storeInline(StoreCategoryRequest $request)
    {
        $category = Category::create($request->validated());

        return redirect()
            ->back()
            ->with('success', __('category.created'));
    }

    /**
     * Toggle category status.
     */
    public function toggleStatus(Category $category)
    {
        $category->update(['is_active' => !$category->is_active]);

        return redirect()
            ->route('categories.index')
            ->with('success', __('category.status_updated'));
    }

    /**
     * Duplicate a category.
     */
    public function duplicate(Category $category)
    {
        $newCategory = $category->duplicate();

        return redirect()
            ->route('categories.index')
            ->with('success', __('category.duplicated'));
    }

    /**
     * Bulk delete categories.
     */
    public function bulkDelete(BulkCategoryRequest $request)
    {
        $categoryIds = $request->validated()['category_ids'];

        Category::whereIn('id', $categoryIds)->delete();

        return response()->json([
            'message' => __('categories.bulk_deleted'),
            'count' => count($categoryIds)
        ]);
    }

    /**
     * Bulk toggle status.
     */
    public function bulkToggleStatus(BulkCategoryRequest $request)
    {
        $data = $request->validated();
        $categoryIds = $data['category_ids'];
        $isActive = $data['action'] === 'activate';

        Category::whereIn('id', $categoryIds)->update(['is_active' => $isActive]);

        return response()->json([
            'message' => __('categories.bulk_status_updated'),
            'count' => count($categoryIds)
        ]);
    }

    /**
     * Get analytics data for categories.
     */
    public function analytics()
    {
        $analytics = [
            'performance' => $this->getCategoryPerformance(),
            'trends' => $this->getCategoryTrends(),
            'usage_patterns' => $this->getUsagePatterns(),
        ];

        return response()->json($analytics);
    }

    /**
     * Export categories data.
     */
    public function export()
    {
        $categories = Category::withCount('services')->get();

        // Aquí puedes implementar la lógica de exportación (Excel, CSV, etc.)
        // Por ahora retornamos JSON
        return response()->json($categories);
    }

    /**
     * Get the average services per category.
     */
    private function getAverageServicesPerCategory()
    {
        $categoriesWithServices = Category::whereHas('services')->withCount('services')->get();

        if ($categoriesWithServices->isEmpty()) {
            return 0;
        }

        return round($categoriesWithServices->avg('services_count'), 1);
    }
    private function getMostUsedCategory()
    {
        $category = Category::withCount('services')
            ->orderBy('services_count', 'desc')
            ->first();

        return $category ? [
            'name' => $category->name,
            'services_count' => $category->services_count
        ] : null;
    }

    /**
     * Get services distribution across categories.
     */
    private function getServicesDistribution()
    {
        return Category::withCount('services')
            ->get()
            ->filter(function ($category) {
                return $category->services_count > 0;
            })
            ->sortByDesc('services_count')
            ->take(10)
            ->values()
            ->map(function ($category, $index) {
                return [
                    'name' => $category->name,
                    'value' => $category->services_count,
                    'color' => $this->generateColor($category->id),
                ];
            });
    }

    /**
     * Get monthly growth data.
     */
    private function getMonthlyGrowth()
    {
        return Category::selectRaw("TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as count")
            ->where('created_at', '>=', now()->subMonths(12))
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
     * Get category performance metrics.
     */
    private function getCategoryPerformance()
    {
        return Category::withCount(['services' => function ($query) {
            $query->where('is_active', true);
        }])
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'services_count' => $category->services_count,
                    'is_active' => $category->is_active,
                    'created_at' => $category->created_at,
                ];
            });
    }

    /**
     * Get category trends.
     */
    private function getCategoryTrends()
    {
        return [
            'growth_rate' => $this->calculateGrowthRate(),
            'usage_frequency' => $this->getUsageFrequency(),
            'seasonal_patterns' => $this->getSeasonalPatterns(),
        ];
    }

    /**
     * Get usage patterns.
     */
    private function getUsagePatterns()
    {
        return [
            'peak_hours' => $this->getPeakUsageHours(),
            'popular_combinations' => $this->getPopularCombinations(),
            'user_preferences' => $this->getUserPreferences(),
        ];
    }

    /**
     * Calculate growth rate.
     */
    private function calculateGrowthRate()
    {
        $currentMonth = Category::whereMonth('created_at', now()->month)->count();
        $previousMonth = Category::whereMonth('created_at', now()->subMonth()->month)->count();

        if ($previousMonth == 0) return 0;

        return round((($currentMonth - $previousMonth) / $previousMonth) * 100, 2);
    }

    /**
     * Get usage frequency data.
     */
    private function getUsageFrequency()
    {
        // Implementar lógica basada en bookings o servicios más utilizados
        return Category::withCount('services')
            ->orderBy('services_count', 'desc')
            ->limit(5)
            ->get()
            ->pluck('services_count', 'name');
    }

    /**
     * Get seasonal patterns.
     */
    private function getSeasonalPatterns()
    {
        return Category::selectRaw('EXTRACT(MONTH FROM created_at) as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('count', 'month');
    }

    /**
     * Get peak usage hours (placeholder).
     */
    private function getPeakUsageHours()
    {
        // Implementar basado en datos de bookings
        return collect(range(0, 23))->mapWithKeys(function ($hour) {
            return [$hour => rand(0, 100)]; // Datos de ejemplo
        });
    }

    /**
     * Get popular category combinations.
     */
    private function getPopularCombinations()
    {
        // Implementar lógica basada en servicios que comparten categorías
        return [];
    }

    /**
     * Get user preferences.
     */
    private function getUserPreferences()
    {
        // Implementar lógica basada en bookings de usuarios
        return [];
    }

    /**
     * Generate color for category.
     */
    private function generateColor($id)
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

        // Convertir UUID a número usando hash
        $numericId = crc32($id);

        return $colors[abs($numericId) % count($colors)];
    }
}
