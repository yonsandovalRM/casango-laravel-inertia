// resources/js/pages/bookings/index.tsx (Refactorizada)
import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Layouts y componentes de UI
import { RescheduleModal } from '@/components/bookings/reschedule-modal';
import AppLayout from '@/layouts/app-layout';

// Componentes del calendario
import { BookingDialog } from '@/components/bookings/booking-dialog';
import { ProfessionalCalendar } from '@/components/calendar/professional-calendar';

// Tipos e interfaces
import { BookingResource } from '@/interfaces/booking';
import { BookingEvent } from '@/interfaces/calendar';
import { ProfessionalResource } from '@/interfaces/professional';

// Utilidades
import { transformBookingsToEvents } from '@/lib/booking-utils';

interface BookingsIndexProps {
    professional: ProfessionalResource;
    bookings: BookingResource[];
}

export default function BookingsIndex({ professional, bookings }: BookingsIndexProps) {
    const { t } = useTranslation();

    // Estados para modales y dialogs
    const [selectedBooking, setSelectedBooking] = useState<BookingEvent | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openRescheduleModal, setOpenRescheduleModal] = useState(false);

    // Transformar bookings a eventos del calendario
    const calendarEvents: BookingEvent[] = useMemo(() => {
        return transformBookingsToEvents(bookings);
    }, [bookings]);

    // Handlers del calendario
    const handleEventClick = (event: BookingEvent) => {
        setSelectedBooking(event);
        setOpenDialog(true);
    };

    const handleCreateBooking = (date: Date, hour: number) => {
        console.log('Crear nueva cita:', date, hour);
        // Implementar navegación a creación de citas
        // router.visit('/create-booking', {
        //   data: { date: date.toISOString().split('T')[0], time: `${hour}:00` }
        // });
    };

    // Handlers de acciones de booking
    const handleGoToBooking = () => {
        if (selectedBooking) {
            router.visit(route('bookings.show', { booking: selectedBooking.id }), {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleConfirmBooking = () => {
        if (selectedBooking) {
            router.post(
                route('bookings.confirm', { booking: selectedBooking.id }),
                {},
                {
                    preserveState: true,
                    onSuccess: () => setOpenDialog(false),
                    onError: (errors) => console.error('Error al confirmar:', errors),
                },
            );
        }
    };

    const handleCancelBooking = () => {
        if (selectedBooking) {
            router.post(
                route('bookings.cancel', { booking: selectedBooking.id }),
                {},
                {
                    preserveState: true,
                    onSuccess: () => setOpenDialog(false),
                    onError: (errors) => console.error('Error al cancelar:', errors),
                },
            );
        }
    };

    const handleCompleteBooking = () => {
        if (selectedBooking) {
            router.post(
                route('bookings.complete', { booking: selectedBooking.id }),
                {},
                {
                    preserveState: true,
                    onSuccess: () => setOpenDialog(false),
                    onError: (errors) => console.error('Error al completar:', errors),
                },
            );
        }
    };

    const handleNoShowBooking = () => {
        if (selectedBooking) {
            router.post(
                route('bookings.no-show', { booking: selectedBooking.id }),
                {},
                {
                    preserveState: true,
                    onSuccess: () => setOpenDialog(false),
                    onError: (errors) => console.error('Error al marcar no show:', errors),
                },
            );
        }
    };

    const handleOpenReschedule = () => {
        setOpenDialog(false);
        setOpenRescheduleModal(true);
    };

    const handleRescheduleSuccess = () => {
        setOpenRescheduleModal(false);
        router.reload();
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: route('dashboard') },
                { title: t('bookings.index.title'), href: route('bookings.index') },
            ]}
        >
            <Head title={t('bookings.index.title')} />

            <div className="p-6">
                <div className="h-[calc(100vh-4rem)] overflow-hidden rounded-lg border">
                    <ProfessionalCalendar
                        bookings={calendarEvents}
                        onEventClick={handleEventClick}
                        onCreateBooking={handleCreateBooking}
                        workingHours={{ start: 8, end: 20 }}
                    />
                </div>
            </div>

            {/* Dialog para mostrar detalles del evento */}
            <BookingDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
                booking={selectedBooking}
                onGoToBooking={handleGoToBooking}
                onConfirmBooking={handleConfirmBooking}
                onCancelBooking={handleCancelBooking}
                onCompleteBooking={handleCompleteBooking}
                onNoShowBooking={handleNoShowBooking}
                onOpenReschedule={handleOpenReschedule}
            />

            {/* Modal de reagendamiento */}
            <RescheduleModal
                open={openRescheduleModal}
                onOpenChange={setOpenRescheduleModal}
                booking={selectedBooking?.bookingData || null}
                onSuccess={handleRescheduleSuccess}
            />
        </AppLayout>
    );
}
