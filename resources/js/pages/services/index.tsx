import { ManageService } from '@/components/services/manage-service';
import { ServiceProvider } from '@/components/services/service-context';
import { CategoryResource } from '@/interfaces/category';
import { CompanyResource } from '@/interfaces/company';
import { ServiceResource, ServiceStatistics } from '@/interfaces/service';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';

export default withTranslation()(ServicesIndex);

interface ServicesIndexProps {
    t: TFunction;
    services: ServiceResource[];
    categories: CategoryResource[];
    statistics: ServiceStatistics;
    company: CompanyResource;
}

function ServicesIndex({ t, services, categories, statistics, company }: ServicesIndexProps) {
    return (
        <AppLayout breadcrumbs={[{ title: t('services.title'), href: '/services' }]}>
            <Head title={t('services.title')} />
            <ServiceProvider>
                <ManageService
                    services={services}
                    categories={categories}
                    statistics={statistics}
                    companyAllowsVideoCalls={company.allows_video_calls}
                    t={t}
                />
            </ServiceProvider>
        </AppLayout>
    );
}
