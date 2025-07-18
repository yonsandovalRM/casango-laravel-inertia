<?php

use App\Enums\Permissions;
use App\Http\Controllers\CompanyController;
use Illuminate\Support\Facades\Route;

Route::prefix('dashboard/company')->group(function () {
    Route::get('/', [CompanyController::class, 'index'])->name('company.index')->middleware('can:' . Permissions::COMPANY_VIEW);
    Route::put('/', [CompanyController::class, 'update'])->name('company.update')->middleware('can:' . Permissions::COMPANY_EDIT);

    // Nuevas rutas para configuración de videollamadas
    Route::put('/video-calls', [CompanyController::class, 'updateVideoCallSettings'])->name('company.video-calls.update')->middleware('can:' . Permissions::COMPANY_EDIT);
    Route::get('/schedule/{dayOfWeek}', [CompanyController::class, 'getScheduleForDay'])->name('company.schedule.day')->middleware('can:' . Permissions::COMPANY_VIEW);
    Route::post('/check-open', [CompanyController::class, 'checkOpenStatus'])->name('company.check-open')->middleware('can:' . Permissions::COMPANY_VIEW);
});
