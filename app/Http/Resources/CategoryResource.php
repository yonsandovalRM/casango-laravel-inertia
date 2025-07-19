<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'is_active' => $this->is_active,
            'services_count' => $this->whenCounted('services'),
            'total_services_count' => $this->whenCounted('services', $this->total_services_count ?? 0),
            'active_services_count' => $this->whenCounted('services', $this->services_count ?? 0),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            'created_at_human' => $this->created_at?->diffForHumans(),
            'updated_at_human' => $this->updated_at?->diffForHumans(),

            // Estadísticas adicionales
            'has_services' => $this->whenLoaded('services', function () {
                return $this->services->count() > 0;
            }),

            'performance_score' => $this->calculatePerformanceScore(),

            // Metadatos útiles
            'status_label' => $this->is_active ? 'Activa' : 'Inactiva',
            'status_color' => $this->is_active ? 'success' : 'secondary',

            // URLs relacionadas
            'urls' => [
                'edit' => route('categories.update', $this->id),
                'delete' => route('categories.destroy', $this->id),
            ],
        ];
    }

    /**
     * Calculate performance score based on various metrics.
     */
    private function calculatePerformanceScore(): int
    {
        $score = 0;

        // Puntos por estar activa
        if ($this->is_active) {
            $score += 30;
        }

        // Puntos por tener servicios
        $servicesCount = $this->services_count ?? 0;
        if ($servicesCount > 0) {
            $score += min($servicesCount * 10, 50); // Máximo 50 puntos
        }

        // Puntos por antigüedad (más tiempo = más estable)
        if ($this->created_at) {
            $daysOld = $this->created_at->diffInDays(now());
            $score += min($daysOld / 10, 20); // Máximo 20 puntos
        }

        return min($score, 100); // Máximo 100 puntos
    }
}
