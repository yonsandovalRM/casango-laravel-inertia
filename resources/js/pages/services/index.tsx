import { ManageService } from '@/components/services/manage-service';
import { ServiceProvider } from '@/components/services/service-context';
import { ServiceResource } from '@/interfaces/service';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';

export default withTranslation()(ServicesIndex);
interface ServicesIndexProps {
    t: TFunction;
    services: ServiceResource[];
}

function ServicesIndex({ t, services }: ServicesIndexProps) {
    return (
        <AppLayout breadcrumbs={[{ title: t('services.title'), href: '/services' }]}>
            <Head title={t('services.title')} />
            <ServiceProvider>
                <ManageService services={services} t={t} />
            </ServiceProvider>
        </AppLayout>
    );
}
