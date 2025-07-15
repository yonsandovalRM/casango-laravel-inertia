<?php

namespace App\Models;

use App\Enums\SubscriptionStatus;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'tenant_id',
        'plan_id',
        'mercadopago_id',
        'mercadopago_status',
        'status',
        'price',
        'currency',
        'billing_cycle',
        'starts_at',
        'ends_at',
        'trial_ends_at',
        'grace_period_ends_at',
        'next_billing_date',
        'last_payment_date',
        'failed_payment_attempts',
        'is_active',
    ];

    protected $casts = [
        'status' => SubscriptionStatus::class,
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'trial_ends_at' => 'datetime',
        'grace_period_ends_at' => 'datetime',
        'next_billing_date' => 'datetime',
        'last_payment_date' => 'datetime',
        'price' => 'decimal:2',
        'failed_payment_attempts' => 'integer',
        'is_active' => 'boolean',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    // Status checkers
    public function isActive(): bool
    {
        return $this->status->isActive() && $this->is_active;
    }

    public function onTrial(): bool
    {
        return $this->status === SubscriptionStatus::TRIAL &&
            $this->trial_ends_at &&
            now()->lt($this->trial_ends_at);
    }

    public function trialExpired(): bool
    {
        return $this->trial_ends_at && now()->gte($this->trial_ends_at);
    }

    public function onGracePeriod(): bool
    {
        return $this->status === SubscriptionStatus::ON_GRACE_PERIOD &&
            $this->grace_period_ends_at &&
            now()->lt($this->grace_period_ends_at);
    }

    public function gracePeriodExpired(): bool
    {
        return $this->grace_period_ends_at && now()->gte($this->grace_period_ends_at);
    }

    public function isCancelled(): bool
    {
        return $this->status === SubscriptionStatus::CANCELLED;
    }

    public function isPaused(): bool
    {
        return $this->status === SubscriptionStatus::PAUSED;
    }

    public function canAccess(): bool
    {
        // Si es plan gratuito, siempre puede acceder
        if ($this->plan->is_free) {
            return true;
        }

        // Verificar estados que permiten acceso
        return $this->isActive() || $this->onTrial() || $this->onGracePeriod();
    }

    public function needsPayment(): bool
    {
        return !$this->plan->is_free &&
            !$this->isActive() &&
            !$this->onTrial() &&
            !$this->onGracePeriod();
    }

    public function daysUntilExpiry(): int
    {
        if ($this->onTrial()) {
            return now()->diffInDays($this->trial_ends_at, false);
        }

        if ($this->onGracePeriod()) {
            return now()->diffInDays($this->grace_period_ends_at, false);
        }

        if ($this->ends_at) {
            return now()->diffInDays($this->ends_at, false);
        }

        return 0;
    }

    // Actions
    public function startTrial(): void
    {
        $this->update([
            'status' => SubscriptionStatus::TRIAL,
            'starts_at' => now(),
            'trial_ends_at' => now()->addDays($this->plan->trial_days),
            'is_active' => true,
        ]);
    }

    public function activate(): void
    {
        $this->update([
            'status' => SubscriptionStatus::ACTIVE,
            'starts_at' => $this->starts_at ?? now(),
            'is_active' => true,
            'failed_payment_attempts' => 0,
            'grace_period_ends_at' => null,
        ]);
    }

    public function startGracePeriod(): void
    {
        $graceDays = config('mercadopago.subscription.grace_period_days', 7);

        $this->update([
            'status' => SubscriptionStatus::ON_GRACE_PERIOD,
            'grace_period_ends_at' => now()->addDays($graceDays),
        ]);
    }

    public function suspend(): void
    {
        $this->update([
            'status' => SubscriptionStatus::SUSPENDED,
            'is_active' => false,
        ]);
    }

    public function cancel(): void
    {
        $this->update([
            'status' => SubscriptionStatus::CANCELLED,
            'is_active' => false,
            'ends_at' => now(),
            'grace_period_ends_at' => null,
        ]);
    }

    public function incrementFailedAttempts(): void
    {
        $this->increment('failed_payment_attempts');

        $maxAttempts = config('mercadopago.subscription.max_failed_attempts', 3);

        if ($this->failed_payment_attempts >= $maxAttempts) {
            $this->startGracePeriod();
        }
    }


    public function getRemainingTrialDays(): int
    {
        if (!$this->onTrial()) {
            return 0;
        }

        return max(0, now()->diffInDays($this->trial_ends_at, false));
    }

    public function getRemainingGraceDays(): int
    {
        if (!$this->onGracePeriod()) {
            return 0;
        }

        return max(0, now()->diffInDays($this->grace_period_ends_at, false));
    }

    public function getStatusMessage(): string
    {
        if ($this->onTrial()) {
            $days = $this->getRemainingTrialDays();
            return $days > 0 ? "Período de prueba: {$days} días restantes" : "Período de prueba expirado";
        }

        if ($this->onGracePeriod()) {
            $days = $this->getRemainingGraceDays();
            return $days > 0 ? "Período de gracia: {$days} días restantes" : "Período de gracia expirado";
        }

        return $this->status->label();
    }

    public function requiresAction(): bool
    {
        return $this->needsPayment() ||
            ($this->onTrial() && $this->getRemainingTrialDays() <= 3) ||
            ($this->onGracePeriod() && $this->getRemainingGraceDays() <= 2);
    }
}
