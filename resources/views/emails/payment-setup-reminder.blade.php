@component('mail::layout')
    @slot('header')
        @component('mail::header', ['url' => config('app.url')])
            <img src="{{ $companyLogo }}" alt="{{ config('app.name') }}" style="height: 50px;">
        @endcomponent
    @endslot

    # @if ($daysRemaining > 3)
        📋 Completa tu configuración de pago
    @else
        🚨 ¡Última oportunidad para configurar tu pago!
    @endif

    Hola **{{ $tenant->name }}**,

    @if ($daysRemaining > 3)
        Estás a solo **{{ $daysRemaining }} días** de que finalice tu período de prueba el **{{ $trialEndDate }}**.
    @elseif ($daysRemaining > 1)
        ⏰ **¡Atención!** Tu período de prueba finaliza en **{{ $daysRemaining }} días** ({{ $trialEndDate }}).
    @elseif ($daysRemaining === 1)
        🚨 **¡Último día!** Tu período de prueba finaliza **mañana** ({{ $trialEndDate }}).
    @else
        🚨 **¡Urgente!** Tu período de prueba finaliza **hoy**. ¡No pierdas acceso a tu cuenta!
    @endif

    Para continuar disfrutando de **{{ $plan->name }}** sin interrupciones, necesitamos que completes la configuración de
    tu método de pago.

    @if ($paymentUrl)
        @component('mail::button', ['url' => $paymentUrl, 'color' => 'success'])
            🔒 Configurar Método de Pago Ahora
        @endcomponent
    @else
        @component('mail::button', ['url' => route('tenant.subscription.index'), 'color' => 'success'])
            📋 Ir a Mi Suscripción
        @endcomponent
    @endif

    ## 🎯 Beneficios de tu plan {{ $plan->name }}:
    @if (!empty($planFeatures))
        @foreach ($planFeatures as $feature)
            - ✅ {{ $feature }}
        @endforeach
    @endif

    ---

    ## 💡 ¿Por qué configurar tu pago ahora?

    ✅ **Acceso continuo:** Garantiza que no tendrás interrupciones en tu servicio

    ✅ **Datos seguros:** Mantén toda tu información y configuración intacta

    ✅ **Tranquilidad:** Olvídate de preocuparte por fechas de vencimiento

    @if ($daysRemaining <= 2)
        ---
        ⚠️ **¡Importante!** Si no configuras tu pago antes del {{ $trialEndDate }}, tu acceso se suspenderá
        automáticamente.
    @endif

    ## 💰 Precio de tu plan:
    **${{ number_format($subscription->getCurrentPrice(), 2) }} {{ strtoupper($plan->currency) }}**
    @if ($subscription->is_monthly)
        por mes (facturación mensual)
    @else
        por año (facturación anual - ¡Ahorras más!)
    @endif

    ## 🤝 ¿Necesitas ayuda?
    Nuestro equipo está disponible para ayudarte:
    - 📧 Email: [{{ $supportEmail }}](mailto:{{ $supportEmail }})
    - 🌐 Centro de ayuda: [{{ config('app.url') }}/help]({{ config('app.url') }}/help)
    - 💬 Chat en vivo: Disponible en tu panel de control

    Gracias por elegir {{ config('app.name') }},<br>
    **El equipo de {{ config('app.name') }}**

    @slot('footer')
        @component('mail::footer')
            © {{ date('Y') }} {{ config('app.name') }}. Todos los derechos reservados.
            <br>
            @if ($subscription->mp_preapproval_id)
                ID de referencia: {{ $subscription->mp_preapproval_id }}
            @endif
            <br>
            <small>Este es un recordatorio automático. Si ya completaste tu configuración de pago, puedes ignorar este
                email.</small>
        @endcomponent
    @endslot
@endcomponent
