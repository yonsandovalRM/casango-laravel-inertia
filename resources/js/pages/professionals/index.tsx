import { ManageProfessional } from '@/components/professionals/manage-service';
import { ProfessionalProvider } from '@/components/professionals/professional-context';
import { ProfessionalResource } from '@/interfaces/professional';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function ProfessionalsIndex({ professionals }: { professionals: ProfessionalResource[] }) {
    const { t } = useTranslation();

    return (
        <AppLayout breadcrumbs={[{ title: t('professionals.title'), href: '/professionals' }]}>
            <Head title={t('professionals.title')} />

            <ProfessionalProvider>
                <ManageProfessional professionals={professionals} t={t} />
            </ProfessionalProvider>
        </AppLayout>
    );
}
