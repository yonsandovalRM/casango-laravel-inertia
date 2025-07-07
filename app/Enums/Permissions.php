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

    public const SERVICES_CREATE = 'create services';
    public const SERVICES_EDIT = 'edit services';
    public const SERVICES_DELETE = 'delete services';
    public const SERVICES_VIEW = 'view services';

    public const CATEGORIES_CREATE = 'create categories';
    public const CATEGORIES_EDIT = 'edit categories';
    public const CATEGORIES_DELETE = 'delete categories';
    public const CATEGORIES_VIEW = 'view categories';

    public const PROFESSIONAL_PROFILE_VIEW = 'view professional profile';
    public const PROFESSIONAL_PROFILE_EDIT = 'edit professional profile';
    public const PROFESSIONAL_PROFILE_DELETE = 'delete professional profile';
    public const PROFESSIONAL_EXCEPTIONS_CREATE = 'create professional exceptions';
    public const PROFESSIONAL_EXCEPTIONS_DELETE = 'delete professional exceptions';

    public const PROFESSIONALS_VIEW = 'view professionals';
    public const PROFESSIONALS_EDIT = 'edit professionals';
    public const PROFESSIONALS_DELETE = 'delete professionals';

    public const BOOKINGS_VIEW = 'view bookings';
    public const BOOKINGS_EDIT = 'edit bookings';
    public const BOOKINGS_DELETE = 'delete bookings';
    public const BOOKINGS_CREATE = 'create bookings';

    public const COMPANY_VIEW = 'view company';
    public const COMPANY_EDIT = 'edit company';

    public const SUBSCRIPTION_VIEW = 'view subscription';
    public const SUBSCRIPTION_EDIT = 'edit subscription';
    public const SUBSCRIPTION_DELETE = 'delete subscription';
    public const SUBSCRIPTION_MANAGE = 'manage subscription';

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

    public static function services(): array
    {
        return [
            self::SERVICES_CREATE,
            self::SERVICES_EDIT,
            self::SERVICES_DELETE,
            self::SERVICES_VIEW,
        ];
    }

    public static function categories(): array
    {
        return [
            self::CATEGORIES_CREATE,
            self::CATEGORIES_EDIT,
            self::CATEGORIES_DELETE,
            self::CATEGORIES_VIEW,
        ];
    }

    public static function professionalProfile(): array
    {
        return [
            self::PROFESSIONAL_PROFILE_VIEW,
            self::PROFESSIONAL_PROFILE_EDIT,
            self::PROFESSIONAL_PROFILE_DELETE,
        ];
    }

    public static function professionals(): array
    {
        return [
            self::PROFESSIONALS_VIEW,
            self::PROFESSIONALS_EDIT,
            self::PROFESSIONALS_DELETE,
            self::PROFESSIONAL_EXCEPTIONS_CREATE,
            self::PROFESSIONAL_EXCEPTIONS_DELETE,
        ];
    }

    public static function bookings(): array
    {
        return [
            self::BOOKINGS_VIEW,
            self::BOOKINGS_EDIT,
            self::BOOKINGS_DELETE,
            self::BOOKINGS_CREATE,
        ];
    }

    public static function company(): array
    {
        return [
            self::COMPANY_VIEW,
            self::COMPANY_EDIT,
        ];
    }
}
