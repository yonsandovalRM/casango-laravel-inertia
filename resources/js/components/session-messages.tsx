import { useSessionMessages } from '@/hooks/use-session-messages';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const SessionMessages = () => {
    useSessionMessages(); // El hook maneja todo internamente

    useEffect(() => {
        // Cleanup al desmontar el componente
        return () => {
            toast.dismiss();
        };
    }, []);

    // Este componente no renderiza nada visible
    // Solo actúa como un gestor de efectos para los mensajes
    return null;
};
