import { User } from '@/types';
import { ServiceResource } from './service';

export interface BookingResource {
    id: string;
    client: User;
    professional: User;
    service: ServiceResource;
    price: number;
    discount: number;
    total: number;
    date: string;
    time: string;
    status: string;
    payment_status?: string;
    payment_method?: string;
    payment_id?: string;
}
