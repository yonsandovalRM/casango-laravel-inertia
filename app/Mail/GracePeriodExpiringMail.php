<?php

namespace App\Mail;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class GracePeriodExpiringMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Subscription $subscription) {}

    public function build()
    {
        $daysLeft = $this->subscription->daysUntilExpiry();

        return $this->subject("Acción urgente: Tu cuenta se suspende en {$daysLeft} días")
            ->view('emails.subscription.grace-period-expiring')
            ->with([
                'subscription' => $this->subscription,
                'tenant' => $this->subscription->tenant,
                'plan' => $this->subscription->plan,
                'daysLeft' => $daysLeft,
            ]);
    }
}
