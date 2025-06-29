import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useCompany } from '@/hooks/use-company';
import { ArrowLeft, Calendar, CheckCircle, Clock, DollarSign, LogIn, Mail, Phone, User } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface BookingConfirmationProps {
    service: any;
    professional: any;
    selectedDate: string;
    selectedTime: any;
    availability: any;
    onBack?: () => void;
    hideHeader?: boolean;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
    service,
    professional,
    selectedDate,
    selectedTime,
    availability,
    onBack,
    hideHeader = false,
}) => {
    const company = useCompany();

    const [bookingData, setBookingData] = useState({
        name: '',
        email: '',
        phone: '',
        notes: '',
    });
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState('login');

    const finalPrice = availability?.service?.price || service.price;
    const finalDuration = availability?.service?.duration || service.duration;

    const handleInputChange = (field: string, value: string, type: 'booking' | 'login' | 'register' = 'booking') => {
        if (type === 'booking') {
            setBookingData((prev) => ({ ...prev, [field]: value }));
        } else if (type === 'login') {
            setLoginData((prev) => ({ ...prev, [field]: value }));
        } else if (type === 'register') {
            setRegisterData((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleLogin = async () => {
        if (!loginData.email || !loginData.password) {
            toast.error('Error', {
                description: 'Por favor completa todos los campos',
            });
            return;
        }

        setIsSubmitting(true);

        // Simular autenticación
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            console.log('Login:', loginData);

            setIsLoggedIn(true);
            setBookingData((prev) => ({
                ...prev,
                name: 'Usuario Logueado',
                email: loginData.email,
                phone: '+57 300 123 4567', // Datos simulados del usuario
            }));

            toast.success('¡Bienvenido!', {
                description: 'Has iniciado sesión correctamente',
            });
        } catch (error) {
            toast.error('Error', {
                description: 'Credenciales incorrectas',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegister = async () => {
        if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
            toast.error('Error', {
                description: 'Por favor completa todos los campos',
            });
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            toast.error('Error', {
                description: 'Las contraseñas no coinciden',
            });
            return;
        }

        setIsSubmitting(true);

        // Simular registro
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            console.log('Register:', registerData);

            setIsLoggedIn(true);
            setBookingData((prev) => ({
                ...prev,
                name: registerData.name,
                email: registerData.email,
                phone: '+57 300 123 4567', // Teléfono por defecto
            }));

            toast.success('¡Cuenta creada!', {
                description: 'Tu cuenta ha sido creada exitosamente',
            });
        } catch (error) {
            toast.error('Error', {
                description: 'Error al crear la cuenta',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmBooking = async () => {
        if (!bookingData.name || !bookingData.email || !bookingData.phone) {
            toast.error('Error', {
                description: 'Por favor completa todos los campos obligatorios',
            });
            return;
        }

        setIsSubmitting(true);

        // Simular llamada a API
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log('Reserva confirmada:', {
                service: service.id,
                professional: professional.id,
                date: selectedDate,
                time: selectedTime.time,
                client: bookingData,
                price: finalPrice,
                duration: finalDuration,
            });

            setIsConfirmed(true);
            toast.success('¡Reserva confirmada!', {
                description: 'Tu cita ha sido agendada exitosamente',
            });
        } catch (error) {
            toast.error('Error', {
                description: 'Hubo un problema al confirmar tu reserva. Inténtalo de nuevo.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isConfirmed) {
        return (
            <div className="min-h-screen p-4">
                <div className="mx-auto max-w-2xl pt-20">
                    <Card className="bg-card text-center">
                        <CardHeader className="pb-4">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                            </div>
                            <CardTitle className="text-2xl text-green-700 dark:text-green-400">¡Reserva Confirmada!</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                Tu cita ha sido agendada exitosamente. Recibirás un correo de confirmación en breve.
                            </p>

                            <div className="space-y-2 rounded-lg bg-accent p-4 text-left">
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                                    <span className="font-semibold">Fecha:</span> {new Date(selectedDate).toLocaleDateString('es-ES')}
                                </div>
                                <div className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4 text-green-600" />
                                    <span className="font-semibold">Hora:</span> {selectedTime.time}
                                </div>
                                <div className="flex items-center">
                                    <User className="mr-2 h-4 w-4 text-green-600" />
                                    <span className="font-semibold">Profesional:</span> {professional.title}{' '}
                                    {professional.user?.name || availability?.professional?.name}
                                </div>
                                <div className="flex items-center">
                                    <DollarSign className="mr-2 h-4 w-4 text-green-600" />
                                    <span className="font-semibold">Total:</span> ${Number(finalPrice).toLocaleString()} COP
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button variant="outline" onClick={() => window.location.reload()} className="flex-1">
                                    Nueva Reserva
                                </Button>
                                <Button onClick={() => (window.location.href = '/')} className="flex-1">
                                    Ir al Inicio
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className={hideHeader ? '' : 'min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4'}>
            <div className={hideHeader ? '' : 'mx-auto max-w-4xl'}>
                {/* Header */}
                {!hideHeader && onBack && (
                    <div className="mb-6 flex items-center">
                        <Button variant="ghost" onClick={onBack} className="mr-4 hover:bg-white/50">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver a horarios
                        </Button>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Booking Summary */}
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <CheckCircle className="mr-2 h-5 w-5" />
                                Resumen de Reserva
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Service Info */}
                            <div>
                                <h3 className="mb-2 text-lg font-semibold">{service.name}</h3>
                                <p className="mb-4 text-sm text-muted-foreground">{service.description}</p>

                                <div className="mb-4 flex items-center space-x-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={professional.user?.photo || availability?.professional?.photo} />
                                        <AvatarFallback className="bg-blue-100 text-blue-600">
                                            {(professional.user?.name || availability?.professional?.name)
                                                ?.split(' ')
                                                .map((n: string) => n[0])
                                                .join('') || 'P'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">
                                            {professional.title} {professional.user?.name || availability?.professional?.name}
                                        </p>
                                        <Badge variant="secondary">Profesional</Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <Calendar className="mr-3 h-4 w-4 text-blue-600" />
                                    <div>
                                        <p className="font-medium">Fecha</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(selectedDate).toLocaleDateString('es-ES', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Clock className="mr-3 h-4 w-4 text-blue-600" />
                                    <div>
                                        <p className="font-medium">Hora y Duración</p>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedTime.time} • {finalDuration} minutos
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="rounded-lg bg-accent p-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">Total a pagar:</span>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">${Number(finalPrice).toLocaleString()}</div>
                                        <div className="text-sm text-muted-foreground">{company.currency}</div>
                                    </div>
                                </div>
                                {finalPrice !== service.price && <p className="mt-2 text-xs text-gray-500">* Precio personalizado del profesional</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Login/Register or Client Information Form */}
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                {!isLoggedIn ? <LogIn className="mr-2 h-5 w-5" /> : <User className="mr-2 h-5 w-5" />}
                                {!isLoggedIn ? 'Inicia sesión o regístrate' : 'Información de Contacto'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!isLoggedIn ? (
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                                        <TabsTrigger value="register">Registrarse</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="login" className="space-y-4">
                                        <div>
                                            <Label htmlFor="login-email">Correo electrónico</Label>
                                            <Input
                                                id="login-email"
                                                type="email"
                                                value={loginData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value, 'login')}
                                                placeholder="tu@email.com"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="login-password">Contraseña</Label>
                                            <Input
                                                id="login-password"
                                                type="password"
                                                value={loginData.password}
                                                onChange={(e) => handleInputChange('password', e.target.value, 'login')}
                                                placeholder="Tu contraseña"
                                                className="mt-1"
                                            />
                                        </div>
                                        <Button onClick={handleLogin} disabled={isSubmitting} className="w-full">
                                            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                                        </Button>
                                    </TabsContent>

                                    <TabsContent value="register" className="space-y-4">
                                        <div>
                                            <Label htmlFor="register-name">Nombre completo</Label>
                                            <Input
                                                id="register-name"
                                                value={registerData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value, 'register')}
                                                placeholder="Tu nombre completo"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="register-email">Correo electrónico</Label>
                                            <Input
                                                id="register-email"
                                                type="email"
                                                value={registerData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value, 'register')}
                                                placeholder="tu@email.com"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="register-password">Contraseña</Label>
                                            <Input
                                                id="register-password"
                                                type="password"
                                                value={registerData.password}
                                                onChange={(e) => handleInputChange('password', e.target.value, 'register')}
                                                placeholder="Contraseña"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="register-confirm">Confirmar contraseña</Label>
                                            <Input
                                                id="register-confirm"
                                                type="password"
                                                value={registerData.confirmPassword}
                                                onChange={(e) => handleInputChange('confirmPassword', e.target.value, 'register')}
                                                placeholder="Confirma tu contraseña"
                                                className="mt-1"
                                            />
                                        </div>
                                        <Button onClick={handleRegister} disabled={isSubmitting} className="w-full">
                                            {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
                                        </Button>
                                    </TabsContent>
                                </Tabs>
                            ) : (
                                <div className="space-y-4">
                                    <div className="mb-4 rounded-lg bg-accent p-3">
                                        <p className="text-sm text-green-700">✓ Sesión iniciada correctamente</p>
                                    </div>

                                    <div>
                                        <Label htmlFor="name">Nombre completo *</Label>
                                        <Input
                                            id="name"
                                            value={bookingData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Tu nombre completo"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Correo electrónico *</Label>
                                        <div className="relative">
                                            <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={bookingData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                placeholder="tu@email.com"
                                                className="mt-1 pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="phone">Teléfono *</Label>
                                        <div className="relative">
                                            <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={bookingData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                placeholder="+57 300 123 4567"
                                                className="mt-1 pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                                        <Textarea
                                            id="notes"
                                            value={bookingData.notes}
                                            onChange={(e) => handleInputChange('notes', e.target.value)}
                                            placeholder="Cualquier información adicional que quieras compartir..."
                                            className="mt-1"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            onClick={handleConfirmBooking}
                                            disabled={isSubmitting || !bookingData.name || !bookingData.email || !bookingData.phone}
                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                            size="lg"
                                        >
                                            {isSubmitting ? 'Confirmando...' : 'Confirmar Reserva'}
                                        </Button>
                                    </div>

                                    <p className="text-center text-xs text-gray-500">
                                        Al confirmar, aceptas nuestros términos y condiciones de servicio.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
