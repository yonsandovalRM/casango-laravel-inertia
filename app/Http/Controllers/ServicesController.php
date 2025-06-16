<?php

namespace App\Http\Controllers;

use App\Http\Requests\Services\StoreServicesRequest;
use App\Http\Requests\Services\UpdateServicesRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ServiceResource;
use App\Models\Category;
use App\Models\Service;
use Inertia\Inertia;

class ServicesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::where('is_active', true)->get();
        $services = Service::where('is_active', true)->with('category')->get();

        return Inertia::render('services/index', [
            'services' => ServiceResource::collection($services)->toArray(request()),
            'categories' => CategoryResource::collection($categories)->toArray(request())
        ]);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreServicesRequest $request)
    {
        $service = Service::create($request->validated());
        return redirect()->route('services.index')->with('success', __('service.created'));
    }




    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateServicesRequest $request, Service $service)
    {
        $service->update($request->validated());
        return redirect()->route('services.index')->with('success', __('service.updated'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        $service->delete();
        return redirect()->route('services.index')->with('success', __('service.deleted'));
    }
}
