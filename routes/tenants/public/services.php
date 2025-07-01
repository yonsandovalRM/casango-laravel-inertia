<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ServicesController;




Route::get('/get-services', [ServicesController::class, 'getServices'])->name('services.get-services');
