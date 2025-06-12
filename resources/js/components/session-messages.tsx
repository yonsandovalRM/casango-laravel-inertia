import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSessionMessages } from '@/hooks/use-session-messages';
import { AlertTriangle, CheckIcon, InfoIcon } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const SessionMessages = () => {
    const { error, message, success } = useSessionMessages();

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
        if (message) {
            toast.info(message);
        }
        if (success) {
            toast.success(success);
        }
        return () => {
            toast.dismiss();
        };
    }, [error, message, success]);

    return (
        <div className="space-y-2 py-4">
            {error && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {message && (
                <Alert variant="default">
                    <InfoIcon className="h-4 w-4" />
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert variant="default">
                    <CheckIcon className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}
        </div>
    );
};
