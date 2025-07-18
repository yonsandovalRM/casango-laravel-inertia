<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'mail' => [
        'support' => [
            'address' => env('MAIL_SUPPORT_ADDRESS', 'soporte@tudominio.com'),
            'name' => env('MAIL_SUPPORT_NAME', 'Soporte'),
        ],
    ],


    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('APP_URL') . '/auth/google/callback', // Dominio central
    ],

    'microsoft' => [
        'client_id' => env('MICROSOFT_CLIENT_ID'),
        'client_secret' => env('MICROSOFT_CLIENT_SECRET'),
        'redirect' => env('APP_URL') . '/auth/microsoft/callback', // Dominio central
    ],

    /* 
        VIDEO CONFERENCIA
    */
    'jitsi' => [
        'base_url' => env('JITSI_BASE_URL', 'https://meet.jit.si'),
        'app_id' => env('JITSI_APP_ID'),
        'api_key' => env('JITSI_API_KEY'),
    ],

    'zoom' => [
        'api_key' => env('ZOOM_API_KEY'),
        'api_secret' => env('ZOOM_API_SECRET'),
        'base_url' => env('ZOOM_BASE_URL', 'https://api.zoom.us/v2'),
    ],

    'daily' => [
        'api_key' => env('DAILY_API_KEY'),
        'base_url' => env('DAILY_BASE_URL', 'https://api.daily.co/v1'),
    ],

    'google_meet' => [
        'client_id' => env('GOOGLE_MEET_CLIENT_ID'),
        'client_secret' => env('GOOGLE_MEET_CLIENT_SECRET'),
        'redirect_uri' => env('GOOGLE_MEET_REDIRECT_URI'),
    ],

];
