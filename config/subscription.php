<?php


return [

    'free_plan_features' => [
        'basic_booking',
        'single_professional',
        'basic_calendar',
        'basic_reports',
    ],

    'default_limits' => [
        'max_professionals' => 1,
        'max_services' => 5,
        'max_bookings_per_month' => 50,
        'max_clients' => 100,
        'advanced_reports' => false,
        'custom_branding' => false,
        'api_access' => false,
        'email_notifications' => true,
        'sms_notifications' => false,
    ],

    // Los IDs deben coincidir con los UUIDs reales de tus planes
    'plan_limits' => [
        // Ejemplo - reemplazar con IDs reales
        'starter-plan-uuid' => [
            'max_professionals' => 3,
            'max_services' => 15,
            'max_bookings_per_month' => 200,
            'max_clients' => 500,
            'advanced_reports' => false,
            'custom_branding' => false,
            'api_access' => false,
            'email_notifications' => true,
            'sms_notifications' => true,
        ],
        'professional-plan-uuid' => [
            'max_professionals' => 10,
            'max_services' => 50,
            'max_bookings_per_month' => 1000,
            'max_clients' => 2000,
            'advanced_reports' => true,
            'custom_branding' => true,
            'api_access' => false,
            'email_notifications' => true,
            'sms_notifications' => true,
        ],
        'enterprise-plan-uuid' => [
            'max_professionals' => -1, // Sin límite
            'max_services' => -1,
            'max_bookings_per_month' => -1,
            'max_clients' => -1,
            'advanced_reports' => true,
            'custom_branding' => true,
            'api_access' => true,
            'email_notifications' => true,
            'sms_notifications' => true,
        ],
    ],

    'no_subscription_limits' => [
        'max_professionals' => 0,
        'max_services' => 0,
        'max_bookings_per_month' => 0,
        'max_clients' => 0,
        'advanced_reports' => false,
        'custom_branding' => false,
        'api_access' => false,
        'email_notifications' => false,
        'sms_notifications' => false,
    ],
];
