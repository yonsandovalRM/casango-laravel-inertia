<?php

use App\Enums\Permissions;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;


Route::group(['prefix' => 'categories'], function () {
    Route::get('/', [CategoryController::class, 'index'])->name('categories.index')->middleware('can:' . Permissions::CATEGORIES_VIEW);
    Route::post('/', [CategoryController::class, 'store'])->name('categories.store')->middleware('can:' . Permissions::CATEGORIES_CREATE);
    Route::put('/{category}', [CategoryController::class, 'update'])->name('categories.update')->middleware('can:' . Permissions::CATEGORIES_EDIT);
    Route::delete('/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy')->middleware('can:' . Permissions::CATEGORIES_DELETE);
    Route::post('/inline', [CategoryController::class, 'storeInline'])->name('categories.store.inline')->middleware('can:' . Permissions::CATEGORIES_CREATE);
});
