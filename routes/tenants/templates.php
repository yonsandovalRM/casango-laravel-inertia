<?php

use App\Enums\Permissions;
use App\Http\Controllers\FormEntryController;
use App\Http\Controllers\FormTemplateController;
use Illuminate\Support\Facades\Route;

Route::prefix('templates')->group(function () {
    Route::get('/', [FormTemplateController::class, 'builder'])->name('templates.builder')->middleware('can:' . Permissions::TEMPLATES_CREATE);
    Route::put('/', [FormTemplateController::class, 'update'])->name('templates.update')->middleware('can:' . Permissions::TEMPLATES_EDIT);
    Route::get('/stats', [FormTemplateController::class, 'getFieldStats'])->name('templates.stats')->middleware('can:' . Permissions::TEMPLATES_VIEW);
    Route::get('/field/{field}/entries', [FormTemplateController::class, 'showFieldEntries'])->name('templates.field.entries')->middleware('can:' . Permissions::TEMPLATES_VIEW);
});




Route::prefix('entries')->group(function () {
    Route::get('/', [FormEntryController::class, 'index'])->name('entries.index')->middleware('can:' . Permissions::TEMPLATES_VIEW);
    Route::get('/create', [FormEntryController::class, 'create'])->name('entries.create')->middleware('can:' . Permissions::TEMPLATES_CREATE);
    Route::post('/', [FormEntryController::class, 'store'])->name('entries.store')->middleware('can:' . Permissions::TEMPLATES_CREATE);
    Route::get('/{formEntry}', [FormEntryController::class, 'show'])->name('entries.show')->middleware('can:' . Permissions::TEMPLATES_VIEW);
    Route::get('/{formEntry}/edit', [FormEntryController::class, 'edit'])->name('entries.edit')->middleware('can:' . Permissions::TEMPLATES_EDIT);
    Route::put('/{formEntry}', [FormEntryController::class, 'update'])->name('entries.update')->middleware('can:' . Permissions::TEMPLATES_EDIT);
    Route::delete('/{formEntry}', [FormEntryController::class, 'destroy'])->name('entries.destroy')->middleware('can:' . Permissions::TEMPLATES_DELETE);
});
