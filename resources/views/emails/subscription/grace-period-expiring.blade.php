@component('mail::message')
    # ⚠️ Acción urgente requerida

    Hola {{ $tenant->name }},

    Tu cuenta está en período de gracia y se suspenderá en **{{ $daysLeft }} días** si no actualizas tu método de pago.

    **¿Qué significa esto?**
    - Aún puedes acceder a todas las funciones
    - Pero tu acceso se suspenderá pronto
    - Todos tus datos se mantendrán seguros

    @component('mail::button', [
        'url' => 'http://' . $tenant->domains->first()->domain . '/dashboard/subscription',
        'color' => 'error',
    ])
        Actualizar Método de Pago AHORA
    @endcomponent

    **Importante:** Una vez suspendida tu cuenta, no podrás:
    - Acceder al dashboard
    - Recibir nuevas reservas
    - Gestionar tu negocio

    Si tienes problemas para realizar el pago, contáctanos inmediatamente.

    Gracias,<br>
    {{ config('app.name') }}
@endcomponent
