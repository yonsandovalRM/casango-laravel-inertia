<?php

namespace App\Http\Controllers;

use App\Http\Resources\CompanyResource;
use App\Models\FormTemplate;
use App\Models\FormTemplateField;
use App\Models\Company;
use App\Models\FormEntryField;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FormTemplateController extends Controller
{

    /**
     * Show the form template builder
     */
    public function builder()
    {

        $company = Company::first();
        $template = $company->getOrCreateFormTemplate();
        $template->load('activeFields');

        return Inertia::render('templates/form-template-builder', [
            'template' => $template,
            'company' => CompanyResource::make($company)->toArray(request()),
        ]);
    }

    /**
     * Update the company's form template
     */
    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'fields' => 'required|array|min:1',
            'fields.*.label' => 'required|string|max:255',
            'fields.*.type' => 'required|string|in:text,number,email,phone,date,time,textarea,select,checkbox,radio,file,image,switch',
        ]);

        $company = Company::first();
        $template = $company->getOrCreateFormTemplate();

        DB::transaction(function () use ($request, $template) {
            // Actualizar información básica del template
            $template->update([
                'name' => $request->name,
                'description' => $request->description,
            ]);

            // Actualizar campos de forma segura
            $template->updateFields($request->fields);
        });

        return redirect()->back()->with('success', __('template.updated'));
    }


    /**
     * Get field usage statistics
     */
    public function getFieldStats()
    {
        $company = Company::first();
        $template = $company->formTemplate;

        if (!$template) {
            return response()->json(['fields' => []]);
        }

        $fields = $template->fields()->get()->map(function ($field) {
            return [
                'id' => $field->id,
                'label' => $field->label,
                'type' => $field->type,
                'is_active' => $field->is_active,
                'required' => $field->required,
                'entries_count' => $field->getEntriesCount(),
                'has_entries' => $field->hasEntries(),
            ];
        });

        return response()->json(['fields' => $fields]);
    }

    /**
     * Show entries for a specific field (for debugging/analytics)
     */
    public function showFieldEntries(FormTemplateField $field)
    {
        $entries = FormEntryField::where('field_label', $field->label)
            ->whereHas('entry', function ($query) use ($field) {
                $query->where('form_template_id', $field->form_template_id);
            })
            ->with('entry.client')
            ->get();

        return Inertia::render('templates/field-entries', [
            'field' => $field,
            'entries' => $entries,
        ]);
    }
}
