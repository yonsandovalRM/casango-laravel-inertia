<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\PlanController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

foreach (config('tenancy.central_domains') as $domain) {
    Route::domain($domain)->group(function () {
        Route::get('/', [HomeController::class, 'index'])->name('home');

        Route::middleware(['auth', 'verified'])->group(function () {
            Route::get('dashboard', function () {
                return Inertia::render('dashboard');
            })->name('dashboard');
        });

        Route::get('plans', [PlanController::class, 'index'])->name('plans.index');

        require __DIR__.'/settings.php';
        require __DIR__.'/auth.php';
    });
}
