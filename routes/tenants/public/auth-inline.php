<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;

Route::post('/login-inline', [AuthenticatedSessionController::class, 'loginInline'])->name('auth.login-inline');
Route::post('/register-inline', [RegisteredUserController::class, 'registerInline'])->name('auth.register-inline');
