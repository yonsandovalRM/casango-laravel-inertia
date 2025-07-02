<?php

namespace App\Enums;

enum BookingStatus: string
{
    case STATUS_PENDING = 'pending';
    case STATUS_CONFIRMED = 'confirmed';
    case STATUS_CANCELLED = 'cancelled';
    case STATUS_NO_SHOW = 'no_show';
    case STATUS_COMPLETED = 'completed';
    case STATUS_RESCHEDULED = 'rescheduled';
    case STATUS_REFUNDED = 'refunded';
    case STATUS_IN_PROGRESS = 'in_progress';
}
