<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Subscription extends Model
{
    use HasUuid;

    protected $fillable = [
        'tenant_id',
        'plan_id',
        'price',
        'currency',
        'trial_ends_at',
        'ends_at',
        'payment_status',
        'is_monthly',
        'is_active',
        'mp_preapproval_id',
        'mp_init_point',
        'payment_setup_reminder_sent_at',
        'payment_due_reminder_sent_at',
        'last_payment_attempt_at',
        'failure_count',
    ];

    protected $casts = [
        'trial_ends_at' => 'datetime',
        'ends_at' => 'datetime',
        'payment_setup_reminder_sent_at' => 'datetime',
        'payment_due_reminder_sent_at' => 'datetime',
        'last_payment_attempt_at' => 'datetime',
        'is_monthly' => 'boolean',
        'is_active' => 'boolean',
        'failure_count' => 'integer',
    ];

    // Constantes para estados de pago
    const STATUS_PENDING = 'pending';
    const STATUS_PENDING_PAYMENT_METHOD = 'pending_payment_method';
    const STATUS_ACTIVE = 'active';
    const STATUS_SUSPENDED = 'suspended';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_EXPIRED = 'expired';
    const STATUS_PAST_DUE = 'past_due';

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * Verificar si la suscripción está en período de prueba
     */
    public function isInTrial(): bool
    {
        return $this->trial_ends_at && $this->trial_ends_at > now();
    }

    /**
     * Verificar si el período de prueba ha terminado
     */
    public function isTrialExpired(): bool
    {
        return $this->trial_ends_at && $this->trial_ends_at <= now();
    }

    /**
     * Verificar si la suscripción está activa
     */
    public function isActive(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        // Si está en trial, está activa
        if ($this->isInTrial()) {
            return true;
        }



        // Si es un plan gratuito, está activa si el estado es activo
        if ($this->plan->is_free) {
            return $this->payment_status === self::STATUS_ACTIVE;
        }

        // Para planes de pago, verificar estado y fecha de vencimiento
        return $this->payment_status === self::STATUS_ACTIVE &&
            (!$this->ends_at || $this->ends_at > now());

        // Para planes de pago: considerar días de gracia
        if ($this->isInGracePeriod()) {
            return true; // Acceso durante gracia
        }

        return false;
    }

    /**
     * Verificar si la suscripción está vencida
     */
    public function isExpired(): bool
    {
        if ($this->plan->is_free) {
            return false;
        }

        return $this->ends_at && $this->ends_at <= now();
    }

    /**
     * Verificar si necesita configurar método de pago
     */
    public function needsPaymentSetup(): bool
    {
        if ($this->plan->is_free) {
            return false;
        }

        return $this->payment_status === self::STATUS_PENDING &&
            $this->trial_ends_at <= now()->addDays(3);
    }

    /**
     * Verificar si puede ser cancelada
     */
    public function canBeCancelled(): bool
    {
        return $this->is_active &&
            !in_array($this->payment_status, [self::STATUS_CANCELLED, self::STATUS_EXPIRED]);
    }

    /**
     * Verificar si puede ser actualizada (upgrade)
     */
    public function canBeUpgraded(): bool
    {
        return $this->is_active &&
            $this->payment_status === self::STATUS_ACTIVE &&
            !$this->plan->is_free;
    }

    /**
     * Verificar si puede ser degradada (downgrade)
     */
    public function canBeDowngraded(): bool
    {
        return $this->is_active &&
            $this->payment_status === self::STATUS_ACTIVE &&
            !$this->isInTrial();
    }

    /**
     * Obtener días restantes del trial
     */
    public function getTrialDaysRemaining(): int
    {
        if (!$this->isInTrial()) {
            return 0;
        }

        return max(0, now()->diffInDays($this->trial_ends_at));
    }

    /**
     * Obtener el precio según el tipo de facturación
     */
    public function getCurrentPrice(): float
    {
        if ($this->plan->is_free) {
            return 0;
        }

        return $this->is_monthly ? $this->plan->price_monthly : $this->plan->price_annual;
    }

    /**
     * Obtener el siguiente ciclo de facturación
     */
    public function getNextBillingDate(): ?Carbon
    {
        if ($this->plan->is_free) {
            return null;
        }

        if ($this->isInTrial()) {
            return $this->trial_ends_at;
        }

        if ($this->payment_status === self::STATUS_ACTIVE && $this->ends_at) {
            return $this->ends_at;
        }

        return null;
    }

    /**
     * Obtener el período de gracia después del vencimiento
     */
    public function getGracePeriodEndDate(): ?Carbon
    {
        if (!$this->ends_at) {
            return null;
        }

        return $this->ends_at->addDays(config('subscription.grace_period_days', 7));
    }

    /**
     * Verificar si está en período de gracia
     */
    public function isInGracePeriod(): bool
    {
        if (!$this->ends_at) {
            return false;
        }

        $gracePeriodEnd = $this->getGracePeriodEndDate();
        return now()->between($this->ends_at, $gracePeriodEnd);
    }

    /**
     * Marcar como suspendida
     */
    public function suspend(): void
    {
        $this->update([
            'payment_status' => self::STATUS_SUSPENDED,
            'is_active' => false,
        ]);
    }

    /**
     * Reactivar suscripción
     */
    public function reactivate(): void
    {
        $this->update([
            'payment_status' => self::STATUS_ACTIVE,
            'is_active' => true,
            'failure_count' => 0,
        ]);
    }

    /**
     * Incrementar contador de fallos
     */
    public function incrementFailureCount(): void
    {
        $this->increment('failure_count');
        $this->update(['last_payment_attempt_at' => now()]);
    }

    /**
     * Resetear contador de fallos
     */
    public function resetFailureCount(): void
    {
        $this->update(['failure_count' => 0]);
    }

    public function markAsPastDue(): void
    {
        if ($this->isExpired()) {
            $this->update([
                'payment_status' => self::STATUS_PAST_DUE,
                'ends_at' => now()->addDays(config('subscription.grace_period_days'))
            ]);
        }
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInTrial($query)
    {
        return $query->where('trial_ends_at', '>', now());
    }

    public function scopeTrialExpired($query)
    {
        return $query->where('trial_ends_at', '<=', now());
    }

    public function scopeExpired($query)
    {
        return $query->where('ends_at', '<=', now());
    }

    public function scopeNeedsPaymentSetup($query)
    {
        return $query->where('payment_status', self::STATUS_PENDING)
            ->where('trial_ends_at', '<=', now()->addDays(3));
    }

    public function scopeWithMercadoPago($query)
    {
        return $query->whereNotNull('mp_preapproval_id');
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('payment_status', $status);
    }

    public function scopeInGracePeriod($query)
    {
        return $query->where('ends_at', '<=', now())
            ->where('ends_at', '>', now()->subDays(config('subscription.grace_period_days', 7)));
    }

    /**
     * Accessors
     */
    public function getStatusLabelAttribute(): string
    {
        $labels = [
            self::STATUS_PENDING => 'Pendiente',
            self::STATUS_PENDING_PAYMENT_METHOD => 'Configurando pago',
            self::STATUS_ACTIVE => 'Activa',
            self::STATUS_SUSPENDED => 'Suspendida',
            self::STATUS_CANCELLED => 'Cancelada',
            self::STATUS_EXPIRED => 'Vencida',
            self::STATUS_PAST_DUE => 'Pago atrasado',
        ];

        return $labels[$this->payment_status] ?? 'Desconocido';
    }

    public function getStatusColorAttribute(): string
    {
        $colors = [
            self::STATUS_PENDING => 'yellow',
            self::STATUS_PENDING_PAYMENT_METHOD => 'orange',
            self::STATUS_ACTIVE => 'green',
            self::STATUS_SUSPENDED => 'red',
            self::STATUS_CANCELLED => 'gray',
            self::STATUS_EXPIRED => 'red',
            self::STATUS_PAST_DUE => 'red',
        ];

        return $colors[$this->payment_status] ?? 'gray';
    }

    public function getStatusIconAttribute(): string
    {
        $icons = [
            self::STATUS_PENDING => 'clock',
            self::STATUS_PENDING_PAYMENT_METHOD => 'credit-card',
            self::STATUS_ACTIVE => 'check-circle',
            self::STATUS_SUSPENDED => 'pause-circle',
            self::STATUS_CANCELLED => 'x-circle',
            self::STATUS_EXPIRED => 'alert-circle',
            self::STATUS_PAST_DUE => 'alert-triangle',
        ];

        return $icons[$this->payment_status] ?? 'help-circle';
    }
}
