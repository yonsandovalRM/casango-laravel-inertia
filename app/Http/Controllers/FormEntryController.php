<?php

namespace App\Http\Controllers;

use App\Models\FormEntry;
use App\Models\FormEntryField;
use App\Models\FormTemplate;
use App\Models\User;
use App\Models\Booking;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class FormEntryController extends Controller
{
    /**
     * Display client entries for a professional
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $professional = $user->professional;

        if (!$professional) {
            return redirect()->back()->with('error', 'No se encontró el perfil profesional');
        }

        $company = Company::first();
        $template = $company->formTemplate;

        $entries = FormEntry::where('professional_id', $professional->id)
            ->with(['client', 'booking', 'fields'])
            ->when($request->client_id, function ($query, $clientId) {
                return $query->where('client_id', $clientId);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('entries/index', [
            'entries' => $entries,
            'template' => $template,
        ]);
    }

    /**
     * Show the form for creating a new entry
     */
    public function create(Request $request)
    {
        $company = Company::first();
        $template = $company->getOrCreateFormTemplate();
        $template->load('activeFields');

        $booking = null;
        $client = null;

        if ($request->booking_id) {
            $booking = Booking::with('client')->find($request->booking_id);
            $client = $booking->client;
        } elseif ($request->client_id) {
            $client = User::find($request->client_id);
        }

        // Obtener la última entrada del cliente para pre-llenar datos
        $lastEntry = null;
        if ($client) {
            $lastEntry = $template->getLastClientEntry($client->id);
        }

        return Inertia::render('entries/create', [
            'template' => $template,
            'booking' => $booking,
            'client' => $client,
            'lastEntry' => $lastEntry,
        ]);
    }

    /**
     * Store a newly created entry
     */
    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|uuid|exists:users,id',
            'booking_id' => 'nullable|uuid|exists:bookings,id',
            'fields' => 'required|array|min:1',
            'fields.*.label' => 'required|string',
            'fields.*.value' => 'nullable',
        ]);

        $user = Auth::user();
        $professional = $user->professional;
        $company = Company::first();

        $template = $company->formTemplate;

        if (!$template) {
            return redirect()->back()->with('error', 'No se encontró el template de formulario');
        }

        // Validar que los campos coincidan con el template activo
        $activeFields = $template->getActiveFieldsOrdered();
        $activeFieldLabels = $activeFields->pluck('label')->toArray();
        $submittedFields = collect($request->fields)->pluck('label')->toArray();

        // Permitir campos que no están en el template activo (para mantener compatibilidad)
        // pero validar que los campos activos requeridos estén presentes
        $requiredFields = $activeFields->where('required', true);
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

        DB::transaction(function () use ($request, $professional, $template) {
            $entry = FormEntry::create([
                'form_template_id' => $template->id,
                'booking_id' => $request->booking_id,
                'client_id' => $request->client_id,
                'professional_id' => $professional->id,
                'filled_at' => now(),
            ]);

            // Crear campos de la entrada
            foreach ($request->fields as $field) {
                // Buscar el campo en el template para validación
                $templateField = $template->fields()->where('label', $field['label'])->first();

                if ($templateField && $templateField->active) {
                    // Validar solo si el campo está activo
                    $rules = $this->validateFieldValue($field, $templateField);
                    $validator = Validator::make($field, $rules);

                    if ($validator->fails()) {
                        throw new \Exception('Validation failed for field: ' . $field['label']);
                    }
                }

                // Crear el campo independientemente de si está activo o no
                // Esto preserva los datos históricos
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
     * Display the specified entry
     */
    public function show(FormEntry $formEntry)
    {
        $user = Auth::user();
        $professional = $user->professional;

        // Verificar que el profesional puede ver esta entrada
        if ($formEntry->professional_id !== $professional->id) {
            return redirect()->back()->with('error', 'No tienes permiso para ver esta entrada');
        }

        $formEntry->load(['template', 'client', 'booking', 'fields']);

        return Inertia::render('entries/show', [
            'entry' => $formEntry,
        ]);
    }

    /**
     * Show the form for editing the specified entry
     */
    public function edit(FormEntry $formEntry)
    {
        $user = Auth::user();
        $professional = $user->professional;

        // Verificar que el profesional puede editar esta entrada
        if ($formEntry->professional_id !== $professional->id) {
            return redirect()->back()->with('error', 'No tienes permiso para editar esta entrada');
        }

        $formEntry->load(['template.activeFields', 'client', 'booking', 'fields']);

        return Inertia::render('entries/edit', [
            'entry' => $formEntry,
        ]);
    }

    /**
     * Update the specified entry
     */
    public function update(Request $request, FormEntry $formEntry)
    {
        $request->validate([
            'fields' => 'required|array|min:1',
            'fields.*.label' => 'required|string',
            'fields.*.value' => 'nullable',
        ]);

        $user = Auth::user();
        $professional = $user->professional;

        // Verificar que el profesional puede editar esta entrada
        if ($formEntry->professional_id !== $professional->id) {
            return redirect()->back()->with('error', 'No tienes permiso para editar esta entrada');
        }

        $template = $formEntry->template;

        // Validar campos requeridos activos
        $activeFields = $template->getActiveFieldsOrdered();
        $requiredFields = $activeFields->where('required', true);

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

        DB::transaction(function () use ($request, $formEntry, $template) {
            // Actualizar campos
            $formEntry->updateFields($request->fields);

            // Actualizar timestamp
            $formEntry->update(['filled_at' => now()]);
        });

        return redirect()->back()->with('success', __('entry.updated'));
    }

    /**
     * Remove the specified entry
     */
    public function destroy(FormEntry $formEntry)
    {
        $user = Auth::user();
        $professional = $user->professional;

        // Verificar que el profesional puede eliminar esta entrada
        if ($formEntry->professional_id !== $professional->id) {
            return redirect()->back()->with('error', 'No tienes permiso para eliminar esta entrada');
        }

        $formEntry->delete();

        return redirect()->back()->with('success', __('entry.deleted'));
    }

    /**
     * Get client history
     */
    public function clientHistory(User $client)
    {
        $user = Auth::user();
        $professional = $user->professional;
        $company = Company::first();

        $template = $company->formTemplate;

        if (!$template) {
            return response()->json(['entries' => []]);
        }

        $entries = $template->getClientEntries($client->id)
            ->filter(function ($entry) use ($professional) {
                return $entry->professional_id === $professional->id;
            });

        return response()->json([
            'client' => $client,
            'entries' => $entries,
            'template' => $template,
        ]);
    }

    /**
     * Get entry data for pre-filling form
     */
    public function getEntryData(FormEntry $formEntry)
    {
        $user = Auth::user();
        $professional = $user->professional;

        // Verificar que el profesional puede ver esta entrada
        if ($formEntry->professional_id !== $professional->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $formEntry->load('fields');

        return response()->json([
            'entry' => $formEntry,
            'fields' => $formEntry->getFieldsAsArray(),
        ]);
    }

    /**
     * Validate field value based on template field type
     */
    private function validateFieldValue($field, $templateField)
    {
        $rules = [];

        switch ($templateField->type) {
            case 'email':
                $rules['value'] = 'email';
                break;
            case 'number':
                $rules['value'] = 'numeric';
                break;
            case 'date':
                $rules['value'] = 'date';
                break;
            case 'phone':
                $rules['value'] = 'regex:/^[0-9+\-\s()]+$/';
                break;
            case 'text':
            case 'textarea':
                $rules['value'] = 'string';
                break;
        }

        if ($templateField->required) {
            $rules['value'] = (isset($rules['value']) ? $rules['value'] . '|' : '') . 'required';
        }

        return $rules;
    }
}
