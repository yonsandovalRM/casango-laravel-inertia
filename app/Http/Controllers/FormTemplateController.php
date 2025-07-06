<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class FormTemplateController extends Controller
{
    public function index()
    {
        return Inertia::render('templates/index');
    }
}
