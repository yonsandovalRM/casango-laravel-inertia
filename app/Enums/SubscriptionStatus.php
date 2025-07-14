<?php

namespace App\Enums;

enum SubscriptionStatus: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case CANCELLED = 'cancelled';
    case ON_GRACE_PERIOD = 'on_grace_period';
    case PENDING = 'pending'; // Esperando pago inicial
    case PAUSED = 'paused'; // Pausado por falta de pago
}
