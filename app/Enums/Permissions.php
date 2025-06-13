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

    public const USERS_CREATE = 'create users';
    public const USERS_EDIT = 'edit users';
    public const USERS_DELETE = 'delete users';
    public const USERS_VIEW = 'view users';

    public const INVITATIONS_CREATE = 'create invitations';
    public const INVITATIONS_VIEW = 'view invitations';

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

    public static function users(): array
    {
        return [
            self::USERS_CREATE,
            self::USERS_EDIT,
            self::USERS_DELETE,
            self::USERS_VIEW,
        ];
    }

    public static function invitations(): array
    {
        return [
            self::INVITATIONS_CREATE,
            self::INVITATIONS_VIEW,
        ];
    }
}
