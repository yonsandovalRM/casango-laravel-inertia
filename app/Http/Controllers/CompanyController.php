<?php

namespace App\Http\Controllers;

use App\Http\Requests\Company\UpdateCompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Services\CompanyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function __construct(
        private CompanyService $companyService
    ) {}

    /**
     * Obtener información de la empresa (API)
     */
    public function getCompany(): JsonResponse
    {
        try {
            $company = $this->companyService->getCompanyWithSchedules();

            if (!$company) {
                return response()->json(['error' => __('company.not_found')], 404);
            }

            return response()->json(
                CompanyResource::make($company)->toArray(request())
            );
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Mostrar página de configuración de empresa
     */
    public function index()
    {
        try {
            $configuration = $this->companyService->getCompanyConfiguration();

            return Inertia::render('company/index', [
                'company' => $configuration,
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Actualizar configuración de empresa
     */
    public function update(UpdateCompanyRequest $request)
    {
        try {
            $this->companyService->updateCompany($request->validated());
            return redirect()->route('company.index')->with('success', __('company.updated'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    /**
     * Actualizar configuración de videollamadas
     */
    public function updateVideoCallSettings(Request $request)
    {
        $request->validate([
            'allows_video_calls' => 'required|boolean'
        ]);

        try {
            $this->companyService->updateVideoCallSettings($request->allows_video_calls);

            $message = $request->allows_video_calls
                ? __('company.video_calls_enabled')
                : __('company.video_calls_disabled');

            return back()->with('success', $message);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Verificar si está abierto en una fecha/hora específica
     */
    public function checkOpenStatus(Request $request): JsonResponse
    {
        $request->validate([
            'datetime' => 'required|date'
        ]);

        try {
            $datetime = \Carbon\Carbon::parse($request->datetime);
            $isOpen = $this->companyService->isOpenAt($datetime);

            return response()->json([
                'is_open' => $isOpen,
                'datetime' => $datetime->toISOString(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Obtener horario para un día específico
     */
    public function getScheduleForDay(Request $request): JsonResponse
    {
        $request->validate([
            'day_of_week' => 'required|string|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'
        ]);

        try {
            $schedule = $this->companyService->getScheduleForDay($request->day_of_week);

            if (!$schedule) {
                return response()->json(['error' => __('company.schedule_not_found')], 404);
            }

            return response()->json($schedule);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
