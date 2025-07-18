<?php

use App\Enums\Permissions;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TenantController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

foreach (config('tenancy.central_domains') as $domain) {
    Route::domain($domain)->group(function () {
        Route::get('/', [HomeController::class, 'index'])->name('home');
        require __DIR__ . '/auth.php';

        Route::middleware(['auth', 'verified'])->group(function () {
            Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        });

        require __DIR__ . '/main/tenants.php';
        Route::middleware('auth')->group(function () {
            require __DIR__ . '/settings.php';
            require __DIR__ . '/main/plans.php';

            require __DIR__ . '/common/invitations.php';
            require __DIR__ . '/common/users.php';
        });
    });
}
