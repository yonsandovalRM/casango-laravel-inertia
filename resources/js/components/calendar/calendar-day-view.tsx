import { BookingEvent } from '@/interfaces/calendar';
import { Plus } from 'lucide-react';
import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { CalendarEventCard } from './calendar-event-card';

interface CalendarDayViewProps {
    currentDate: Date;
    workingHours: number[];
    getBookingsForDay: (date: Date) => BookingEvent[];
    formatTime: (date: Date) => string;
    getEventPosition: (booking: BookingEvent) => { top: number; height: number };
    onEventClick?: (booking: BookingEvent) => void;
    onCreateBooking?: (date: Date, hour: number) => void;
}

export const CalendarDayView: React.FC<CalendarDayViewProps> = ({
    currentDate,
    workingHours,
    getBookingsForDay,
    formatTime,
    getEventPosition,
    onEventClick,
    onCreateBooking,
}) => {
    const dayBookings = getBookingsForDay(currentDate);

    return (
        <div className="flex h-full flex-col">
            {/* Encabezado del día */}
            <div className="sticky top-0 z-20 border-b border-border bg-gray-50 p-4 dark:bg-card">
                <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">{currentDate.toLocaleDateString('es-ES', { weekday: 'long' })}</div>
                    <div className="text-2xl font-bold text-foreground">{currentDate.getDate()}</div>
                    <div className="text-sm text-muted-foreground">{currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</div>
                    {dayBookings.length > 0 && (
                        <div className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                            {dayBookings.length} cita{dayBookings.length !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            </div>

            {/* Contenido del día */}
            <ScrollArea className="flex-1 overflow-y-auto">
                <div className="relative">
                    {/* Horas */}
                    {workingHours.map((hour) => (
                        <div key={hour} className="flex border-b border-border bg-gray-50 dark:bg-card">
                            {/* Columna de hora */}
                            <div className="w-20 flex-shrink-0 border-r border-border bg-gray-50 p-3 text-center dark:bg-card">
                                <span className="text-sm font-medium text-foreground">{hour.toString().padStart(2, '0')}:00</span>
                            </div>

                            {/* Área de contenido */}
                            <div className="relative z-10 flex-1">
                                <div
                                    className="group h-20 cursor-pointer transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    onClick={() => onCreateBooking?.(currentDate, hour)}
                                >
                                    {/* Línea de media hora */}
                                    <div className="absolute top-1/2 left-0 h-px w-full bg-gray-200 dark:bg-gray-800"></div>

                                    {/* Botón para agregar cita */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                        <Plus
                                            size={20}
                                            className="-ml-18 rounded-full bg-white p-1 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Eventos del día */}
                    <div className="absolute top-0 right-0 bottom-0 left-20">
                        {dayBookings.map((booking) => (
                            <CalendarEventCard
                                key={booking.id}
                                booking={booking}
                                position={getEventPosition(booking)}
                                formatTime={formatTime}
                                onClick={() => onEventClick?.(booking)}
                                className="mx-2"
                            />
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};
