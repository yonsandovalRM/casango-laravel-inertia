<?php

namespace App\Http\Controllers;

use App\Http\Requests\Services\StoreServicesRequest;
use App\Http\Requests\Services\UpdateServicesRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Services;
use Inertia\Inertia;

class ServicesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $services = Services::where('is_active', true)->get();
        return Inertia::render('services/index', [
            'services' => ServiceResource::collection($services)->toArray(request())
        ]);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreServicesRequest $request)
    {
        $service = Services::create($request->validated());
        return redirect()->route('services.index')->with('success', __('service.created'));
    }




    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateServicesRequest $request, Services $services)
    {
        $services->update($request->validated());
        return redirect()->route('services.index')->with('success', __('service.updated'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Services $services)
    {
        $services->delete();
        return redirect()->route('services.index')->with('success', __('service.deleted'));
    }
}
