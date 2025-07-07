<?php

use App\Enums\Permissions;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'dashboard/subscription'], function () {
    Route::get('/', [App\Http\Controllers\TenantSubscriptionController::class, 'index'])->name('tenant.subscription.index')->middleware('can:' . Permissions::SUBSCRIPTION_VIEW);
});
