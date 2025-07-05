<?php

namespace App\Http\Controllers;

use App\Models\FormEntry;
use App\Models\FormEntryField;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class FormEntryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'form_template_id' => 'required|uuid|exists:form_templates,id',
            'booking_id' => 'required|uuid|exists:bookings,id',
            'fields' => 'required|array|min:1',
        ]);

        $professional = User::find(Auth::user()->id)->professional;
        DB::transaction(function () use ($request, $professional) {
            $entry = FormEntry::create([
                'form_template_id' => $request->form_template_id,
                'booking_id' => $request->booking_id,
                'professional_id' => $professional->id,
                'visibility' => $request->visibility ?? 'private',
                'filled_at' => now(),
            ]);

            $fields = $request->fields;
            foreach ($fields as $field) {
                FormEntryField::create([
                    'form_entry_id' => $entry->id,
                    'field_label' => $field['label'],
                    'value' => $field['value'] ?? null,
                ]);
            }
        });
        return redirect()->back()->with('success', __('entry.created'));
    }

    /**
     * Display the specified resource.
     */
    public function show(FormEntry $formEntry)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FormEntry $formEntry)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FormEntry $formEntry)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FormEntry $formEntry)
    {
        //
    }
}
