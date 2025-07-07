<?php

namespace App\Http\Controllers;

use App\Models\FormTemplate;
use App\Models\FormField;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class FormTemplateController extends Controller
{
    public function index()
    {
        $templates = FormTemplate::with(['fields' => function ($query) {
            $query->orderBy('order');
        }])->get();

        return Inertia::render('templates/index', [
            'templates' => $templates
        ]);
    }

    public function create()
    {
        return Inertia::render('templates/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => ['required', 'string', Rule::in(['user_profile', 'booking_form'])],
            'is_active' => 'boolean',
            'fields' => 'required|array|min:1',
            'fields.*.label' => 'required|string|max:255',
            'fields.*.name' => 'required|string|max:255',
            'fields.*.type' => 'required|string|in:text,textarea,date,time,datetime-local,select,checkbox,radio,file,email,number,tel,url',
            'fields.*.options' => 'nullable|array',
            'fields.*.options.*' => 'string',
            'fields.*.placeholder' => 'nullable|string|max:255',
            'fields.*.order' => 'required|integer|min:0',
            'fields.*.is_required' => 'boolean',
            'fields.*.default_value' => 'nullable|string',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                $template = FormTemplate::create([
                    'name' => $validated['name'],
                    'description' => $validated['description'],
                    'type' => $validated['type'],
                    'is_active' => $validated['is_active'] ?? true,
                ]);

                foreach ($validated['fields'] as $fieldData) {
                    FormField::create([
                        'form_template_id' => $template->id,
                        'label' => $fieldData['label'],
                        'name' => $fieldData['name'],
                        'type' => $fieldData['type'],
                        'options' => $fieldData['options'] ?? null,
                        'placeholder' => $fieldData['placeholder'] ?? null,
                        'order' => $fieldData['order'],
                        'is_required' => $fieldData['is_required'] ?? false,
                        'default_value' => $fieldData['default_value'] ?? null,
                    ]);
                }
            });

            return redirect()->route('form-templates.index')
                ->with('success', __('form_templates.created'));
        } catch (\Exception $e) {
            dd($e);
            return back()->withErrors(['error' => __('form_templates.create_error')])
                ->withInput();
        }
    }

    public function show(FormTemplate $template)
    {
        $template->load(['fields' => function ($query) {
            $query->orderBy('order');
        }]);

        return Inertia::render('templates/show', [
            'template' => $template
        ]);
    }

    public function edit(FormTemplate $template)
    {
        $template->load(['fields' => function ($query) {
            $query->orderBy('order');
        }]);

        return Inertia::render('templates/edit', [
            'template' => $template
        ]);
    }

    public function update(Request $request, FormTemplate $template)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => ['required', 'string', Rule::in(['user_profile', 'booking_form'])],
            'is_active' => 'boolean',
            'fields' => 'required|array|min:1',
            'fields.*.id' => 'nullable|integer|exists:form_fields,id',
            'fields.*.label' => 'required|string|max:255',
            'fields.*.name' => 'required|string|max:255',
            'fields.*.type' => 'required|string|in:text,textarea,date,time,datetime-local,select,checkbox,radio,file,email,number,tel,url',
            'fields.*.options' => 'nullable|array',
            'fields.*.options.*' => 'string',
            'fields.*.placeholder' => 'nullable|string|max:255',
            'fields.*.order' => 'required|integer|min:0',
            'fields.*.is_required' => 'boolean',
            'fields.*.default_value' => 'nullable|string',
        ]);

        try {
            DB::transaction(function () use ($validated, $template) {
                // Actualizar template
                $template->update([
                    'name' => $validated['name'],
                    'description' => $validated['description'],
                    'type' => $validated['type'],
                    'is_active' => $validated['is_active'] ?? true,
                ]);

                // Obtener IDs de campos existentes y nuevos
                $existingFieldIds = collect($validated['fields'])
                    ->pluck('id')
                    ->filter()
                    ->toArray();

                // Eliminar campos que ya no están en la request
                $template->fields()
                    ->whereNotIn('id', $existingFieldIds)
                    ->delete();

                // Crear o actualizar campos
                foreach ($validated['fields'] as $fieldData) {
                    if (isset($fieldData['id'])) {
                        // Actualizar campo existente
                        FormField::where('id', $fieldData['id'])
                            ->update([
                                'label' => $fieldData['label'],
                                'name' => $fieldData['name'],
                                'type' => $fieldData['type'],
                                'options' => $fieldData['options'] ?? null,
                                'placeholder' => $fieldData['placeholder'] ?? null,
                                'order' => $fieldData['order'],
                                'is_required' => $fieldData['is_required'] ?? false,
                                'default_value' => $fieldData['default_value'] ?? null,
                            ]);
                    } else {
                        // Crear nuevo campo
                        FormField::create([
                            'form_template_id' => $template->id,
                            'label' => $fieldData['label'],
                            'name' => $fieldData['name'],
                            'type' => $fieldData['type'],
                            'options' => $fieldData['options'] ?? null,
                            'placeholder' => $fieldData['placeholder'] ?? null,
                            'order' => $fieldData['order'],
                            'is_required' => $fieldData['is_required'] ?? false,
                            'default_value' => $fieldData['default_value'] ?? null,
                        ]);
                    }
                }
            });

            return redirect()->route('form-templates.index')
                ->with('success', __('form_templates.updated'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('form_templates.update_error')])
                ->withInput();
        }
    }

    public function destroy(FormTemplate $template)
    {
        try {
            // Verificar si el template está siendo usado
            $isUsed = $template->bookingFormData()->exists() ||
                $template->userProfileData()->exists();

            if ($isUsed) {
                return back()->withErrors(['error' => __('form_templates.cannot_delete_in_use')]);
            }

            $template->delete();

            return redirect()->route('form-templates.index')
                ->with('success', __('form_templates.deleted'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('form_templates.delete_error')]);
        }
    }

    public function toggle(FormTemplate $template)
    {
        $template->update(['is_active' => !$template->is_active]);

        return back()->with('success', __('form_templates.status_updated'));
    }

    public function duplicate(FormTemplate $template)
    {
        try {
            DB::transaction(function () use ($template) {
                $newTemplate = $template->replicate();
                $newTemplate->name = $template->name . ' (Copy)';
                $newTemplate->is_active = false;
                $newTemplate->save();

                foreach ($template->fields as $field) {
                    $newField = $field->replicate();
                    $newField->form_template_id = $newTemplate->id;
                    $newField->save();
                }
            });

            return redirect()->route('form-templates.index')
                ->with('success', __('form_templates.duplicated'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('form_templates.duplicate_error')]);
        }
    }
}
