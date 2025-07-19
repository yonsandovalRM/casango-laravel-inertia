<?php

// app/Enums/ServiceType.php
namespace App\Enums;

enum ServiceType: string
{
    case IN_PERSON = 'in_person';
    case VIDEO_CALL = 'video_call';
    case HYBRID = 'hybrid';

    public function label(): string
    {
        return match ($this) {
            self::IN_PERSON => 'Presencial',
            self::VIDEO_CALL => 'Videollamada',
            self::HYBRID => 'Híbrido',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::IN_PERSON => 'Servicio que se realiza en persona en las instalaciones de la empresa',
            self::VIDEO_CALL => 'Servicio que se realiza a través de videollamada online',
            self::HYBRID => 'Servicio que puede realizarse tanto presencial como por videollamada',
        };
    }

    public function icon(): string
    {
        return match ($this) {
            self::IN_PERSON => '🏢',
            self::VIDEO_CALL => '📹',
            self::HYBRID => '🔄',
        };
    }

    public function allowsInPerson(): bool
    {
        return match ($this) {
            self::IN_PERSON => true,
            self::VIDEO_CALL => false,
            self::HYBRID => true,
        };
    }

    public function allowsVideoCall(): bool
    {
        return match ($this) {
            self::IN_PERSON => false,
            self::VIDEO_CALL => true,
            self::HYBRID => true,
        };
    }

    public function requiresLocation(): bool
    {
        return $this->allowsInPerson();
    }

    public function requiresVideoLink(): bool
    {
        return $this->allowsVideoCall();
    }

    public static function getAvailableTypes(bool $companyAllowsVideoCalls = false): array
    {
        if (!$companyAllowsVideoCalls) {
            return [self::IN_PERSON];
        }

        return self::cases();
    }
}
