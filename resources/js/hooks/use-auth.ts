import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export const useAuth = () => {
    const { auth } = usePage<SharedData>().props;
    return { auth };
};
