import { BookingResource } from '@/interfaces/booking';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BookingsIndexProps {
    bookings: BookingResource[];
}

export default function BookingsIndex({ bookings }: BookingsIndexProps) {
    const { t } = useTranslation();

    const [availableProfessionals, setAvailableProfessionals] = useState([]);
    const [professionalAvailability, setProfessionalAvailability] = useState([]);

    const getAvailableProfessionals = async () => {
        const response = await axios.get(
            route('availability.professionals', {
                service_id: '338b11bd-fa9d-4611-9614-ad891c8e9bc3',
                date: '2025-06-30',
            }),
        );
        setAvailableProfessionals(response.data);
    };

    const getProfessionalAvailability = async () => {
        const response = await axios.get(
            route('availability.professional-schedule', {
                professional_id: '15d40904-5599-45a0-b80a-4db2a0abb667',
                service_id: '338b11bd-fa9d-4611-9614-ad891c8e9bc3',
                date: '2025-06-30',
            }),
        );
        setProfessionalAvailability(response.data);
    };

    return (
        <AppLayout breadcrumbs={[{ title: t('bookings.title'), href: '/bookings' }]}>
            <Head title={t('bookings.title')} />
            Hola
            <button onClick={getAvailableProfessionals}>Get Available Professionals</button>
            <br />
            <button onClick={getProfessionalAvailability}>Get Professional Availability</button>
            <pre>{JSON.stringify(availableProfessionals, null, 2)}</pre>
        </AppLayout>
    );
}
