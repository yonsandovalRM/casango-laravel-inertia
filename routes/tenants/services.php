<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ServicesController;


Route::group(['prefix' => 'services'], function () {
    Route::get('/', [ServicesController::class, 'index'])->name('services.index');
    Route::post('/', [ServicesController::class, 'store'])->name('services.store');
    Route::put('/{services}', [ServicesController::class, 'update'])->name('services.update');
    Route::delete('/{services}', [ServicesController::class, 'destroy'])->name('services.destroy');
});
