import { AppHeaderPage } from '@/components/app-header-page';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function BookingShow() {
    const { t } = useTranslation();
    return (
        <AppLayout breadcrumbs={[{ title: t('bookings.index.title'), href: '/bookings' }]}>
            <Head title={t('bookings.index.title')} />
            <AppHeaderPage title={t('bookings.show.title')} description={t('bookings.show.description')} />
            <div className="p-4"></div>
        </AppLayout>
    );
}
