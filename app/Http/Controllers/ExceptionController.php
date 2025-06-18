<?php

namespace App\Http\Controllers;

use App\Models\Exception;
use App\Models\Professional;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExceptionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'reason' => 'nullable|string',
        ]);

        $professional = Professional::where('user_id', Auth::user()->id)->firstOrFail();
        $professional->exceptions()->create($request->validated());

        return redirect()->route('professional.me')->with('success', __('professional.exception_created'));
    }

    public function destroy(Exception $exception)
    {
        $exception->delete();
        return redirect()->route('professional.me')->with('success', __('professional.exception_deleted'));
    }
}
