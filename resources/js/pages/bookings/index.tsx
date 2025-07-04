import { AppHeaderPage } from '@/components/app-header-page';
import { BookingResource } from '@/interfaces/booking';
import { ProfessionalResource } from '@/interfaces/professional';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface BookingsIndexProps {
    professional: ProfessionalResource;
    bookings: BookingResource[];
}

export default function BookingsIndex({ professional, bookings }: BookingsIndexProps) {
    const { t } = useTranslation();
    console.log({ professional, bookings });
    return (
        <AppLayout breadcrumbs={[{ title: t('bookings.index.title'), href: '/bookings' }]}>
            <Head title={t('bookings.index.title')} />
            <AppHeaderPage title={t('bookings.index.title')} description={t('bookings.index.description')} />
        </AppLayout>
    );
}
