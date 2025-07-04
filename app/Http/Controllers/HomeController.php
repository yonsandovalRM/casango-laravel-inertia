<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlanResource;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $plans = Plan::all();
        return Inertia::render('home', [
            'plans' => PlanResource::collection($plans)->toArray(request())
        ]);
    }
}
