import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export const useCompany = () => {
    const { company } = usePage<SharedData>().props;
    return company;
};
