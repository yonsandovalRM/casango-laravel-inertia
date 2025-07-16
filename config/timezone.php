<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Application Timezone
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default timezone for your application, which
    | will be used by the PHP date and date-time functions.
    |
    */
    'default' => env('APP_TIMEZONE', 'UTC'),

    /*
    |--------------------------------------------------------------------------
    | Company Timezone Cache TTL
    |--------------------------------------------------------------------------
    |
    | Time in seconds to cache the company timezone. Set to 0 to disable cache.
    |
    */
    'cache_ttl' => env('TIMEZONE_CACHE_TTL', 3600),

    /*
    |--------------------------------------------------------------------------
    | Timezone Fields
    |--------------------------------------------------------------------------
    |
    | Default fields that should be treated as timezone-aware across models.
    |
    */
    'default_fields' => [
        'created_at',
        'updated_at',
        'date',
        'time',
        'start_time',
        'end_time',
        'open_time',
        'close_time',
        'break_start_time',
        'break_end_time',
        'trial_ends_at',
        'ends_at',
        'starts_at',
        'next_billing_date',
        'last_payment_date',
        'expires_at',
        'email_verified_at'
    ],

    /*
    |--------------------------------------------------------------------------
    | Common Timezones
    |--------------------------------------------------------------------------
    |
    | List of commonly used timezones for quick selection in forms.
    |
    */
    'common_timezones' => [
        'America/Santiago' => '(UTC-03:00) Santiago',
        'America/Argentina/Buenos_Aires' => '(UTC-03:00) Buenos Aires',
        'America/Sao_Paulo' => '(UTC-03:00) São Paulo',
        'America/Lima' => '(UTC-05:00) Lima',
        'America/Bogota' => '(UTC-05:00) Bogotá',
        'America/Mexico_City' => '(UTC-06:00) Ciudad de México',
        'America/New_York' => '(UTC-05:00) Nueva York',
        'America/Los_Angeles' => '(UTC-08:00) Los Ángeles',
        'Europe/Madrid' => '(UTC+01:00) Madrid',
        'UTC' => '(UTC+00:00) UTC',
    ],

    /*
    |--------------------------------------------------------------------------
    | Debug Mode
    |--------------------------------------------------------------------------
    |
    | When enabled, timezone information will be added to response headers
    | and additional logging will be performed.
    |
    */
    'debug' => env('TIMEZONE_DEBUG', false),
];
