<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TenantHomeController extends Controller
{
    public function index()
    {
        return Inertia::render('tenant-pages/home');
    }
}
