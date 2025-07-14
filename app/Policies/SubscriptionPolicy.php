<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Subscription;

class SubscriptionPolicy
{
    public function view(User $user, Subscription $subscription): bool
    {
        return $user->tenant_id === $subscription->tenant_id;
    }

    public function manage(User $user, Subscription $subscription): bool
    {
        return $user->tenant_id === $subscription->tenant_id &&
            $user->hasRole(['owner', 'admin']);
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
            ($subscription->isCancelled() || $subscription->isPaused());
    }
}
