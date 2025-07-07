<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'tenant_id' => $this->tenant_id,
            'plan_id' => $this->plan_id,
            'price' => $this->price,
            'currency' => $this->currency,
            'is_monthly' => $this->is_monthly,
            'is_active' => $this->is_active,
            'payment_status' => $this->payment_status,
            'status_label' => $this->status_label,
            'status_color' => $this->status_color,

            // Fechas
            'trial_ends_at' => $this->trial_ends_at,
            'ends_at' => $this->ends_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'payment_setup_reminder_sent_at' => $this->payment_setup_reminder_sent_at,
            'payment_due_reminder_sent_at' => $this->payment_due_reminder_sent_at,

            // MercadoPago
            'mp_preapproval_id' => $this->mp_preapproval_id,
            'mp_init_point' => $this->mp_init_point,

            // Estados calculados
            'is_in_trial' => $this->isInTrial(),
            'is_trial_expired' => $this->isTrialExpired(),
            'is_expired' => $this->isExpired(),
            'trial_days_remaining' => $this->getTrialDaysRemaining(),
            'current_price' => $this->getCurrentPrice(),
            'next_billing_date' => $this->getNextBillingDate(),
            'needs_payment_setup' => $this->needsPaymentSetup(),

            // Relaciones
            'plan' => PlanResource::make($this->whenLoaded('plan')),
            'tenant' => $this->when(
                $this->relationLoaded('tenant'),
                function () {
                    return [
                        'id' => $this->tenant->id,
                        'name' => $this->tenant->name,
                        'email' => $this->tenant->email,
                    ];
                }
            ),

            // Información adicional para el frontend
            'billing_cycle' => $this->is_monthly ? 'monthly' : 'annual',
            'billing_cycle_label' => $this->is_monthly ? 'Mensual' : 'Anual',
            'price_formatted' => '$' . number_format($this->getCurrentPrice(), 2) . ' ' . strtoupper($this->currency),
            'trial_ends_at_formatted' => $this->trial_ends_at ? $this->trial_ends_at->format('d/m/Y') : null,
            'ends_at_formatted' => $this->ends_at ? $this->ends_at->format('d/m/Y') : null,
            'next_billing_date_formatted' => $this->getNextBillingDate() ? $this->getNextBillingDate()->format('d/m/Y') : null,

            // Alertas y notificaciones
            'alerts' => $this->getAlerts(),
            'can_cancel' => $this->canBeCancelled(),
            'can_upgrade' => $this->canBeUpgraded(),
            'can_downgrade' => $this->canBeDowngraded(),
        ];
    }

    /**
     * Get alerts for the subscription
     */
    private function getAlerts(): array
    {
        $alerts = [];

        if ($this->isTrialExpired() && $this->payment_status === 'pending') {
            $alerts[] = [
                'type' => 'error',
                'message' => 'Tu período de prueba ha expirado. Configura tu método de pago para continuar.',
                'action' => 'setup_payment'
            ];
        } elseif ($this->getTrialDaysRemaining() <= 3 && $this->payment_status === 'pending') {
            $alerts[] = [
                'type' => 'warning',
                'message' => "Tu período de prueba termina en {$this->getTrialDaysRemaining()} días. Configura tu método de pago.",
                'action' => 'setup_payment'
            ];
        }

        if ($this->payment_status === 'pending_payment_method') {
            $alerts[] = [
                'type' => 'info',
                'message' => 'Método de pago pendiente. Completa la configuración para activar tu suscripción.',
                'action' => 'complete_payment'
            ];
        }

        if ($this->payment_status === 'suspended') {
            $alerts[] = [
                'type' => 'error',
                'message' => 'Tu suscripción está suspendida. Actualiza tu método de pago para reactivar.',
                'action' => 'update_payment'
            ];
        }

        return $alerts;
    }

    /**
     * Check if subscription can be cancelled
     */
    private function canBeCancelled(): bool
    {
        return $this->is_active && in_array($this->payment_status, ['active', 'pending_payment_method']);
    }

    /**
     * Check if subscription can be upgraded
     */
    private function canBeUpgraded(): bool
    {
        return $this->is_active && $this->payment_status === 'active';
    }

    /**
     * Check if subscription can be downgraded
     */
    private function canBeDowngraded(): bool
    {
        return $this->is_active && $this->payment_status === 'active' && !$this->isInTrial();
    }
}
