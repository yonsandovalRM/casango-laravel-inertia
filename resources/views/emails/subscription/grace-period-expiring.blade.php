<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Acción Urgente Requerida</title>
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
            background-color: #dc3545;
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

        .urgent {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }

        .warning-list {
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
        <h1>⚠️ Acción urgente requerida</h1>
    </div>

    <div class="content">
        <p>Hola {{ $tenant->name }},</p>

        <div class="urgent">
            <strong>Tu cuenta está en período de gracia y se suspenderá en {{ $daysLeft }} días si no actualizas tu
                método de pago.</strong>
        </div>

        <div class="details">
            <h3>¿Qué significa esto?</h3>
            <ul>
                <li>Aún puedes acceder a todas las funciones</li>
                <li>Pero tu acceso se suspenderá pronto</li>
                <li>Todos tus datos se mantendrán seguros</li>
            </ul>
        </div>

        <div style="text-align: center;">
            <a href="http://{{ $tenant->domains->first()->domain }}/dashboard/subscription" class="button">
                Actualizar Método de Pago AHORA
            </a>
        </div>

        <div class="warning-list">
            <h4>Importante: Una vez suspendida tu cuenta, no podrás:</h4>
            <ul>
                <li>Acceder al dashboard</li>
                <li>Recibir nuevas reservas</li>
                <li>Gestionar tu negocio</li>
            </ul>
        </div>

        <p>Si tienes problemas para realizar el pago, contáctanos inmediatamente.</p>
    </div>

    <div class="footer">
        <p>Gracias,<br>{{ config('app.name') }}</p>
    </div>
</body>

</html>
