<?php

namespace App\Http\Controllers;


use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {


        return Inertia::render('dashboard');
    }
}
