<?php

namespace App\Mail;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\HtmlString;

class PaymentDueReminder extends Mailable
{
    use Queueable, SerializesModels;

    public $subscription;
    public $tenant;
    public $plan;
    public $daysRemaining;

    /**
     * Create a new message instance.
     */
    public function __construct(Subscription $subscription)
    {
        $this->subscription = $subscription;
        $this->tenant = $subscription->tenant;
        $this->plan = $subscription->plan;
        $this->daysRemaining = now()->diffInDays($subscription->trial_ends_at);
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject(
            $this->daysRemaining > 0
                ? "Tu período de prueba termina en {$this->daysRemaining} días - {$this->tenant->name}"
                : "Tu período de prueba ha finalizado - {$this->tenant->name}"
        )
            ->markdown('emails.payment-due-reminder', [
                'tenant' => $this->tenant,
                'subscription' => $this->subscription,
                'plan' => $this->plan,
                'paymentUrl' => $this->subscription->mp_init_point,
                'trialEndsAt' => $this->subscription->trial_ends_at->format('d/m/Y'),
                'daysRemaining' => $this->daysRemaining,
                'supportEmail' => config('mail.support.address'),
                'companyLogo' => asset('images/logo-email.png'),
            ]);
    }
}
