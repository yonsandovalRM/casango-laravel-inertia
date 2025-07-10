<?php

namespace App\Helpers;

class OAuthHelper
{
    public static function getGoogleAuthUrl(string $tenantId): string
    {
        $centralDomain = config('tenancy.central_domains')[0];
        return "http://{$centralDomain}/auth/google?tenant={$tenantId}";
        // TODO: usar https si está configurado en producción
    }

    public static function getMicrosoftAuthUrl(string $tenantId): string
    {
        $centralDomain = config('tenancy.central_domains')[0];
        return "http://{$centralDomain}/auth/microsoft?tenant={$tenantId}";
    }
}
