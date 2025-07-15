<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bienvenido a {{ config('app.name') }}</title>
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

        .alert {
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
        <h1>¡Bienvenido a {{ config('app.name') }}!</h1>
    </div>

    <div class="content">
        <p>Hola {{ $user->name }},</p>

        <p>Se ha creado una cuenta para ti en <strong>{{ $tenant->name ?? config('app.name') }}</strong>.</p>

        <div class="details">
            <h3>Tus credenciales de acceso:</h3>
            <ul>
                <li><strong>Email:</strong> {{ $user->email }}</li>
                <li><strong>Contraseña temporal:</strong> {{ $password }}</li>
            </ul>
        </div>

        <div class="alert">
            <strong>Importante:</strong> Por seguridad, cambia tu contraseña inmediatamente después de iniciar sesión.
        </div>

        <div style="text-align: center;">
            <a href="{{ isset($tenant) ? 'http://' . $tenant->domains->first()->domain . '/login' : route('login') }}"
                class="button">
                Iniciar Sesión
            </a>
        </div>

        <p>Si no has solicitado esta cuenta, puedes ignorar este correo o contactar con nuestro equipo de soporte.</p>
    </div>

    <div class="footer">
        <p>Gracias,<br>{{ config('app.name') }}</p>
    </div>
</body>

</html>
