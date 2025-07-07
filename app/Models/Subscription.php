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
    ];

    protected $casts = [
        'trial_ends_at' => 'datetime',
        'ends_at' => 'datetime',
        'payment_setup_reminder_sent_at' => 'datetime',
        'payment_due_reminder_sent_at' => 'datetime',
        'is_monthly' => 'boolean',
        'is_active' => 'boolean',
    ];

    // Constantes para estados de pago
    const STATUS_PENDING = 'pending';
    const STATUS_PENDING_PAYMENT_METHOD = 'pending_payment_method';
    const STATUS_ACTIVE = 'active';
    const STATUS_SUSPENDED = 'suspended';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_EXPIRED = 'expired';

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
        return $this->is_active &&
            ($this->isInTrial() ||
                ($this->payment_status === self::STATUS_ACTIVE && $this->ends_at > now()));
    }

    /**
     * Verificar si la suscripción está vencida
     */
    public function isExpired(): bool
    {
        return $this->ends_at && $this->ends_at <= now();
    }

    /**
     * Verificar si necesita configurar método de pago
     */
    public function needsPaymentSetup(): bool
    {
        return $this->payment_status === self::STATUS_PENDING &&
            $this->trial_ends_at <= now()->addDays(3);
    }

    /**
     * Obtener días restantes del trial
     */
    public function getTrialDaysRemaining(): int
    {
        if (!$this->isInTrial()) {
            return 0;
        }

        return now()->diffInDays($this->trial_ends_at);
    }

    /**
     * Obtener el precio según el tipo de facturación
     */
    public function getCurrentPrice(): float
    {
        return $this->is_monthly ? $this->plan->price_monthly : $this->plan->price_annual;
    }

    /**
     * Obtener el siguiente ciclo de facturación
     */
    public function getNextBillingDate(): ?Carbon
    {
        if ($this->isInTrial()) {
            return $this->trial_ends_at;
        }

        if ($this->payment_status === self::STATUS_ACTIVE) {
            return $this->ends_at;
        }

        return null;
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

    public function scopeNeedsPaymentSetup($query)
    {
        return $query->where('payment_status', self::STATUS_PENDING)
            ->where('trial_ends_at', '<=', now()->addDays(3));
    }

    public function scopeWithMercadoPago($query)
    {
        return $query->whereNotNull('mp_preapproval_id');
    }

    /**
     * Accessors
     */
    public function getStatusLabelAttribute(): string
    {
        $labels = [
            self::STATUS_PENDING => 'Pendiente',
            self::STATUS_PENDING_PAYMENT_METHOD => 'Pendiente método de pago',
            self::STATUS_ACTIVE => 'Activa',
            self::STATUS_SUSPENDED => 'Suspendida',
            self::STATUS_CANCELLED => 'Cancelada',
            self::STATUS_EXPIRED => 'Vencida',
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
        ];

        return $colors[$this->payment_status] ?? 'gray';
    }
}
