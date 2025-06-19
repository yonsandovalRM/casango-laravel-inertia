<?php

namespace App\Http\Controllers;

use App\Models\Exception;
use App\Models\Professional;
use App\Http\Requests\ProfessionalExceptions\StoreProfessionalExceptions;
use Illuminate\Support\Facades\Auth;

class ExceptionController extends Controller
{
    public function store(StoreProfessionalExceptions $request)
    {
        $professional = Professional::where('user_id', Auth::user()->id)->firstOrFail();

        if ($this->existAnotherException($professional, $request->date, $request->start_time, $request->end_time)) {
            return redirect()->route('professional.me')->with('error', __('professional.exception_already_exists'));
        }

        $professional->exceptions()->create($request->validated());

        return redirect()->route('professional.me')->with('success', __('professional.exception_created'));
    }

    public function destroy(Exception $exception)
    {
        $exception->delete();
        return redirect()->route('professional.me')->with('success', __('professional.exception_deleted'));
    }

    private function existAnotherException(Professional $professional, $date, $start_time, $end_time, $id = null)
    {
        return $professional->exceptions()->where('date', $date)->where('start_time', $start_time)->where('end_time', $end_time)->where('id', '!=', $id)->exists();
    }
}
