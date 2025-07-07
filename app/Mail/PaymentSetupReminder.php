<?php

namespace App\Mail;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Traits\HandlesMercadoPago;

class PaymentSetupReminder extends Mailable
{
    use Queueable, SerializesModels, HandlesMercadoPago;

    public $subscription;
    public $tenant;
    public $plan;
    public $paymentUrl;
    public $daysRemaining;
    public $trialEndDate;
    public $planFeatures;
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

        // Generar URL de pago (crear preapproval si no existe)
        $this->paymentUrl = $this->getPaymentUrl($subscription);

        // Calcular días restantes
        $this->daysRemaining = $subscription->getTrialDaysRemaining();
        $this->trialEndDate = $subscription->trial_ends_at->format('d/m/Y');

        // Obtener características del plan
        $this->planFeatures = $this->plan->features ?? [];

        // Configuración de la empresa
        $this->companyLogo = config('app.logo_url', asset('images/logo.png'));
        $this->supportEmail = config('app.support_email', 'support@example.com');
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->markdown('emails.payment-setup-reminder')
            ->subject($this->getSubject())
            ->with([
                'subscription' => $this->subscription,
                'tenant' => $this->tenant,
                'plan' => $this->plan,
                'paymentUrl' => $this->paymentUrl,
                'daysRemaining' => $this->daysRemaining,
                'trialEndDate' => $this->trialEndDate,
                'planFeatures' => $this->planFeatures,
                'companyLogo' => $this->companyLogo,
                'supportEmail' => $this->supportEmail,
            ]);
    }

    /**
     * Get the subject line based on days remaining
     */
    private function getSubject(): string
    {
        if ($this->daysRemaining <= 1) {
            return "🚨 ¡Última oportunidad! Configura tu pago hoy";
        }

        if ($this->daysRemaining <= 3) {
            return "⏰ Solo {$this->daysRemaining} días para configurar tu pago";
        }

        return "📋 Completa tu configuración de pago - {$this->daysRemaining} días restantes";
    }
}
