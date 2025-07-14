<?php

namespace App\Listeners;

use App\Events\SubscriptionCreated;
use App\Events\SubscriptionUpdated;
use App\Events\PaymentFailed;
use App\Mail\SubscriptionCreatedMail;
use App\Mail\SubscriptionActivatedMail;
use App\Mail\PaymentFailedMail;
use App\Mail\TrialExpiringMail;
use Illuminate\Support\Facades\Mail;

class SendSubscriptionNotifications
{
    public function handleSubscriptionCreated(SubscriptionCreated $event): void
    {
        $subscription = $event->subscription;

        Mail::to($subscription->tenant->email)
            ->send(new SubscriptionCreatedMail($subscription));
    }

    public function handleSubscriptionUpdated(SubscriptionUpdated $event): void
    {
        $subscription = $event->subscription;
        $previousStatus = $event->previousStatus;

        // Suscripción activada
        if (
            $subscription->status === \App\Enums\SubscriptionStatus::ACTIVE &&
            $previousStatus !== \App\Enums\SubscriptionStatus::ACTIVE
        ) {

            Mail::to($subscription->tenant->email)
                ->send(new SubscriptionActivatedMail($subscription));
        }
    }

    public function handlePaymentFailed(PaymentFailed $event): void
    {
        $subscription = $event->subscription;

        Mail::to($subscription->tenant->email)
            ->send(new PaymentFailedMail($subscription));
    }
}
