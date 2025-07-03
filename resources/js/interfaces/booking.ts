// resources/js/interfaces/booking.ts

import { User } from '@/types';
import { ProfessionalResource } from './professional';
import { ServiceResource } from './service';

export interface BookingResource {
    id: string;
    client_id: string;
    professional_id: string;
    service_id: string;
    price: number;
    discount: number;
    total: number;
    date: string;
    time: string;
    notes?: string;
    status: string;
    payment_status: string;
    payment_method?: string;
    payment_id?: string;
    duration?: number;
    phone?: string;
    created_at: string;
    updated_at: string;

    // Relaciones
    client: User;

    professional: ProfessionalResource;

    service: ServiceResource;
}

export interface BookingFilters {
    search: string;
    status: string;
    service: string;
    date_from: string;
    date_to: string;
    sort_by: string;
    sort_direction: string;
}

export interface ServiceOption {
    id: string;
    name: string;
}

export interface BookingStatus {
    pending: string;
    confirmed: string;
    cancelled: string;
    completed: string;
    no_show: string;
}

export interface PaymentStatus {
    pending: string;
    paid: string;
    refunded: string;
    failed: string;
}

// Props para componentes
export interface BookingTimelineProps {
    bookings: BookingResource[];
    filters: BookingFilters;
    services: ServiceOption[];
    onSyncGoogle?: () => void;
    onSyncOutlook?: () => void;
    onConfirmBooking?: (bookingId: string) => void;
    onCancelBooking?: (bookingId: string) => void;
}

export interface FiltersBookingsProps {
    bookings: BookingResource[];
    filters: BookingFilters;
    services: ServiceOption[];
}

export interface BookingCardTimelineProps {
    booking: BookingResource;
    selectedBooking: string | null;
    setSelectedBooking: (id: string | null) => void;
    onConfirm?: (bookingId: string) => void;
    onCancel?: (bookingId: string) => void;
}
