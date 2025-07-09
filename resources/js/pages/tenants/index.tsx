import { AppHeaderPage } from '@/components/app-header-page';
import { TenantCard } from '@/components/tenants/tenant-card';
import { TenantFilters } from '@/components/tenants/tenant-filters';
import { Button } from '@/components/ui/button';
import { DialogConfirm } from '@/components/ui/dialog-confirm';
import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
import { TenantResource } from '@/interfaces/tenant';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Negocios',
        href: route('tenants.index'),
    },
];

export default function TenantsIndex({ tenants }: { tenants: TenantResource[] }) {
    const [open, setOpen] = useState(false);
    const { hasPermission } = usePermissions();

    const handleConfirmDelete = (tenantId: string) => {
        setOpen(false);
        router.delete(route('tenants.destroy', { tenant: tenantId }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Negocios" />
            <AppHeaderPage
                title="Negocios"
                description="Gestiona los negocios de tu empresa"
                actions={
                    <Button asChild>
                        <Link href={route('tenants.create')}>
                            <Plus className="size-4" />
                            Nuevo Negocio
                        </Link>
                    </Button>
                }
            />
            <div className="p-6">
                <TenantFilters />

                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tenants.map((tenant) => (
                        <TenantCard
                            key={tenant.id}
                            tenant={tenant}
                            actions={
                                <>
                                    {hasPermission(PERMISSIONS.tenants.edit) && (
                                        <Button variant="outline" className="flex items-center gap-2">
                                            <Pencil className="size-4" />
                                            Editar
                                        </Button>
                                    )}

                                    {hasPermission(PERMISSIONS.tenants.delete) && (
                                        <DialogConfirm
                                            variant="destructive"
                                            title="Eliminar negocio"
                                            description="¿Estás seguro de querer eliminar este negocio? Esta acción no se puede deshacer."
                                            onConfirm={() => handleConfirmDelete(tenant.id)}
                                            onCancel={() => setOpen(false)}
                                        >
                                            <Button variant="soft-destructive" onClick={() => setOpen(true)}>
                                                <Trash className="size-4" />
                                                Eliminar
                                            </Button>
                                        </DialogConfirm>
                                    )}
                                </>
                            }
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
