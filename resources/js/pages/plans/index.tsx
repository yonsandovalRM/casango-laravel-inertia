import { AppHeaderPage } from '@/components/app-header-page';
import CreatePlan from '@/components/plans/create-plan';
import ListPlans from '@/components/plans/list-plans';
import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { PlanResource } from '../../interfaces/plan';

export default function PlansIndex({ plans }: { plans: PlanResource[] }) {
    const { hasPermission } = usePermissions();
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('ui.menu.dashboard'),
            href: '/dashboard',
        },
        {
            title: t('plans.title'),
            href: route('plans.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('plans.title')} />
            <AppHeaderPage
                title={t('plans.title')}
                description={t('plans.description')}
                actions={hasPermission(PERMISSIONS.plans.create) ? <CreatePlan /> : null}
            />
            <div className="p-6">
                <ListPlans plans={plans} />
            </div>
        </AppLayout>
    );
}
