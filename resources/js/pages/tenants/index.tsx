import { Button } from '@/components/ui/button';
import { TenantResource } from '@/interfaces/tenant';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

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

            <div className="px-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Negocios</h1>
                    <Button asChild>
                        <Link href={route('tenants.create')}>
                            <Plus className="size-4" />
                            Nuevo Negocio
                        </Link>
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
