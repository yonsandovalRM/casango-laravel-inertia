import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlanResource } from '@/interfaces/plan';
import { SubscriptionResource, SubscriptionStatusData } from '@/interfaces/subscription';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { Head, router, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowDown, ArrowUp, Calendar, CheckCircle, Clock, CreditCard, Loader2, Play, RefreshCw, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface SubscriptionProps {
    subscription: SubscriptionResource | null;
    plans: PlanResource[];
    paymentUrl?: string;
    subscriptionStatus?: SubscriptionStatusData;
}

export default function Subscription({ subscription, plans, paymentUrl, subscriptionStatus }: SubscriptionProps) {
    const [statusData, setStatusData] = useState<SubscriptionStatusData | null>(subscriptionStatus || null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<'create' | 'update' | 'upgrade' | 'downgrade' | null>(null);

    // Form para crear/actualizar suscripción
    const { data, setData, post, processing, errors, reset } = useForm({
        plan_id: subscription?.plan_id || '',
        is_monthly: subscription?.is_monthly ?? true,
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.plan_id) {
            toast.error('Por favor selecciona un plan');
            return;
        }

        let routeName = '';
        let successMessage = '';

        switch (actionType) {
            case 'create':
                routeName = 'tenant.subscription.create';
                successMessage = 'Suscripción creada exitosamente';
                break;
            case 'update':
                routeName = 'tenant.subscription.update';
                successMessage = 'Suscripción actualizada exitosamente';
                break;
            case 'upgrade':
                routeName = 'tenant.subscription.upgrade';
                successMessage = 'Upgrade realizado exitosamente';
                break;
            case 'downgrade':
                routeName = 'tenant.subscription.downgrade';
                successMessage = 'Downgrade realizado exitosamente';
                break;
            default:
                return;
        }

        post(route(routeName), {
            onSuccess: () => {
                toast.success(successMessage);
                setIsDialogOpen(false);
                reset();
            },
            onError: (errors) => {
                const errorMessage = Object.values(errors)[0] as string;
                toast.error(errorMessage || 'Error al procesar la solicitud');
            },
        });
    };

    const handleAction = (action: string) => {
        const actions: Record<string, () => void> = {
            'setup-payment': () => {
                router.post(
                    route('tenant.subscription.setup-payment'),
                    {},
                    {
                        onSuccess: () => toast.success('Redirigiendo a configurar pago...'),
                        onError: (errors) => {
                            const errorMessage = Object.values(errors)[0] as string;
                            toast.error(errorMessage || 'Error al configurar el pago');
                        },
                    },
                );
            },
            renew: () => {
                router.post(
                    route('tenant.subscription.renew'),
                    {},
                    {
                        onSuccess: () => toast.success('Suscripción renovada exitosamente'),
                        onError: (errors) => {
                            const errorMessage = Object.values(errors)[0] as string;
                            toast.error(errorMessage || 'Error al renovar la suscripción');
                        },
                    },
                );
            },
            reactivate: () => {
                router.post(
                    route('tenant.subscription.reactivate'),
                    {},
                    {
                        onSuccess: () => toast.success('Suscripción reactivada exitosamente'),
                        onError: (errors) => {
                            const errorMessage = Object.values(errors)[0] as string;
                            toast.error(errorMessage || 'Error al reactivar la suscripción');
                        },
                    },
                );
            },
            cancel: () => {
                if (confirm('¿Estás seguro de que quieres cancelar tu suscripción?')) {
                    router.post(
                        route('tenant.subscription.cancel'),
                        {},
                        {
                            onSuccess: () => toast.success('Suscripción cancelada exitosamente'),
                            onError: (errors) => {
                                const errorMessage = Object.values(errors)[0] as string;
                                toast.error(errorMessage || 'Error al cancelar la suscripción');
                            },
                        },
                    );
                }
            },
        };

        actions[action]?.();
    };

    const handleRefreshStatus = () => {
        router.get(
            route('tenant.subscription.status'),
            {},
            {
                only: ['subscriptionStatus'],
                onSuccess: (page) => {
                    setStatusData(page.props.subscriptionStatus as SubscriptionStatusData);
                    toast.success('Estado actualizado');
                },
                onError: () => toast.error('Error al obtener el estado'),
            },
        );
    };

    const openDialog = (type: 'create' | 'update' | 'upgrade' | 'downgrade') => {
        setActionType(type);
        setIsDialogOpen(true);
    };

    const getStatusBadge = (status: string, isActive: boolean) => {
        if (!isActive) return <Badge variant="destructive">Inactiva</Badge>;

        const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string; className: string }> = {
            paid: { variant: 'default', label: 'Activa', className: 'bg-green-500 hover:bg-green-600' },
            active: { variant: 'default', label: 'Activa', className: 'bg-green-500 hover:bg-green-600' },
            pending: { variant: 'secondary', label: 'Pendiente', className: '' },
            pending_payment_method: { variant: 'destructive', label: 'Requiere configuración', className: '' },
            overdue: { variant: 'destructive', label: 'Vencida', className: '' },
            cancelled: { variant: 'outline', label: 'Cancelada', className: '' },
        };

        const config = statusConfig[status] || { variant: 'secondary' as const, label: status, className: '' };

        return (
            <Badge variant={config.variant} className={config.className}>
                {config.label}
            </Badge>
        );
    };

    const parseFeatures = (features: string[] | string) => {
        if (Array.isArray(features)) return features;
        try {
            return JSON.parse(features);
        } catch {
            return [];
        }
    };

    const getSelectedPlan = () => {
        return plans.find((plan) => plan.id === data.plan_id);
    };

    const getSelectedPlanPrice = () => {
        const plan = getSelectedPlan();
        if (!plan) return 0;
        return data.is_monthly ? plan.price_monthly : plan.price_annual;
    };

    const currentStatus = statusData || {
        status: subscription?.payment_status || 'pending',
        status_label: subscription?.payment_status || 'Pendiente',
        status_color: 'secondary',
        is_active: subscription?.is_active || false,
        is_in_trial: false,
        is_trial_expired: false,
        is_expired: false,
        needs_payment_setup: false,
        trial_days_remaining: 0,
        trial_ends_at: '',
        ends_at: '',
        next_billing_date: '',
        current_price: 0,
        plan_name: '',
        is_monthly: true,
        can_cancel: false,
        can_upgrade: false,
        can_downgrade: false,
        can_reactivate: false,
    };

    // Si no hay suscripción, mostrar creación
    if (!subscription) {
        return (
            <AppLayout breadcrumbs={[{ title: 'Suscripción', href: '/subscription' }]}>
                <Head title="Suscripción" />
                <div className="p-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Crear Suscripción</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => openDialog('create')}>
                                <Play className="mr-2 h-4 w-4" />
                                Crear Suscripción
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Dialog para crear suscripción */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Crear Suscripción</DialogTitle>
                            <DialogDescription>Selecciona un plan y el tipo de facturación para crear tu suscripción.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="plan">Seleccionar Plan</Label>
                                <Select value={data.plan_id} onValueChange={(value) => setData('plan_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {plans.map((plan) => (
                                            <SelectItem key={plan.id} value={plan.id}>
                                                {plan.name} - {formatCurrency(plan.price_monthly, plan.currency)}/mes
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.plan_id && <p className="text-sm text-red-500">{errors.plan_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Tipo de Facturación</Label>
                                <RadioGroup
                                    value={data.is_monthly ? 'monthly' : 'annual'}
                                    onValueChange={(value) => setData('is_monthly', value === 'monthly')}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="monthly" id="monthly" />
                                        <Label htmlFor="monthly">Mensual</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="annual" id="annual" />
                                        <Label htmlFor="annual">Anual</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {data.plan_id && (
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="font-medium">
                                        Precio: {formatCurrency(getSelectedPlanPrice(), getSelectedPlan()?.currency || 'CLP')}
                                        {data.is_monthly ? '/mes' : '/año'}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Crear Suscripción
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </AppLayout>
        );
    }

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
                                <Button variant="outline" size="sm" onClick={handleRefreshStatus}>
                                    <RefreshCw className="h-4 w-4" />
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

                        {subscription.payment_status === 'cancelled' && (
                            <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-4 text-gray-800">
                                <X className="h-5 w-5" />
                                <span>Tu suscripción está cancelada. Puedes reactivarla en cualquier momento.</span>
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
                                    {isTrialActive && subscription.trial_ends_at && (
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
                            {/* Configurar Pago */}
                            {(currentStatus.needs_payment_setup || subscription.payment_status === 'pending_payment_method') && (
                                <Button onClick={() => handleAction('setup-payment')}>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Configurar Pago
                                </Button>
                            )}

                            {/* Renovar */}
                            {(currentStatus.is_expired || !currentStatus.is_active) && subscription.payment_status !== 'cancelled' && (
                                <Button onClick={() => handleAction('renew')}>
                                    <Clock className="mr-2 h-4 w-4" />
                                    Renovar
                                </Button>
                            )}

                            {/* Reactivar */}
                            {currentStatus.can_reactivate && (
                                <Button onClick={() => handleAction('reactivate')}>
                                    <Play className="mr-2 h-4 w-4" />
                                    Reactivar
                                </Button>
                            )}

                            {/* Actualizar Plan */}
                            {currentStatus.is_active && (
                                <Button variant="outline" onClick={() => openDialog('update')}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Cambiar Plan
                                </Button>
                            )}

                            {/* Upgrade */}
                            {currentStatus.can_upgrade && (
                                <Button variant="outline" onClick={() => openDialog('upgrade')}>
                                    <ArrowUp className="mr-2 h-4 w-4" />
                                    Upgrade
                                </Button>
                            )}

                            {/* Downgrade */}
                            {currentStatus.can_downgrade && (
                                <Button variant="outline" onClick={() => openDialog('downgrade')}>
                                    <ArrowDown className="mr-2 h-4 w-4" />
                                    Downgrade
                                </Button>
                            )}

                            {/* Cancelar */}
                            {currentStatus.can_cancel && currentStatus.is_active && (
                                <Button onClick={() => handleAction('cancel')} variant="destructive">
                                    <X className="mr-2 h-4 w-4" />
                                    Cancelar Suscripción
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Dialog para actualizar/upgrade/downgrade */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === 'update' && 'Cambiar Plan'}
                            {actionType === 'upgrade' && 'Upgrade de Plan'}
                            {actionType === 'downgrade' && 'Downgrade de Plan'}
                            {actionType === 'create' && 'Crear Suscripción'}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === 'update' && 'Selecciona un nuevo plan para tu suscripción.'}
                            {actionType === 'upgrade' && 'Selecciona un plan superior para obtener más características.'}
                            {actionType === 'downgrade' && 'Selecciona un plan inferior para reducir costos.'}
                            {actionType === 'create' && 'Selecciona un plan para crear tu suscripción.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="plan">Seleccionar Plan</Label>
                            <Select value={data.plan_id} onValueChange={(value) => setData('plan_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {plans.map((plan) => (
                                        <SelectItem key={plan.id} value={plan.id}>
                                            {plan.name} - {formatCurrency(plan.price_monthly, plan.currency)}/mes
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.plan_id && <p className="text-sm text-red-500">{errors.plan_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Tipo de Facturación</Label>
                            <RadioGroup
                                value={data.is_monthly ? 'monthly' : 'annual'}
                                onValueChange={(value) => setData('is_monthly', value === 'monthly')}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="monthly" id="monthly" />
                                    <Label htmlFor="monthly">Mensual</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="annual" id="annual" />
                                    <Label htmlFor="annual">Anual</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {data.plan_id && (
                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="font-medium">
                                    Precio: {formatCurrency(getSelectedPlanPrice(), getSelectedPlan()?.currency || 'CLP')}
                                    {data.is_monthly ? '/mes' : '/año'}
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {actionType === 'update' && 'Actualizar Plan'}
                                {actionType === 'upgrade' && 'Realizar Upgrade'}
                                {actionType === 'downgrade' && 'Realizar Downgrade'}
                                {actionType === 'create' && 'Crear Suscripción'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
