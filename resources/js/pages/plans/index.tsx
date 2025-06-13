import { AppHeaderPage } from '@/components/app-header-page';
import { CreatePlan } from '@/components/plans/create-plan';
import { ListPlans } from '@/components/plans/list-plans';
import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { PlanResource } from '../../interfaces/plan';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Planes',
        href: '/plans',
    },
];

export default function PlansIndex({ plans }: { plans: PlanResource[] }) {
    const { hasPermission } = usePermissions();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Planes" />
            <AppHeaderPage
                title="Planes"
                description="Gestiona los planes de tu empresa"
                actions={hasPermission(PERMISSIONS.plans.create) ? <CreatePlan /> : null}
            />
            <ListPlans plans={plans} />
        </AppLayout>
    );
}
