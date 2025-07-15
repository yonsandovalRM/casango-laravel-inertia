import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookingResource } from '@/interfaces/booking';
import { useForm } from '@inertiajs/react';
import { Calendar, Copy, FileText } from 'lucide-react';
import { useState } from 'react';

interface CloneFormDataProps {
    currentBooking: BookingResource;
    bookingHistory: any[];
    className?: string;
}

export default function CloneFormData({ currentBooking, bookingHistory, className = '' }: CloneFormDataProps) {
    const [open, setOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<string>('');

    const { post, processing } = useForm({
        source_booking_id: '',
    });

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    const handleCloneData = () => {
        if (!selectedBookingId) return;

        post(route('bookings.form-data.clone', { booking: currentBooking.id }), {
            data: {
                source_booking_id: selectedBookingId,
            },
            onSuccess: () => {
                setOpen(false);
                setSelectedBookingId('');
            },
            preserveScroll: true,
        });
    };

    const getBookingWithFormsData = () => {
        return bookingHistory.filter((booking) => {
            // Filtrar solo reservas que tengan al menos un formulario con datos
            return booking.forms_data && booking.forms_data.some((form: any) => form.has_data);
        });
    };

    const availableBookings = getBookingWithFormsData();

    if (availableBookings.length === 0) {
        return null;
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Copy className="h-5 w-5" />
                    Clonar Datos de Formularios
                </CardTitle>
                <CardDescription>Copia la información de formularios de una reserva anterior del mismo cliente</CardDescription>
            </CardHeader>
            <CardContent>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                            <Copy className="mr-2 h-4 w-4" />
                            Clonar datos de reserva anterior
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Seleccionar Reserva de Origen</DialogTitle>
                            <DialogDescription>
                                Elige una reserva anterior para copiar los datos de sus formularios. Solo se mostrarán reservas que tengan formularios
                                completados.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Reserva de origen</label>
                                <Select value={selectedBookingId} onValueChange={setSelectedBookingId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una reserva..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableBookings.map((booking) => (
                                            <SelectItem key={booking.id} value={booking.id}>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        {formatDate(booking.date)} - {booking.service?.name || 'Sin servicio'}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Mostrar detalles de la reserva seleccionada */}
                            {selectedBookingId && (
                                <div className="rounded-lg bg-muted p-4">
                                    {(() => {
                                        const selectedBooking = availableBookings.find((b) => b.id === selectedBookingId);
                                        if (!selectedBooking) return null;

                                        return (
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-medium">Formularios disponibles para clonar:</h4>
                                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                                    {selectedBooking.forms_data
                                                        ?.filter((form: any) => form.has_data)
                                                        .map((form: any) => (
                                                            <div
                                                                key={form.template.id}
                                                                className="flex items-center gap-2 rounded border bg-background p-2"
                                                            >
                                                                <FileText className="h-4 w-4 text-green-500" />
                                                                <span className="text-sm">{form.template.name}</span>
                                                            </div>
                                                        ))}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    * Solo se clonarán los datos de formularios que estén actualmente activos
                                                </p>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleCloneData} disabled={!selectedBookingId || processing}>
                                    {processing ? 'Clonando...' : 'Clonar Datos'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
