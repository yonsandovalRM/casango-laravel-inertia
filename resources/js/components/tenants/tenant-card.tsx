import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import { TenantResource } from '@/interfaces/tenant';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // o el idioma que necesites
import { CalendarIcon, CreditCardIcon, DollarSignIcon, GlobeIcon, InfoIcon } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export const TenantCard = ({ tenant, actions }: { tenant: TenantResource; actions?: React.ReactNode }) => {
    const plan = tenant.subscription?.plan;

    const subscription = tenant.subscription;
    const { formatDate } = useDateFormatter();
    console.log({ tenant, plan, subscription }); // Para depuración
    // Manejo seguro de fechas
    const endsAt = subscription?.ends_at ? new Date(subscription.ends_at) : null;
    const trialEndsAt = subscription?.trial_ends_at ? new Date(subscription.trial_ends_at) : null;

    // Estado del tenant con más detalles
    const getTenantStatus = () => {
        if (!subscription) return 'Sin suscripción';
        if (subscription.is_active) {
            return trialEndsAt && trialEndsAt > new Date() ? 'En periodo de prueba' : 'Activo';
        }
        return 'Inactivo';
    };

    return (
        <Card className="rounded-2xl border shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <CardTitle className="line-clamp-1 text-lg font-bold" title={tenant.name}>
                            {tenant.name}
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm text-muted-foreground">
                            Creado el {format(new Date(tenant.created_at), 'dd MMM yyyy', { locale: es })}
                        </CardDescription>
                    </div>

                    <Badge variant={subscription?.is_active ? 'default' : 'secondary'} className="flex items-center gap-1">
                        <CreditCardIcon className="h-4 w-4" />
                        {getTenantStatus()}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                            <InfoIcon className="h-4 w-4" />
                            Plan
                        </p>
                        <p className="font-medium">{plan?.name || 'Sin plan'}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                            <InfoIcon className="h-4 w-4" />
                            Categoría
                        </p>
                        <p className="font-medium">{tenant.category?.name || 'Sin categoría'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                            <DollarSignIcon className="h-4 w-4" />
                            Precio
                        </p>
                        <p className="font-medium">
                            {subscription?.price
                                ? `${formatCurrency(subscription.price)} ${subscription.currency} / ${subscription.is_monthly ? 'mes' : 'año'}`
                                : '—'}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" />
                            {trialEndsAt && trialEndsAt > new Date() ? 'Prueba hasta' : 'Finaliza el'}
                        </p>
                        <p className="font-medium"> {trialEndsAt && trialEndsAt > new Date() ? formatDate(trialEndsAt) : 'Finaliza el'}</p>
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <GlobeIcon className="h-4 w-4" />
                        Dominio
                    </p>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <a
                                href={tenant.url}
                                className="line-clamp-1 font-medium underline hover:text-blue-600 dark:hover:text-blue-400"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {tenant.domain || 'Sin dominio'}
                            </a>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Visitar sitio</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </CardContent>

            {actions && <CardFooter className="flex justify-end gap-2 pt-2">{actions}</CardFooter>}
        </Card>
    );
};
