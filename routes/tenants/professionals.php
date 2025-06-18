<?php

use App\Enums\Permissions;
use App\Http\Controllers\ExceptionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfessionalController;


Route::group(['prefix' => 'professional'], function () {
    Route::get('/', [ProfessionalController::class, 'me'])->name('professional.me')->middleware('can:' . Permissions::PROFESSIONAL_PROFILE_VIEW);
    Route::put('/', [ProfessionalController::class, 'updateMe'])->name('professional.update.me')->middleware('can:' . Permissions::PROFESSIONAL_PROFILE_EDIT);
    Route::put('/schedule', [ProfessionalController::class, 'updateSchedule'])->name('professional.schedule.update')->middleware('can:' . Permissions::PROFESSIONAL_PROFILE_EDIT);
    Route::post('/exceptions', [ExceptionController::class, 'store'])->name('professional.exceptions.store')->middleware('can:' . Permissions::PROFESSIONAL_EXCEPTIONS_CREATE);
    Route::delete('/exceptions/{exception}', [ExceptionController::class, 'destroy'])->name('professional.exceptions.destroy')->middleware('can:' . Permissions::PROFESSIONAL_EXCEPTIONS_DELETE);
});

Route::group(['prefix' => 'professionals'], function () {
    Route::get('/', [ProfessionalController::class, 'index'])->name('professionals.index')->middleware('can:' . Permissions::PROFESSIONALS_VIEW);
    Route::put('/{professional}', [ProfessionalController::class, 'update'])->name('professionals.update')->middleware('can:' . Permissions::PROFESSIONALS_EDIT);
    Route::delete('/{professional}', [ProfessionalController::class, 'destroy'])->name('professionals.destroy')->middleware('can:' . Permissions::PROFESSIONALS_DELETE);
});
