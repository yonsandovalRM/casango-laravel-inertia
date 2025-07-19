<?php

namespace App\Services;

use App\Enums\ServiceType;
use App\Models\Category;
use App\Models\Company;
use App\Models\Service;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ServiceService
{
    /**
     * Obtener todos los servicios activos con categorías
     */
    public function getActiveServices(): Collection
    {
        return Service::where('is_active', true)
            ->with(['category', 'professionals'])
            ->orderBy('name')
            ->get();
    }

    /**
     * Obtener todos los servicios (activos e inactivos) para el dashboard
     */
    public function getAllServices(): Collection
    {
        return Service::with(['category', 'professionals'])
            ->orderBy('is_active', 'desc')
            ->orderBy('name')
            ->get();
    }

    /**
     * Obtener servicios para el frontend público
     */
    public function getServicesForPublic(): array
    {
        $services = $this->getActiveServices();
        $company = Company::first();

        return [
            'services' => $services,
            'company_allows_video_calls' => $company?->allows_video_calls ?? false,
            'available_service_types' => $this->getAvailableServiceTypes($company),
        ];
    }

    /**
     * Crear un nuevo servicio
     */
    public function createService(array $data): Service
    {
        // Validar que el tipo de servicio sea compatible con la configuración de la empresa
        $this->validateServiceTypeCompatibility($data['service_type'] ?? ServiceType::IN_PERSON->value);

        return DB::transaction(function () use ($data) {
            return Service::create([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'notes' => $data['notes'] ?? null,
                'category_id' => $data['category_id'],
                'price' => $data['price'] ?? null,
                'duration' => $data['duration'],
                'preparation_time' => $data['preparation_time'] ?? 0,
                'post_service_time' => $data['post_service_time'] ?? 0,
                'service_type' => $data['service_type'] ?? ServiceType::IN_PERSON->value,
                'is_active' => $data['is_active'] ?? true,
            ]);
        });
    }

    /**
     * Actualizar un servicio existente
     */
    public function updateService(Service $service, array $data): Service
    {
        // Validar que el tipo de servicio sea compatible con la configuración de la empresa
        if (isset($data['service_type'])) {
            $this->validateServiceTypeCompatibility($data['service_type']);
        }

        return DB::transaction(function () use ($service, $data) {
            $service->update(array_filter($data, fn($value) => $value !== null));
            return $service->fresh(['category', 'professionals']);
        });
    }

    /**
     * Eliminar un servicio (soft delete)
     */
    public function deleteService(Service $service): bool
    {
        return DB::transaction(function () use ($service) {
            // Verificar si tiene reservas activas
            $hasActiveBookings = $service->bookings()
                ->whereIn('status', ['pending', 'confirmed'])
                ->whereDate('date', '>=', now())
                ->exists();

            if ($hasActiveBookings) {
                throw new \Exception(__('service.cannot_delete_with_active_bookings'));
            }

            return $service->delete();
        });
    }

    /**
     * Obtener servicios por categoría
     */
    public function getServicesByCategory(?string $categoryId = null): Collection
    {
        $query = Service::where('is_active', true)->with(['category', 'professionals']);

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        return $query->orderBy('name')->get();
    }

    /**
     * Obtener servicios disponibles para videollamada
     */
    public function getVideoCallServices(): Collection
    {
        return Service::where('is_active', true)
            ->whereIn('service_type', [ServiceType::VIDEO_CALL->value, ServiceType::HYBRID->value])
            ->with(['category', 'professionals'])
            ->orderBy('name')
            ->get();
    }

    /**
     * Obtener servicios disponibles presenciales
     */
    public function getInPersonServices(): Collection
    {
        return Service::where('is_active', true)
            ->whereIn('service_type', [ServiceType::IN_PERSON->value, ServiceType::HYBRID->value])
            ->with(['category', 'professionals'])
            ->orderBy('name')
            ->get();
    }

    /**
     * Obtener servicios con filtros avanzados
     */
    public function getFilteredServices(array $filters): Collection
    {
        $query = Service::with(['category', 'professionals']);

        // Filtro de búsqueda
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($categoryQuery) use ($search) {
                        $categoryQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filtro por categoría
        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        // Filtro por tipo de servicio
        if (!empty($filters['service_type'])) {
            $query->where('service_type', $filters['service_type']);
        }

        // Filtro por estado activo
        if (isset($filters['is_active']) && $filters['is_active'] !== null) {
            $query->where('is_active', $filters['is_active']);
        }

        // Filtro por rango de precios
        if (!empty($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (!empty($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        // Filtro por duración
        if (!empty($filters['min_duration'])) {
            $query->where('duration', '>=', $filters['min_duration']);
        }

        if (!empty($filters['max_duration'])) {
            $query->where('duration', '<=', $filters['max_duration']);
        }

        return $query->orderBy('name')->get();
    }

    /**
     * Validar compatibilidad del tipo de servicio con la empresa
     */
    private function validateServiceTypeCompatibility(string $serviceType): void
    {
        $company = Company::first();
        $type = ServiceType::from($serviceType);

        if ($type->allowsVideoCall() && !($company?->allows_video_calls ?? false)) {
            throw new \Exception(__('service.video_calls_not_enabled_in_company'));
        }
    }

    /**
     * Obtener tipos de servicio disponibles según configuración de empresa
     */
    private function getAvailableServiceTypes(?Company $company): array
    {
        $allowsVideoCalls = $company?->allows_video_calls ?? false;

        if (!$allowsVideoCalls) {
            return [ServiceType::IN_PERSON->value => ServiceType::IN_PERSON->label()];
        }

        return collect(ServiceType::cases())->mapWithKeys(function ($type) {
            return [$type->value => $type->label()];
        })->toArray();
    }

    /**
     * Obtener estadísticas de servicios
     */
    public function getServiceStatistics(): array
    {
        $total = Service::count();
        $active = Service::where('is_active', true)->count();
        $inPerson = Service::where('service_type', ServiceType::IN_PERSON->value)->count();
        $videoCall = Service::where('service_type', ServiceType::VIDEO_CALL->value)->count();
        $hybrid = Service::where('service_type', ServiceType::HYBRID->value)->count();

        return [
            'total' => $total,
            'active' => $active,
            'inactive' => $total - $active,
            'by_type' => [
                'in_person' => $inPerson,
                'video_call' => $videoCall,
                'hybrid' => $hybrid,
            ],
            'categories_count' => Category::whereHas('services')->count(),
            'avg_duration' => Service::avg('duration') ?? 0,
            'avg_price' => Service::whereNotNull('price')->avg('price') ?? 0,
            'total_professionals' => Service::withCount('professionals')->get()->sum('professionals_count'),
        ];
    }

    /**
     * Obtener estadísticas filtradas
     */
    public function getFilteredStatistics(array $filters): array
    {
        $services = $this->getFilteredServices($filters);

        return [
            'total_filtered' => $services->count(),
            'active_filtered' => $services->where('is_active', true)->count(),
            'avg_duration_filtered' => $services->avg('duration') ?? 0,
            'avg_price_filtered' => $services->whereNotNull('price')->avg('price') ?? 0,
            'categories_filtered' => $services->pluck('category.id')->unique()->count(),
        ];
    }

    /**
     * Buscar servicios por término
     */
    public function searchServices(string $term): Collection
    {
        return Service::where('is_active', true)
            ->where(function ($query) use ($term) {
                $query->where('name', 'like', "%{$term}%")
                    ->orWhere('description', 'like', "%{$term}%")
                    ->orWhereHas('category', function ($categoryQuery) use ($term) {
                        $categoryQuery->where('name', 'like', "%{$term}%");
                    });
            })
            ->with(['category', 'professionals'])
            ->orderBy('name')
            ->get();
    }

    /**
     * Verificar si un servicio puede ser videollamada
     */
    public function canBeVideoCall(Service $service): bool
    {
        $serviceType = ServiceType::from($service->service_type);
        $company = Company::first();

        return $serviceType->allowsVideoCall() && ($company?->allows_video_calls ?? false);
    }

    /**
     * Verificar si un servicio puede ser presencial
     */
    public function canBeInPerson(Service $service): bool
    {
        $serviceType = ServiceType::from($service->service_type);
        return $serviceType->allowsInPerson();
    }

    /**
     * Obtener servicios más populares
     */
    public function getPopularServices(int $limit = 5): Collection
    {
        return Service::where('is_active', true)
            ->withCount(['bookings' => function ($query) {
                $query->where('status', 'confirmed')
                    ->where('created_at', '>=', now()->subMonths(3));
            }])
            ->orderBy('bookings_count', 'desc')
            ->limit($limit)
            ->with(['category', 'professionals'])
            ->get();
    }

    /**
     * Obtener servicios por profesional
     */
    public function getServicesByProfessional(string $professionalId): Collection
    {
        return Service::whereHas('professionals', function ($query) use ($professionalId) {
            $query->where('professional_id', $professionalId);
        })
            ->where('is_active', true)
            ->with(['category'])
            ->orderBy('name')
            ->get();
    }
}
