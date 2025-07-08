<?php

namespace App\Http\Controllers;

use App\Http\Requests\Tenants\CreateTenantRequest;
use App\Http\Resources\PlanResource;
use App\Http\Resources\TenantResource;
use App\Models\Company;
use App\Models\FormTemplate;
use App\Models\Plan;
use App\Models\Tenant;
use App\Traits\HandlesMercadoPago;
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
    use GeneratesSubdomainSuggestions, HandlesMercadoPago;

    /* 
    * Show the list of tenants
    * @return \Inertia\Response
    */
    public function index()
    {
        $tenants = Tenant::with(['subscriptions' => function ($query) {
            $query->where('is_active', true)->with('plan');
        }])->get();

        return Inertia::render('tenants/index', [
            'tenants' => TenantResource::collection($tenants)->toArray(request()),
        ]);
    }

    /* 
    * Show the form for creating a new tenant
    * @return \Inertia\Response
    */
    public function create(Request $request)
    {
        $plans = Plan::all();
        if ($request->plan) {
            $plan = $plans->findOrFail($request->plan);
        } else {
            $plan = $plans->where('is_popular', true)->first();
        }

        $billing = $request->billing ?? 'monthly';
        return Inertia::render('tenants/create', [
            'plans' => PlanResource::collection($plans)->toArray(request()),
            'plan' => $plan ? PlanResource::make($plan)->toArray(request()) : null,
            'billing' => $billing,
        ]);
    }

    public function created(Request $request)
    {
        $tenant = Tenant::with(['subscriptions' => function ($query) {
            $query->where('is_active', true)->with('plan');
        }])->findOrFail($request->tenant);

        $subscription = $tenant->subscriptions->first();
        $needsPaymentSetup = $subscription ? $this->needsPaymentSetup($subscription) : false;
        $paymentUrl = null;
        if ($needsPaymentSetup && $subscription) {
            $paymentUrl = $this->getPaymentUrl($subscription);
        }

        return Inertia::render('tenants/created', [
            'tenant' => TenantResource::make($tenant)->toArray(request()),
            'subscription' => $subscription,
            'needs_payment_setup' => $needsPaymentSetup,
            'payment_url' => $paymentUrl,
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
        $domain = $request->subdomain . '.' . config('tenancy.central_domains')[0];
        $plan = Plan::findOrFail($request->plan_id);

        if ($this->validateDomainExists($domain)) {
            return redirect()->route('tenants.create')->with('error', __('tenant.subdomain_already_in_use'));
        }

        try {
            // DB::beginTransaction();

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

            $subscription = $this->createSubscription($tenant, $plan, $request->billing);
            $this->createOwnerOnTenant($tenant, $request->owner_name, $request->owner_email, $request->owner_password);
            $this->createProfessional($tenant); // TODO: Crear profesional por defecto, eliminar en producción
            $this->createCompany($tenant);

            // Programar creación de preaprobación para después del trial
            $this->schedulePreapprovalCreation($subscription);

            //DB::commit();

            Log::info("Tenant created successfully", [
                'tenant' => $tenant,
                'subscription' => $subscription,
            ]);

            return redirect()->route('tenants.created', ['tenant' => $tenant])->with('success', __('tenant.create_success'));
        } catch (\Exception $e) {
            // DB::rollback();

            Log::error("Error creating tenant", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->route('tenants.create')->with('error', __('tenant.create_error'));
        }
    }


    /* 
    * Show tenant dashboard with subscription info
    * @param Tenant $tenant
    * @return \Inertia\Response
    */
    public function show(Tenant $tenant)
    {
        $tenant->load(['subscriptions' => function ($query) {
            $query->where('is_active', true)->with('plan');
        }]);

        $subscription = $tenant->subscriptions->first();
        $needsPaymentSetup = $subscription ? $this->needsPaymentSetup($subscription) : false;
        $paymentUrl = null;

        if ($needsPaymentSetup && $subscription) {
            $paymentUrl = $this->getPaymentUrl($subscription);
        }

        return Inertia::render('tenants/show', [
            'tenant' => TenantResource::make($tenant)->toArray(request()),
            'subscription' => $subscription,
            'needs_payment_setup' => $needsPaymentSetup,
            'payment_url' => $paymentUrl,
        ]);
    }

    /* 
    * Destroy a tenant
    * @param Tenant $tenant
    * @return \Illuminate\Http\RedirectResponse
    */
    public function destroy(Tenant $tenant)
    {
        try {
            // Cancelar suscripciones activas
            $activeSubscriptions = $tenant->subscriptions()->where('is_active', true)->get();
            foreach ($activeSubscriptions as $subscription) {
                $this->cancelPreapproval($subscription);
            }

            $tenant->delete();

            return redirect()->route('tenants.index')->with('success', __('tenant.delete_success'));
        } catch (\Exception $e) {
            Log::error("Error deleting tenant", [
                'tenant_id' => $tenant->id,
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('tenants.index')->with('error', __('tenant.delete_error'));
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

    private function createProfessional(Tenant $tenant)
    {
        $tenant->run(function () {
            $user = User::create([
                'name' => 'Luis Jimenez',
                'email' => 'lj@pro.com',
                'password' => bcrypt('password'),
            ]);

            $professional = Role::findOrCreate('professional');
            $user->assignRole($professional);

            $user->professional()->create([
                'title' => 'Dr.',
                'is_company_schedule' => true,
            ]);
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
    * @param string $billing
    * @return \App\Models\Subscription
    */
    private function createSubscription(Tenant $tenant, Plan $plan, string $billing)
    {
        $trial_days = now()->addDays($plan->trial_days);
        $ends_at = now()->addDays($plan->trial_days)->addMonths($billing === 'monthly' ? 1 : 12);

        return $tenant->subscriptions()->create([
            'plan_id' => $plan->id,
            'price' => $billing === 'monthly' ? $plan->price_monthly : $plan->price_annual,
            'currency' => $plan->currency,
            'trial_ends_at' => $trial_days,
            'ends_at' => $ends_at,
            'payment_status' => 'pending',
            'is_monthly' => $billing === 'monthly',
            'is_active' => true,
        ]);
    }

    /* 
    * Schedule preapproval creation for near trial end
    * @param \App\Models\Subscription $subscription
    * @return void
    */
    private function schedulePreapprovalCreation($subscription)
    {
        // Si el trial termina en menos de 7 días, crear preaprobación inmediatamente
        if ($subscription->trial_ends_at <= now()->addDays(7)) {
            $this->createPreapproval($subscription);
        }
        // Si no, el comando programado se encargará de crearla cuando sea necesario
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
                'has_break' => false,
            ]);
        }
    }
}
