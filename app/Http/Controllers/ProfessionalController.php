<?php

namespace App\Http\Controllers;

use App\Http\Requests\Professionals\UpdateProfessionalRequest;
use App\Http\Requests\Professionals\UpdateProfessionalServicesRequest;
use App\Http\Requests\ProfessionalSchedules\UpdateProfessionalScheduleRequest;
use App\Http\Resources\ProfessionalResource;
use App\Http\Resources\ProfessionalScheduleResource;
use App\Http\Resources\ServiceResource;
use App\Models\Company;
use App\Models\Professional;
use App\Models\ProfessionalSchedule;
use App\Models\Service;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ProfessionalController extends Controller
{
    public function me()
    {
        $professional = Professional::with('user', 'exceptions')->where('user_id', Auth::user()->id)->firstOrFail();
        $professional_schedules = ProfessionalSchedule::all();
        $company = Company::with('schedules')->first();

        return Inertia::render('professionals/profile/me', [
            'professional' => new ProfessionalResource($professional)->toArray(request()),
            'professional_schedules' => ProfessionalScheduleResource::collection($professional_schedules)->toArray(request()),
            'company_schedules' => $company->getDailySchedulesArray(),
        ]);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $professionals = Professional::with('user')->get();

        return Inertia::render('professionals/index', [
            'professionals' => ProfessionalResource::collection($professionals)->toArray(request()),

        ]);
    }

    public function showAssignServices(Professional $professional)
    {
        $services = Service::with(['professionals' => function ($query) use ($professional) {
            $query->where('professionals.id', $professional->id)
                ->select('professionals.id')
                ->withPivot('duration', 'price');
        }])->get();

        return Inertia::render('professionals/assign-services', [
            'professional' => ProfessionalResource::make(
                $professional->load(['services' => function ($query) {
                    $query->withPivot('duration', 'price');
                }])
            )->toArray(request()),

            'services' => ServiceResource::collection($services)->toArray(request()),
        ]);
    }

    public function updateMe(UpdateProfessionalRequest $request)
    {
        $professional = Professional::where('user_id', Auth::user()->id)->firstOrFail();

        $professional->update($request->validated());

        if ($request->input('is_company_schedule')) {
            $professional->schedules()->delete();
            return;
        }

        return redirect()->route('professional.me')->with('success', __('professional.updated'));
    }

    public function updateSchedule(UpdateProfessionalScheduleRequest $request)
    {
        $professional = Professional::where('user_id', Auth::user()->id)->firstOrFail();

        $professional->schedules()->delete();
        foreach ($request->validated()['schedules'] as $schedule) {
            $professional->schedules()->create($schedule);
        }
        return redirect()->route('professional.me')->with('success', __('professional.updated'));
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProfessionalRequest $request, Professional $professional)
    {
        $professional->update($request->validated());
        return redirect()->route('professionals.show', $professional)->with('success', __('professional.updated'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Professional $professional)
    {
        $professional->delete();
        return redirect()->route('professionals.index')->with('success', __('professional.deleted'));
    }

    public function assignServices(Professional $professional, UpdateProfessionalServicesRequest $request)
    {
        $professional->services()->sync($request->services);
        return redirect()->route('professionals.index')->with('success', __('professional.updated'));
    }
}
