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

];
