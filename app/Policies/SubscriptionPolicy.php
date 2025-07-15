<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Subscription;

class SubscriptionPolicy
{
    public function view(User $user, Subscription $subscription): bool
    {
        // En contexto de tenant, verificar que pertenece al tenant actual
        if (function_exists('tenant') && tenant()) {
            return tenant()->id === $subscription->tenant_id;
        }

        // En contexto central, verificar permisos de administrador
        return $user->hasRole(['super-admin', 'admin']);
    }

    public function manage(User $user, Subscription $subscription): bool
    {
        if (function_exists('tenant') && tenant()) {
            return tenant()->id === $subscription->tenant_id &&
                $user->hasRole(['owner', 'admin']);
        }

        return $user->hasRole(['super-admin', 'admin']);
    }

    public function cancel(User $user, Subscription $subscription): bool
    {
        return $this->manage($user, $subscription) &&
            $subscription->isActive() &&
            !$subscription->isCancelled();
    }

    public function reactivate(User $user, Subscription $subscription): bool
    {
        return $this->manage($user, $subscription) &&
            ($subscription->isCancelled() || $subscription->isPaused() || $subscription->needsPayment());
    }

    public function create(User $user): bool
    {
        if (function_exists('tenant') && tenant()) {
            return $user->hasRole(['owner', 'admin']);
        }

        return $user->hasRole(['super-admin', 'admin']);
    }
}
