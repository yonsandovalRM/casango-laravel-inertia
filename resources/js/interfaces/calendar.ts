export interface BookingEvent {
    id: string;
    title: string;
    clientName: string;
    clientPhone?: string;
    serviceName: string;
    start: Date;
    end: Date;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show' | 'rescheduled';
    notes?: string;
    price: number;
    duration: number;
    bookingData: any; // Tipo específico de tu aplicación
}

export interface CalendarFilters {
    status: string;
    search: string;
}

export type CalendarView = 'week' | 'day' | 'month';

export interface EventPosition {
    top: number;
    height: number;
}

export interface StatusColors {
    bg: string;
    text: string;
    border: string;
}

export const statusColors: Record<string, StatusColors> = {
    pending: { bg: '#fbbf24', text: '#92400e', border: '#f59e0b' },
    confirmed: { bg: '#10b981', text: '#065f46', border: '#059669' },
    cancelled: { bg: '#ef4444', text: '#991b1b', border: '#dc2626' },
    completed: { bg: '#6b7280', text: '#374151', border: '#4b5563' },
    no_show: { bg: '#f97316', text: '#9a3412', border: '#ea580c' },
    rescheduled: { bg: '#8b5cf6', text: '#5b21b6', border: '#7c3aed' },
};

export const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    completed: 'Completada',
    no_show: 'No asistió',
    rescheduled: 'Reagendada',
};
