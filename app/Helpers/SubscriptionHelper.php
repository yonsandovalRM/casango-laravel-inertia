<?php

namespace App\Helpers;

use App\Models\Tenant;
use App\Http\Resources\SubscriptionStatusResource;

class SubscriptionHelper
{
    public static function getCurrentSubscriptionStatus(?Tenant $tenant = null): ?array
    {
        // Solo funciona en contexto de tenant
        if (!function_exists('tenant') || !tenant()) {
            return null;
        }

        $tenant = $tenant ?? tenant();

        $subscription = $tenant->subscriptions()
            ->where('is_active', true)
            ->with('plan')
            ->first();

        if (!$subscription) {
            return null;
        }

        return (new SubscriptionStatusResource($subscription))->toArray(request());
    }

    public static function canAccessFeature(string $feature, ?Tenant $tenant = null): bool
    {
        if (!function_exists('tenant') || !tenant()) {
            return false;
        }

        $tenant = $tenant ?? tenant();

        $subscription = $tenant->subscriptions()
            ->where('is_active', true)
            ->with('plan')
            ->first();

        if (!$subscription || !$subscription->canAccess()) {
            return false;
        }

        // Para planes gratuitos, verificar features limitadas
        if ($subscription->plan->is_free) {
            $freeFeatures = config('subscription.free_plan_features', []);
            return in_array($feature, $freeFeatures);
        }

        return true;
    }

    public static function getFeatureLimits(?Tenant $tenant = null): array
    {
        if (!function_exists('tenant') || !tenant()) {
            return [];
        }

        $tenant = $tenant ?? tenant();

        $subscription = $tenant->subscriptions()
            ->where('is_active', true)
            ->with('plan')
            ->first();

        if (!$subscription) {
            return config('subscription.no_subscription_limits', []);
        }

        $planLimits = config("subscription.plan_limits.{$subscription->plan->id}", []);

        return array_merge(
            config('subscription.default_limits', []),
            $planLimits
        );
    }

    public static function checkLimit(string $limitType, int $currentCount, ?Tenant $tenant = null): bool
    {
        $limits = self::getFeatureLimits($tenant);
        $limit = $limits[$limitType] ?? -1;

        // -1 significa sin límite
        return $limit === -1 || $currentCount < $limit;
    }

    public static function getRemainingCount(string $limitType, int $currentCount, ?Tenant $tenant = null): int
    {
        $limits = self::getFeatureLimits($tenant);
        $limit = $limits[$limitType] ?? -1;

        if ($limit === -1) {
            return PHP_INT_MAX; // Sin límite
        }

        return max(0, $limit - $currentCount);
    }
}
