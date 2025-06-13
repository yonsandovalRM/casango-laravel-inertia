<?php

use App\Enums\Permissions;
use App\Http\Controllers\TenantController;
use Illuminate\Support\Facades\Route;

Route::prefix('tenants')->group(function () {
    Route::get('', [TenantController::class, 'index'])->name('tenants.index')->middleware('can:'.Permissions::TENANTS_VIEW);
    Route::post('', [TenantController::class, 'store'])->name('tenants.store');
    Route::get('/create', [TenantController::class, 'create'])->name('tenants.create');
    Route::delete('/{tenant}', [TenantController::class, 'destroy'])->name('tenants.destroy')->middleware('can:'.Permissions::TENANTS_DELETE);
});
