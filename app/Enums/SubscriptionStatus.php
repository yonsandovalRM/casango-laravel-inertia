<?php

namespace App\Enums;

enum SubscriptionStatus: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case CANCELLED = 'cancelled';
    case ON_GRACE_PERIOD = 'on_grace_period';
    case PENDING = 'pending';
    case PAUSED = 'paused';
    case TRIAL = 'trial';
    case TRIAL_EXPIRED = 'trial_expired';
    case SUSPENDED = 'suspended';
    case EXPIRED = 'expired';

    public function label(): string
    {
        return match ($this) {
            self::ACTIVE => 'Activa',
            self::INACTIVE => 'Inactiva',
            self::CANCELLED => 'Cancelada',
            self::ON_GRACE_PERIOD => 'Período de gracia',
            self::PENDING => 'Pendiente',
            self::PAUSED => 'Pausada',
            self::TRIAL => 'Período de prueba',
            self::TRIAL_EXPIRED => 'Prueba expirada',
            self::SUSPENDED => 'Suspendida',
            self::EXPIRED => 'Expirada',
        };
    }

    public function isActive(): bool
    {
        return in_array($this, [
            self::ACTIVE,
            self::TRIAL,
            self::ON_GRACE_PERIOD
        ]);
    }
}
