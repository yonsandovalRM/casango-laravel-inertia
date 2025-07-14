@component('mail::message')
    # Problema con tu pago

    Hola {{ $tenant->name }},

    Hemos intentado procesar tu pago para el plan **{{ $plan->name }}** pero no pudimos completar la transacción.

    @if ($attemptsLeft > 0)
        Intentaremos nuevamente en las próximas horas. Te quedan **{{ $attemptsLeft }} intentos** antes de que tu cuenta
        entre en período de gracia.
    @else
        Tu cuenta ha entrado en período de gracia. Tienes {{ config('mercadopago.subscription.grace_period_days') }} días
        para actualizar tu método de pago.
    @endif

    @component('mail::button', ['url' => 'http://' . $tenant->domains->first()->domain . '/dashboard/subscription'])
        Actualizar Método de Pago
    @endcomponent

    Si necesitas ayuda, contacta con nuestro soporte.

    Gracias,<br>
    {{ config('app.name') }}
@endcomponent
