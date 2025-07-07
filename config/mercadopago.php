<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Mercado Pago Configuration
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for Mercado Pago services such
    | as preapproval and payment processing. You can set your access token
    | and other configurations here.
    |
    */

    'preapproval_url' => env('MP_PREAPPROVAL_URL', 'https://api.mercadopago.com/preapproval'),
    'payment_url' => env('MP_PAYMENT_URL', 'https://api.mercadopago.com/v1/payments'),
    'access_token' => env('MP_ACCESS_TOKEN', ''),
    'webhook_secret' => env('MP_WEBHOOK_SECRET', ''),

    /*
    |--------------------------------------------------------------------------
    | Subscription Settings
    |--------------------------------------------------------------------------
    */

    'subscription' => [
        'reminder_days_before_trial_end' => env('MP_REMINDER_DAYS', 3),
        'due_reminder_days_before_trial_end' => env('MP_DUE_REMINDER_DAYS', 1),
        'grace_period_days' => env('MP_GRACE_PERIOD_DAYS', 7),
        'auto_suspend_after_days' => env('MP_AUTO_SUSPEND_DAYS', 30),
    ],

    /*
    |--------------------------------------------------------------------------
    | Currency Settings
    |--------------------------------------------------------------------------
    */

    'currency' => [
        'default' => env('MP_DEFAULT_CURRENCY', 'ARS'),
        'supported' => ['ARS', 'USD', 'EUR', 'BRL', 'CLP', 'COP', 'MXN', 'PEN', 'UYU'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Testing Configuration
    |--------------------------------------------------------------------------
    */

    'sandbox' => [
        'enabled' => env('MP_SANDBOX', false),
        'access_token' => env('MP_SANDBOX_ACCESS_TOKEN', ''),
        'preapproval_url' => env('MP_SANDBOX_PREAPPROVAL_URL', 'https://api.mercadopago.com/preapproval'),
    ],
];
