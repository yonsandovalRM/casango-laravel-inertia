import { BookingResource } from '@/interfaces/booking';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface BookingsIndexProps {
    bookings: BookingResource[];
}

export default function BookingsIndex({ bookings }: BookingsIndexProps) {
    const { t } = useTranslation();
    console.log(bookings);
    return (
        <AppLayout breadcrumbs={[{ title: t('bookings.title'), href: '/bookings' }]}>
            <Head title={t('bookings.title')} />
            Hola
        </AppLayout>
    );
}
