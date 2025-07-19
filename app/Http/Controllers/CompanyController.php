<?php

namespace App\Http\Controllers;

use App\Http\Requests\Company\UpdateCompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Services\CompanyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

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
                return response()->json([
                    'success' => false,
                    'error' => __('company.not_found')
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => CompanyResource::make($company)->toArray(request())
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching company data', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => __('company.fetch_error')
            ], 500);
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
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error'),
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading company page', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'error' => __('company.load_error')
            ]);
        }
    }

    /**
     * Actualizar configuración de empresa
     */
    public function update(UpdateCompanyRequest $request)
    {
        $this->companyService->updateCompany($request->validated());
        return redirect()->back()
            ->with('success', __('company.updated'));
    }

    /**
     * Actualizar configuración de videollamadas
     */
    public function updateVideoCallSettings(Request $request)
    {

        $request->validate([
            'allows_video_calls' => 'required|boolean'
        ]);

        $this->companyService->updateVideoCallSettings($request->allows_video_calls);

        $message = $request->allows_video_calls
            ? __('company.video_calls_enabled')
            : __('company.video_calls_disabled');

        return redirect()->back()->with('success', $message);
    }

    /**
     * Verificar si está abierto en una fecha/hora específica
     */
    public function checkOpenStatus(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'datetime' => 'required|date'
            ]);

            $datetime = \Carbon\Carbon::parse($request->datetime);
            $isOpen = $this->companyService->isOpenAt($datetime);

            return response()->json([
                'success' => true,
                'data' => [
                    'is_open' => $isOpen,
                    'datetime' => $datetime->toISOString(),
                    'formatted_datetime' => $datetime->format('Y-m-d H:i:s'),
                ]
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => __('company.validation_error'),
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error checking open status', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'datetime' => $request->datetime ?? null
            ]);

            return response()->json([
                'success' => false,
                'error' => __('company.open_status_check_error')
            ], 500);
        }
    }

    /**
     * Obtener horario para un día específico
     */
    public function getScheduleForDay(Request $request, string $dayOfWeek): JsonResponse
    {
        try {
            $request->merge(['day_of_week' => $dayOfWeek]);

            $request->validate([
                'day_of_week' => 'required|string|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'
            ]);

            $schedule = $this->companyService->getScheduleForDay($dayOfWeek);

            if (!$schedule) {
                return response()->json([
                    'success' => false,
                    'error' => __('company.schedule_not_found_for_day', ['day' => $dayOfWeek])
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $schedule
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => __('company.validation_error'),
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error fetching schedule for day', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'day_of_week' => $dayOfWeek
            ]);

            return response()->json([
                'success' => false,
                'error' => __('company.schedule_fetch_error')
            ], 500);
        }
    }

    /**
     * Validar horarios de la empresa (helper endpoint)
     */
    public function validateSchedules(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'schedules' => 'required|array',
                'schedules.*.day_of_week' => 'required|string|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
                'schedules.*.is_open' => 'required|boolean',
                'schedules.*.open_time' => 'required_if:schedules.*.is_open,true|nullable|date_format:H:i',
                'schedules.*.close_time' => 'required_if:schedules.*.is_open,true|nullable|date_format:H:i',
                'schedules.*.has_break' => 'boolean',
                'schedules.*.break_start_time' => 'nullable|date_format:H:i',
                'schedules.*.break_end_time' => 'nullable|date_format:H:i',
            ]);

            $schedules = $request->schedules;
            $errors = [];

            foreach ($schedules as $index => $schedule) {
                $scheduleErrors = $this->validateSingleSchedule($schedule);
                if (!empty($scheduleErrors)) {
                    $errors[$schedule['day_of_week']] = $scheduleErrors;
                }
            }

            return response()->json([
                'success' => true,
                'valid' => empty($errors),
                'errors' => $errors
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => __('company.validation_error'),
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error validating schedules', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => __('company.schedule_validation_error')
            ], 500);
        }
    }

    /**
     * Validar un horario individual
     */
    private function validateSingleSchedule(array $schedule): array
    {
        $errors = [];

        if (!$schedule['is_open']) {
            return $errors;
        }

        $openTime = $schedule['open_time'] ?? null;
        $closeTime = $schedule['close_time'] ?? null;
        $hasBreak = $schedule['has_break'] ?? false;
        $breakStart = $schedule['break_start_time'] ?? null;
        $breakEnd = $schedule['break_end_time'] ?? null;

        // Validar horarios de apertura y cierre
        if (!$openTime) {
            $errors[] = __('company.open_time_required');
        }

        if (!$closeTime) {
            $errors[] = __('company.close_time_required');
        }

        if ($openTime && $closeTime && $openTime >= $closeTime) {
            $errors[] = __('company.close_time_must_be_after_open_time');
        }

        // Validar horarios de descanso
        if ($hasBreak) {
            if (!$breakStart) {
                $errors[] = __('company.break_start_time_required');
            }

            if (!$breakEnd) {
                $errors[] = __('company.break_end_time_required');
            }

            if ($breakStart && $breakEnd && $breakStart >= $breakEnd) {
                $errors[] = __('company.break_end_time_must_be_after_break_start_time');
            }

            if ($breakStart && $openTime && $breakStart < $openTime) {
                $errors[] = __('company.break_start_must_be_after_open_time');
            }

            if ($breakEnd && $closeTime && $breakEnd > $closeTime) {
                $errors[] = __('company.break_end_must_be_before_close_time');
            }
        }

        return $errors;
    }
}
