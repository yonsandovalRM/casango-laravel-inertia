export interface ServiceResource {
    id: string;
    name: string;
    description: string;
    notes: string;
    category: string;
    price: number;
    duration: number;
    preparation_time: number;
    post_service_time: number;
    is_active: boolean;
}

export type ServiceFormData = {
    name: string;
    description: string;
    notes: string;
    category: string;
    price: number;
    duration: number;
    preparation_time: number;
    post_service_time: number;
    is_active: boolean;
};
