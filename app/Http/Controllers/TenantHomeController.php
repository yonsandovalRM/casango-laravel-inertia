<?php

namespace App\Http\Controllers;

use App\Http\Resources\CompanyResource;
use App\Http\Resources\ServiceResource;
use App\Models\Company;
use App\Models\Service;
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

    public function services()
    {
        $company = Company::with('schedules')->first();

        return Inertia::render('public-pages/services', [
            'company' => CompanyResource::make($company)->toArray(request()),
        ]);
    }

    public function reservationWizard($service_id)
    {
        $service = Service::find($service_id);

        return Inertia::render('public-pages/reservation-wizard', [
            'service' => ServiceResource::make($service)->toArray(request()),
        ]);
    }
}
