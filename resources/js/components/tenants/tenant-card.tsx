import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TenantResource } from '@/interfaces/tenant';
import { CalendarIcon, CreditCardIcon, DollarSignIcon, GlobeIcon } from 'lucide-react';
import { Badge } from '../ui/badge';

export const TenantCard = ({ tenant, actions }: { tenant: TenantResource; actions: React.ReactNode }) => {
    const plan = tenant.subscription?.plan;

    return (
        <Card className="rounded-2xl border shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg font-bold">
                    <span>{tenant.name}</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <CreditCardIcon className="h-4 w-4" />
                        {tenant.subscription?.payment_status}
                    </Badge>
                </CardTitle>
                <CardDescription className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <table>
                        <tbody>
                            <tr>
                                <td width={100}>Plan</td>
                                <td className="font-medium text-foreground">{plan?.name}</td>
                            </tr>
                            <tr>
                                <td>Categoría</td>
                                <td className="font-medium text-foreground">{tenant.category}</td>
                            </tr>
                            <tr>
                                <td>Estado</td>
                                <td className="font-medium text-foreground">{tenant.subscription?.is_active ? 'Activo' : 'Inactivo'}</td>
                            </tr>
                        </tbody>
                    </table>
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
                <div className="flex justify-between gap-6 text-sm">
                    <div>
                        <p className="flex items-center gap-1 text-muted-foreground">
                            <DollarSignIcon className="h-4 w-4" />
                            Precio
                        </p>
                        <p className="font-medium text-foreground">
                            {tenant.subscription?.price} {tenant.subscription?.currency} / {tenant.subscription?.is_monthly ? 'mes' : 'año'}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="flex items-center gap-1 text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" />
                            Finaliza el
                        </p>
                        <p className="font-medium text-foreground">
                            {tenant.subscription?.ends_at ? new Date(tenant.subscription.ends_at).toLocaleDateString() : '—'}
                        </p>
                    </div>
                </div>
                <div className="flex justify-between gap-6 text-sm">
                    <div>
                        <p className="flex items-center gap-1 text-muted-foreground">
                            <GlobeIcon className="h-4 w-4" />
                            Dominio
                        </p>
                        <p className="font-medium text-foreground">
                            <a
                                href={tenant.url}
                                className="underline hover:text-blue-600 dark:hover:text-blue-400"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {tenant.domain}
                            </a>
                        </p>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 pt-2">{actions}</CardFooter>
        </Card>
    );
};
