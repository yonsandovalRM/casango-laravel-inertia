<?php

use App\Enums\Permissions;
use App\Http\Controllers\BookingController;
use Illuminate\Support\Facades\Route;

Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index')->middleware('can:' . Permissions::BOOKINGS_VIEW);
