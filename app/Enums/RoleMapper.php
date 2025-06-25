<?php

namespace App\Enums;

use Illuminate\Support\Facades\Lang;

class RoleMapper
{
    public static function getRoleName(string $roleId): string
    {
        return match ($roleId) {
            'admin' => Lang::get('roles.admin'),
            'manager' => Lang::get('roles.manager'),
            'owner' => Lang::get('roles.owner'),
            'professional' => Lang::get('roles.professional'),
            'employee' => Lang::get('roles.employee'),
            'client' => Lang::get('roles.client'),
            'user' => Lang::get('roles.user'),
            'super-admin' => Lang::get('roles.super-admin'),
            default => Lang::get('roles.default'),
        };
    }
}
