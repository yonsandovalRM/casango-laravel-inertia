import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useMemo, useState } from 'react';

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    color?: string;
    description?: string;
}

interface CustomCalendarProps {
    events?: CalendarEvent[];
    onEventClick?: (event: CalendarEvent) => void;
    onDateClick?: (date: Date) => void;
    onEventCreate?: (start: Date, end: Date) => void;
}

export const CustomCalendar: React.FC<CustomCalendarProps> = ({ events = [], onEventClick, onDateClick, onEventCreate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'week' | 'day' | 'month'>('week');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Date | null>(null);

    // Generar horas del día
    const hours = useMemo(() => {
        const hrs = [];
        for (let i = 8; i <= 20; i++) {
            hrs.push(i);
        }
        return hrs;
    }, []);

    // Obtener días de la semana
    const getWeekDays = (date: Date) => {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);

        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            days.push(day);
        }
        return days;
    };

    // Obtener días del mes
    const getMonthDays = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        const endDate = new Date(lastDay);

        // Ajustar para empezar en lunes
        startDate.setDate(startDate.getDate() - (startDate.getDay() === 0 ? 6 : startDate.getDay() - 1));
        endDate.setDate(endDate.getDate() + ((7 - endDate.getDay()) % 7));

        const days = [];
        const current = new Date(startDate);
        while (current <= endDate) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return days;
    };

    // Formatear fecha
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Formatear hora
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    // Calcular posición del evento
    const getEventPosition = (event: CalendarEvent, dayStart: Date) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);

        const startMinutes = eventStart.getHours() * 60 + eventStart.getMinutes();
        const endMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes();
        const duration = endMinutes - startMinutes;

        // Calcular posición relativa (8:00 AM = 0)
        const relativeStart = startMinutes - 8 * 60;
        const top = Math.max(0, (relativeStart / 60) * 60); // 60px por hora
        const height = Math.max(20, (duration / 60) * 60); // Altura mínima 20px

        return { top, height };
    };

    // Filtrar eventos por día
    const getEventsForDay = (date: Date) => {
        return events.filter((event) => {
            const eventDate = new Date(event.start);
            return eventDate.toDateString() === date.toDateString();
        });
    };

    // Navegación
    const navigate = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (view === 'week') {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        } else if (view === 'day') {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        } else if (view === 'month') {
            newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        }
        setCurrentDate(newDate);
    };

    // Manejo de arrastre para crear eventos
    const handleMouseDown = (date: Date, hour: number) => {
        const startTime = new Date(date);
        startTime.setHours(hour, 0, 0, 0);
        setDragStart(startTime);
        setIsDragging(true);
    };

    const handleMouseUp = (date: Date, hour: number) => {
        if (isDragging && dragStart) {
            const endTime = new Date(date);
            endTime.setHours(hour, 0, 0, 0);

            if (endTime > dragStart) {
                onEventCreate?.(dragStart, endTime);
            }
        }
        setIsDragging(false);
        setDragStart(null);
    };

    // Renderizar vista de semana
    const renderWeekView = () => {
        const weekDays = getWeekDays(currentDate);

        return (
            <div className="flex h-full flex-col">
                {/* Encabezado de días */}
                <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
                    <div className="p-3 text-sm font-medium text-gray-500"></div>
                    {weekDays.map((day, index) => (
                        <div key={index} className="border-l border-gray-200 p-3 text-center">
                            <div className="text-sm font-medium text-gray-900">{day.toLocaleDateString('es-ES', { weekday: 'short' })}</div>
                            <div
                                className={`text-lg font-semibold ${
                                    day.toDateString() === new Date().toDateString() ? 'text-blue-600' : 'text-gray-700'
                                }`}
                            >
                                {day.getDate()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contenido de la semana */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid h-full grid-cols-8">
                        {/* Columna de horas */}
                        <div className="border-r border-gray-200">
                            {hours.map((hour) => (
                                <div key={hour} className="flex h-[60px] items-start justify-end border-b border-gray-100 pt-1 pr-2">
                                    <span className="text-xs text-gray-500">{hour}:00</span>
                                </div>
                            ))}
                        </div>

                        {/* Columnas de días */}
                        {weekDays.map((day, dayIndex) => (
                            <div key={dayIndex} className="relative border-r border-gray-200">
                                {hours.map((hour) => (
                                    <div
                                        key={hour}
                                        className="h-[60px] cursor-pointer border-b border-gray-100 transition-colors hover:bg-blue-50"
                                        onMouseDown={() => handleMouseDown(day, hour)}
                                        onMouseUp={() => handleMouseUp(day, hour)}
                                        onClick={() => onDateClick?.(new Date(day.setHours(hour, 0, 0, 0)))}
                                    >
                                        {/* Líneas de medias horas */}
                                        <div className="absolute top-1/2 h-0.5 w-full border-t border-dotted border-gray-100"></div>
                                    </div>
                                ))}

                                {/* Eventos del día */}
                                {getEventsForDay(day).map((event) => {
                                    const { top, height } = getEventPosition(event, day);
                                    return (
                                        <div
                                            key={event.id}
                                            className="absolute right-1 left-1 cursor-pointer rounded-md shadow-sm transition-all hover:scale-105 hover:shadow-md"
                                            style={{
                                                top: `${top}px`,
                                                height: `${height}px`,
                                                backgroundColor: event.color || '#3b82f6',
                                                zIndex: 10,
                                            }}
                                            onClick={() => onEventClick?.(event)}
                                        >
                                            <div className="p-1 text-xs leading-tight text-white">
                                                <div className="truncate font-medium">{event.title}</div>
                                                <div className="opacity-90">
                                                    {formatTime(event.start)} - {formatTime(event.end)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // Renderizar vista de mes
    const renderMonthView = () => {
        const monthDays = getMonthDays(currentDate);
        const weeks = [];

        for (let i = 0; i < monthDays.length; i += 7) {
            weeks.push(monthDays.slice(i, i + 7));
        }

        return (
            <div className="flex h-full flex-col">
                {/* Encabezado de días de la semana */}
                <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                        <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Semanas */}
                <div className="flex-1 overflow-y-auto">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="grid h-32 grid-cols-7 border-b border-gray-200">
                            {week.map((day, dayIndex) => {
                                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                                const isToday = day.toDateString() === new Date().toDateString();
                                const dayEvents = getEventsForDay(day);

                                return (
                                    <div
                                        key={dayIndex}
                                        className={`cursor-pointer border-r border-gray-200 p-1 hover:bg-gray-50 ${
                                            !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                                        }`}
                                        onClick={() => onDateClick?.(day)}
                                    >
                                        <div
                                            className={`mb-1 text-sm font-medium ${
                                                isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                                            }`}
                                        >
                                            {day.getDate()}
                                        </div>

                                        {/* Eventos del día */}
                                        <div className="space-y-1">
                                            {dayEvents.slice(0, 3).map((event) => (
                                                <div
                                                    key={event.id}
                                                    className="cursor-pointer truncate rounded p-1 text-xs text-white hover:opacity-80"
                                                    style={{ backgroundColor: event.color || '#3b82f6' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEventClick?.(event);
                                                    }}
                                                >
                                                    {event.title}
                                                </div>
                                            ))}
                                            {dayEvents.length > 3 && <div className="text-xs text-gray-500">+{dayEvents.length - 3} más</div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Renderizar vista de día
    const renderDayView = () => {
        const dayEvents = getEventsForDay(currentDate);

        return (
            <div className="flex h-full flex-col">
                {/* Encabezado del día */}
                <div className="border-b border-gray-200 bg-gray-50 p-4">
                    <h2 className="text-lg font-semibold text-gray-900">{formatDate(currentDate)}</h2>
                </div>

                {/* Contenido del día */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2">
                        {/* Columna de horas */}
                        <div className="border-r border-gray-200">
                            {hours.map((hour) => (
                                <div key={hour} className="flex h-[80px] items-start justify-end border-b border-gray-100 pt-2 pr-4">
                                    <span className="text-sm font-medium text-gray-500">{hour}:00</span>
                                </div>
                            ))}
                        </div>

                        {/* Columna de eventos */}
                        <div className="relative">
                            {hours.map((hour) => (
                                <div
                                    key={hour}
                                    className="h-[80px] cursor-pointer border-b border-gray-100 transition-colors hover:bg-blue-50"
                                    onClick={() => onDateClick?.(new Date(currentDate.setHours(hour, 0, 0, 0)))}
                                >
                                    <div className="absolute top-1/2 h-0.5 w-full border-t border-dotted border-gray-100"></div>
                                </div>
                            ))}

                            {/* Eventos del día */}
                            {dayEvents.map((event) => {
                                const { top, height } = getEventPosition(event, currentDate);
                                return (
                                    <div
                                        key={event.id}
                                        className="absolute right-2 left-2 cursor-pointer rounded-lg shadow-md transition-all hover:scale-105 hover:shadow-lg"
                                        style={{
                                            top: `${top * 1.33}px`, // Ajuste para vista de día
                                            height: `${height * 1.33}px`,
                                            backgroundColor: event.color || '#3b82f6',
                                            zIndex: 10,
                                        }}
                                        onClick={() => onEventClick?.(event)}
                                    >
                                        <div className="p-3 text-white">
                                            <div className="mb-1 font-semibold">{event.title}</div>
                                            <div className="text-sm opacity-90">
                                                {formatTime(event.start)} - {formatTime(event.end)}
                                            </div>
                                            {event.description && <div className="mt-1 text-xs opacity-80">{event.description}</div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-[600px] overflow-hidden rounded-lg bg-white shadow-lg">
            {/* Barra de herramientas */}
            <div className="border-b border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigate('prev')} className="rounded-lg p-2 transition-colors hover:bg-gray-100">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => navigate('next')} className="rounded-lg p-2 transition-colors hover:bg-gray-100">
                            <ChevronRight size={20} />
                        </button>
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="rounded-lg px-3 py-1 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                        >
                            Hoy
                        </button>
                    </div>

                    <h1 className="text-xl font-semibold text-gray-900">
                        {currentDate.toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                        })}
                    </h1>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setView('month')}
                            className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                                view === 'month' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            Mes
                        </button>
                        <button
                            onClick={() => setView('week')}
                            className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                                view === 'week' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            Semana
                        </button>
                        <button
                            onClick={() => setView('day')}
                            className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                                view === 'day' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            Día
                        </button>
                    </div>
                </div>
            </div>

            {/* Contenido del calendario */}
            <div className="flex-1 overflow-hidden">
                {view === 'week' && renderWeekView()}
                {view === 'month' && renderMonthView()}
                {view === 'day' && renderDayView()}
            </div>
        </div>
    );
};
