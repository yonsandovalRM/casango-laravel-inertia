<?php

namespace App\Enums;

class Permissions
{
    public const PLANS_CREATE = 'create plans';
    public const PLANS_EDIT = 'edit plans';
    public const PLANS_DELETE = 'delete plans';
    public const PLANS_VIEW = 'view plans';

    // Puedes agrupar si lo deseas:
    public static function plans(): array
    {
        return [
            self::PLANS_CREATE,
            self::PLANS_EDIT,
            self::PLANS_DELETE,
            self::PLANS_VIEW,
        ];
    }
}
