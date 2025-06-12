import { PlanResource } from './plan';

export interface TenantResource {
    id: string;
    name: string;
    email: string;
    category: string;
    plan: PlanResource;
}
