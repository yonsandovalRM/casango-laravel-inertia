<?php

use App\Http\Controllers\BookingsController;
use App\Http\Controllers\TenantHomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('bookings', [TenantHomeController::class, 'bookings'])->name('home.bookings');
Route::get('bookings/{service_id}', [TenantHomeController::class, 'bookingsService'])->name('home.bookings.service');
