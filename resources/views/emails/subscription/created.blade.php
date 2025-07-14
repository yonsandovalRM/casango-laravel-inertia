@component('mail::message')
    # ¡Bienvenido a {{ config('app.name') }}!

    Hola {{ $tenant->name }},

    Tu suscripción al plan **{{ $plan->name }}** ha sido creada exitosamente.

    ## Detalles de tu suscripción:
    - **Plan:** {{ $plan->name }}
    - **Precio:** ${{ number_format($subscription->price, 0, ',', '.') }} {{ $subscription->currency }}
    - **Ciclo:** {{ $subscription->billing_cycle === 'monthly' ? 'Mensual' : 'Anual' }}

    @if ($subscription->onTrial())
        - **Período de prueba hasta:** {{ $subscription->trial_ends_at->format('d/m/Y') }}
    @endif

    @component('mail::button', ['url' => 'http://' . $tenant->domains->first()->domain . '/dashboard'])
        Acceder a tu Dashboard
    @endcomponent

    Si tienes alguna pregunta, no dudes en contactarnos.

    Gracias,<br>
    {{ config('app.name') }}
@endcomponent
