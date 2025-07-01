<?php

use App\Enums\Permissions;
use App\Http\Controllers\BookingController;
use Illuminate\Support\Facades\Route;


Route::group(['prefix' => 'dashboard/bookings'], function () {
    Route::get('/client', [BookingController::class, 'client'])->name('bookings.client')->middleware('can:' . Permissions::BOOKINGS_VIEW);
    Route::get('/professional', [BookingController::class, 'professional'])->name('bookings.professional')->middleware('can:' . Permissions::BOOKINGS_VIEW);
    Route::post('/', [BookingController::class, 'store'])->name('bookings.store')->middleware('can:' . Permissions::BOOKINGS_CREATE);
    Route::put('/{booking}', [BookingController::class, 'update'])->name('bookings.update')->middleware('can:' . Permissions::BOOKINGS_EDIT);
    Route::delete('/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy')->middleware('can:' . Permissions::BOOKINGS_DELETE);
});
