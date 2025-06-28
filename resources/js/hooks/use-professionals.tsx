import { ProfessionalResource } from '@/interfaces/professional';
import axios from 'axios';
import { useEffect, useState } from 'react';

export const useProfessionals = (serviceId: string, selectedDate: string) => {
    const [professionals, setProfessionals] = useState<ProfessionalResource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfessionals = async () => {
            setLoading(true);

            try {
                const response = await axios.get(route('availability.professionals', { service_id: serviceId, date: selectedDate }));

                setProfessionals(response.data.professionals);
            } catch (error) {
                console.error('Error fetching professionals:', error);
                setProfessionals([]);
            } finally {
                setLoading(false);
            }
        };

        if (serviceId && selectedDate) {
            fetchProfessionals();
        }
    }, [serviceId, selectedDate]);

    return {
        professionals,
        loading,
    };
};
