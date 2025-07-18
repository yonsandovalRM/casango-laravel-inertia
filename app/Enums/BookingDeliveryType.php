<?php

namespace App\Enums;

enum BookingDeliveryType: string
{
    case IN_PERSON = 'in_person';
    case VIDEO_CALL = 'video_call';

    public function label(): string
    {
        return match ($this) {
            self::IN_PERSON => 'Presencial',
            self::VIDEO_CALL => 'Videollamada',
        };
    }

    public function icon(): string
    {
        return match ($this) {
            self::IN_PERSON => 'map-pin',
            self::VIDEO_CALL => 'video',
        };
    }

    public function requiresLocation(): bool
    {
        return $this === self::IN_PERSON;
    }

    public function requiresVideoLink(): bool
    {
        return $this === self::VIDEO_CALL;
    }

    public static function fromServiceType(ServiceType $serviceType): array
    {
        return match ($serviceType) {
            ServiceType::IN_PERSON => [self::IN_PERSON],
            ServiceType::VIDEO_CALL => [self::VIDEO_CALL],
            ServiceType::HYBRID => [self::IN_PERSON, self::VIDEO_CALL],
        };
    }
}
