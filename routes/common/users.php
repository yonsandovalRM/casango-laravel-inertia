<?php

use App\Enums\Permissions;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('users')->group(function () {
    Route::get('', [UserController::class, 'index'])->name('users.index')->middleware('can:'.Permissions::USERS_VIEW);
    Route::put('/{user}', [UserController::class, 'update'])->name('users.update')->middleware('can:'.Permissions::USERS_EDIT);
    Route::delete('/{user}', [UserController::class, 'destroy'])->name('users.destroy')->middleware('can:'.Permissions::USERS_DELETE);
});
