import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { AlertTriangle, Calendar, CheckCircle, Clock, CreditCard, Star, XCircle, Zap } from 'lucide-react';
import { useState } from 'react';

interface SubscriptionData {
    id: string;
    status: string;
    status_label: string;
    is_active: boolean;
    can_access: boolean;
    needs_payment: boolean;
    on_trial: boolean;
    trial_expired: boolean;
    on_grace_period: boolean;
    days_until_expiry: number;
    price: number;
    currency: string;
    billing_cycle: string;
    trial_ends_at?: string;
    grace_period_ends_at?: string;
    next_billing_date?: string;
    plan: {
        id: string;
        name: string;
        is_free: boolean;
        trial_days: number;
    };
    permissions: {
        can_cancel: boolean;
        can_reactivate: boolean;
        can_manage: boolean;
    };
}

interface Plan {
    id: string;
    name: string;
    description: string;
    price_monthly: number;
    price_annual: number;
    currency: string;
    is_free: boolean;
    is_popular: boolean;
    features: string[];
    trial_days: number;
}

interface Props {
    subscription: SubscriptionData | null;
    plans: Plan[];
    canManage: boolean;
}

export default function SubscriptionIndex({ subscription, plans, canManage }: Props) {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getStatusIcon = (subscription: SubscriptionData) => {
        if (subscription.on_trial) return <Clock className="h-4 w-4 text-blue-500" />;
        if (subscription.is_active) return <CheckCircle className="h-4 w-4 text-green-500" />;
        if (subscription.on_grace_period) return <AlertTriangle className="h-4 w-4 text-orange-500" />;
        return <XCircle className="h-4 w-4 text-red-500" />;
    };

    const getStatusColor = (subscription: SubscriptionData) => {
        if (subscription.on_trial) return 'bg-blue-100 text-blue-800';
        if (subscription.is_active) return 'bg-green-100 text-green-800';
        if (subscription.on_grace_period) return 'bg-orange-100 text-orange-800';
        return 'bg-red-100 text-red-800';
    };

    const handleSubscribe = (planId: string) => {
        setIsSubmitting(true);

        router.post(
            route('tenant.subscription.store'),
            {
                plan_id: planId,
                billing: billingCycle,
            },
            {
                onFinish: () => setIsSubmitting(false),
                onError: (errors) => {
                    console.error('Error en suscripción:', errors);
                    setIsSubmitting(false);
                },
            },
        );
    };

    const handleCancel = () => {
        if (confirm('¿Estás seguro de que quieres cancelar tu suscripción?')) {
            setIsSubmitting(true);

            router.post(
                route('tenant.subscription.cancel'),
                {},
                {
                    onFinish: () => setIsSubmitting(false),
                    onError: (errors) => {
                        console.error('Error al cancelar:', errors);
                        setIsSubmitting(false);
                    },
                },
            );
        }
    };

    const handleReactivate = () => {
        setIsSubmitting(true);

        router.post(
            route('tenant.subscription.reactivate'),
            {
                plan_id: subscription?.plan.id || '',
                billing: subscription?.billing_cycle || 'monthly',
            },
            {
                onFinish: () => setIsSubmitting(false),
                onError: (errors) => {
                    console.error('Error al reactivar:', errors);
                    setIsSubmitting(false);
                },
            },
        );
    };

    const handleChangePlan = (planId: string) => {
        setIsSubmitting(true);

        router.post(
            route('tenant.subscription.change-plan'),
            {
                plan_id: planId,
                billing: billingCycle,
            },
            {
                onFinish: () => setIsSubmitting(false),
                onError: (errors) => {
                    console.error('Error al cambiar plan:', errors);
                    setIsSubmitting(false);
                },
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Inicio', href: route('dashboard') },
        { title: 'Suscripción', href: route('tenant.subscription.index') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Negocios" />
            <div className="p-6">
                {/* Estado actual de la suscripción */}
                {subscription && (
                    <Card className="mb-8">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(subscription)}
                                    <div>
                                        <CardTitle className="text-xl">Plan {subscription.plan.name}</CardTitle>
                                        <CardDescription>Tu suscripción actual</CardDescription>
                                    </div>
                                </div>
                                <Badge className={getStatusColor(subscription)}>{subscription.status_label}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Precio</p>
                                    <p className="text-2xl font-bold">
                                        {subscription.plan.is_free ? 'Gratis' : formatCurrency(subscription.price, subscription.currency)}
                                        {!subscription.plan.is_free && (
                                            <span className="text-sm font-normal text-muted-foreground">
                                                /{subscription.billing_cycle === 'monthly' ? 'mes' : 'año'}
                                            </span>
                                        )}
                                    </p>
                                </div>

                                {subscription.next_billing_date && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Próximo pago</p>
                                        <p className="text-lg font-semibold">
                                            {new Date(subscription.next_billing_date).toLocaleDateString('es-CL')}
                                        </p>
                                    </div>
                                )}

                                {subscription.trial_ends_at && subscription.on_trial && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Prueba expira</p>
                                        <p className="text-lg font-semibold text-blue-600">{subscription.days_until_expiry} días restantes</p>
                                    </div>
                                )}

                                {subscription.grace_period_ends_at && subscription.on_grace_period && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Período de gracia</p>
                                        <p className="text-lg font-semibold text-orange-600">{subscription.days_until_expiry} días restantes</p>
                                    </div>
                                )}
                            </div>

                            {/* Alertas */}
                            {subscription.on_trial && subscription.days_until_expiry <= 3 && (
                                <Alert variant="info" className="mt-4">
                                    <Clock className="h-4 w-4" />
                                    <AlertDescription>
                                        Tu período de prueba expira en {subscription.days_until_expiry} días. Suscríbete para continuar sin
                                        interrupciones.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {subscription.on_grace_period && (
                                <Alert variant="warning" className="mt-4">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                        Tu cuenta está en período de gracia. Tienes {subscription.days_until_expiry} días para actualizar tu método de
                                        pago antes de que se suspenda tu acceso.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {subscription.needs_payment && (
                                <Alert variant="destructive" className="mt-4">
                                    <XCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Tu suscripción requiere pago para continuar. Actualiza tu método de pago para reactivar tu cuenta.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Acciones */}
                            {canManage && (
                                <div className="mt-6 flex gap-3">
                                    {subscription.permissions.can_cancel && (
                                        <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                                            {isSubmitting ? 'Procesando...' : 'Cancelar Suscripción'}
                                        </Button>
                                    )}

                                    {subscription.permissions.can_reactivate && (
                                        <Button onClick={handleReactivate} disabled={isSubmitting}>
                                            {isSubmitting ? 'Procesando...' : 'Reactivar Suscripción'}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Selector de ciclo de facturación */}
                <div className="mb-6 flex items-center justify-center gap-4">
                    <span className={billingCycle === 'monthly' ? 'font-semibold' : 'text-muted-foreground'}>Mensual</span>
                    <Switch
                        checked={billingCycle === 'annual'}
                        onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')}
                        disabled={isSubmitting}
                    />
                    <span className={billingCycle === 'annual' ? 'font-semibold' : 'text-muted-foreground'}>Anual</span>
                    {billingCycle === 'annual' && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Ahorra hasta 20%
                        </Badge>
                    )}
                </div>

                {/* Planes disponibles */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {plans.map((plan) => {
                        const price = billingCycle === 'monthly' ? plan.price_monthly : plan.price_annual;
                        const isCurrentPlan = subscription?.plan.id === plan.id;
                        const monthlyPrice = billingCycle === 'annual' ? price / 12 : price;

                        return (
                            <Card
                                key={plan.id}
                                className={`relative ${plan.is_popular ? 'border-blue-500 shadow-lg' : ''} ${isCurrentPlan ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' : ''}`}
                            >
                                {plan.is_popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                                        <Badge className="bg-blue-500 text-white">
                                            <Star className="mr-1 h-3 w-3" />
                                            Más Popular
                                        </Badge>
                                    </div>
                                )}

                                {isCurrentPlan && (
                                    <div className="absolute -top-3 right-4">
                                        <Badge className="bg-green-500 text-white">
                                            <CheckCircle className="mr-1 h-3 w-3" />
                                            Plan Actual
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>

                                    <div className="py-4">
                                        {plan.is_free ? (
                                            <div className="text-4xl font-bold">Gratis</div>
                                        ) : (
                                            <>
                                                <div className="text-4xl font-bold">
                                                    {formatCurrency(monthlyPrice, plan.currency)}
                                                    <span className="text-lg font-normal text-muted-foreground">/mes</span>
                                                </div>
                                                {billingCycle === 'annual' && (
                                                    <div className="text-sm text-muted-foreground">
                                                        Facturado {formatCurrency(price, plan.currency)} anualmente
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {plan.trial_days > 0 && !plan.is_free && (
                                        <Badge variant="outline" className="mb-4">
                                            <Zap className="mr-1 h-3 w-3" />
                                            {plan.trial_days} días gratis
                                        </Badge>
                                    )}
                                </CardHeader>

                                <CardContent className="flex h-full flex-col">
                                    <div className="flex-1">
                                        <ul className="mb-6 space-y-3">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                                                    <span className="text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {canManage && (
                                        <div className="space-y-2">
                                            {isCurrentPlan ? (
                                                <Button variant="outline" disabled className="w-full">
                                                    Plan Actual
                                                </Button>
                                            ) : subscription ? (
                                                <Button
                                                    onClick={() => handleChangePlan(plan.id)}
                                                    disabled={isSubmitting}
                                                    className="w-full"
                                                    variant={plan.is_popular ? 'default' : 'outline'}
                                                >
                                                    {isSubmitting ? 'Procesando...' : 'Cambiar a este Plan'}
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => handleSubscribe(plan.id)}
                                                    disabled={isSubmitting}
                                                    className="w-full"
                                                    variant={plan.is_popular ? 'default' : 'outline'}
                                                >
                                                    {isSubmitting
                                                        ? 'Procesando...'
                                                        : plan.is_free
                                                          ? 'Comenzar Gratis'
                                                          : plan.trial_days > 0
                                                            ? `Iniciar Prueba Gratis`
                                                            : 'Suscribirse'}
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Información adicional */}
                <div className="mt-12 text-center">
                    <Card>
                        <CardHeader>
                            <CardTitle>¿Tienes preguntas?</CardTitle>
                            <CardDescription>Estamos aquí para ayudarte a elegir el plan perfecto para tu negocio</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <Button variant="outline">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Agendar Demo
                                </Button>
                                <Button variant="outline">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Contactar Ventas
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
