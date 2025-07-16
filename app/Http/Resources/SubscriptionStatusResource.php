<?php

namespace App\Http\Resources;

use App\Models\User;
use App\Traits\TimezoneResourceTrait;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class SubscriptionStatusResource extends JsonResource
{
    use TimezoneResourceTrait;

    protected $timezoneFields = [
        'trial_ends_at',
        'ends_at',
        'grace_period_ends_at',
        'next_billing_date',
        'last_payment_date',
        'created_at',
        'updated_at',
    ];

    public function toArray($request)
    {
        $user = Auth::user() ? User::find(Auth::user()->id) : null;

        return [
            'id' => $this->id,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'mp_status' => $this->mercadopago_status,
            'is_active' => $this->isActive(),
            'can_access' => $this->canAccess(),
            'needs_payment' => $this->needsPayment(),
            'on_trial' => $this->onTrial(),
            'trial_expired' => $this->trialExpired(),
            'on_grace_period' => $this->onGracePeriod(),
            'grace_period_expired' => $this->gracePeriodExpired(),
            'is_cancelled' => $this->isCancelled(),
            'is_paused' => $this->isPaused(),
            'days_until_expiry' => $this->daysUntilExpiry(),
            'price' => $this->price,
            'currency' => $this->currency,
            'billing_cycle' => $this->billing_cycle,
            'trial_ends_at' => $this->trial_ends_at,
            'ends_at' => $this->ends_at,
            'grace_period_ends_at' => $this->grace_period_ends_at,
            'next_billing_date' => $this->next_billing_date,
            'last_payment_date' => $this->last_payment_date,
            'failed_payment_attempts' => $this->failed_payment_attempts,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'plan' => [
                'id' => $this->plan->id,
                'name' => $this->plan->name,
                'is_free' => $this->plan->is_free,
                'trial_days' => $this->plan->trial_days,
            ],
            'permissions' => [
                'can_cancel' => $user?->can('cancel', $this->resource) ?? false,
                'can_reactivate' => $user?->can('reactivate', $this->resource) ?? false,
                'can_manage' => $user?->can('manage', $this->resource) ?? false,
            ]
        ];
    }
}
