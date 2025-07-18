<?php

use App\Enums\Permissions;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ServicesController;

Route::group(['prefix' => 'dashboard/services'], function () {
    Route::get('/', [ServicesController::class, 'index'])->name('services.index')->middleware('can:' . Permissions::SERVICES_VIEW);
    Route::post('/', [ServicesController::class, 'store'])->name('services.store')->middleware('can:' . Permissions::SERVICES_CREATE);
    Route::put('/{service}', [ServicesController::class, 'update'])->name('services.update')->middleware('can:' . Permissions::SERVICES_EDIT);
    Route::delete('/{service}', [ServicesController::class, 'destroy'])->name('services.destroy')->middleware('can:' . Permissions::SERVICES_DELETE);

    // Nuevas rutas para búsqueda y filtros
    Route::get('/search', [ServicesController::class, 'search'])->name('services.search')->middleware('can:' . Permissions::SERVICES_VIEW);
    Route::get('/by-category', [ServicesController::class, 'byCategory'])->name('services.by-category')->middleware('can:' . Permissions::SERVICES_VIEW);
    Route::get('/video-call', [ServicesController::class, 'videoCallServices'])->name('services.video-call')->middleware('can:' . Permissions::SERVICES_VIEW);
    Route::get('/in-person', [ServicesController::class, 'inPersonServices'])->name('services.in-person')->middleware('can:' . Permissions::SERVICES_VIEW);
});
