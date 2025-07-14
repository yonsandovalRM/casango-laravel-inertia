<?php

use App\Enums\Permissions;
use App\Http\Controllers\TenantSubscriptionController;
use Illuminate\Support\Facades\Route;

/* PERMISOS :
Permissions::SUBSCRIPTION_VIEW
Permissions::SUBSCRIPTION_MANAGE
 */

Route::group(['prefix' => 'dashboard/subscription'], function () {});
