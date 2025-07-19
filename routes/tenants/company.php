<?php

use App\Enums\Permissions;
use App\Http\Controllers\CompanyController;
use Illuminate\Support\Facades\Route;

Route::prefix('dashboard/company')->name('company.')->group(function () {
    // Main company pages
    Route::get('/', [CompanyController::class, 'index'])
        ->name('index')
        ->middleware('can:' . Permissions::COMPANY_VIEW);

    Route::put('/', [CompanyController::class, 'update'])
        ->name('update')
        ->middleware('can:' . Permissions::COMPANY_EDIT);

    // Video call settings
    Route::put('/video-calls', [CompanyController::class, 'updateVideoCallSettings'])
        ->name('video-calls.update')
        ->middleware('can:' . Permissions::COMPANY_EDIT);

    // These routes could be moved to API section for better separation
    Route::get('/schedule/{dayOfWeek}', [CompanyController::class, 'getScheduleForDay'])
        ->name('schedule.day')
        ->middleware('can:' . Permissions::COMPANY_VIEW);

    Route::post('/check-open', [CompanyController::class, 'checkOpenStatus'])
        ->name('check-open')
        ->middleware('can:' . Permissions::COMPANY_VIEW);


    /*  Route::get('/', [CompanyController::class, 'getCompany'])
        ->name('get')
        ->middleware('can:' . Permissions::COMPANY_VIEW); */
});
