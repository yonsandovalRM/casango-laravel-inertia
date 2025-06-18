<?php

namespace App\Http\Controllers;

use App\Http\Resources\CompanyResource;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TenantHomeController extends Controller
{
    public function index()
    {
        $company = Company::with('schedules')->first();

        return Inertia::render('home-tenants', [
            'company' => CompanyResource::make($company)->toArray(request()),
        ]);
    }
}
