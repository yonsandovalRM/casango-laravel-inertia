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
        'reminder_days_before_trial_end' => env('SUBSCRIPTION_REMINDER_DAYS', 3),
        'due_reminder_days_before_trial_end' => env('SUBSCRIPTION_DUE_REMINDER_DAYS', 1),
        'grace_period_days' => env('SUBSCRIPTION_GRACE_PERIOD_DAYS', 7),
        'auto_suspend_after_days' => env('SUBSCRIPTION_AUTO_SUSPEND_DAYS', 30),
        'max_failed_attempts' => env('SUBSCRIPTION_MAX_FAILED_ATTEMPTS', 3),
    ],

    /*
    |--------------------------------------------------------------------------
    | Currency Settings
    |--------------------------------------------------------------------------
    */

    'currency' => [
        'default' => env('MP_DEFAULT_CURRENCY', 'CLP'),
        'supported' => ['ARS', 'USD', 'EUR', 'BRL', 'CLP', 'COP', 'MXN', 'PEN', 'UYU'],
    ],


];
