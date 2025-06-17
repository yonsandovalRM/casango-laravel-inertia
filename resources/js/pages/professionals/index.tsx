import { AppHeaderPage } from '@/components/app-header-page';
import { ProfessionalResource } from '@/interfaces/professional';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from 'react-i18next';

export default function ProfessionalsIndex({ professionals }: { professionals: ProfessionalResource[] }) {
    const { t } = useTranslation();

    return (
        <AppLayout breadcrumbs={[{ title: t('professionals.title'), href: '/professionals' }]}>
            <AppHeaderPage title={t('professionals.title')} description={t('professionals.description')} />
        </AppLayout>
    );
}
