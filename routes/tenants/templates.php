<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FormTemplateController;

Route::prefix('dashboard/form-templates')->name('form-templates.')->group(function () {
    Route::get('/', [FormTemplateController::class, 'index'])->name('index');
    Route::get('/create', [FormTemplateController::class, 'create'])->name('create');
    Route::post('/', [FormTemplateController::class, 'store'])->name('store');
    Route::get('/{template}', [FormTemplateController::class, 'show'])->name('show');
    Route::get('/{template}/edit', [FormTemplateController::class, 'edit'])->name('edit');
    Route::put('/{template}', [FormTemplateController::class, 'update'])->name('update');
    Route::delete('/{template}', [FormTemplateController::class, 'destroy'])->name('destroy');
    Route::patch('/{template}/toggle', [FormTemplateController::class, 'toggle'])->name('toggle');
    Route::post('/{template}/duplicate', [FormTemplateController::class, 'duplicate'])->name('duplicate');
});
