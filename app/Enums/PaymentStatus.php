<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case STATUS_PENDING = 'pending';
    case STATUS_PAID = 'paid';
    case STATUS_FAILED = 'failed';
}
