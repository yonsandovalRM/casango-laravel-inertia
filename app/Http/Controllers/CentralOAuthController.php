<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CentralOAuthController extends Controller
{
    public function redirectToGoogle(Request $request)
    {
        $tenantId = $request->get('tenant');

        // Validar tenant
        if (!$tenantId || !Tenant::find($tenantId)) {
            return redirect()->route('home')->withErrors(['error' => 'Tenant no válido']);
        }

        // Guardar tenant en sesión
        $request->session()->put('oauth_tenant_id', $tenantId);

        return Socialite::driver('google')
            ->with(['state' => base64_encode(json_encode(['tenant' => $tenantId]))])
            ->redirect();
    }

    public function handleGoogleCallback(Request $request)
    {
        try {
            // Obtener tenant del state o sesión
            $tenantId = null;

            if ($request->has('state')) {
                $state = json_decode(base64_decode($request->get('state')), true);
                $tenantId = $state['tenant'] ?? null;
            }

            if (!$tenantId) {
                $tenantId = $request->session()->get('oauth_tenant_id');
            }

            if (!$tenantId) {
                return redirect()->route('home')->withErrors(['error' => 'Sesión OAuth expirada']);
            }

            // Validar tenant
            $tenant = Tenant::find($tenantId);
            if (!$tenant) {
                return redirect()->route('home')->withErrors(['error' => 'Tenant no válido']);
            }

            // Obtener usuario de Google
            $googleUser = Socialite::driver('google')->user();

            // Inicializar tenancy para crear/buscar usuario
            tenancy()->initialize($tenant);

            // Buscar o crear usuario en el tenant
            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'password' => Hash::make(Str::random(32)), // Password aleatoria
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => now(),
                ]);
            } else {
                // Actualizar datos de Google si no los tiene
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar(),
                        'email_verified_at' => now(),
                    ]);
                }
            }

            // Autenticar usuario
            Auth::login($user);

            // Limpiar sesión OAuth
            $request->session()->forget('oauth_tenant_id');

            // Redirigir al tenant
            return redirect()->to("http://{$tenant->id}.{$this->getBaseDomain()}/dashboard");
        } catch (\Exception $e) {
            return redirect()->route('home')->withErrors(['error' => 'Error en autenticación OAuth']);
        }
    }

    public function redirectToMicrosoft(Request $request)
    {
        $tenantId = $request->get('tenant');

        if (!$tenantId || !Tenant::find($tenantId)) {
            return redirect()->route('home')->withErrors(['error' => 'Tenant no válido']);
        }

        $request->session()->put('oauth_tenant_id', $tenantId);

        return Socialite::driver('microsoft')
            ->with(['state' => base64_encode(json_encode(['tenant' => $tenantId]))])
            ->redirect();
    }

    public function handleMicrosoftCallback(Request $request)
    {
        // Implementación similar a Google
        // ... (código similar adaptado para Microsoft)
    }

    private function getBaseDomain(): string
    {
        return parse_url(config('app.url'), PHP_URL_HOST);
    }
}
