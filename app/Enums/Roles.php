<?php

namespace App\Enums;

class Roles
{
    public const ADMIN = 'admin';
    public const USER = 'user';

    public static function all(): array
    {
        return [
            self::ADMIN,
            self::USER,
        ];
    }
}
