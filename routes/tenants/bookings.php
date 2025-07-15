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

    // Nuevas rutas para acciones del calendario
    Route::post('/{booking}/confirm', [BookingController::class, 'confirm'])->name('bookings.confirm')->middleware('can:' . Permissions::BOOKINGS_EDIT);
    Route::post('/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel')->middleware('can:' . Permissions::BOOKINGS_EDIT);
    Route::post('/{booking}/complete', [BookingController::class, 'complete'])->name('bookings.complete')->middleware('can:' . Permissions::BOOKINGS_EDIT);
    Route::post('/{booking}/no-show', [BookingController::class, 'noShow'])->name('bookings.no-show')->middleware('can:' . Permissions::BOOKINGS_EDIT);
    Route::post('/{booking}/reschedule', [BookingController::class, 'reschedule'])->name('bookings.reschedule')->middleware('can:' . Permissions::BOOKINGS_EDIT);

    // Ruta para obtener datos del calendario con filtros
    Route::get('/calendar/data', [BookingController::class, 'calendar'])->name('bookings.calendar')->middleware('can:' . Permissions::BOOKINGS_VIEW);

    // Ruta para formulario de perfil de usuario (sin cambios)
    Route::post('/{booking}/form-data/user-profile', [BookingController::class, 'storeFormDataUserProfile'])
        ->name('bookings.form-data.store.user-profile')
        ->middleware('can:' . Permissions::BOOKINGS_CREATE);

    // Nueva ruta para múltiples formularios de booking con template específico
    Route::post('/{booking}/form-data/booking-form/{templateId}', [BookingController::class, 'storeFormDataBookingForm'])
        ->name('bookings.form-data.store.booking-form')
        ->middleware('can:' . Permissions::BOOKINGS_CREATE);

    // Nuevas rutas para funcionalidades adicionales
    Route::post('/{booking}/form-data/clone', [BookingController::class, 'cloneFormData'])
        ->name('bookings.form-data.clone')
        ->middleware('can:' . Permissions::BOOKINGS_CREATE);

    Route::get('/{booking}/form-data/export', [BookingController::class, 'exportFormData'])
        ->name('bookings.form-data.export')
        ->middleware('can:' . Permissions::BOOKINGS_VIEW);
});
