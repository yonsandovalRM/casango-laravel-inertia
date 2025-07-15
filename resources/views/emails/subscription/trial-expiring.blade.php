<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Período de Prueba por Expirar</title>
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
            background-color: #28a745;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
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

        .info {
            background-color: #d1ecf1;
            border: 1px solid #bee5eb;
            color: #0c5460;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }

        .features-list {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>Tu período de prueba expira pronto</h1>
    </div>

    <div class="content">
        <p>Hola {{ $tenant->name }},</p>

        <div class="info">
            <strong>Tu período de prueba del plan {{ $plan->name }} expira en {{ $daysLeft }} días.</strong>
        </div>

        <p>Para continuar disfrutando de todos los beneficios sin interrupciones, suscríbete ahora.</p>

        <div style="text-align: center;">
            <a href="http://{{ $tenant->domains->first()->domain }}/dashboard/subscription" class="button">
                Suscribirme Ahora
            </a>
        </div>

        @if (!empty($plan->features))
            <div class="features-list">
                <h3>¿Por qué suscribirte?</h3>
                <ul>
                    @foreach ($plan->features as $feature)
                        <li>{{ $feature }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <div class="details">
            <h3>¿Tienes preguntas?</h3>
            <p>Si tienes alguna pregunta sobre tu suscripción o necesitas ayuda, estamos aquí para asistirte. No dudes
                en contactarnos.</p>
        </div>
    </div>

    <div class="footer">
        <p>Gracias,<br>{{ config('app.name') }}</p>
    </div>
</body>

</html>
