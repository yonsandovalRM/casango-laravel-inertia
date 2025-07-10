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

        return Inertia::render('tenant-pages/home-tenants', [
            'company' => CompanyResource::make($company)->toArray(request()),
        ]);
    }

    public function bookings()
    {
        $company = Company::with('schedules')->first();

        return Inertia::render('tenant-pages/services', [
            'company' => CompanyResource::make($company)->toArray(request()),
        ]);
    }

    public function bookingsService($service_id)
    {
        $service = Service::find($service_id);

        return Inertia::render('tenant-pages/reservation-wizard', [
            'service' => ServiceResource::make($service)->toArray(request()),
        ]);
    }
}
