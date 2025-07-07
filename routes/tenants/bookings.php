<?php

use App\Enums\Permissions;
use App\Http\Controllers\BookingController;
use Illuminate\Support\Facades\Route;


Route::group(['prefix' => 'dashboard/bookings'], function () {
    Route::get('/client', [BookingController::class, 'historyClient'])->name('bookings.client')->middleware('can:' . Permissions::BOOKINGS_VIEW);
    Route::get('/professional', [BookingController::class, 'historyProfessional'])->name('bookings.professional')->middleware('can:' . Permissions::BOOKINGS_VIEW);
    Route::get('/', [BookingController::class, 'index'])->name('bookings.index')->middleware('can:' . Permissions::BOOKINGS_CREATE);
    Route::get('/{booking}', [BookingController::class, 'show'])->name('bookings.show')->middleware('can:' . Permissions::BOOKINGS_VIEW);
    Route::post('/', [BookingController::class, 'store'])->name('bookings.store')->middleware('can:' . Permissions::BOOKINGS_CREATE);
    Route::put('/{booking}', [BookingController::class, 'update'])->name('bookings.update')->middleware('can:' . Permissions::BOOKINGS_EDIT);
    Route::delete('/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy')->middleware('can:' . Permissions::BOOKINGS_DELETE);

    Route::post('/{booking}/form-data/user-profile', [BookingController::class, 'storeFormDataUserProfile'])->name('bookings.form-data.store.user-profile')->middleware('can:' . Permissions::BOOKINGS_CREATE);
    Route::post('/{booking}/form-data/booking-form', [BookingController::class, 'storeFormDataBookingForm'])->name('bookings.form-data.store.booking-form')->middleware('can:' . Permissions::BOOKINGS_CREATE);
});
