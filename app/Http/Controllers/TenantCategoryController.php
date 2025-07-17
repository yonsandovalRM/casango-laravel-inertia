<?php

namespace App\Http\Controllers;

use App\Http\Requests\TenantCategories\StoreTenantCategoryRequest;
use App\Http\Requests\TenantCategories\UpdateTenantCategoryRequest;
use App\Http\Resources\TenantCategoryResource;
use App\Models\TenantCategory;
use Inertia\Inertia;

class TenantCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tenant_categories = TenantCategory::where('is_active', true)
            ->orderBy('name')
            ->get();
        return Inertia::render('tenant-categories/index', [
            'tenant_categories' => TenantCategoryResource::collection($tenant_categories)->toArray(request()),
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTenantCategoryRequest $request)
    {
        $tenant_categories = TenantCategory::create($request->validated());
        return redirect()->route('tenant-categories.index')
            ->with('success', __('tenant-category.created'));
    }




    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTenantCategoryRequest $request, TenantCategory $tenantCategory)
    {
        $tenantCategory->update($request->validated());
        return redirect()->route('tenant-categories.index')
            ->with('success', __('tenant-category.updated'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TenantCategory $tenantCategory)
    {

        $tenantCategory->delete();
        return redirect()->route('tenant-categories.index')
            ->with('success', __('tenant-category.deleted'));
    }
}
