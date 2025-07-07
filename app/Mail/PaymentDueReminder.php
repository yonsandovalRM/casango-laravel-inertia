<?php

namespace App\Mail;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentDueReminder extends Mailable
{
    use Queueable, SerializesModels;

    public $subscription;
    public $tenant;
    public $plan;

    /**
     * Create a new message instance.
     */
    public function __construct(Subscription $subscription)
    {
        $this->subscription = $subscription;
        $this->tenant = $subscription->tenant;
        $this->plan = $subscription->plan;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Tu período de prueba termina pronto - ' . $this->tenant->name)
            ->markdown('emails.payment-due-reminder')
            ->with([
                'tenant' => $this->tenant,
                'subscription' => $this->subscription,
                'plan' => $this->plan,
                'payment_url' => $this->subscription->mp_init_point,
                'trial_ends_at' => $this->subscription->trial_ends_at,
            ]);
    }
}
