// resources/js/interfaces/service.ts
export interface ServiceResource {
    id: string;
    name: string;
    description: string | null;
    notes: string | null;
    category: {
        id: string;
        name: string;
        is_active: boolean;
    };
    professionals_count: number;
    price: number | null;
    duration: number;
    preparation_time: number;
    post_service_time: number;
    service_type: string;
    service_type_label: string;
    service_type_icon: string;
    service_type_description: string;
    allows_in_person: boolean;
    allows_video_call: boolean;
    is_active: boolean;
}

export interface ServiceFormData {
    name: string;
    description: string;
    notes: string;
    category_id: string;
    price: number;
    duration: number;
    preparation_time: number;
    post_service_time: number;
    service_type: string;
    is_active: boolean;
}

export interface ServiceStatistics {
    total: number;
    active: number;
    inactive: number;
    by_type: {
        in_person: number;
        video_call: number;
        hybrid: number;
    };
    categories_count: number;
}

export interface ServiceFilters {
    search: string;
    category_id: string | null;
    service_type: string | null;
    is_active: boolean | null;
}

export interface ServicePublicData {
    services: ServiceResource[];
    company_allows_video_calls: boolean;
    available_service_types: Record<string, string>;
}

// Enum for service types
export enum ServiceType {
    IN_PERSON = 'in_person',
    VIDEO_CALL = 'video_call',
    HYBRID = 'hybrid',
}

export const SERVICE_TYPE_OPTIONS = [
    { value: ServiceType.IN_PERSON, label: 'Presencial', icon: '🏢' },
    { value: ServiceType.VIDEO_CALL, label: 'Videollamada', icon: '📹' },
    { value: ServiceType.HYBRID, label: 'Híbrido', icon: '🔄' },
];
