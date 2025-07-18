import { ServiceResource } from '@/interfaces/service';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';

export const useServices = (searchTerm: string, category: string, sortBy: string) => {
    const [services, setServices] = useState<ServiceResource[]>([]);
    const [highlightedServices, setHighlightedServices] = useState<ServiceResource[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getServices();
    }, []);

    const getServices = async () => {
        const response = await axios.get(route('services.get-services'));
        setServices(response.data.services);
        setHighlightedServices(response.data.slice(0, 4));
    };

    const categories = useMemo(() => {
        return Array.from(new Set(services.map((service) => service.category.name)));
    }, [services]);

    const filteredServices = useMemo(() => {
        let filtered = services;

        // Filtrar por término de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(
                (service) =>
                    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    service.category.name.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        // Filtrar por categoría
        if (category && category !== 'all') {
            filtered = filtered.filter((service) => service.category.name === category);
        }

        // Ordenar
        filtered = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'price':
                    return Number(a.price) - Number(b.price);
                case 'price_desc':
                    return Number(b.price) - Number(a.price);
                case 'duration':
                    return a.duration - b.duration;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [services, searchTerm, category, sortBy]);

    return {
        services,
        categories,
        filteredServices,
        highlightedServices,
        loading,
    };
};
