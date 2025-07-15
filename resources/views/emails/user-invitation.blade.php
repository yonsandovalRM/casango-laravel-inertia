<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Invitación a {{ config('app.name') }}</title>
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
        <h1>Invitación a {{ config('app.name') }}</h1>
    </div>

    <div class="content">
        <p>Hola {{ $invitation->name }},</p>

        <p>Has sido invitado a unirte a <strong>{{ $tenant->name }}</strong> en {{ config('app.name') }}.</p>

        <div class="details">
            <h3>Detalles de tu invitación:</h3>
            <ul>
                <li><strong>Email:</strong> {{ $invitation->email }}</li>
                <li><strong>Rol:</strong> {{ $invitation->role }}</li>
                <li><strong>Organización:</strong> {{ $tenant->name }}</li>
            </ul>
        </div>

        <div style="text-align: center;">
            <a href="{{ $acceptUrl }}" class="button">
                Aceptar Invitación
            </a>
        </div>

        <p>Si no has solicitado esta invitación, puedes ignorar este correo de forma segura.</p>

        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
    </div>

    <div class="footer">
        <p>Gracias,<br>{{ config('app.name') }}</p>
    </div>
</body>

</html>
