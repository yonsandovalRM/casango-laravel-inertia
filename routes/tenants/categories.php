<?php

use App\Enums\Permissions;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;

Route::group(['prefix' => 'dashboard/categories'], function () {
    // Rutas principales CRUD
    Route::get('/', [CategoryController::class, 'index'])
        ->name('categories.index')
        ->middleware('can:' . Permissions::CATEGORIES_VIEW);

    Route::post('/', [CategoryController::class, 'store'])
        ->name('categories.store')
        ->middleware('can:' . Permissions::CATEGORIES_CREATE);

    Route::put('/{category}', [CategoryController::class, 'update'])
        ->name('categories.update')
        ->middleware('can:' . Permissions::CATEGORIES_EDIT);

    Route::delete('/{category}', [CategoryController::class, 'destroy'])
        ->name('categories.destroy')
        ->middleware('can:' . Permissions::CATEGORIES_DELETE);

    // Ruta para formularios inline (creación rápida)
    Route::post('/inline', [CategoryController::class, 'storeInline'])
        ->name('categories.store.inline')
        ->middleware('can:' . Permissions::CATEGORIES_CREATE);

    // Nuevas rutas para funcionalidades avanzadas
    Route::get('/analytics', [CategoryController::class, 'analytics'])
        ->name('categories.analytics')
        ->middleware('can:' . Permissions::CATEGORIES_VIEW);

    Route::get('/export', [CategoryController::class, 'export'])
        ->name('categories.export')
        ->middleware('can:' . Permissions::CATEGORIES_VIEW);

    // Rutas para operaciones en lote
    Route::post('/bulk-delete', [CategoryController::class, 'bulkDelete'])
        ->name('categories.bulk-delete')
        ->middleware('can:' . Permissions::CATEGORIES_DELETE);

    Route::post('/bulk-toggle-status', [CategoryController::class, 'bulkToggleStatus'])
        ->name('categories.bulk-toggle-status')
        ->middleware('can:' . Permissions::CATEGORIES_EDIT);

    // Ruta para duplicar categoría
    Route::post('/{category}/duplicate', [CategoryController::class, 'duplicate'])
        ->name('categories.duplicate')
        ->middleware('can:' . Permissions::CATEGORIES_CREATE);

    // Ruta para toggle rápido de estado
    Route::patch('/{category}/toggle-status', [CategoryController::class, 'toggleStatus'])
        ->name('categories.toggle-status')
        ->middleware('can:' . Permissions::CATEGORIES_EDIT);

    // Rutas API para filtros y búsqueda
    Route::get('/search', [CategoryController::class, 'search'])
        ->name('categories.search')
        ->middleware('can:' . Permissions::CATEGORIES_VIEW);

    Route::get('/filters', [CategoryController::class, 'getFilters'])
        ->name('categories.filters')
        ->middleware('can:' . Permissions::CATEGORIES_VIEW);
});
