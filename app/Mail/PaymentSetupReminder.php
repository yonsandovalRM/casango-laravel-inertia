<?php

namespace App\Mail;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;

class PaymentSetupReminder extends Mailable
{
    use Queueable, SerializesModels;

    public $subscription;
    public $tenant;
    public $plan;
    public $daysRemaining;
    public $trialEndDate;

    /**
     * Create a new message instance.
     */
    public function __construct(Subscription $subscription)
    {
        $this->subscription = $subscription;
        $this->tenant = $subscription->tenant;
        $this->plan = $subscription->plan;
        $this->daysRemaining = Carbon::now()->diffInDays($subscription->trial_ends_at);
        $this->trialEndDate = $subscription->trial_ends_at->format('d/m/Y');
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject(
            $this->daysRemaining > 3
                ? "Completa tu configuración de pago - {$this->tenant->name}"
                : "¡Últimos días para configurar tu pago! - {$this->tenant->name}"
        )
            ->markdown('emails.payment-setup-reminder', [
                'tenant' => $this->tenant,
                'subscription' => $this->subscription,
                'plan' => $this->plan,
                'paymentUrl' => $this->subscription->mp_init_point,
                'trialEndDate' => $this->trialEndDate,
                'daysRemaining' => $this->daysRemaining,
                'supportEmail' => config('mail.support.address'),
                'companyLogo' => asset('images/logo-email.png'),
                'planFeatures' => $this->plan->features ?? [],
            ]);
    }
}
