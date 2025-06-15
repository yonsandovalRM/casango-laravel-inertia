<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateCompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use Inertia\Inertia;

class CompanyController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show()
    {
        $company = Company::first();
        return Inertia::render('company/index', [
            'company' => CompanyResource::make($company),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCompanyRequest $request)
    {
        $company = Company::first();
        $company->update($request->validated());
        return redirect()->route('company.index')->with('success', __('company.updated'));
    }


}
