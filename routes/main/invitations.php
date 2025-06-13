<?php

use App\Enums\Permissions;
use App\Http\Controllers\InvitationController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'invitations'], function () {
    Route::get('/{token}', [InvitationController::class, 'form'])->name('invitations.form');
    Route::post('/{token}', [InvitationController::class, 'accept'])->name('invitations.accept');

    Route::middleware('auth')->group(function () {
        Route::get('/', [InvitationController::class, 'index'])->name('invitations.index')->middleware('can:'.Permissions::INVITATIONS_VIEW);
        Route::post('/', [InvitationController::class, 'store'])->name('invitations.store')->middleware('can:'.Permissions::INVITATIONS_CREATE);
    });
});