export interface PlanResource {
    id: string;
    name: string;
    description: string;
    price_monthly: number;
    price_annual: number;
    currency: string;
    features: string[];
    is_free: boolean;
    is_popular: boolean;
    trial_days: number;
}
