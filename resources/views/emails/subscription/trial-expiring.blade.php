@component('mail::message')
    # Tu período de prueba expira pronto

    Hola {{ $tenant->name }},

    Tu período de prueba del plan **{{ $plan->name }}** expira en **{{ $daysLeft }} días**.

    Para continuar disfrutando de todos los beneficios sin interrupciones, suscríbete ahora.

    @component('mail::button', ['url' => 'http://' . $tenant->domains->first()->domain . '/dashboard/subscription'])
        Suscribirme Ahora
    @endcomponent

    ## ¿Por qué suscribirte?
    @foreach ($plan->features as $feature)
        - {{ $feature }}
    @endforeach

    Si tienes alguna pregunta, estamos aquí para ayudarte.

    Gracias,<br>
    {{ config('app.name') }}
@endcomponent
