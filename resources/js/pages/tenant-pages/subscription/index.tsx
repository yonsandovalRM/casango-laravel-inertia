import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlanResource } from '@/interfaces/plan';
import { SubscriptionResource } from '@/interfaces/subscription';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { Calendar, CheckCircle, Clock, CreditCard } from 'lucide-react';

interface SubscriptionProps {
    subscription: SubscriptionResource;
    plans: PlanResource[];
}

export default function Subscription({ subscription, plans }: SubscriptionProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    const onPay = () => {
        // Implement payment logic here
        console.log('Pagar ahora');
    };
    const onRenew = () => {
        // Implement renewal logic here
        console.log('Renovar suscripción');
    };

    const onCancel = () => {
        // Implement cancellation logic here
        console.log('Cancelar suscripción');
    };
    const getStatusBadge = (status: string, isActive: boolean) => {
        if (!isActive) return <Badge variant="destructive">Inactiva</Badge>;

        switch (status) {
            case 'paid':
                return (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                        Pagada
                    </Badge>
                );
            case 'pending':
                return <Badge variant="secondary">Pendiente</Badge>;
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

    const isTrialActive = new Date(subscription.trial_ends_at) > new Date();
    const features = parseFeatures(subscription.plan.features);
    return (
        <AppLayout breadcrumbs={[{ title: 'Suscripción', href: '/subscription' }]}>
            <Head title="Suscripción" />
            <div className="p-4">
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold">Suscripción Actual</CardTitle>
                            {getStatusBadge(subscription.payment_status, subscription.is_active)}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
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
                                    <p className="font-medium">Vence: {formatDate(subscription.ends_at)}</p>
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
                            {subscription.payment_status === 'pending_payment_method' && (
                                <Button onClick={onPay}>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Pagar Ahora
                                </Button>
                            )}

                            <Button onClick={onRenew} variant="outline">
                                <Clock className="mr-2 h-4 w-4" />
                                Renovar
                            </Button>

                            <Button onClick={onCancel} variant="soft-destructive">
                                Cancelar Suscripción
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
