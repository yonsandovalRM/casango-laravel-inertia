import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TenantResource } from '@/interfaces/tenant';
import { Head, Link, router } from '@inertiajs/react';
import confetti from 'canvas-confetti';
import { ArrowRight, Book, Calendar, Check, Mail, MessageCircle, Phone, Settings, Users } from 'lucide-react';
import { useEffect } from 'react';

export default function TenantCreated({ tenant }: { tenant: TenantResource }) {
    useEffect(() => {
        // Si no hay datos del estado, redirigir al registro
        if (!tenant.name || !tenant.email) {
            router.visit(route('tenants.create'));
            return;
        }

        // Activar confetti
        const duration = 3000;
        const end = Date.now() + duration;

        const colors = ['#3B82F6', '#10B981', '#F59E0B'];

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();

        // Confetti central después de 1 segundo
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: colors,
            });
        }, 1000);

        return () => {
            confetti.reset();
        };
    }, [tenant.name, tenant.email]);
    return (
        <div className="bg-content">
            <Head title="Cuenta creada" />
            <div className="min-h-screen py-16">
                <div className="mx-auto max-w-2xl px-4">
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold">¡Bienvenido a Micita!</h1>
                        <p className="text-lg">Tu cuenta ha sido creada exitosamente</p>
                    </div>

                    <Alert variant="info" className="mb-8">
                        <Mail className="mr-2 h-4 w-4" />
                        <AlertTitle>Revisa tu email</AlertTitle>
                        <AlertDescription>
                            Te hemos enviado un email de confirmación con las credenciales de acceso y los siguientes pasos para configurar tu
                            sistema.
                        </AlertDescription>
                    </Alert>
                    <div className="mb-8 grid gap-6">
                        <h2 className="mb-4 text-xl font-semibold">Próximos pasos</h2>

                        <Card className="cursor-pointer transition-shadow hover:shadow-md">
                            <CardContent className="flex items-center p-6">
                                <div className="mr-4 rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                                    <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold">1. Configurar tu negocio</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Agrega servicios, horarios y configuración básica</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-600" />
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer transition-shadow hover:shadow-md">
                            <CardContent className="flex items-center p-6">
                                <div className="mr-4 rounded-lg bg-green-100 p-3 dark:bg-green-900">
                                    <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold">2. Crear tu primera reserva</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Prueba el sistema creando una reserva de ejemplo</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-600" />
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer transition-shadow hover:shadow-md">
                            <CardContent className="flex items-center p-6">
                                <div className="mr-4 rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold">3. Invitar a tu equipo</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Agrega usuarios para que puedan gestionar reservas</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-gray-400" />
                            </CardContent>
                        </Card>
                    </div>
                    <div className="flex flex-col justify-center gap-6 sm:flex-row">
                        <Button variant="outline" asChild>
                            <Link href={route('home')}>Volver al inicio</Link>
                        </Button>
                        <Button asChild>
                            <a href={`http://${tenant.domain}`} target="_blank">
                                Acceder a mi Dashboard
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle className="text-center">¿Necesitas ayuda para empezar?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col justify-center gap-6 sm:flex-row">
                                <Button variant="ghost" size="sm">
                                    <Phone className="h-4 w-4" />
                                    Agendar demo gratuita
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <MessageCircle className="h-4 w-4" />
                                    Chat con soporte
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <Book className="h-4 w-4" />
                                    Ver guía de inicio
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
