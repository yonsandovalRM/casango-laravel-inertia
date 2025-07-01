<?php

use App\Enums\Permissions;
use App\Http\Controllers\BookingController;
use Illuminate\Support\Facades\Route;


Route::group(['prefix' => 'dashboard/bookings'], function () {
    Route::get('/', [BookingController::class, 'index'])->name('bookings.index')->middleware('can:' . Permissions::BOOKINGS_VIEW);
    Route::post('/', [BookingController::class, 'store'])->name('bookings.store')->middleware('can:' . Permissions::BOOKINGS_CREATE);
    Route::put('/{booking}', [BookingController::class, 'update'])->name('bookings.update')->middleware('can:' . Permissions::BOOKINGS_EDIT);
    Route::delete('/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy')->middleware('can:' . Permissions::BOOKINGS_DELETE);
});
