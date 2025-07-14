import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle, Settings, Users } from 'lucide-react';

interface Props {
    subscription: any;
}

export default function SubscriptionSuccess({ subscription }: Props) {
    return (
        <div className="container mx-auto max-w-2xl p-6">
            <div className="mb-8 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="mb-2 text-3xl font-bold">¡Suscripción Exitosa!</h1>
                <p className="text-muted-foreground">
                    {subscription
                        ? `Tu suscripción al plan ${subscription.plan.name} está activa`
                        : 'Tu proceso de suscripción ha sido iniciado exitosamente'}
                </p>
            </div>

            {subscription && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Detalles de tu Suscripción</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Plan:</span>
                                <span className="font-semibold">{subscription.plan.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Estado:</span>
                                <span className="font-semibold text-green-600">{subscription.status_label}</span>
                            </div>
                            {subscription.trial_ends_at && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Prueba hasta:</span>
                                    <span className="font-semibold">{new Date(subscription.trial_ends_at).toLocaleDateString('es-CL')}</span>
                                </div>
                            )}
                            {subscription.next_billing_date && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Próximo pago:</span>
                                    <span className="font-semibold">{new Date(subscription.next_billing_date).toLocaleDateString('es-CL')}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Alert className="mb-8 border-blue-200 bg-blue-50">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                    {subscription?.on_trial
                        ? 'Tu período de prueba ha comenzado. Puedes usar todas las funciones sin restricciones.'
                        : 'Tu suscripción se activará en breve. Recibirás una confirmación por email.'}
                </AlertDescription>
            </Alert>

            <div className="mb-8 space-y-4">
                <h3 className="text-lg font-semibold">Próximos pasos recomendados:</h3>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Settings className="h-5 w-5 text-blue-600" />
                            <div className="flex-1">
                                <h4 className="font-medium">Configurar tu negocio</h4>
                                <p className="text-sm text-muted-foreground">Agrega servicios, horarios y personaliza tu perfil</p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={route('company.index')}>Configurar</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-green-600" />
                            <div className="flex-1">
                                <h4 className="font-medium">Invitar a tu equipo</h4>
                                <p className="text-sm text-muted-foreground">Agrega profesionales y personal administrativo</p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={route('invitations.index')}>Invitar</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button variant="outline" asChild>
                    <Link href={route('tenant.subscription.index')}>Ver Suscripción</Link>
                </Button>
                <Button asChild>
                    <Link href={route('dashboard')}>
                        Ir al Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
