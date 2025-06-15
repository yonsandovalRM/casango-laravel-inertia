<?php

namespace App\Http\Controllers;

use App\Http\Requests\Tenants\CreateTenantRequest;
use App\Http\Resources\PlanResource;
use App\Http\Resources\TenantResource;
use App\Models\Company;
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
use App\Traits\GeneratesSubdomainSuggestions;

class TenantController extends Controller
{
    use GeneratesSubdomainSuggestions;



    /* 
    * Show the list of tenants
    * @return \Inertia\Response
    */
    public function index()
    {
        $tenants = Tenant::with('subscriptions')->get();
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
    * Get suggestions for a subdomain
    * @param Request $request
    * @return \Illuminate\Http\JsonResponse
    */
    public function getSuggestions(Request $request)
    {
        $suggestions = $this->generateSubdomainSuggestions($request->subdomain, config('tenancy.central_domains')[0], 5);
        return response()->json($suggestions);
    }

    /* 
    * Store a new tenant
    * @param CreateTenantRequest $request
    * @return \Illuminate\Http\RedirectResponse
    */
    public function store(CreateTenantRequest $request)
    {
      
        $tenant_id = $request->subdomain;
        $domain = $request->subdomain.'.'.config('tenancy.central_domains')[0];
        $plan = Plan::find($request->plan_id);
        if (!$plan) {
            return redirect()->route('tenants.create')->with('error', __('plan.plan_not_found'));
        }

        if ($this->validateDomainExists($domain)) {
            return redirect()->route('tenants.create')->with('error', __('tenant.subdomain_already_in_use'));
        }

        try {
            $tenant = Tenant::query()->create([
                'id' => $tenant_id,
                'name' => $request->name,
                'email' => $request->owner_email,
                'plan_id' => $plan->id,
                'category' => $request->category,
            ]);

            $tenant->domains()->create([
                'domain' => $domain,
            ]);

            $this->createSubscription($tenant, $plan);
            $this->createOwnerOnTenant($tenant, $request->owner_name, $request->owner_email, $request->owner_password);
            $this->createCompany($tenant);


            
            Log::info("Tenant created successfully", [
                'tenant' => $tenant,
            ]);
            return redirect()->route('tenants.create')->with('success', __('tenant.create_success'));
        } catch (\Exception $e) {
            Log::error("Error creating tenant", [
                'error' => $e->getMessage(),
            ]);
            return redirect()->route('tenants.create')->with('error', __('tenant.create_error'));
        }
    }


    /* 
    * Destroy a tenant
    * @param Tenant $tenant
    * @return \Illuminate\Http\RedirectResponse
    */
    public function destroy(Tenant $tenant)
    {
        $tenant->delete();
        return redirect()->route('tenants.index')->with('success', __('tenant.delete_success'));
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

    /* 
    * Validate if a domain exists
    * @param string $domain
    * @return bool
    */
    private function validateDomainExists(string $domain)
    {
        $tenant = Tenant::query()->where('id', $domain)->first();
        if ($tenant) {
            return true;
        }
        return false;
    }

    /* 
    * Create a subscription for a tenant
    * @param Tenant $tenant
    * @param Plan $plan
    * @return void
    */
    private function createSubscription(Tenant $tenant, Plan $plan)
    {
          // TODO: Solo maneja suscripciones de forma mensual, se debe agregar soporte para suscripciones anuales
        $trial_days = now()->addDays($plan->trial_days);
        $ends_at = now()->addDays($plan->trial_days)->addMonths(1);

        $tenant->subscriptions()->create([
            'plan_id' => $plan->id,
            'price' => $plan->price_monthly,
            'currency' => $plan->currency,
            'trial_ends_at' => $trial_days,
            'ends_at' => $ends_at,
            'payment_status' => 'pending',
            'is_monthly' => true,
            'is_active' => true,
        ]);

    }

    private function createCompany(Tenant $tenant)
    {
        $tenant->run(function () use ($tenant) {
            $company = Company::create([
                'name' => $tenant->name,
                'email' => $tenant->email,
                
            ]);
            $this->createCompanySchedule($company);
        });
    }

    private function createCompanySchedule(Company $company)
    {
        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        foreach ($days as $day) {
            $company->schedules()->create([
                'day_of_week' => $day,
                'open_time' => '09:00',
                'close_time' => '18:00',
                'is_open' => $day === 'sunday' ? false : true,
            ]);
        }

    }
 

  
}
