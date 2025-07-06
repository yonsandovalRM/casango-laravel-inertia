<?php

namespace App\Http\Controllers;

use App\Models\FormField;

class FormFieldController extends Controller
{
    public function destroy(FormField $field)
    {
        $field->delete();
        return redirect()->back()->with('success', __('form_fields.deleted'));
    }
}
