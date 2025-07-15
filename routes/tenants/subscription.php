<?php

use App\Enums\Permissions;
use App\Http\Controllers\Tenants\SubscriptionController;
use Illuminate\Support\Facades\Route;


Route::group(['prefix' => 'dashboard/subscription'], function () {
    Route::get('/', [SubscriptionController::class, 'index'])->name('tenant.subscription.index')->middleware('can:' . Permissions::SUBSCRIPTION_VIEW);
    Route::post('/', [SubscriptionController::class, 'store'])->name('tenant.subscription.store')->middleware('can:' . Permissions::SUBSCRIPTION_MANAGE);
    Route::get('/success', [SubscriptionController::class, 'success'])->name('tenant.subscription.success')->middleware('can:' . Permissions::SUBSCRIPTION_MANAGE);
    Route::post('/cancel', [SubscriptionController::class, 'cancel'])->name('tenant.subscription.cancel')->middleware('can:' . Permissions::SUBSCRIPTION_MANAGE);
    Route::post('/reactivate', [SubscriptionController::class, 'reactivate'])->name('tenant.subscription.reactivate')->middleware('can:' . Permissions::SUBSCRIPTION_MANAGE);
    Route::post('/change-plan', [SubscriptionController::class, 'changePlan'])->name('tenant.subscription.change-plan')->middleware('can:' . Permissions::SUBSCRIPTION_MANAGE);
});
