<?php

use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::prefix('payments')->name('tenants.payment.')->group(function () {
    // Rutas públicas para callbacks de MercadoPago
    Route::post('webhook', [PaymentController::class, 'webhook'])->name('webhook');
    Route::get('success', [PaymentController::class, 'success'])->name('success');
    Route::get('failure', [PaymentController::class, 'failure'])->name('failure');
    Route::get('pending', [PaymentController::class, 'pending'])->name('pending');

    // Rutas protegidas
    Route::middleware('auth')->group(function () {
        Route::post('setup', [PaymentController::class, 'setupPayment'])->name('setup');
        Route::get('status/{subscription}', [PaymentController::class, 'getSubscriptionStatus'])->name('status');
        Route::post('cancel/{subscription}', [PaymentController::class, 'cancelSubscription'])->name('cancel');
    });
});
