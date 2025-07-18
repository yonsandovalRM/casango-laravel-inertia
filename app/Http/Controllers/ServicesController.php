<?php

namespace App\Http\Controllers;

use App\Http\Requests\Services\StoreServicesRequest;
use App\Http\Requests\Services\UpdateServicesRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ServiceResource;
use App\Models\Category;
use App\Models\Service;
use App\Services\ServiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServicesController extends Controller
{
    public function __construct(
        private ServiceService $serviceService
    ) {}

    /**
     * Obtener servicios para API pública
     */
    public function getServices(): JsonResponse
    {
        try {
            $data = $this->serviceService->getServicesForPublic();

            return response()->json([
                'services' => ServiceResource::collection($data['services'])->toArray(request()),
                'company_allows_video_calls' => $data['company_allows_video_calls'],
                'available_service_types' => $data['available_service_types'],
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Mostrar listado de servicios en dashboard
     */
    public function index()
    {
        try {
            $categories = Category::where('is_active', true)->get();
            $services = $this->serviceService->getActiveServices();
            $statistics = $this->serviceService->getServiceStatistics();

            return Inertia::render('services/index', [
                'services' => ServiceResource::collection($services)->toArray(request()),
                'categories' => CategoryResource::collection($categories)->toArray(request()),
                'statistics' => $statistics,
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Crear nuevo servicio
     */
    public function store(StoreServicesRequest $request)
    {
        try {
            $this->serviceService->createService($request->validated());
            return redirect()->route('services.index')->with('success', __('service.created'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    /**
     * Actualizar servicio existente
     */
    public function update(UpdateServicesRequest $request, Service $service)
    {
        try {
            $this->serviceService->updateService($service, $request->validated());
            return redirect()->route('services.index')->with('success', __('service.updated'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    /**
     * Eliminar servicio
     */
    public function destroy(Service $service)
    {
        try {
            $this->serviceService->deleteService($service);
            return redirect()->route('services.index')->with('success', __('service.deleted'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Buscar servicios
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'term' => 'required|string|min:2|max:100'
        ]);

        try {
            $services = $this->serviceService->searchServices($request->term);

            return response()->json([
                'services' => ServiceResource::collection($services)->toArray(request()),
                'count' => $services->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Obtener servicios por categoría
     */
    public function byCategory(Request $request): JsonResponse
    {
        $request->validate([
            'category_id' => 'nullable|uuid|exists:categories,id'
        ]);

        try {
            $services = $this->serviceService->getServicesByCategory($request->category_id);

            return response()->json([
                'services' => ServiceResource::collection($services)->toArray(request()),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Obtener servicios disponibles para videollamada
     */
    public function videoCallServices(): JsonResponse
    {
        try {
            $services = $this->serviceService->getVideoCallServices();

            return response()->json([
                'services' => ServiceResource::collection($services)->toArray(request()),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Obtener servicios presenciales
     */
    public function inPersonServices(): JsonResponse
    {
        try {
            $services = $this->serviceService->getInPersonServices();

            return response()->json([
                'services' => ServiceResource::collection($services)->toArray(request()),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
