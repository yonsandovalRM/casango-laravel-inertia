import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BookingEvent } from '@/interfaces/calendar';
import { AlertCircle, Calendar, CheckCircle, Link, XCircle } from 'lucide-react';
import React, { useState } from 'react';

interface BookingActionsProps {
    booking: BookingEvent | null;
    onGoToBooking: () => void;
    onConfirmBooking: () => void;
    onCancelBooking: () => void;
    onCompleteBooking: () => void;
    onNoShowBooking: () => void;
    onOpenReschedule: () => void;
}

export const BookingActions: React.FC<BookingActionsProps> = ({
    booking,
    onGoToBooking,
    onConfirmBooking,
    onCancelBooking,
    onCompleteBooking,
    onNoShowBooking,
    onOpenReschedule,
}) => {
    if (!booking) return null;

    const status = booking.status;
    const [openDialog, setOpenDialog] = useState<string | null>(null);

    const baseButtonClass = 'transition-colors hover:bg-primary hover:text-primary-foreground';

    const handleActionWithConfirmation = (actionType: string, actionCallback: () => void) => {
        setOpenDialog(actionType);
    };

    const handleConfirmAction = () => {
        switch (openDialog) {
            case 'confirm':
                onConfirmBooking();
                break;
            case 'cancel':
                onCancelBooking();
                break;
            case 'complete':
                onCompleteBooking();
                break;
            case 'no_show':
                onNoShowBooking();
                break;
            default:
                break;
        }
        setOpenDialog(null);
    };

    const getDialogConfig = () => {
        switch (openDialog) {
            case 'confirm':
                return {
                    title: 'Confirmar cita',
                    description: '¿Estás seguro de que deseas confirmar esta cita?',
                };
            case 'cancel':
                return {
                    title: 'Cancelar cita',
                    description: '¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.',
                };
            case 'complete':
                return {
                    title: 'Marcar como completada',
                    description: '¿Estás seguro de que deseas marcar esta cita como completada?',
                };
            case 'no_show':
                return {
                    title: 'Cliente no se presentó',
                    description: '¿Marcar esta cita como "no show"? El cliente no asistió a la cita.',
                };
            default:
                return {
                    title: 'Confirmar acción',
                    description: '¿Estás seguro de que deseas realizar esta acción?',
                };
        }
    };

    const dialogConfig = getDialogConfig();

    return (
        <div className="block w-full">
            {/* Diálogo de confirmación */}
            <Dialog open={!!openDialog} onOpenChange={(open) => !open && setOpenDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{dialogConfig.title}</DialogTitle>
                        <DialogDescription>{dialogConfig.description}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDialog(null)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleConfirmAction}>Confirmar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-4 gap-2">
                {/* Botón Ver Detalles - no necesita confirmación */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline" className={baseButtonClass} onClick={onGoToBooking}>
                                <Link className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Ver detalles</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/* Botones según el estado */}
                {status === 'pending' && (
                    <>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`${baseButtonClass} hover:bg-green-600 hover:text-white`}
                                        onClick={() => handleActionWithConfirmation('confirm', onConfirmBooking)}
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Confirmar cita</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" className={baseButtonClass} onClick={onOpenReschedule}>
                                        <Calendar className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Reagendar</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`${baseButtonClass} hover:bg-destructive hover:text-white`}
                                        onClick={() => handleActionWithConfirmation('cancel', onCancelBooking)}
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Cancelar cita</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </>
                )}

                {status === 'confirmed' && (
                    <>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`${baseButtonClass} hover:bg-blue-600 hover:text-white`}
                                        onClick={() => handleActionWithConfirmation('complete', onCompleteBooking)}
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Marcar como completada</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`${baseButtonClass} hover:bg-orange-500 hover:text-white`}
                                        onClick={() => handleActionWithConfirmation('no_show', onNoShowBooking)}
                                    >
                                        <AlertCircle className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>No se presentó</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" className={baseButtonClass} onClick={onOpenReschedule}>
                                        <Calendar className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Reagendar</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`${baseButtonClass} hover:bg-destructive hover:text-white`}
                                        onClick={() => handleActionWithConfirmation('cancel', onCancelBooking)}
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Cancelar cita</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </>
                )}
            </div>

            {/* Mensajes de estado */}
            <div className="mt-2 flex flex-col gap-2">
                {status === 'cancelled' && <div className="text-sm text-muted-foreground italic">Esta cita ha sido cancelada</div>}
                {status === 'completed' && (
                    <div className="flex items-center text-sm text-green-600 italic dark:text-green-400">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Cita completada
                    </div>
                )}
                {status === 'no_show' && (
                    <div className="flex items-center text-sm text-orange-600 italic dark:text-orange-300">
                        <AlertCircle className="mr-1 h-4 w-4" />
                        Cliente no asistió
                    </div>
                )}
                {status === 'rescheduled' && (
                    <div className="flex items-center text-sm text-purple-600 italic dark:text-purple-400">
                        <Calendar className="mr-1 h-4 w-4" />
                        Cita reagendada
                    </div>
                )}
            </div>
        </div>
    );
};
