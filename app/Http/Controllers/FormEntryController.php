<?php

namespace App\Http\Controllers;

use App\Models\FormEntry;
use App\Models\FormEntryField;
use App\Models\FormTemplate;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

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
            'fields.*.label' => 'required|string',
            'fields.*.value' => 'nullable',
        ]);

        // Validar que los campos coincidan con el template
        $template = FormTemplate::with('fields')->find($request->form_template_id);
        $templateFields = $template->fields->pluck('label')->toArray();
        $submittedFields = collect($request->fields)->pluck('label')->toArray();

        if (array_diff($submittedFields, $templateFields)) {
            return back()->withErrors(['fields' => 'Invalid fields submitted']);
        }

        $requiredFields = $template->fields->where('required', true);
        foreach ($requiredFields as $requiredField) {
            $fieldValue = collect($request->fields)
                ->where('label', $requiredField->label)
                ->first();

            if (!$fieldValue || empty($fieldValue['value'])) {
                return back()->withErrors([
                    'fields' => __('entry.required_field', ['field' => $requiredField->label])
                ]);
            }
        }
        $professional = User::find(Auth::user()->id)->professional;
        DB::transaction(function () use ($request, $professional, $template) {
            $entry = FormEntry::create([
                'form_template_id' => $request->form_template_id,
                'booking_id' => $request->booking_id,
                'professional_id' => $professional->id,
                'visibility' => $request->visibility ?? 'private',
                'filled_at' => now(),
            ]);

            $fields = $request->fields;
            foreach ($fields as $field) {
                $templateField = $template->fields->firstWhere('label', $field['label']);
                $rules = $this->validateFieldValue($field, $templateField);
                $validator = Validator::make($field, $rules);

                if ($validator->fails()) {
                    return back()->withErrors(['fields' => $validator->errors()]);
                }


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

    private function validateFieldValue($field, $templateField)
    {
        $rules = [];

        switch ($templateField->type) {
            case 'email':
                $rules[] = 'email';
                break;
            case 'number':
                $rules[] = 'numeric';
                break;
            case 'date':
                $rules[] = 'date';
                break;
            case 'phone':
                $rules[] = 'regex:/^[0-9+\-\s()]+$/';
                break;
        }

        if ($templateField->required) {
            $rules[] = 'required';
        }

        return $rules;
    }
}
