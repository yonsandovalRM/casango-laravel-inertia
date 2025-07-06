import { AppHeaderPage } from '@/components/app-header-page';
import { BookingResource } from '@/interfaces/booking';
import { ClientHistory, Template } from '@/interfaces/template';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface BookingShowProps {
    booking: BookingResource;
    template: Template;
    clientHistory: ClientHistory[];
}

export default function BookingShow({ booking, template, clientHistory }: BookingShowProps) {
    console.log(booking, template, clientHistory);
    const { t } = useTranslation();
    return (
        <AppLayout breadcrumbs={[{ title: t('bookings.index.title'), href: '/bookings' }]}>
            <Head title={t('bookings.index.title')} />
            <AppHeaderPage title={t('bookings.show.title')} description={t('bookings.show.description')} />
            <div className="p-4"></div>
        </AppLayout>
    );
}
