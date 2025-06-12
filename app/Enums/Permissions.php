<?php

namespace App\Enums;

class Permissions
{
    public const PLANS_CREATE = 'create plans';
    public const PLANS_EDIT = 'edit plans';
    public const PLANS_DELETE = 'delete plans';
    public const PLANS_VIEW = 'view plans';

    public const TENANTS_EDIT = 'edit tenants';
    public const TENANTS_DELETE = 'delete tenants';
    public const TENANTS_VIEW = 'view tenants';

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

    public static function tenants(): array
    {
        return [
            self::TENANTS_EDIT,
            self::TENANTS_DELETE,
            self::TENANTS_VIEW,
        ];
    }
}
