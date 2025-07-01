<?php

use App\Http\Controllers\CompanyController;
use Illuminate\Support\Facades\Route;



Route::prefix('dashboard/company')->group(function () {
    Route::get('/', [CompanyController::class, 'index'])->name('company.index');
    Route::put('/', [CompanyController::class, 'update'])->name('company.update');
});
