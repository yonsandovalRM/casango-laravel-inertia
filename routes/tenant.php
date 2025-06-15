<?php

declare(strict_types=1);

use App\Http\Controllers\CompanyController;
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

    Route::get('company', [CompanyController::class, 'index'])->name('company.index');
    Route::put('company', [CompanyController::class, 'update'])->name('company.update');

    require __DIR__.'/auth.php';
    require __DIR__.'/settings.php';

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
