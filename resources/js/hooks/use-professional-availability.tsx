import { ProfessionalAvailability } from '@/interfaces/professional';
import axios from 'axios';
import { useEffect, useState } from 'react';

export const useProfessionalAvailability = (professionalId: string, serviceId: string, selectedDate: string) => {
    const [availability, setAvailability] = useState<ProfessionalAvailability | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAvailability = async () => {
            setLoading(true);

            try {
                const response = await axios.get(
                    route('availability.professional-schedule', {
                        professional_id: professionalId,
                        service_id: serviceId,
                        date: selectedDate,
                    }),
                );
                console.log(response.data);
                setAvailability(response.data);
            } catch (error) {
                console.error('Error fetching availability:', error);
                setAvailability(null);
            } finally {
                setLoading(false);
            }
        };

        if (professionalId && serviceId && selectedDate) {
            fetchAvailability();
        }
    }, [professionalId, serviceId, selectedDate]);

    return {
        availability,
        loading,
    };
};
