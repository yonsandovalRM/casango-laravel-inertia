@component('mail::layout')
    @slot('header')
        @component('mail::header', ['url' => config('app.url')])
            <img src="{{ $companyLogo }}" alt="{{ config('app.name') }}" style="height: 50px;">
        @endcomponent
    @endslot

    # @if ($daysRemaining > 3)
        Completa tu configuración de pago
    @else
        ¡Última oportunidad para configurar tu pago!
    @endif

    Hola {{ $tenant->name }},

    @if ($daysRemaining > 3)
        Estás a solo **{{ $daysRemaining }} días** de que finalice tu período de prueba el **{{ $trialEndDate }}**.
    @else
        Tu período de prueba finaliza **mañana**. ¡No pierdas acceso a tu cuenta!
    @endif

    Para continuar disfrutando de **{{ $plan->name }}** sin interrupciones, necesitamos que completes la configuración de
    tu método de pago.

    @component('mail::button', ['url' => $paymentUrl, 'color' => 'success'])
        Configurar Método de Pago
    @endcomponent

    **Recuerda los beneficios de tu plan:**
    @foreach ($planFeatures as $feature)
        - {{ $feature }}
    @endforeach

    **¿Por qué configurar ahora?**
    ✅ Garantizar acceso continuo
    ✅ Evitar interrupciones en tu servicio
    ✅ Mantener tus datos seguros

    @if ($daysRemaining <= 2)
        ⏰ **¡Atención!** Si no configuras tu pago antes del {{ $trialEndDate }}, tu acceso podría suspenderse temporalmente.
    @endif

    ¿Necesitas ayuda? Nuestro equipo está disponible en [{{ $supportEmail }}](mailto:{{ $supportEmail }}).

    Saludos cordiales,
    El equipo de {{ config('app.name') }}

    @slot('footer')
        @component('mail::footer')
            © {{ date('Y') }} {{ config('app.name') }}. Todos los derechos reservados.
            <br>
            @if ($subscription->mp_preapproval_id)
                ID de referencia: {{ $subscription->mp_preapproval_id }}
            @endif
        @endcomponent
    @endslot
@endcomponent
