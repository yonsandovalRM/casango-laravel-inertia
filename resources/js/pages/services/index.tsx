import AppLayout from '@/layouts/app-layout';
import { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';

export default withTranslation()(ServicesIndex);

function ServicesIndex({ t }: { t: TFunction }) {
    return (
        <AppLayout breadcrumbs={[{ title: t('services.title'), href: '/services' }]}>
            <div>
                <h1>{t('services.title')}</h1>
            </div>
        </AppLayout>
    );
}
