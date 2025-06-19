<?php
// app/Traits/GeneratesSubdomainSuggestions.php

namespace App\Traits;

use App\Models\Tenant;
use Illuminate\Support\Str;

trait GeneratesSubdomainSuggestions
{
    /**
     * Genera sugerencias de subdominio cuando el principal está ocupado
     * 
     * @param string $baseSubdomain Subdominio original solicitado
     * @param string $mainDomain Dominio principal (ej: 'micita.cl')
     * @param int $count Número de sugerencias a generar
     * @return array
     */
    public function generateSubdomainSuggestions(string $baseSubdomain, string $mainDomain, int $count = 5): array
    {
        $suggestions = [];
        $attempts = 0;
        $maxAttempts = $count * 3; // Límite para evitar bucles infinitos

        $baseSubdomain = Str::slug($baseSubdomain); // Normaliza el subdominio

        while (count($suggestions) < $count && $attempts < $maxAttempts) {
            $attempts++;

            $variation = $this->generateSubdomainVariation($baseSubdomain, count($suggestions));
            $fullDomain = "{$variation}.{$mainDomain}";

            if (!$this->subdomainExists($fullDomain)) {
                $suggestions[] = $variation;
            }
        }

        return $suggestions;
    }

    /**
     * Verifica si un subdominio ya existe
     */
    protected function subdomainExists(string $fullDomain): bool
    {
        return Tenant::where('domain', $fullDomain)->exists();
    }

    /**
     * Genera variaciones del subdominio base
     */
    protected function generateSubdomainVariation(string $base, int $attempt): string
    {
        // Primero intentamos añadir números secuenciales
        if ($attempt < 3) {
            return $base . ($attempt + 2);
        }

        // Luego probamos con sufijos comunes
        $suffixes = ['app', 'web', 'online', 'mx', 'digital', 'site'];
        if ($attempt < 6) {
            return $base . '-' . $suffixes[$attempt - 3];
        }

        // Después con prefijos comunes
        $prefixes = ['mi', 'tu', 'nuevo', 'la', 'el'];
        if ($attempt < 9) {
            return $prefixes[$attempt - 6] . '-' . $base;
        }

        // Finalmente combinaciones aleatorias
        return $base . '-' . Str::random(3);
    }

    /**
     * Formatea las sugerencias con el dominio principal
     */
    public function formatSuggestions(array $subdomains, string $mainDomain): array
    {
        return array_map(fn($sub) => "{$sub}.{$mainDomain}", $subdomains);
    }
}
