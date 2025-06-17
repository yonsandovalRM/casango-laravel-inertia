import { AppHeaderPage } from '@/components/app-header-page';
import CreatePlan from '@/components/plans/create-plan';
import ListPlans from '@/components/plans/list-plans';
import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { withTranslation } from 'react-i18next';
import { PlanResource } from '../../interfaces/plan';

export default withTranslation()(PlansIndex);
function PlansIndex({ plans, t }: { plans: PlanResource[]; t: any }) {
    const { hasPermission } = usePermissions();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('ui.menu.dashboard'),
            href: '/dashboard',
        },
        {
            title: t('plans.title'),
            href: '/plans',
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
            <div className="p-4">
                <ListPlans plans={plans} />
            </div>
        </AppLayout>
    );
}
