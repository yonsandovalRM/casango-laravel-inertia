<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Restablecer Contraseña</title>
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
        <h1>Restablecer Contraseña</h1>
    </div>

    <div class="content">
        <p>Hola {{ $name }},</p>

        <p>Has solicitado restablecer tu contraseña en {{ config('app.name') }}.</p>

        <div style="text-align: center;">
            <a href="{{ $url }}" class="button">
                Restablecer Contraseña
            </a>
        </div>

        <div class="warning">
            <strong>Importante:</strong> Este enlace expirará en {{ config('auth.passwords.users.expire') }} minutos.
        </div>

        <p>Si no has solicitado restablecer tu contraseña, puedes ignorar este correo de forma segura.</p>

        <p>Si tienes alguna pregunta, contáctanos en {{ config('app.email') }}.</p>
    </div>

    <div class="footer">
        <p>Gracias,<br>{{ config('app.name') }}</p>
    </div>
</body>

</html>
