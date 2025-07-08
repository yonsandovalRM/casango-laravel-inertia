import { PlanResource } from './plan';

export interface SubscriptionResource {
    id: string;
    tenant_id: string;
    plan: PlanResource;
    plan_id: string;
    price: number;
    currency: string;
    trial_ends_at: string;
    ends_at: string;
    payment_status: string;
    is_monthly: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
