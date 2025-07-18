<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ServicesController;

Route::get('/get-services', [ServicesController::class, 'getServices'])->name('services.get-services');

// Nuevas rutas públicas para filtrar servicios por tipo
Route::get('/get-services/video-call', [ServicesController::class, 'videoCallServices'])->name('services.get-video-call');
Route::get('/get-services/in-person', [ServicesController::class, 'inPersonServices'])->name('services.get-in-person');
Route::get('/get-services/search', [ServicesController::class, 'search'])->name('services.get-search');
