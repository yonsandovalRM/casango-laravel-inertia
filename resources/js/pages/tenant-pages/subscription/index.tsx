import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlanResource } from '@/interfaces/plan';
import { SubscriptionResource } from '@/interfaces/subscription';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { AlertCircle, Calendar, CheckCircle, Clock, CreditCard, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface SubscriptionStatusData {
    status: string;
    status_label: string;
    status_color: string;
    mp_status?: string;
    is_active: boolean;
    is_in_trial: boolean;
    is_trial_expired: boolean;
    is_expired: boolean;
    needs_payment_setup: boolean;
    trial_days_remaining: number;
    trial_ends_at: string;
    ends_at: string;
    next_billing_date: string;
    current_price: number;
    plan_name: string;
    is_monthly: boolean;
    can_cancel: boolean;
    can_upgrade: boolean;
    can_downgrade: boolean;
}

interface SubscriptionProps {
    subscription: SubscriptionResource;
    plans: PlanResource[];
    paymentUrl?: string;
    subscriptionStatus?: SubscriptionStatusData;
}

export default function Subscription({ subscription, plans, paymentUrl, subscriptionStatus }: SubscriptionProps) {
    const [loading, setLoading] = useState<string | null>(null);
    const [statusData, setStatusData] = useState<SubscriptionStatusData | null>(subscriptionStatus || null);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handlePayment = async () => {
        if (paymentUrl) {
            // Redirigir directamente a la URL de pago
            window.location.href = paymentUrl;
        } else {
            // Configurar método de pago
            setLoading('payment');
            try {
                const response = await axios.post(route('tenant.subscription.setup-payment'));

                const data = await response.data;

                if (response.status === 200) {
                    if (data.payment_url) {
                        window.location.href = data.payment_url;
                    } else {
                        toast.success('Método de pago ya configurado');
                        router.reload();
                    }
                } else {
                    toast.error(data.error || 'Error al configurar el pago');
                }
            } catch (error) {
                toast.error('Error al configurar el pago');
            } finally {
                setLoading(null);
            }
        }
    };

    const handleRenew = async () => {
        setLoading('renew');
        try {
            const response = await axios.post(route('tenant.subscription.renew'));

            const data = await response.data;

            if (response.status === 200) {
                toast.success('Suscripción renovada exitosamente');
                if (data.payment_url) {
                    // Redirigir a configurar pago si es necesario
                    window.location.href = data.payment_url;
                } else {
                    router.reload();
                }
            } else {
                toast.error(data.error || 'Error al renovar la suscripción');
            }
        } catch (error) {
            toast.error('Error al renovar la suscripción');
        } finally {
            setLoading(null);
        }
    };

    const handleCancel = async () => {
        if (!confirm('¿Estás seguro de que quieres cancelar tu suscripción?')) {
            return;
        }

        setLoading('cancel');
        try {
            const response = await axios.post(route('tenant.subscription.cancel'));

            const data = await response.data;

            if (response.status === 200) {
                toast.success('Suscripción cancelada exitosamente');
                router.reload();
            } else {
                toast.error(data.error || 'Error al cancelar la suscripción');
            }
        } catch (error) {
            toast.error('Error al cancelar la suscripción');
        } finally {
            setLoading(null);
        }
    };

    const handleRefreshStatus = async () => {
        setLoading('status');
        try {
            const response = await fetch(route('tenant.subscription.status'));
            const data = await response.json();

            if (response.ok) {
                setStatusData(data);
                toast.success('Estado actualizado');
            } else {
                toast.error('Error al obtener el estado');
            }
        } catch (error) {
            toast.error('Error al obtener el estado');
        } finally {
            setLoading(null);
        }
    };

    const getStatusBadge = (status: string, isActive: boolean) => {
        if (!isActive) return <Badge variant="destructive">Inactiva</Badge>;

        switch (status) {
            case 'paid':
            case 'active':
                return (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                        Activa
                    </Badge>
                );
            case 'pending':
                return <Badge variant="secondary">Pendiente</Badge>;
            case 'pending_payment_method':
                return <Badge variant="destructive">Requiere configuración de pago</Badge>;
            case 'overdue':
                return <Badge variant="destructive">Vencida</Badge>;
            case 'cancelled':
                return <Badge variant="outline">Cancelada</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const parseFeatures = (features: string[] | string) => {
        if (Array.isArray(features)) return features;
        try {
            return JSON.parse(features);
        } catch {
            return [];
        }
    };

    const currentStatus = statusData || {
        is_active: subscription.is_active,
        is_in_trial: false,
        is_trial_expired: false,
        is_expired: false,
        needs_payment_setup: false,
        trial_days_remaining: 0,
        can_cancel: true,
        can_upgrade: false,
        can_downgrade: false,
    };

    const isTrialActive = subscription.trial_ends_at && new Date(subscription.trial_ends_at) > new Date();
    const features = parseFeatures(subscription.plan.features);

    return (
        <AppLayout breadcrumbs={[{ title: 'Suscripción', href: '/subscription' }]}>
            <Head title="Suscripción" />
            <div className="p-4">
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold">Suscripción Actual</CardTitle>
                            <div className="flex items-center gap-2">
                                {getStatusBadge(subscription.payment_status, currentStatus.is_active)}
                                <Button variant="outline" size="sm" onClick={handleRefreshStatus} disabled={loading === 'status'}>
                                    {loading === 'status' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Actualizar'}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Alertas importantes */}
                        {currentStatus.needs_payment_setup && (
                            <div className="flex items-center gap-2 rounded-lg bg-yellow-50 p-4 text-yellow-800">
                                <AlertCircle className="h-5 w-5" />
                                <span>Tu suscripción requiere configurar un método de pago para continuar activa.</span>
                            </div>
                        )}

                        {currentStatus.is_expired && (
                            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-800">
                                <AlertCircle className="h-5 w-5" />
                                <span>Tu suscripción ha expirado. Renuévala para continuar disfrutando de los beneficios.</span>
                            </div>
                        )}

                        {currentStatus.is_in_trial && (
                            <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-4 text-blue-800">
                                <Clock className="h-5 w-5" />
                                <span>Estás en período de prueba. Te quedan {currentStatus.trial_days_remaining} días.</span>
                            </div>
                        )}

                        {/* Plan Info */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold">{subscription.plan.name}</h3>
                                {subscription.plan.is_popular && <Badge variant="default">Popular</Badge>}
                            </div>
                            <p className="text-muted-foreground">{subscription.plan.description}</p>
                        </div>

                        {/* Price & Billing */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex items-center space-x-3">
                                <CreditCard className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">{formatCurrency(subscription.price, subscription.currency)}</p>
                                    <p className="text-sm text-muted-foreground">{subscription.is_monthly ? 'Mensual' : 'Anual'}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    {subscription.ends_at && <p className="font-medium">Vence: {formatDate(subscription.ends_at)}</p>}
                                    {isTrialActive && (
                                        <p className="text-sm text-muted-foreground">Prueba hasta: {formatDate(subscription.trial_ends_at)}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div>
                            <h4 className="mb-3 font-medium">Características incluidas:</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {features.map((feature: string, index: number) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 border-t pt-4">
                            {(currentStatus.needs_payment_setup || subscription.payment_status === 'pending_payment_method') && (
                                <Button onClick={handlePayment} disabled={loading === 'payment'}>
                                    {loading === 'payment' ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <CreditCard className="mr-2 h-4 w-4" />
                                    )}
                                    Configurar Pago
                                </Button>
                            )}

                            {(currentStatus.is_expired || !currentStatus.is_active) && (
                                <Button onClick={handleRenew} disabled={loading === 'renew'}>
                                    {loading === 'renew' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />}
                                    Renovar
                                </Button>
                            )}

                            {currentStatus.can_cancel && currentStatus.is_active && (
                                <Button onClick={handleCancel} variant="destructive" disabled={loading === 'cancel'}>
                                    {loading === 'cancel' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Cancelar Suscripción'}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
