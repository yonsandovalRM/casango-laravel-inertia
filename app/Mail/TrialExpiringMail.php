<?php

namespace App\Mail;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TrialExpiringMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Subscription $subscription) {}

    public function build()
    {
        $daysLeft = $this->subscription->daysUntilExpiry();

        return $this->subject("Tu período de prueba expira en {$daysLeft} días")
            ->view('emails.subscription.trial-expiring')
            ->with([
                'subscription' => $this->subscription,
                'tenant' => $this->subscription->tenant,
                'plan' => $this->subscription->plan,
                'daysLeft' => $daysLeft,
            ]);
    }
}
