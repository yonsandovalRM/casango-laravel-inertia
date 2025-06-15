import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface FlashMessage {
    id: string;
    message: string;
    type: 'error' | 'info' | 'success';
}

interface FlashMessages {
    error?: FlashMessage;
    message?: FlashMessage;
    success?: FlashMessage;
}

export const useSessionMessages = () => {
    const { flash } = usePage<SharedData>().props;
    const processedMessages = useRef<Set<string>>(new Set());

    useEffect(() => {
        const flashMessages = flash as unknown as FlashMessages;

        // Procesar mensaje de error
        if (flashMessages.error && !processedMessages.current.has(flashMessages.error.id)) {
            processedMessages.current.add(flashMessages.error.id);
            toast.error(flashMessages.error.message);
        }

        // Procesar mensaje informativo
        if (flashMessages.message && !processedMessages.current.has(flashMessages.message.id)) {
            processedMessages.current.add(flashMessages.message.id);
            toast.info(flashMessages.message.message);
        }

        // Procesar mensaje de éxito
        if (flashMessages.success && !processedMessages.current.has(flashMessages.success.id)) {
            processedMessages.current.add(flashMessages.success.id);
            toast.success(flashMessages.success.message);
        }

        // Limpiar mensajes antiguos periódicamente
        if (processedMessages.current.size > 20) {
            const messagesArray = Array.from(processedMessages.current);
            const toKeep = messagesArray.slice(-10);
            processedMessages.current = new Set(toKeep);
        }
    }, [flash]);

    return { flash: flash as unknown as FlashMessages };
};
