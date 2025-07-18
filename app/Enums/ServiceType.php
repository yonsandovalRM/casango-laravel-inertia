<?php

namespace App\Enums;

enum ServiceType: string
{
    case IN_PERSON = 'in_person';
    case VIDEO_CALL = 'video_call';
    case HYBRID = 'hybrid'; // Permite ambos tipos

    public function label(): string
    {
        return match ($this) {
            self::IN_PERSON => 'Presencial',
            self::VIDEO_CALL => 'Videollamada',
            self::HYBRID => 'Presencial y Videollamada',
        };
    }

    public function icon(): string
    {
        return match ($this) {
            self::IN_PERSON => 'map-pin',
            self::VIDEO_CALL => 'video',
            self::HYBRID => 'monitor-speaker',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::IN_PERSON => 'Servicio que se realiza en las instalaciones físicas',
            self::VIDEO_CALL => 'Servicio que se realiza mediante videollamada',
            self::HYBRID => 'Servicio que puede realizarse presencial o por videollamada',
        };
    }

    public function allowsInPerson(): bool
    {
        return in_array($this, [self::IN_PERSON, self::HYBRID]);
    }

    public function allowsVideoCall(): bool
    {
        return in_array($this, [self::VIDEO_CALL, self::HYBRID]);
    }

    public static function getOptions(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => $case->label(),
            'icon' => $case->icon(),
            'description' => $case->description(),
        ], self::cases());
    }
}
