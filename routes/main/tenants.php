<?php

use App\Enums\Permissions;
use App\Http\Controllers\TenantController;
use Illuminate\Support\Facades\Route;

Route::get('negocios', [TenantController::class, 'index'])->name('tenants.index')->middleware('can:'.Permissions::TENANTS_VIEW);
Route::post('negocios', [TenantController::class, 'store'])->name('tenants.store');
Route::get('negocios/crear', [TenantController::class, 'create'])->name('tenants.create');
Route::delete('negocios/{tenant}', [TenantController::class, 'destroy'])->name('tenants.destroy')->middleware('can:'.Permissions::TENANTS_DELETE);