<?php

use App\Enums\Permissions;
use App\Http\Controllers\TenantSubscriptionController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'dashboard/subscription'], function () {
    Route::get('/', [TenantSubscriptionController::class, 'index'])
        ->name('tenant.subscription.index')
        ->middleware('can:' . Permissions::SUBSCRIPTION_VIEW);

    Route::get('/status', [TenantSubscriptionController::class, 'getStatus'])
        ->name('tenant.subscription.status')
        ->middleware('can:' . Permissions::SUBSCRIPTION_VIEW);

    Route::post('/setup-payment', [TenantSubscriptionController::class, 'setupPayment'])
        ->name('tenant.subscription.setup-payment')
        ->middleware('can:' . Permissions::SUBSCRIPTION_MANAGE);

    Route::post('/create', [TenantSubscriptionController::class, 'create'])
        ->name('tenant.subscription.create')
        ->middleware('can:' . Permissions::SUBSCRIPTION_MANAGE);

    Route::post('/update', [TenantSubscriptionController::class, 'update'])
        ->name('tenant.subscription.update')
        ->middleware('can:' . Permissions::SUBSCRIPTION_MANAGE);

    Route::post('/upgrade', [TenantSubscriptionController::class, 'upgrade'])
        ->name('tenant.subscription.upgrade')
        ->middleware('can:' . Permissions::SUBSCRIPTION_MANAGE);

    Route::post('/downgrade', [TenantSubscriptionController::class, 'downgrade'])
        ->name('tenant.subscription.downgrade')
        ->middleware('can:' . Permissions::SUBSCRIPTION_MANAGE);

    Route::post('/renew', [TenantSubscriptionController::class, 'renew'])
        ->name('tenant.subscription.renew')
        ->middleware('can:' . Permissions::SUBSCRIPTION_MANAGE);

    Route::post('/reactivate', [TenantSubscriptionController::class, 'reactivate'])
        ->name('tenant.subscription.reactivate')
        ->middleware('can:' . Permissions::SUBSCRIPTION_MANAGE);

    Route::post('/cancel', [TenantSubscriptionController::class, 'cancel'])
        ->name('tenant.subscription.cancel')
        ->middleware('can:' . Permissions::SUBSCRIPTION_MANAGE);

    Route::get('/show', [TenantSubscriptionController::class, 'show'])
        ->name('tenant.subscription.show')
        ->middleware('can:' . Permissions::SUBSCRIPTION_VIEW);

    Route::get('/edit', [TenantSubscriptionController::class, 'edit'])
        ->name('tenant.subscription.edit')
        ->middleware('can:' . Permissions::SUBSCRIPTION_MANAGE);
});
