import BookingTimeline from '@/components/bookings/booking-timeline';
import { BookingResource } from '@/interfaces/booking';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export default function ClientBookings({ bookings }: { bookings: BookingResource[] }) {
    const { t } = useTranslation();

    const handleSyncGoogle = () => {
        toast.info('Sincronización con Google Calendar', {
            description: 'Redirigiendo a Google Calendar para sincronizar todas tus reservas...',
        });

        console.log('Sincronizando con Google Calendar...');
    };

    const handleSyncOutlook = () => {
        toast.info('Sincronización con Outlook', {
            description: 'Redirigiendo a Outlook para sincronizar todas tus reservas...',
        });

        console.log('Sincronizando con Outlook...');
    };

    const handleConfirmBooking = (bookingId: string) => {
        console.log(bookingId);
        toast.success('Reserva Confirmada', {
            description: 'La reserva ha sido confirmada exitosamente.',
        });
    };

    const handleCancelBooking = (bookingId: string) => {
        console.log(bookingId);

        toast.error('Reserva Cancelada', {
            description: 'La reserva ha sido cancelada.',
        });
    };
    return (
        <AppLayout breadcrumbs={[{ title: t('bookings.client.title'), href: '/bookings/client' }]}>
            <Head title={t('bookings.client.title')} />
            <BookingTimeline
                bookings={bookings}
                onSyncGoogle={handleSyncGoogle}
                onSyncOutlook={handleSyncOutlook}
                onConfirmBooking={handleConfirmBooking}
                onCancelBooking={handleCancelBooking}
            />
        </AppLayout>
    );
}
