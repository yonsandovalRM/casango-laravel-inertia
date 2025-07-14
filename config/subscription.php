<?php

return [
    'grace_period_days' => 7, // Days after which a subscription is considered expired if not paid
    'suspension_days' => 3, // Days after which a subscription is suspended if not paid
    'currency_symbol' => '$',
    'retry_attempts' => 3, // Number of attempts to retry payment before marking as past due
];
