<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlanResource;
use App\Http\Resources\SubscriptionResource;
use App\Models\Subscription;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class TenantSubscriptionController extends Controller
{

    public function index()
    {
        $tenant = tenant();

        $subscription = Subscription::on('pgsql') // Especifica la conexión
            ->with('plan') // Ahora sí puedes usar with()
            ->where('tenant_id', $tenant->id)
            ->first();

        $plans = DB::connection('pgsql')
            ->table('plans')
            ->get();

        return Inertia::render('tenant-pages/subscription/index', [
            'subscription' => SubscriptionResource::make($subscription)->toArray(request()),
            'plans' => PlanResource::collection($plans)->toArray(request())
        ]);
    }

    public function create()
    {
        return view('tenants.subscription.create');
    }

    public function edit()
    {
        return view('tenants.subscription.edit');
    }

    public function show()
    {
        return view('tenants.subscription.show');
    }
}
