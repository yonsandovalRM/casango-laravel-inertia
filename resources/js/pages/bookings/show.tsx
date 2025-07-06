import { BookingClientInfo } from '@/components/bookings/show/booking-client-info';
import { BookingStatusActions } from '@/components/bookings/show/booking-status-actions';
import { ClientHistorySection } from '@/components/bookings/show/client-history-section';
import { NewRecordForm } from '@/components/bookings/show/new-record-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingResource } from '@/interfaces/booking';
import { ClientHistory, Template } from '@/interfaces/template';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BookingShowProps {
    booking: BookingResource;
    template: Template;
    clientHistory: ClientHistory[];
}

export default function BookingShow({ booking, template, clientHistory }: BookingShowProps) {
    console.log(booking, template, clientHistory);
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'history' | 'new-record'>('history');
    const [bookingStatus, setBookingStatus] = useState(booking.status);

    const handleStatusUpdate = (status: string) => {
        setBookingStatus(status);
        // Here you would typically make an API call to update the status
        console.log('Updating booking status to:', status);
    };

    const handleNewRecord = (data: any) => {
        // Here you would typically make an API call to save the new record
        console.log('Saving new record:', data);
        // Switch back to history tab after saving
        setActiveTab('history');
    };

    return (
        <AppLayout breadcrumbs={[{ title: t('bookings.index.title'), href: '/bookings' }]}>
            <Head title={t('bookings.show.title')} />

            <div className="space-y-4 p-4">
                {/* Client Information Card */}
                <BookingClientInfo booking={booking} />

                {/* Status Actions */}
                <BookingStatusActions currentStatus={bookingStatus} onStatusUpdate={handleStatusUpdate} />

                {/* Tabs for History and New Record */}
                <Tabs defaultValue="history">
                    <TabsList>
                        <TabsTrigger value="history">Historial del Cliente</TabsTrigger>
                        <TabsTrigger value="new-record">Nueva Ficha</TabsTrigger>
                    </TabsList>
                    <TabsContent value="history">
                        <ClientHistorySection history={clientHistory} />
                    </TabsContent>
                    <TabsContent value="new-record">
                        <NewRecordForm template={template} bookingId={booking.id} onSubmit={handleNewRecord} />
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
