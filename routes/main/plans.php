<?php

use App\Enums\Permissions;
use App\Http\Controllers\PlanController;
use Illuminate\Support\Facades\Route;

Route::prefix('plans')->group(function () {
    Route::get('/', [PlanController::class, 'index'])->name('plans.index')->middleware('can:'.Permissions::PLANS_VIEW);
    Route::post('/', [PlanController::class, 'store'])->name('plans.store')->middleware('can:'.Permissions::PLANS_CREATE);
    Route::put('/{plan}', [PlanController::class, 'update'])->name('plans.update')->middleware('can:'.Permissions::PLANS_EDIT);
    Route::delete('/{plan}', [PlanController::class, 'destroy'])->name('plans.destroy')->middleware('can:'.Permissions::PLANS_DELETE);
});