import Calendar from '@/components/calendar/calendar';
import EventCard from '@/components/calendar/event-card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookingResource } from '@/interfaces/booking';
import { ProfessionalResource } from '@/interfaces/professional';
import AppLayout from '@/layouts/app-layout';
import { EventClickArg } from '@fullcalendar/core';
import { Head, router } from '@inertiajs/react';
import { CalendarIcon, MapPin, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BookingsIndexProps {
    professional: ProfessionalResource;
    bookings: BookingResource[];
}

export default function BookingsIndex({ professional, bookings }: BookingsIndexProps) {
    const { t } = useTranslation();
    const [bookingSelected, setBookingSelected] = useState<BookingResource | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    // Función para calcular la hora de finalización
    const calculateEndTime = (date: string, startTime: string, durationMinutes: number): string => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const startDate = new Date(date);
        startDate.setHours(hours, minutes);

        const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

        const endTime = endDate.toTimeString().substring(0, 8);
        return `${date}T${endTime}`;
    };

    // Transformar los bookings a eventos para FullCalendar
    const events = bookings.map((booking) => ({
        id: booking.id,
        title: booking.service.name,
        start: `${booking.date}T${booking.time}`,
        end: calculateEndTime(booking.date, booking.time, booking.service.duration),
        className: `fc-event-${booking.status}`,
        extendedProps: {
            client: booking.client,
            professional: booking.professional,
            service: booking.service,
            price: booking.price,
            status: booking.status,
            notes: booking.notes,
            payment_status: booking.payment_status,
        },
    }));

    const handleEventClick = (clickInfo: EventClickArg) => {
        const event = clickInfo.event;
        const booking = bookings.find((booking) => booking.id === event.id);
        if (!booking) return;
        setBookingSelected(booking);
        setOpenDialog(true);
    };

    const handleDateClick = (arg: any) => {
        console.log('Fecha clickeada:', arg.date);
        // Aquí puedes implementar la creación de nuevas reservas
    };

    const handleGoToBooking = () => {
        router.visit(route('bookings.show', { booking: bookingSelected?.id }), {
            preserveState: true,
            preserveScroll: true,
            only: ['booking'],
        });
    };

    const handleReschedule = () => {
        console.log('Reagendar');
    };

    const handleCancel = () => {
        setOpenDialog(false);
    };

    return (
        <AppLayout breadcrumbs={[{ title: t('bookings.index.title'), href: '/bookings' }]}>
            <Head title={t('bookings.index.title')} />
            <Calendar events={events} onEventClick={handleEventClick} onDateClick={handleDateClick} />
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalles de la reserva</DialogTitle>
                    </DialogHeader>
                    {bookingSelected && <EventCard booking={bookingSelected} />}
                    <DialogFooter>
                        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                            <Button onClick={handleCancel} variant="outline">
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancelar
                            </Button>
                            <Button onClick={handleReschedule} variant="outline">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                Reagendar
                            </Button>

                            <Button onClick={handleGoToBooking}>
                                <MapPin className="mr-2 h-4 w-4" />
                                Ir a reserva
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
