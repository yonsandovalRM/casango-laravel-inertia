<?php

namespace App\Http\Controllers;

use App\Http\Requests\Professionals\UpdateProfessionalRequest;
use App\Http\Resources\ProfessionalResource;
use App\Models\Professional;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ProfessionalController extends Controller
{
    public function me()
    {
        $professional = Professional::with('user')->where('user_id', Auth::user()->id)->firstOrFail();
        return Inertia::render('professionals/profile/me', [
            'professional' => new ProfessionalResource($professional)->toArray(request()),
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
}
