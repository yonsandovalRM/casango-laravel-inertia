<?php

namespace App\Http\Controllers;

use App\Services\AvailabilityService;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    public function __construct(
        private AvailabilityService $availabilityService
    ) {}

    /**
     * Obtener todos los profesionales disponibles para un servicio en una fecha específica
     */
    public function getAvailableProfessionals(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date|after_or_equal:today',
        ]);

        try {
            $result = $this->availabilityService->getAvailableProfessionals(
                $request->service_id,
                $request->date
            );

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Obtener bloques de tiempo para un profesional específico
     */
    public function getProfessionalAvailability(Request $request)
    {
        $request->validate([
            'professional_id' => 'required|exists:professionals,id',
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date|after_or_equal:today',
        ]);

        try {
            $result = $this->availabilityService->getProfessionalAvailability(
                $request->professional_id,
                $request->service_id,
                $request->date
            );

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], $e->getMessage() === __('availability.professional_service_not_found') ? 404 : 400);
        }
    }
}
