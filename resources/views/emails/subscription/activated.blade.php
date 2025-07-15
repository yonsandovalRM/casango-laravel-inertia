@component('mail::message')
    # ¡Tu suscripción está activa!

    Hola {{ $tenant->name }},

    Tu suscripción al plan **{{ $plan->name }}** se ha activado exitosamente.

    ## Detalles de tu suscripción:
    - **Plan:** {{ $plan->name }}
    - **Precio:** ${{ number_format($subscription->price, 0, ',', '.') }} {{ $subscription->currency }}
    - **Ciclo:** {{ $subscription->billing_cycle === 'monthly' ? 'Mensual' : 'Anual' }}
    - **Próximo pago:**
    {{ $subscription->next_billing_date ? $subscription->next_billing_date->format('d/m/Y') : 'Por definir' }}

    @component('mail::button', ['url' => 'http://' . $tenant->domains->first()->domain . '/dashboard'])
        Acceder a tu Dashboard
    @endcomponent

    ¡Ahora puedes aprovechar todas las funcionalidades de tu plan!

    Gracias,<br>
    {{ config('app.name') }}
@endcomponent
