<?php

namespace App\Enums;

enum BookingStatus: string
{
    case STATUS_PENDING = 'pending';
    case STATUS_CONFIRMED = 'confirmed';
    case STATUS_CANCELLED = 'cancelled';
}
