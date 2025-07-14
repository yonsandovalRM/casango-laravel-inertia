<?php

namespace App\Events;

use App\Models\Subscription;
use App\Enums\SubscriptionStatus;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SubscriptionUpdated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Subscription $subscription,
        public SubscriptionStatus $previousStatus
    ) {}
}
