import { AppHeaderPage } from '@/components/app-header-page';
import { AssignServices } from '@/components/professionals/assign-services';
import { ProfessionalResource } from '@/interfaces/professional';
import { ServiceResource } from '@/interfaces/service';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface ProfessionalsAssignServicesProps {
    professional: ProfessionalResource;
    services: ServiceResource[];
}

export default function ProfessionalsAssignServices({ professional, services }: ProfessionalsAssignServicesProps) {
    const { t } = useTranslation();

    return (
        <AppLayout breadcrumbs={[{ title: t('professionals.title'), href: '/professionals' }]}>
            <Head title={t('professionals.title')} />

            <AppHeaderPage title={`${professional.title} ${professional.user.name}`} description={t('professionals.assign_services.description')} />

            <AssignServices services={services} t={t} professional={professional} />
        </AppLayout>
    );
}
