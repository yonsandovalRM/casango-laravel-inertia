import { usePage } from '@inertiajs/react';

interface FeatureLimits {
    max_professionals: number;
    max_services: number;
    max_bookings_per_month: number;
    max_clients: number;
    advanced_reports: boolean;
    custom_branding: boolean;
    api_access: boolean;
    email_notifications: boolean;
    sms_notifications: boolean;
}

export function useSubscriptionLimits() {
    const { featureLimits, subscription } = usePage().props as any;

    const checkLimit = (limitType: keyof FeatureLimits, currentCount: number): boolean => {
        if (!featureLimits) return false;

        const limit = featureLimits[limitType];
        // -1 significa sin límite
        return limit === -1 || currentCount < limit;
    };

    const getRemainingCount = (limitType: keyof FeatureLimits, currentCount: number): number => {
        if (!featureLimits) return 0;

        const limit = featureLimits[limitType];
        if (limit === -1) return Infinity;

        return Math.max(0, limit - currentCount);
    };

    const hasFeature = (feature: keyof FeatureLimits): boolean => {
        if (!featureLimits) return false;
        return !!featureLimits[feature];
    };

    const canAccess = (): boolean => {
        return subscription?.can_access ?? false;
    };

    const needsUpgrade = (): boolean => {
        return subscription?.needs_payment ?? false;
    };

    return {
        limits: featureLimits as FeatureLimits,
        subscription,
        checkLimit,
        getRemainingCount,
        hasFeature,
        canAccess,
        needsUpgrade,
    };
}
