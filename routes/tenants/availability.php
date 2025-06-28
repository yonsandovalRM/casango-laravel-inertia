<?php

use App\Http\Controllers\AvailabilityController;
use Illuminate\Support\Facades\Route;

Route::prefix('availability')->group(function () {
    // Obtener profesionales disponibles para un servicio en una fecha
    Route::get('/professionals', [AvailabilityController::class, 'getAvailableProfessionals'])
        ->name('availability.professionals');

    // Obtener disponibilidad de un profesional específico
    Route::get('/professional-schedule', [AvailabilityController::class, 'getProfessionalAvailability'])
        ->name('availability.professional-schedule');
});
