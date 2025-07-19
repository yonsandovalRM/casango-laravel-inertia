export interface CategoryResource {
    id: string;
    name: string;
    is_active: boolean;

    // Contadores
    services_count?: number;
    total_services_count?: number;
    active_services_count?: number;

    // Fechas
    created_at?: string;
    updated_at?: string;
    created_at_human?: string;
    updated_at_human?: string;

    // Metadatos
    has_services?: boolean;
    performance_score?: number;
    status_label?: string;
    status_color?: 'success' | 'secondary' | 'destructive';

    // URLs para acciones
    urls?: {
        edit: string;
        delete: string;
    };
}

export type CategoryFormData = {
    name: string;
    is_active: boolean;
};

export interface CategoryStats {
    total_categories: number;
    active_categories: number;
    inactive_categories: number;
    categories_with_services: number;
    empty_categories: number;
    total_services: number;
    avg_services_per_category: number;
    most_used_category: {
        name: string;
        services_count: number;
    } | null;
    recent_categories: number;
}

export interface CategoryChartData {
    categories_by_status: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    services_distribution: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    monthly_growth: Array<{
        month: string;
        count: number;
    }>;
}
