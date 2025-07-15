<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Problema con tu Pago</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e9ecef;
            border-radius: 8px;
        }

        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }

        .details {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #666;
        }

        .error {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }

        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>Problema con tu pago</h1>
    </div>

    <div class="content">
        <p>Hola {{ $tenant->name }},</p>

        <p>Hemos intentado procesar tu pago para el plan <strong>{{ $plan->name }}</strong> pero no pudimos completar
            la transacción.</p>

        @if ($attemptsLeft > 0)
            <div class="warning">
                <strong>Intentaremos nuevamente en las próximas horas.</strong><br>
                Te quedan <strong>{{ $attemptsLeft }} intentos</strong> antes de que tu cuenta entre en período de
                gracia.
            </div>
        @else
            <div class="error">
                <strong>Tu cuenta ha entrado en período de gracia.</strong><br>
                Tienes {{ config('mercadopago.subscription.grace_period_days') }} días para actualizar tu método de
                pago.
            </div>
        @endif

        <div style="text-align: center;">
            <a href="http://{{ $tenant->domains->first()->domain }}/dashboard/subscription" class="button">
                Actualizar Método de Pago
            </a>
        </div>

        <div class="details">
            <h3>¿Necesitas ayuda?</h3>
            <p>Si necesitas asistencia, contacta con nuestro equipo de soporte. Estamos aquí para ayudarte a resolver
                cualquier problema con tu pago.</p>
        </div>
    </div>

    <div class="footer">
        <p>Gracias,<br>{{ config('app.name') }}</p>
    </div>
</body>

</html>
