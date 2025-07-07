<?php

namespace App\Mail;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Traits\HandlesMercadoPago;

class PaymentDueReminder extends Mailable
{
    use Queueable, SerializesModels, HandlesMercadoPago;

    public $subscription;
    public $tenant;
    public $plan;
    public $paymentUrl;
    public $daysRemaining;
    public $trialEndsAt;
    public $companyLogo;
    public $supportEmail;

    /**
     * Create a new message instance.
     */
    public function __construct(Subscription $subscription)
    {
        $this->subscription = $subscription;
        $this->tenant = $subscription->tenant;
        $this->plan = $subscription->plan;

        // Generar URL de pago
        $this->paymentUrl = $this->getPaymentUrl($subscription);

        // Calcular días restantes
        $this->daysRemaining = $subscription->getTrialDaysRemaining();
        $this->trialEndsAt = $subscription->trial_ends_at->format('d/m/Y');

        // Configuración de la empresa
        $this->companyLogo = config('app.logo_url', asset('images/logo.png'));
        $this->supportEmail = config('app.support_email', 'support@example.com');
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->markdown('emails.payment-due-reminder')
            ->subject($this->getSubject())
            ->with([
                'subscription' => $this->subscription,
                'tenant' => $this->tenant,
                'plan' => $this->plan,
                'paymentUrl' => $this->paymentUrl,
                'daysRemaining' => $this->daysRemaining,
                'trialEndsAt' => $this->trialEndsAt,
                'companyLogo' => $this->companyLogo,
                'supportEmail' => $this->supportEmail,
            ]);
    }

    /**
     * Get the subject line based on days remaining
     */
    private function getSubject(): string
    {
        if ($this->daysRemaining > 0) {
            return "⏰ Tu período de prueba termina en {$this->daysRemaining} días";
        }

        return "⚠️ Tu período de prueba ha finalizado - Configura tu pago";
    }
}
