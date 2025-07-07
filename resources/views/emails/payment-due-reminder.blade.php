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

    Hola **{{ $tenant->name }}**,

    @if ($daysRemaining > 0)
        Tu período de prueba para el plan **{{ $plan->name }}** finaliza en **{{ $daysRemaining }}
        día{{ $daysRemaining > 1 ? 's' : '' }}** (el {{ $trialEndsAt }}).
    @else
        Tu período de prueba para el plan **{{ $plan->name }}** ha finalizado el {{ $trialEndsAt }}.
    @endif

    Para continuar disfrutando de nuestro servicio sin interrupciones, por favor completa tu información de pago haciendo
    clic en el botón de abajo:

    @if ($paymentUrl)
        @component('mail::button', ['url' => $paymentUrl, 'color' => 'primary'])
            🔒 Configurar Método de Pago
        @endcomponent
    @else
        @component('mail::button', ['url' => route('tenant.subscription.index'), 'color' => 'primary'])
            📋 Ir a Mi Suscripción
        @endcomponent
    @endif

    ## Beneficios de tu plan {{ $plan->name }}:
    @if (!empty($plan->features))
        @foreach ($plan->features as $feature)
            - ✅ {{ $feature }}
        @endforeach
    @endif

    ---

    @if ($daysRemaining > 1)
        ⚠️ **Importante:** Si no configuras tu método de pago antes del {{ $trialEndsAt }}, tu acceso podría verse
        interrumpido.
    @elseif($daysRemaining === 1)
        🚨 **¡Último día!** Configura tu método de pago hoy para evitar interrupciones en tu servicio.
    @else
        🚨 **¡Atención!** Tu acceso está a punto de ser suspendido. Completa tu pago para reactivar el servicio
        inmediatamente.
    @endif

    ## Precio de tu plan:
    **${{ number_format($subscription->getCurrentPrice(), 2) }} {{ strtoupper($plan->currency) }}**
    @if ($subscription->is_monthly)
        por mes
    @else
        por año
    @endif

    ## ¿Necesitas ayuda?
    Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos:
    - 📧 Email: [{{ $supportEmail }}](mailto:{{ $supportEmail }})
    - 🌐 Portal de ayuda: [{{ config('app.url') }}/help]({{ config('app.url') }}/help)

    Gracias por confiar en nosotros,<br>
    **El equipo de {{ config('app.name') }}**

    @slot('footer')
        @component('mail::footer')
            © {{ date('Y') }} {{ config('app.name') }}. Todos los derechos reservados.
            <br>
            @if ($subscription->mp_preapproval_id)
                ID de referencia: {{ $subscription->mp_preapproval_id }}
            @endif
            <br>
            <small>Este es un recordatorio automático. Por favor, no respondas a este email.</small>
        @endcomponent
    @endslot
@endcomponent
