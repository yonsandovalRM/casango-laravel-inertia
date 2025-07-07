@component('mail::layout')
    @slot('header')
        @component('mail::header', ['url' => config('app.url')])
            <img src="{{ $companyLogo }}" alt="{{ config('app.name') }}" style="height: 50px;">
        @endcomponent
    @endslot

    # @if ($daysRemaining > 0)
        ¡Tu período de prueba está por terminar!
    @else
        Tu período de prueba ha finalizado
    @endif

    Hola {{ $tenant->name }},

    @if ($daysRemaining > 0)
        Tu período de prueba para el plan **{{ $plan->name }}** finaliza en **{{ $daysRemaining }} días** (el
        {{ $trialEndsAt }}).
    @else
        Tu período de prueba para el plan **{{ $plan->name }}** ha finalizado el {{ $trialEndsAt }}.
    @endif

    Para continuar disfrutando de nuestro servicio sin interrupciones, por favor completa tu información de pago.

    @component('mail::button', ['url' => $paymentUrl, 'color' => 'primary'])
        Configurar Método de Pago
    @endcomponent

    **Beneficios de tu plan:**
    @foreach ($plan->features as $feature)
        - {{ $feature }}
    @endforeach

    @if ($daysRemaining > 1)
        ⚠️ Si no configuras tu método de pago antes de la fecha de finalización, tu acceso podría verse interrumpido.
    @elseif($daysRemaining === 1)
        ⚠️ ¡Último día! Configura tu método de pago hoy para evitar interrupciones.
    @else
        ⚠️ Tu acceso está a punto de ser suspendido. Completa tu pago para reactivar el servicio.
    @endif

    ¿Necesitas ayuda? Contáctanos en [{{ $supportEmail }}](mailto:{{ $supportEmail }}).

    Gracias,<br>
    El equipo de {{ config('app.name') }}

    @slot('footer')
        @component('mail::footer')
            © {{ date('Y') }} {{ config('app.name') }}. Todos los derechos reservados.
            <br>
            @if ($subscription->mp_preapproval_id)
                Referencia: #{{ $subscription->mp_preapproval_id }}
            @endif
        @endcomponent
    @endslot
@endcomponent
