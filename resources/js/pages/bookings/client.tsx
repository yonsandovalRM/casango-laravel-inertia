import { AppHeaderPage } from '@/components/app-header-page';
import BookingTimeline from '@/components/bookings/booking-timeline';
import { Button } from '@/components/ui/button';
import { BookingResource } from '@/interfaces/booking';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
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

    return (
        <AppLayout breadcrumbs={[{ title: t('bookings.client.title'), href: '/bookings/client' }]}>
            <Head title={t('bookings.client.title')} />
            <AppHeaderPage
                title={t('bookings.client.title')}
                description={t('bookings.client.description')}
                actions={
                    <>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button variant="outline" onClick={handleSyncGoogle}>
                                <Calendar className="h-4 w-4" />
                                Sincronizar con Google
                            </Button>
                            <Button variant="outline" onClick={handleSyncOutlook}>
                                <Calendar className="h-4 w-4" />
                                Sincronizar con Outlook
                            </Button>
                        </div>
                    </>
                }
            />
            <BookingTimeline bookings={bookings} onSyncGoogle={handleSyncGoogle} onSyncOutlook={handleSyncOutlook} />
        </AppLayout>
    );
}
