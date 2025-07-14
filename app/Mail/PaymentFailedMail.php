<?php

namespace App\Mail;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentFailedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Subscription $subscription) {}

    public function build()
    {
        return $this->subject('Problema con tu pago - Acción requerida')
            ->view('emails.subscription.payment-failed')
            ->with([
                'subscription' => $this->subscription,
                'tenant' => $this->subscription->tenant,
                'plan' => $this->subscription->plan,
                'attemptsLeft' => config('mercadopago.subscription.max_failed_attempts', 3) - $this->subscription->failed_payment_attempts,
            ]);
    }
}
