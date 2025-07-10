import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useCompany } from '@/hooks/use-company';
import { router, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, Check, CheckCircle, Clock, DollarSign, LogIn, Mail, Phone, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import InputError from '../input-error';
import { ProfessionalHeader } from '../professionals/ui/professional-header';
import { Alert, AlertDescription } from '../ui/alert';

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
    const { auth } = useAuth();

    useEffect(() => {
        if (auth.user) {
            setBookingData({
                name: auth.user.name,
                email: auth.user.email,
                phone: '',
                notes: '',
            });
        }
    }, [auth]);

    const [bookingData, setBookingData] = useState({
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
        phone: '',
        notes: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [activeTab, setActiveTab] = useState('login');

    // Forms de Inertia para login y registro
    const loginForm = useForm({
        email: '',
        password: '',
    });

    const registerForm = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const finalPrice = availability?.service?.price || service.price;
    const finalDuration = availability?.service?.duration || service.duration;

    const handleInputChange = (field: string, value: string) => {
        setBookingData((prev) => ({ ...prev, [field]: value }));
    };

    const handleLogin = () => {
        loginForm.post(route('auth.login-inline'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('¡Bienvenido!', {
                    description: 'Has iniciado sesión correctamente',
                });
            },
            onError: (errors) => {
                toast.error('Error', {
                    description: errors.email || errors.password || 'Credenciales incorrectas',
                });
            },
        });
    };

    const handleRegister = () => {
        registerForm.post(route('auth.register-inline'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('¡Cuenta creada!', {
                    description: 'Tu cuenta ha sido creada exitosamente',
                });
                setBookingData({
                    name: registerForm.data.name,
                    email: registerForm.data.email,
                    phone: '',
                    notes: '',
                });
            },
            onError: (errors) => {
                toast.error('Error', {
                    description: Object.values(errors).join(', ') || 'Error al crear la cuenta',
                });
            },
        });
    };

    const handleConfirmBooking = async () => {
        if (!bookingData.phone) {
            toast.error('Error', {
                description: 'Por favor ingresa tu número de teléfono',
            });
            return;
        }

        setIsSubmitting(true);

        router.post(
            route('bookings.store'),
            {
                service: service.id,
                professional: professional.id,
                date: selectedDate,
                time: selectedTime.time,
                client: bookingData,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsConfirmed(true);
                    toast.success('¡Reserva confirmada!', {
                        description: 'Tu cita ha sido agendada exitosamente',
                    });
                },
                onError: (errors) => {
                    toast.error('Error', {
                        description: errors.message || 'Hubo un problema al confirmar tu reserva. Inténtalo de nuevo.',
                    });
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    if (isConfirmed) {
        return (
            <div className="min-h-screen p-6">
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

                            <div className="flex gap-6 pt-4">
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

                                <ProfessionalHeader professional={professional} />
                            </div>

                            {/* User Info (when logged in) */}
                            {auth.user && (
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <User className="mr-2 h-4 w-4 text-blue-600" />
                                        <div>
                                            <p className="font-medium">Nombre</p>
                                            <p className="text-sm text-muted-foreground">{auth.user.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="mr-2 h-4 w-4 text-blue-600" />
                                        <div>
                                            <p className="font-medium">Correo electrónico</p>
                                            <p className="text-sm text-muted-foreground">{auth.user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                            <div className="rounded-lg bg-accent p-6">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">Total a pagar:</span>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">${Number(finalPrice).toLocaleString()}</div>
                                        <div className="text-sm text-muted-foreground">{company.currency}</div>
                                    </div>
                                </div>
                                {finalPrice !== service.price && (
                                    <p className="mt-2 text-xs text-muted-foreground">* Precio personalizado del profesional</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Login/Register or Client Information Form */}
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                {!auth.user ? <LogIn className="mr-2 h-5 w-5" /> : <User className="mr-2 h-5 w-5" />}
                                {!auth.user ? 'Inicia sesión o regístrate' : 'Información adicional'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!auth.user ? (
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
                                                value={loginForm.data.email}
                                                onChange={(e) => loginForm.setData('email', e.target.value)}
                                                placeholder="tu@email.com"
                                                className="mt-1"
                                            />
                                            <InputError message={loginForm.errors.email} />
                                        </div>
                                        <div>
                                            <Label htmlFor="login-password">Contraseña</Label>
                                            <Input
                                                id="login-password"
                                                type="password"
                                                value={loginForm.data.password}
                                                onChange={(e) => loginForm.setData('password', e.target.value)}
                                                placeholder="Tu contraseña"
                                                className="mt-1"
                                            />
                                            <InputError message={loginForm.errors.password} />
                                        </div>
                                        <Button onClick={handleLogin} disabled={loginForm.processing} className="w-full" size="lg">
                                            {loginForm.processing ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                                        </Button>
                                    </TabsContent>

                                    <TabsContent value="register" className="space-y-4">
                                        <div>
                                            <Label htmlFor="register-name">Nombre completo</Label>
                                            <Input
                                                id="register-name"
                                                value={registerForm.data.name}
                                                onChange={(e) => registerForm.setData('name', e.target.value)}
                                                placeholder="Tu nombre completo"
                                                className="mt-1"
                                            />
                                            <InputError message={registerForm.errors.name} />
                                        </div>
                                        <div>
                                            <Label htmlFor="register-email">Correo electrónico</Label>
                                            <Input
                                                id="register-email"
                                                type="email"
                                                value={registerForm.data.email}
                                                onChange={(e) => registerForm.setData('email', e.target.value)}
                                                placeholder="tu@email.com"
                                                className="mt-1"
                                            />
                                            <InputError message={registerForm.errors.email} />
                                        </div>
                                        <div>
                                            <Label htmlFor="register-phone">Teléfono</Label>
                                            <Input
                                                id="register-phone"
                                                type="tel"
                                                value={registerForm.data.phone}
                                                onChange={(e) => registerForm.setData('phone', e.target.value)}
                                                placeholder="+57 300 123 4567"
                                                className="mt-1"
                                            />
                                            <InputError message={registerForm.errors.phone} />
                                        </div>
                                        <div>
                                            <Label htmlFor="register-password">Contraseña</Label>
                                            <Input
                                                id="register-password"
                                                type="password"
                                                value={registerForm.data.password}
                                                onChange={(e) => registerForm.setData('password', e.target.value)}
                                                placeholder="Contraseña"
                                                className="mt-1"
                                            />
                                            <InputError message={registerForm.errors.password} />
                                        </div>
                                        <div>
                                            <Label htmlFor="register-confirm">Confirmar contraseña</Label>
                                            <Input
                                                id="register-confirm"
                                                type="password"
                                                value={registerForm.data.password_confirmation}
                                                onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                                placeholder="Confirma tu contraseña"
                                                className="mt-1"
                                            />
                                            <InputError message={registerForm.errors.password_confirmation} />
                                        </div>
                                        <Button onClick={handleRegister} disabled={registerForm.processing} className="w-full">
                                            {registerForm.processing ? 'Creando cuenta...' : 'Crear Cuenta'}
                                        </Button>
                                    </TabsContent>
                                </Tabs>
                            ) : (
                                <div className="space-y-4">
                                    <Alert variant="success">
                                        <AlertDescription className="flex items-center">
                                            <Check className="mr-2 inline h-4 w-4" />
                                            Estás logueado como <strong>{auth.user.name}</strong>.
                                        </AlertDescription>
                                    </Alert>

                                    <div>
                                        <Label htmlFor="phone">Teléfono *</Label>
                                        <div className="relative">
                                            <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
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
                                            disabled={isSubmitting || (!auth.user.phone && !bookingData.phone)}
                                            className="w-full"
                                            size="lg"
                                        >
                                            {isSubmitting ? 'Confirmando...' : 'Confirmar Reserva'}
                                        </Button>
                                    </div>

                                    <p className="mt-2 text-center text-xs text-muted-foreground">
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
