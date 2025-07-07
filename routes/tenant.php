<?php

declare(strict_types=1);

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\TenantDashboardController;
use App\Http\Controllers\TenantHomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {

    Route::get('/', [TenantHomeController::class, 'index'])->name('home');
    require __DIR__ . '/auth.php';
    require __DIR__ . '/tenants/public/services.php';
    require __DIR__ . '/tenants/public/bookings.php';
    require __DIR__ . '/tenants/public/availability.php';
    require __DIR__ . '/tenants/public/auth-inline.php';


    Route::middleware('auth')->group(function () {
        Route::get('dashboard', [TenantDashboardController::class, 'index'])->name('dashboard');
        require __DIR__ . '/tenants/company.php';
        require __DIR__ . '/tenants/subscription.php';
        require __DIR__ . '/tenants/templates.php';
        require __DIR__ . '/settings.php';
        require __DIR__ . '/common/invitations.php';
        require __DIR__ . '/common/users.php';
        require __DIR__ . '/tenants/services.php';
        require __DIR__ . '/tenants/categories.php';
        require __DIR__ . '/tenants/professionals.php';
        require __DIR__ . '/tenants/bookings.php';
    });
});
