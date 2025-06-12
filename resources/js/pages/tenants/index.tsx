import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TenantResource } from '@/interfaces/tenant';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ExternalLink, Pencil, Plus, Trash } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Negocios',
        href: '/negocios',
    },
];
export default function TenantsIndex({ tenants }: { tenants: TenantResource[] }) {
    console.log({ tenants });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Negocios" />

            <div className="p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Negocios</h1>
                    <Button asChild>
                        <Link href={route('tenants.create')}>
                            <Plus className="size-4" />
                            Nuevo Negocio
                        </Link>
                    </Button>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tenants.map((tenant) => (
                        <Card key={tenant.id}>
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex items-center justify-between gap-2">
                                        {tenant.name}
                                        <Badge variant="outline">{tenant.plan.name}</Badge>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>Suscripcion por confirmar aun</CardDescription>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">{tenant.domain}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="grid grid-cols-3 gap-2">
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button variant="outline" asChild className="flex items-center gap-2">
                                            <Link href="#">
                                                <Pencil className="size-4" />
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Editar</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button variant="outline" asChild className="flex items-center gap-2">
                                            <Link href="#">
                                                <Trash className="size-4" />
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Eliminar</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button variant="outline" asChild className="flex items-center gap-2">
                                            <a href={tenant.url} target="_blank">
                                                <ExternalLink className="size-4" />
                                            </a>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Ir al sitio</TooltipContent>
                                </Tooltip>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
