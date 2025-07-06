import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface BookingStatusActionsProps {
    currentStatus: string;
    onStatusUpdate: (status: string) => void;
}

export function BookingStatusActions({ currentStatus, onStatusUpdate }: BookingStatusActionsProps) {
    const isCompleted = currentStatus.toLowerCase() === 'completed' || currentStatus.toLowerCase() === 'completada';
    const isNoShow = currentStatus.toLowerCase() === 'no_show' || currentStatus.toLowerCase() === 'no_asistio';

    return (
        <Card>
            <CardContent>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Acciones de la Cita</h3>

                <div className="flex flex-wrap gap-3">
                    <Button onClick={() => onStatusUpdate('completed')} disabled={isCompleted} variant={isCompleted ? 'secondary' : 'default'}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {isCompleted ? 'Completada' : 'Marcar como Completada'}
                    </Button>

                    <Button onClick={() => onStatusUpdate('no_show')} disabled={isNoShow} variant={isNoShow ? 'secondary' : 'outline'}>
                        <XCircle className="mr-2 h-4 w-4" />
                        {isNoShow ? 'No Asistió' : 'Marcar como No Asistió'}
                    </Button>

                    <Button onClick={() => onStatusUpdate('pending')} variant="outline">
                        <Clock className="mr-2 h-4 w-4" />
                        Marcar como Pendiente
                    </Button>
                </div>

                <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                        <strong>Estado actual:</strong> {currentStatus}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
