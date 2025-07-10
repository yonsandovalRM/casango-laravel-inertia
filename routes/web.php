<?php

use App\Enums\Permissions;
use App\Http\Controllers\CentralOAuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TenantController;
use App\Http\Middleware\ValidateTenantParameter;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

foreach (config('tenancy.central_domains') as $domain) {
    Route::domain($domain)->group(function () {
        Route::get('/', [HomeController::class, 'index'])->name('home');
        require __DIR__ . '/auth.php';

        Route::middleware('guest')->group(function () {
            Route::get('/auth/google', [CentralOAuthController::class, 'redirectToGoogle'])
                ->middleware(ValidateTenantParameter::class)
                ->name('central.google.redirect');

            Route::get('/auth/google/callback', [CentralOAuthController::class, 'handleGoogleCallback'])
                ->name('central.google.callback');

            Route::get('/auth/microsoft', [CentralOAuthController::class, 'redirectToMicrosoft'])
                ->middleware(ValidateTenantParameter::class)
                ->name('central.microsoft.redirect');

            Route::get('/auth/microsoft/callback', [CentralOAuthController::class, 'handleMicrosoftCallback'])
                ->name('central.microsoft.callback');
        });

        Route::middleware(['auth', 'verified'])->group(function () {
            Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        });

        require __DIR__ . '/main/tenants.php';
        require __DIR__ . '/main/payments.php';

        Route::middleware('auth')->group(function () {
            require __DIR__ . '/settings.php';
            require __DIR__ . '/main/plans.php';

            require __DIR__ . '/common/invitations.php';
            require __DIR__ . '/common/users.php';
        });
    });
}
