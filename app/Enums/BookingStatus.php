<?php

// app/Enums/BookingStatus.php

namespace App\Enums;

class BookingStatus
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_NO_SHOW = 'no_show';
    public const STATUS_RESCHEDULED = 'rescheduled';

    public static function all(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_CONFIRMED,
            self::STATUS_CANCELLED,
            self::STATUS_COMPLETED,
            self::STATUS_NO_SHOW,
            self::STATUS_RESCHEDULED,
        ];
    }

    public static function labels(): array
    {
        return [
            self::STATUS_PENDING => 'Pendiente',
            self::STATUS_CONFIRMED => 'Confirmada',
            self::STATUS_CANCELLED => 'Cancelada',
            self::STATUS_COMPLETED => 'Completada',
            self::STATUS_NO_SHOW => 'No asistió',
            self::STATUS_RESCHEDULED => 'Reagendada',
        ];
    }

    public static function colors(): array
    {
        return [
            self::STATUS_PENDING => '#fbbf24',
            self::STATUS_CONFIRMED => '#10b981',
            self::STATUS_CANCELLED => '#ef4444',
            self::STATUS_COMPLETED => '#6b7280',
            self::STATUS_NO_SHOW => '#f97316',
            self::STATUS_RESCHEDULED => '#8b5cf6',
        ];
    }
}
