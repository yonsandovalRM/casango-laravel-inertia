import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function ProfessionalBookings() {
    const { t } = useTranslation();
    return (
        <AppLayout breadcrumbs={[{ title: t('bookings.professional.title'), href: '/bookings/professional' }]}>
            <Head title={t('bookings.professional.title')} />
        </AppLayout>
    );
}
