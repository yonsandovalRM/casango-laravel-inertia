<?php

use App\Enums\Permissions;
use App\Http\Controllers\TenantCategoryController;
use Illuminate\Support\Facades\Route;

Route::prefix('dashboard/business-categories')->group(function () {
    Route::get('', [TenantCategoryController::class, 'index'])->name('tenant-categories.index')->middleware('can:' . Permissions::TENANT_CATEGORIES_VIEW);
    Route::post('', [TenantCategoryController::class, 'store'])->name('tenant-categories.store')->middleware('can:' . Permissions::TENANT_CATEGORIES_CREATE);
    Route::put('/{tenantCategory}', [TenantCategoryController::class, 'update'])->name('tenant-categories.update')->middleware('can:' . Permissions::TENANT_CATEGORIES_EDIT);
    Route::delete('/{tenantCategory}', [TenantCategoryController::class, 'destroy'])->name('tenant-categories.destroy')->middleware('can:' . Permissions::TENANT_CATEGORIES_DELETE);
});
