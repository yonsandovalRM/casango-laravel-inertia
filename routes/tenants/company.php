<?php

use App\Enums\Permissions;
use App\Http\Controllers\CompanyController;
use Illuminate\Support\Facades\Route;



Route::prefix('dashboard/company')->group(function () {
    Route::get('/', [CompanyController::class, 'index'])->name('company.index')->middleware('can:' . Permissions::COMPANY_VIEW);
    Route::put('/', [CompanyController::class, 'update'])->name('company.update')->middleware('can:' . Permissions::COMPANY_EDIT);
});
