<?php

use App\Enums\Permissions;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('usuarios', [UserController::class, 'index'])->name('users.index')->middleware('can:'.Permissions::USERS_VIEW);
Route::delete('usuarios/{user}', [UserController::class, 'destroy'])->name('users.destroy')->middleware('can:'.Permissions::USERS_DELETE);
