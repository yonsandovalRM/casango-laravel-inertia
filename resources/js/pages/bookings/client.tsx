import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function ClientBookings() {
    const { t } = useTranslation();
    return (
        <AppLayout breadcrumbs={[{ title: t('bookings.client.title'), href: '/bookings/client' }]}>
            <Head title={t('bookings.client.title')} />
        </AppLayout>
    );
}
