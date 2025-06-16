<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;


Route::group(['prefix' => 'categories'], function () {
    Route::get('/', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('/', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('/{categories}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/{categories}', [CategoryController::class, 'destroy'])->name('categories.destroy');
});
