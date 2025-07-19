import { ServiceFilters, ServiceResource } from '@/interfaces/service';
import { debounce } from 'lodash';
import { useCallback, useMemo, useState } from 'react';

interface UseServiceFiltersReturn {
    filters: ServiceFilters;
    setFilters: (filters: ServiceFilters) => void;
    filteredServices: ServiceResource[];
    clearFilters: () => void;
    hasActiveFilters: boolean;
    updateFilter: (key: keyof ServiceFilters, value: any) => void;
    debouncedUpdateFilter: (key: keyof ServiceFilters, value: any) => void;
}

export function useServiceFilters(services: ServiceResource[]): UseServiceFiltersReturn {
    const [filters, setFilters] = useState<ServiceFilters>({
        search: '',
        category_id: null,
        service_type: null,
        is_active: null,
    });

    // Debounced filter update for search
    const debouncedUpdateFilter = useCallback(
        debounce((key: keyof ServiceFilters, value: any) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        }, 300),
        [],
    );

    const updateFilter = useCallback((key: keyof ServiceFilters, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
            search: '',
            category_id: null,
            service_type: null,
            is_active: null,
        });
    }, []);

    const hasActiveFilters = useMemo(() => {
        return Boolean(filters.search || filters.category_id || filters.service_type || filters.is_active !== null);
    }, [filters]);

    const filteredServices = useMemo(() => {
        return services.filter((service) => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchesSearch =
                    service.name.toLowerCase().includes(searchLower) ||
                    service.description?.toLowerCase().includes(searchLower) ||
                    service.category.name.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }

            // Category filter
            if (filters.category_id && service.category.id !== filters.category_id) {
                return false;
            }

            // Service type filter
            if (filters.service_type && service.service_type !== filters.service_type) {
                return false;
            }

            // Status filter
            if (filters.is_active !== null && service.is_active !== filters.is_active) {
                return false;
            }

            return true;
        });
    }, [services, filters]);

    return {
        filters,
        setFilters,
        filteredServices,
        clearFilters,
        hasActiveFilters,
        updateFilter,
        debouncedUpdateFilter,
    };
}
