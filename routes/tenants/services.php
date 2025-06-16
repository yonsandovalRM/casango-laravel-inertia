<?php

use App\Enums\Permissions;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ServicesController;


Route::group(['prefix' => 'services'], function () {
    Route::get('/', [ServicesController::class, 'index'])->name('services.index')->middleware('can:' . Permissions::SERVICES_VIEW);
    Route::post('/', [ServicesController::class, 'store'])->name('services.store')->middleware('can:' . Permissions::SERVICES_CREATE);
    Route::put('/{service}', [ServicesController::class, 'update'])->name('services.update')->middleware('can:' . Permissions::SERVICES_EDIT);
    Route::delete('/{service}', [ServicesController::class, 'destroy'])->name('services.destroy')->middleware('can:' . Permissions::SERVICES_DELETE);
});
