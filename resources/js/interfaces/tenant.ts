import { PlanResource } from './plan';

export interface TenantResource {
    id: string;
    name: string;
    email: string;
    category: string;
    plan: PlanResource;
    domain: string;
    url: string;
    created_at: string;
    updated_at: string;
}

export const MOCK_CATEGORIES = [
    {
        id: 'restaurant',
        name: 'Restaurante',
    },
    {
        id: 'bar',
        name: 'Bar',
    },
    {
        id: 'hotel',
        name: 'Hotel',
    },
    {
        id: 'other',
        name: 'Otro',
    },
];
