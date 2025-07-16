// utils/booking-utils.ts
import { BookingResource } from '@/interfaces/booking';
import { BookingEvent } from '@/interfaces/calendar';

/**
 * Función para calcular la hora de finalización de una cita
 */
export const calculateEndTime = (date: string, startTime: string, durationMinutes: number): Date => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date(date);
    startDate.setHours(hours, minutes);

    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    return endDate;
};

/**
 * Transformar bookings del backend a eventos del calendario
 */
export const transformBookingsToEvents = (bookings: BookingResource[]): BookingEvent[] => {
    return bookings.map((booking) => ({
        id: booking.id,
        title: booking.service.name,
        clientName: booking.client.name,
        clientPhone: booking.phone,
        serviceName: booking.service.name,
        start: new Date(`${booking.date}T${booking.time}`),
        end: calculateEndTime(booking.date, booking.time, booking.service.duration),
        status: booking.status as any,
        notes: booking.notes,
        price: booking.total,
        duration: booking.service.duration,
        bookingData: booking,
    }));
};

/**
 * Formatear fecha para mostrar en headers
 */
export const formatDateHeader = (date: Date, view: 'week' | 'day' | 'month'): string => {
    if (view === 'week') {
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
        });
    } else if (view === 'day') {
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } else if (view === 'month') {
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
        });
    }
    return '';
};

/**
 * Validar si una fecha está dentro del horario de trabajo
 */
export const isWithinWorkingHours = (date: Date, workingHours: { start: number; end: number }): boolean => {
    const hour = date.getHours();
    return hour >= workingHours.start && hour <= workingHours.end;
};

/**
 * Obtener el color de estado para mostrar en la UI
 */
export const getStatusDisplayInfo = (status: string) => {
    const statusInfo = {
        pending: { label: 'Pendiente', color: 'yellow', icon: '⏳' },
        confirmed: { label: 'Confirmada', color: 'green', icon: '✅' },
        cancelled: { label: 'Cancelada', color: 'red', icon: '❌' },
        completed: { label: 'Completada', color: 'gray', icon: '✔️' },
        no_show: { label: 'No asistió', color: 'orange', icon: '⚠️' },
        rescheduled: { label: 'Reagendada', color: 'purple', icon: '📅' },
    };

    return statusInfo[status as keyof typeof statusInfo] || statusInfo.pending;
};
