<?php

namespace App\Providers;

use App\Events\SubscriptionCreated;
use App\Events\SubscriptionUpdated;
use App\Events\PaymentFailed;
use App\Listeners\SendSubscriptionNotifications;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        SubscriptionCreated::class => [
            SendSubscriptionNotifications::class . '@handleSubscriptionCreated',
        ],
        SubscriptionUpdated::class => [
            SendSubscriptionNotifications::class . '@handleSubscriptionUpdated',
        ],
        PaymentFailed::class => [
            SendSubscriptionNotifications::class . '@handlePaymentFailed',
        ],
    ];
}
