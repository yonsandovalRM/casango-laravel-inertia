import { BookingEvent } from '@/interfaces/calendar';
import { Clock, Plus } from 'lucide-react';
import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { CalendarEventCard } from './calendar-event-card';

interface CalendarWeekViewProps {
    currentDate: Date;
    workingHours: number[];
    getWeekDays: (date: Date) => Date[];
    getBookingsForDay: (date: Date) => BookingEvent[];
    formatTime: (date: Date) => string;
    getEventPosition: (booking: BookingEvent) => { top: number; height: number };
    onEventClick?: (booking: BookingEvent) => void;
    onCreateBooking?: (date: Date, hour: number) => void;
}

export const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({
    currentDate,
    workingHours,
    getWeekDays,
    getBookingsForDay,
    formatTime,
    getEventPosition,
    onEventClick,
    onCreateBooking,
}) => {
    const weekDays = getWeekDays(currentDate);

    return (
        <div className="flex h-full flex-col">
            {/* Encabezado de días */}
            <div className="sticky top-0 z-20 grid grid-cols-8 border-b border-border bg-gray-50 dark:bg-card">
                <div className="border-r border-border p-4 text-sm font-medium text-muted-foreground">
                    <Clock size={16} className="mx-auto" />
                </div>

                {weekDays.map((day, index) => {
                    const isToday = day.toDateString() === new Date().toDateString();
                    const dayBookings = getBookingsForDay(day);

                    return (
                        <div key={index} className="relative border-r border-border p-3 text-center">
                            <div className="text-sm font-medium text-foreground">{day.toLocaleDateString('es-ES', { weekday: 'short' })}</div>
                            <div
                                className={`text-xl font-bold ${
                                    isToday
                                        ? 'mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground'
                                        : 'text-foreground'
                                }`}
                            >
                                {day.getDate()}
                            </div>
                            {dayBookings.length > 0 && (
                                <div className="mt-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                                    {dayBookings.length} cita{dayBookings.length !== 1 ? 's' : ''}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Contenido de la semana */}

            <ScrollArea className="flex-1 overflow-y-auto">
                <div className="grid min-h-full grid-cols-8">
                    {/* Columna de horas */}
                    <div className="border-r border-border bg-gray-50 dark:bg-card">
                        {workingHours.map((hour) => (
                            <div key={hour} className="flex h-20 items-start justify-center border-b border-border pt-2">
                                <span className="text-sm font-medium text-foreground">{hour.toString().padStart(2, '0')}:00</span>
                            </div>
                        ))}
                    </div>
                    {/* Columnas de días */}
                    {weekDays.map((day, dayIndex) => (
                        <div key={dayIndex} className="relative border-r border-border bg-card dark:bg-background">
                            {workingHours.map((hour) => (
                                <div
                                    key={hour}
                                    className="group relative h-20 cursor-pointer border-b border-border transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    onClick={() => onCreateBooking?.(day, hour)}
                                >
                                    {/* Línea de media hora */}
                                    <div className="absolute top-1/2 left-0 h-px w-full bg-gray-200 dark:bg-gray-800"></div>

                                    {/* Botón para agregar cita */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                        <Plus size={20} className="rounded-full bg-white p-1 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400" />
                                    </div>
                                </div>
                            ))}

                            {/* Eventos del día */}
                            {getBookingsForDay(day).map((booking) => (
                                <CalendarEventCard
                                    key={booking.id}
                                    booking={booking}
                                    position={getEventPosition(booking)}
                                    formatTime={formatTime}
                                    onClick={() => onEventClick?.(booking)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};
