<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Suscripción Creada</title>
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
    </style>
</head>

<body>
    <div class="header">
        <h1>¡Bienvenido a {{ config('app.name') }}!</h1>
    </div>

    <div class="content">
        <p>Hola {{ $tenant->name }},</p>

        <p>Tu suscripción al plan <strong>{{ $plan->name }}</strong> ha sido creada exitosamente.</p>

        <div class="details">
            <h3>Detalles de tu suscripción:</h3>
            <ul>
                <li><strong>Plan:</strong> {{ $plan->name }}</li>
                <li><strong>Precio:</strong> ${{ number_format($subscription->price, 0, ',', '.') }}
                    {{ $subscription->currency }}</li>
                <li><strong>Ciclo:</strong> {{ $subscription->billing_cycle === 'monthly' ? 'Mensual' : 'Anual' }}</li>
                @if ($subscription->trial_ends_at)
                    <li><strong>Período de prueba hasta:</strong> {{ $subscription->trial_ends_at->format('d/m/Y') }}
                    </li>
                @endif
            </ul>
        </div>

        <div style="text-align: center;">
            <a href="http://{{ $tenant->domains->first()->domain }}/dashboard" class="button">
                Acceder a tu Dashboard
            </a>
        </div>

        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
    </div>

    <div class="footer">
        <p>Gracias,<br>{{ config('app.name') }}</p>
    </div>
</body>

</html>
