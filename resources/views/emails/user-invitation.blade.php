

<!DOCTYPE html>
<html>
<head>
    <title>Invitación a {{ config('app.name') }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
            border-top: 1px solid #ddd;
        }
        .content {
            padding: 20px;
            background-color: #fff;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
        }
        .credentials {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #6c757d;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{ asset('images/logo.png') }}" alt="Logo" class="logo">
        </div>
        
        <div class="content">
            <p>Hola {{ $name }},</p>
            
            <p>Has sido invitado a unirte a {{ config('app.name') }}. A continuación encontrarás los detalles de la invitación:</p>

            <div class="credentials">
                <p><strong>Email:</strong> {{ $invitation->email }}</p>
                <p><strong>Rol:</strong> {{ $invitation->role }}</p>
            </div>
            
            <a href="{{ $url }}" class="button">Aceptar Invitación</a>
            
            <p>Si no has solicitado esta invitación, por favor ignora este correo o contacta con nuestro equipo de soporte.</p>
        </div>
        
        <div class="footer">
            <p>© {{ date('Y') }} {{ config('app.name') }}. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>