<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case STATUS_PENDING = 'pending';
    case STATUS_PAID = 'paid';
    case STATUS_FAILED = 'failed';
    case STATUS_CANCELLED = 'cancelled';
    case STATUS_EXPIRED = 'expired';
    case STATUS_ACTIVE = 'active';
    case STATUS_SUSPENDED = 'suspended';
    case STATUS_PAST_DUE = 'past_due';
}
