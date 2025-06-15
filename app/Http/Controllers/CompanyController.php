<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateCompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function getCompany(): JsonResponse
    {
        $company = Company::with('schedules')->first();
        return response()->json(CompanyResource::make($company)->toArray(request()));
    }

    /**
     * Display the specified resource.
     */
    public function index()
    {
        $company = Company::with('schedules')->first();
        return Inertia::render('company/index', [
            'company' => CompanyResource::make($company)->toArray(request()),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCompanyRequest $request)
    {
        $company = Company::first();
        $company->update($request->validated());
        $this->updateSchedules($company, $request->validated()['schedules'] ?? []);
        return redirect()->route('company.index')->with('success', __('company.updated'));
    }

    private function updateSchedules(Company $company, array $schedules)
    {
        $company->schedules()->delete();
        foreach ($schedules as $schedule) {
            $company->schedules()->updateOrCreate(
                ['day_of_week' => $schedule['day_of_week']],
                $schedule
            );
        }
    }


}
