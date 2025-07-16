import { BookingEvent, CalendarFilters, CalendarView, EventPosition } from '@/interfaces/calendar';
import { useMemo, useState } from 'react';

export const useCalendarLogic = (bookings: BookingEvent[], filters: CalendarFilters, workingHours: { start: number; end: number }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Generar array de horas de trabajo
    const workingHoursArray = useMemo(() => {
        const hours = [];
        for (let i = workingHours.start; i <= workingHours.end; i++) {
            hours.push(i);
        }
        return hours;
    }, [workingHours]);

    // Filtrar eventos
    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            const matchesStatus = filters.status === 'all' || booking.status === filters.status;
            const matchesSearch =
                filters.search === '' ||
                booking.clientName.toLowerCase().includes(filters.search.toLowerCase()) ||
                booking.serviceName.toLowerCase().includes(filters.search.toLowerCase());

            return matchesStatus && matchesSearch;
        });
    }, [bookings, filters]);

    // Obtener días de la semana
    const getWeekDays = (date: Date) => {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);

        const days = [];
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(start);
            currentDay.setDate(start.getDate() + i);
            days.push(currentDay);
        }
        return days;
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
    const getEventPosition = (booking: BookingEvent): EventPosition => {
        const startMinutes = booking.start.getHours() * 60 + booking.start.getMinutes();
        const endMinutes = booking.end.getHours() * 60 + booking.end.getMinutes();
        const duration = endMinutes - startMinutes;

        const relativeStart = startMinutes - workingHours.start * 60;
        const top = Math.max(0, (relativeStart / 60) * 80); // 80px por hora
        const height = Math.max(30, (duration / 60) * 80); // Altura mínima 30px

        return { top, height };
    };

    // Filtrar eventos por día
    const getBookingsForDay = (date: Date) => {
        return filteredBookings.filter((booking) => {
            const bookingDate = new Date(booking.start);
            return bookingDate.toDateString() === date.toDateString();
        });
    };

    // Navegación
    const navigate = (direction: 'prev' | 'next', view: CalendarView) => {
        const newDate = new Date(currentDate);
        if (view === 'week') {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        } else if (view === 'day') {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        }
        setCurrentDate(newDate);
    };

    const resetToToday = () => {
        setCurrentDate(new Date());
    };

    return {
        currentDate,
        filteredBookings,
        workingHoursArray,
        navigate,
        resetToToday,
        getWeekDays,
        getBookingsForDay,
        formatTime,
        getEventPosition,
    };
};
