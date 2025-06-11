export interface PlanResource extends PlanFormData {
    id: string;
    created_at: string;
    updated_at: string;
}

export type PlanFormData = {
    name: string;
    description: string;
    price_monthly: number;
    price_annual: number;
    currency: string;
    is_free: boolean;
    is_popular: boolean;
    features: string[];
    trial_days: number;
};
