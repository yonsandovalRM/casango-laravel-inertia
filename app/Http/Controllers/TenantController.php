<?php

namespace App\Http\Controllers;

use App\Http\Requests\Tenants\CreateTenantRequest;
use App\Http\Resources\PlanResource;
use App\Http\Resources\TenantResource;
use App\Models\Plan;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;
use Stancl\Tenancy\Jobs\CreateDatabase;

class TenantController extends Controller
{
    /* 
    * Show the list of tenants
    * @return \Inertia\Response
    */
    public function index()
    {
        $tenants = Tenant::all();
        return Inertia::render('tenants/index', [
            'tenants' => TenantResource::collection($tenants)->toArray(request()),
        ]);
    }

    /* 
    * Show the form for creating a new tenant
    * @return \Inertia\Response
    */
    public function create()
    {
        $plans = Plan::all();
        return Inertia::render('tenants/create', [
            'plans' => PlanResource::collection($plans)->toArray(request()),
        ]);
    }

    /* 
    * Store a new tenant
    * @param CreateTenantRequest $request
    * @return \Illuminate\Http\RedirectResponse
    */
    public function store(CreateTenantRequest $request)
    {

   
        try {
            $tenant = Tenant::query()->create([
                'id' => $request->domain,
                'name' => $request->name,
                'plan_id' => $request->plan_id,
                'category' => $request->category,
            ]);

            $tenant->domains()->create([
                'domain' => $request->domain,
            ]);

         

            $this->createOwnerOnTenant($tenant, $request->owner_name, $request->owner_email, $request->owner_password);


            
            Log::info("Tenant created successfully", [
                'tenant' => $tenant,
            ]);
            return redirect()->route('tenants.create')->with('success', __('tenants.create_success'));
        } catch (\Exception $e) {
            Log::error("Error creating tenant", [
                'error' => $e->getMessage(),
            ]);
            return redirect()->route('tenants.create')->with('error', __('tenants.create_error'));
        }
    }

    /* 
    * Create the owner on the tenant
    * @param Tenant $tenant
    * @param string $ownerName
    * @param string $ownerEmail
    * @param string $ownerPassword
    * @return void
    */
    private function createOwnerOnTenant(Tenant $tenant, string $ownerName, string $ownerEmail, string $ownerPassword)
    {
        $tenant->run(function () use ($ownerName, $ownerEmail, $ownerPassword) {
            $user = User::create([
                'name' => $ownerName,
                'email' => $ownerEmail,
                'password' => bcrypt($ownerPassword),
            ]);

            $owner = Role::findOrCreate('owner');
            $user->assignRole($owner);
        });
    }

}
