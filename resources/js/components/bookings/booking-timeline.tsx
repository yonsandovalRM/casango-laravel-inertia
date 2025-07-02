import { Card, CardContent } from '@/components/ui/card';
import { BookingResource } from '@/interfaces/booking';

import { Calendar } from 'lucide-react';
import React, { useState } from 'react';
import BookingCardTimeline from './booking-card-timeline';
import FiltersBookings from './filters-bookings';

interface BookingTimelineProps {
    bookings: BookingResource[];
    onSyncGoogle?: () => void;
    onSyncOutlook?: () => void;
    onConfirmBooking?: (bookingId: string) => void;
    onCancelBooking?: (bookingId: string) => void;
}

const BookingTimeline: React.FC<BookingTimelineProps> = ({ bookings, onSyncGoogle, onSyncOutlook }) => {
    const [selectedBooking, setSelectedBooking] = useState<string | null>(bookings[0]?.id || null);

    return (
        <div className="mx-auto max-w-6xl space-y-6 p-4">
            <FiltersBookings bookings={bookings} />

            {/* Timeline */}
            {bookings.length > 0 ? (
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200 dark:from-blue-900 dark:via-blue-800 dark:to-blue-900"></div>

                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <BookingCardTimeline
                                key={booking.id}
                                booking={booking}
                                selectedBooking={selectedBooking}
                                setSelectedBooking={setSelectedBooking}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <Card className="py-12 text-center">
                    <CardContent>
                        <div className="text-muted-foreground">
                            <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
                            <h3 className="mb-2 text-lg font-medium">No se encontraron reservas</h3>
                            <p>Prueba ajustando los filtros de búsqueda.</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default BookingTimeline;
