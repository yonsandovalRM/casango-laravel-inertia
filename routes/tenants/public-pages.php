<?php

use App\Http\Controllers\BookingsController;
use App\Http\Controllers\TenantHomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('public')->group(function () {
    Route::get('services', [TenantHomeController::class, 'services'])->name('public.services');
});
