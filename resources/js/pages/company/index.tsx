import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { withTranslation } from 'react-i18next';

export default withTranslation()(CompanyIndex);
function CompanyIndex({ t }: { t: any }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('company.title'),
            href: route('company.index'),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('company.title')} />
            <div className="container mx-auto">
                <h1>{t('company.title')}</h1>
            </div>
        </AppLayout>
    );
}
