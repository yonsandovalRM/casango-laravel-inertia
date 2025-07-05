<?php

use App\Enums\Permissions;
use App\Http\Controllers\FormTemplateController;
use Illuminate\Support\Facades\Route;

Route::prefix('templates')->group(function () {
    Route::get('/', [FormTemplateController::class, 'index'])->name('templates.index')->middleware('can:' . Permissions::TEMPLATES_VIEW);
    Route::get('/builder', [FormTemplateController::class, 'builder'])->name('templates.builder')->middleware('can:' . Permissions::TEMPLATES_CREATE);
    Route::post('/', [FormTemplateController::class, 'store'])->name('templates.store')->middleware('can:' . Permissions::TEMPLATES_CREATE);
});
