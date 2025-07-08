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
export interface SubscriptionStatusData {
    status: string;
    status_label: string;
    status_color: string;
    mp_status?: string;
    is_active: boolean;
    is_in_trial: boolean;
    is_trial_expired: boolean;
    is_expired: boolean;
    needs_payment_setup: boolean;
    trial_days_remaining: number;
    trial_ends_at: string;
    ends_at: string;
    next_billing_date: string;
    current_price: number;
    plan_name: string;
    is_monthly: boolean;
    can_cancel: boolean;
    can_upgrade: boolean;
    can_downgrade: boolean;
    can_reactivate: boolean;
}
