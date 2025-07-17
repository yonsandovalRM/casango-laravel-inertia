import { AppHeaderPage } from '@/components/app-header-page';
import { CategoryStats } from '@/components/tenants/category-stats';
import { PlanStats } from '@/components/tenants/plan-stats';
import { TenantCard } from '@/components/tenants/tenant-card';
import { TenantFilters } from '@/components/tenants/tenant-filters';
import { TenantStatsGrid } from '@/components/tenants/tenant-stats-grid';
import { Button } from '@/components/ui/button';
import { DialogConfirm } from '@/components/ui/dialog-confirm';
import { Separator } from '@/components/ui/separator';
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

interface TenantStats {
    total_tenants: number;
    active_tenants: number;
    trial_tenants: number;
    suspended_tenants: number;
    monthly_revenue: number;
    annual_revenue: number;
    grace_period_tenants: number;
    new_tenants_this_month: number;
}

interface PlanStat {
    name: string;
    count: number;
    revenue: number;
}

interface CategoryStat {
    name: string;
    count: number;
}

interface TenantsIndexProps {
    tenants: TenantResource[];
    stats: TenantStats;
    plan_stats: PlanStat[];
    category_stats: CategoryStat[];
}

export default function TenantsIndex({ tenants, stats, plan_stats, category_stats }: TenantsIndexProps) {
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

            <div className="space-y-6 p-6">
                {/* Estadísticas principales */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Resumen General</h2>
                    <TenantStatsGrid stats={stats} />
                </div>

                <Separator />

                {/* Estadísticas por plan y categoría */}
                <div className="grid gap-6 md:grid-cols-2">
                    <PlanStats planStats={plan_stats} totalTenants={stats.total_tenants} />
                    <CategoryStats categoryStats={category_stats} totalTenants={stats.total_tenants} />
                </div>

                <Separator />

                {/* Lista de negocios */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Negocios</h2>
                    <TenantFilters />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            </div>
        </AppLayout>
    );
}
