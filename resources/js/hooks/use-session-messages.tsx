import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export const useSessionMessages = () => {
    const { message: messageFlash, error: errorFlash, success: successFlash } = usePage<SharedData>().props.flash;
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (messageFlash) {
            setMessage(messageFlash);
        }
        if (errorFlash) {
            setError(errorFlash);
        }
        if (successFlash) {
            setSuccess(successFlash);
        }
        return () => {
            reset();
        };
    }, [messageFlash, errorFlash, successFlash]);

    const reset = () => {
        setMessage(null);
        setError(null);
        setSuccess(null);
    };
    return { message, error, success, reset };
};
