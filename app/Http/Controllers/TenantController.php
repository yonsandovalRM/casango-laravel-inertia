<?php

namespace App\Http\Controllers;

use App\Enums\SubscriptionStatus;
use App\Http\Requests\Tenants\CreateTenantRequest;
use App\Http\Resources\PlanResource;
use App\Http\Resources\TenantCategoryResource;
use App\Http\Resources\TenantResource;
use App\Jobs\SetupTenantJob;
use App\Models\Company;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\TenantCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;
use App\Traits\GeneratesSubdomainSuggestions;

class TenantController extends Controller
{
    use GeneratesSubdomainSuggestions;

    public function index()
    {
        $tenants = Tenant::with(['subscriptions' => function ($query) {
            $query->where('is_active', true)->with('plan');
        }])->get();

        return Inertia::render('tenants/index', [
            'tenants' => TenantResource::collection($tenants)->toArray(request()),
        ]);
    }

    public function create(Request $request)
    {
        $plans = Plan::where('active', true)->get();
        $tenant_categories = TenantCategory::where('is_active', true)->get();
        if ($request->plan) {
            $plan = $plans->findOrFail($request->plan);
        } else {
            $plan = $plans->where('is_popular', true)->first();
        }

        $billing = $request->billing ?? 'monthly';
        return Inertia::render('tenants/create', [
            'plans' => PlanResource::collection($plans)->toArray(request()),
            'plan' => $plan ? PlanResource::make($plan)->toArray(request()) : null,
            'tenant_categories' => TenantCategoryResource::collection($tenant_categories)->toArray(request()),
            'billing' => $billing,
        ]);
    }

    public function created(Request $request)
    {
        $tenant = Tenant::with(['tenantCategory', 'subscriptions' => function ($query) {
            $query->where('is_active', true)->with('plan');
        }])->findOrFail($request->tenant);

        $subscription = $tenant->subscriptions->first();

        return Inertia::render('tenants/created', [
            'tenant' => TenantResource::make($tenant)->toArray(request()),
            'subscription' => $subscription
        ]);
    }

    public function getSuggestions(Request $request)
    {
        $suggestions = $this->generateSubdomainSuggestions($request->subdomain, config('tenancy.central_domains')[0], 5);
        return response()->json($suggestions);
    }

    public function store(CreateTenantRequest $request)
    {
        $tenant_id = $request->subdomain;
        $domain = $request->subdomain . '.' . config('tenancy.central_domains')[0];
        $plan = Plan::findOrFail($request->plan_id);
        $tenant_category = TenantCategory::findOrFail($request->tenant_category_id);

        if ($this->validateDomainExists($domain)) {
            return redirect()->route('tenants.create')->with('error', __('tenant.subdomain_already_in_use'));
        }

        $tenant = null;
        $subscription = null;

        try {
            // PASO 1: Crear tenant y dominio (sin transacción porque crea DB)
            $tenant = Tenant::query()->create([
                'id' => $tenant_id,
                'name' => $request->name,
                'email' => $request->owner_email,
                'plan_id' => $plan->id,
                'tenant_category_id' => $tenant_category->id,
            ]);

            $tenant->domains()->create([
                'domain' => $domain,
            ]);

            // PASO 2: Crear suscripción en transacción separada
            DB::beginTransaction();

            try {
                $subscription = $this->createSubscription($tenant, $plan, $request->billing);
                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

            // PASO 3: Configurar datos dentro del tenant
            SetupTenantJob::dispatch($tenant, [
                'name' => $request->owner_name,
                'email' => $request->owner_email,
                'password' => $request->owner_password,
            ]);

            Log::info("Tenant created successfully", [
                'tenant_id' => $tenant->id,
                'subscription_id' => $subscription->id,
            ]);

            return redirect()->route('tenants.created', ['tenant' => $tenant])
                ->with('success', __('tenant.create_success'));
        } catch (\Exception $e) {
            Log::error("Error creating tenant", [
                'tenant_id' => $tenant_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Limpiar datos si algo falló
            $this->cleanupFailedTenant($tenant, $subscription);

            return redirect()->route('tenants.create')
                ->with('error', __('tenant.create_error') . ': ' . $e->getMessage());
        }
    }

    public function show(Tenant $tenant)
    {
        $tenant->load(['subscriptions' => function ($query) {
            $query->where('is_active', true)->with('plan');
        }]);

        $subscription = $tenant->subscriptions->first();

        return Inertia::render('tenants/show', [
            'tenant' => TenantResource::make($tenant)->toArray(request()),
            'subscription' => $subscription
        ]);
    }

    public function destroy(Tenant $tenant)
    {
        try {
            // Cancelar suscripciones activas antes de eliminar
            $activeSubscriptions = $tenant->subscriptions()->where('is_active', true)->get();
            foreach ($activeSubscriptions as $subscription) {
                if ($subscription->mercadopago_id) {
                    // Aquí podrías cancelar en MercadoPago si es necesario
                }
                $subscription->cancel();
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



    /**
     * Limpiar datos si la creación falla
     */
    private function cleanupFailedTenant(?Tenant $tenant, ?Subscription $subscription): void
    {
        try {
            if ($subscription) {
                $subscription->delete();
            }

            if ($tenant) {
                // Eliminar dominios
                $tenant->domains()->delete();

                // Eliminar tenant (esto también elimina la base de datos)
                $tenant->delete();
            }
        } catch (\Exception $e) {
            Log::error("Error cleaning up failed tenant creation", [
                'tenant_id' => $tenant?->id,
                'error' => $e->getMessage()
            ]);
        }
    }



    private function validateDomainExists(string $domain): bool
    {
        return Tenant::query()->whereHas('domains', function ($query) use ($domain) {
            $query->where('domain', $domain);
        })->exists();
    }

    private function createSubscription(Tenant $tenant, Plan $plan, string $billing): Subscription
    {
        $price = $billing === 'monthly' ? $plan->price_monthly : $plan->price_annual;

        // Si es plan gratuito, crear directamente como activo
        if ($plan->is_free) {
            return Subscription::create([
                'tenant_id' => $tenant->id,
                'plan_id' => $plan->id,
                'status' => SubscriptionStatus::ACTIVE,
                'price' => 0,
                'currency' => $plan->currency,
                'billing_cycle' => $billing,
                'starts_at' => now(),
                'is_active' => true,
            ]);
        }

        // Si tiene período de prueba, crear como trial
        if ($plan->trial_days > 0) {
            return Subscription::create([
                'tenant_id' => $tenant->id,
                'plan_id' => $plan->id,
                'status' => SubscriptionStatus::TRIAL,
                'price' => $price,
                'currency' => $plan->currency,
                'billing_cycle' => $billing,
                'starts_at' => now(),
                'trial_ends_at' => now()->addDays($plan->trial_days),
                'is_active' => true,
            ]);
        }

        // Para planes de pago sin trial, crear como pendiente
        return Subscription::create([
            'tenant_id' => $tenant->id,
            'plan_id' => $plan->id,
            'status' => SubscriptionStatus::PENDING,
            'price' => $price,
            'currency' => $plan->currency,
            'billing_cycle' => $billing,
            'is_active' => false,
        ]);
    }
}
