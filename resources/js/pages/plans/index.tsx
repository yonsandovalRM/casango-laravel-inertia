import { ListPlans } from '@/components/plans/list-plans';
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
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Planes" />

            <div className="px-4">
                <ListPlans plans={plans} />
            </div>
        </AppLayout>
    );
}
