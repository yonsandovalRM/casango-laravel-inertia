import EventCard from '@/components/calendar/event-card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookingEvent } from '@/interfaces/calendar';
import { Calendar } from 'lucide-react';
import React from 'react';
import { BookingActions } from './booking-actions';

interface BookingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: BookingEvent | null;
    onGoToBooking: () => void;
    onConfirmBooking: () => void;
    onCancelBooking: () => void;
    onCompleteBooking: () => void;
    onNoShowBooking: () => void;
    onOpenReschedule: () => void;
}

export const BookingDialog: React.FC<BookingDialogProps> = ({
    open,
    onOpenChange,
    booking,
    onGoToBooking,
    onConfirmBooking,
    onCancelBooking,
    onCompleteBooking,
    onNoShowBooking,
    onOpenReschedule,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Detalles de la Cita
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Servicio: <span className="ml-3 font-bold text-foreground">{booking?.serviceName}</span>
                </DialogDescription>

                {booking && <EventCard booking={booking.bookingData} />}

                <DialogFooter>
                    <BookingActions
                        booking={booking}
                        onGoToBooking={onGoToBooking}
                        onConfirmBooking={onConfirmBooking}
                        onCancelBooking={onCancelBooking}
                        onCompleteBooking={onCompleteBooking}
                        onNoShowBooking={onNoShowBooking}
                        onOpenReschedule={onOpenReschedule}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
