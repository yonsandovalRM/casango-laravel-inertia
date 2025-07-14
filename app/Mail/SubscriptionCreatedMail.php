<?php

namespace App\Mail;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SubscriptionCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Subscription $subscription) {}

    public function build()
    {
        return $this->subject('¡Bienvenido! Tu suscripción ha sido creada')
            ->view('emails.subscription.created')
            ->with([
                'subscription' => $this->subscription,
                'tenant' => $this->subscription->tenant,
                'plan' => $this->subscription->plan,
            ]);
    }
}
