<?php

namespace App\Http\Controllers;


use App\Models\FormTemplate;
use App\Models\FormTemplateField;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FormTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $templates = FormTemplate::all();
        return Inertia::render('templates/index', [
            'templates' => $templates,
        ]);
    }

    public function builder()
    {
        return Inertia::render('templates/form-template-builder');
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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'fields' => 'required|array|min:1',
            'fields.*.label' => 'required|string|max:255',
            'fields.*.type' => 'required|string|in:text,number,email,phone,date,time,textarea,select,checkbox,radio,file,image,switch',

        ]);

        DB::transaction(function () use ($request) {
            $template = FormTemplate::create([
                'name' => $request->name,
                'description' => $request->description,
                'visibility' => $request->visibility ?? 'private',
            ]);

            $fields = $request->fields;
            foreach ($fields as $index => $field) {
                FormTemplateField::create([
                    'form_template_id' => $template->id,
                    'label' => $field['label'],
                    'type' => $field['type'],
                    'placeholder' => $field['placeholder'] ?? null,
                    'required' => $field['required'] ?? false,
                    'options' => $field['options'] ?? null,
                    'order' => $index,
                ]);
            }
        });
        return redirect()->back()->with('success', __('template.created'));
    }

    /**
     * Display the specified resource.
     */
    public function show(FormTemplate $formTemplate)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FormTemplate $formTemplate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FormTemplate $formTemplate)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FormTemplate $formTemplate)
    {
        //
    }
}
