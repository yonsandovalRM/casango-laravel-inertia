// components/calendar/calendar-event-card.tsx
import { BookingEvent, EventPosition, statusColors } from '@/interfaces/calendar';
import { Phone, User } from 'lucide-react';
import React from 'react';

interface CalendarEventCardProps {
    booking: BookingEvent;
    position: EventPosition;
    formatTime: (date: Date) => string;
    onClick?: () => void;
    className?: string;
}

export const CalendarEventCard: React.FC<CalendarEventCardProps> = ({ booking, position, formatTime, onClick, className = '' }) => {
    const colors = statusColors[booking.status];

    return (
        <div
            className={`absolute right-1 left-1 z-10 cursor-pointer overflow-hidden rounded-lg shadow-sm transition-all hover:scale-105 hover:shadow-md ${className}`}
            style={{
                top: `${position.top}px`,
                height: `${position.height}px`,
                backgroundColor: colors.bg,
                borderLeft: `4px solid ${colors.border}`,
            }}
            onClick={onClick}
        >
            <div className="h-full overflow-hidden p-2">
                <div className="text-sm leading-tight font-semibold text-white">
                    {formatTime(booking.start)} - {formatTime(booking.end)}
                </div>
                <div className="mt-1 truncate text-xs font-medium text-white">{booking.serviceName}</div>
                <div className="truncate text-xs text-white opacity-90">
                    <User size={10} className="mr-1 inline" />
                    {booking.clientName}
                </div>
                {booking.clientPhone && (
                    <div className="mt-1 truncate text-xs text-white opacity-80">
                        <Phone size={10} className="mr-1 inline" />
                        {booking.clientPhone}
                    </div>
                )}

                {/* Indicador de estado */}
                <div className="absolute top-1 right-1">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.border }} />
                </div>
            </div>
        </div>
    );
};
