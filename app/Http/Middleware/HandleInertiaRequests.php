<?php

namespace App\Http\Middleware;

use App\Helpers\SubscriptionHelper;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $company = null;
        $subscription = null;
        $featureLimits = [];

        // Solo cargar datos del tenant si estamos en un contexto de tenant
        if (function_exists('tenancy') && tenancy()->initialized) {
            $company = Company::first();
            $subscription = SubscriptionHelper::getCurrentSubscriptionStatus();
            $featureLimits = SubscriptionHelper::getFeatureLimits();
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'company' => $company ? CompanyResource::make($company)->toArray(request()) : null,
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'roles' => $request->user()->getRoleNames(),
                    'permissions' => $request->user()->getAllPermissions()->pluck('name'),
                ] : null,
            ],
            'flash' => $this->getFlashMessages(),
            'ziggy' => fn(): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',

            // Solo incluir estos datos en tenants
            'subscription' => $subscription,
            'featureLimits' => $featureLimits,
        ];
    }

    private function getFlashMessages(): array
    {
        $messages = [];

        if ($error = session('error')) {
            $messages['error'] = [
                'id' => uniqid('error_'),
                'message' => $error,
                'type' => 'error'
            ];
        }

        if ($message = session('message')) {
            $messages['message'] = [
                'id' => uniqid('message_'),
                'message' => $message,
                'type' => 'info'
            ];
        }

        if ($success = session('success')) {
            $messages['success'] = [
                'id' => uniqid('success_'),
                'message' => $success,
                'type' => 'success'
            ];
        }

        if ($warning = session('warning')) {
            $messages['warning'] = [
                'id' => uniqid('warning_'),
                'message' => $warning,
                'type' => 'warning'
            ];
        }

        return $messages;
    }
}
