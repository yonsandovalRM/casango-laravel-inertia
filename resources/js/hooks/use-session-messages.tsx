import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export const useSessionMessages = () => {
    const { message, error, success } = usePage<SharedData>().props.flash;
    return { message, error, success };
};
