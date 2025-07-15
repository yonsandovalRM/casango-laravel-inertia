import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookingResource } from '@/interfaces/booking';
import { useForm } from '@inertiajs/react';
import { AlertCircle, Calendar, Clock } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface RescheduleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: BookingResource | null;
    onSuccess?: () => void;
}

interface AvailabilitySlot {
    time: string;
    available: boolean;
    reason?: string;
    period: 'morning' | 'afternoon';
}

interface AvailabilityResponse {
    time_blocks: {
        morning: AvailabilitySlot[];
        afternoon: AvailabilitySlot[];
    };
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({ open, onOpenChange, booking, onSuccess }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
    const [loadingAvailability, setLoadingAvailability] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        date: '',
        time: '',
    });

    // Reset form when modal opens/closes
    useEffect(() => {
        if (open && booking) {
            setSelectedDate('');
            setSelectedTime('');
            setAvailability(null);
            reset();
        }
    }, [open, booking]);

    // Fetch availability when date changes
    useEffect(() => {
        if (selectedDate && booking) {
            fetchAvailability(selectedDate);
        }
    }, [selectedDate, booking]);

    const fetchAvailability = async (date: string) => {
        if (!booking) return;

        setLoadingAvailability(true);
        try {
            const response = await fetch(
                `/availability/professional-schedule?professional_id=${booking.professional_id}&service_id=${booking.service_id}&date=${date}`,
            );
            const data = await response.json();

            if (response.ok) {
                setAvailability(data);
            } else {
                console.error('Error fetching availability:', data.message);
                setAvailability(null);
            }
        } catch (error) {
            console.error('Error fetching availability:', error);
            setAvailability(null);
        } finally {
            setLoadingAvailability(false);
        }
    };

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setSelectedTime('');
        setData((prev) => ({ ...prev, date, time: '' }));
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        setData((prev) => ({ ...prev, time }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!booking || !data.date || !data.time) return;

        post(route('bookings.reschedule', { booking: booking.id }), {
            onSuccess: () => {
                onOpenChange(false);
                onSuccess?.();
            },
        });
    };

    const renderTimeSlots = (slots: AvailabilitySlot[], period: string) => {
        if (!slots || slots.length === 0) {
            return <div className="py-4 text-center text-sm text-gray-500">No hay horarios disponibles en la {period}</div>;
        }

        return (
            <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => (
                    <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                        className={`rounded-lg border p-2 text-sm transition-all ${
                            slot.available
                                ? selectedTime === slot.time
                                    ? 'border-blue-600 bg-blue-600 text-white'
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                                : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                        } `}
                        title={!slot.available ? `No disponible: ${slot.reason}` : undefined}
                    >
                        {slot.time}
                    </button>
                ))}
            </div>
        );
    };

    if (!booking) return null;

    // Get minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Reagendar Cita
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Información actual */}
                    <div className="rounded-lg bg-gray-50 p-4">
                        <h3 className="mb-2 font-medium text-gray-900">Cita Actual</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Cliente:</span> {booking.client.name}
                            </div>
                            <div>
                                <span className="text-gray-600">Servicio:</span> {booking.service.name}
                            </div>
                            <div>
                                <span className="text-gray-600">Fecha actual:</span> {new Date(booking.date).toLocaleDateString('es-ES')}
                            </div>
                            <div>
                                <span className="text-gray-600">Hora actual:</span> {booking.time}
                            </div>
                        </div>
                    </div>

                    {/* Selección de nueva fecha */}
                    <div className="space-y-2">
                        <Label htmlFor="date">Nueva Fecha</Label>
                        <Input
                            id="date"
                            type="date"
                            min={today}
                            value={selectedDate}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="w-full"
                        />
                        {errors.date && <p className="text-sm text-red-600">{errors.date}</p>}
                    </div>

                    {/* Selección de horarios */}
                    {selectedDate && (
                        <div className="space-y-4">
                            <Label>Nueva Hora</Label>

                            {loadingAvailability ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                                    <span className="ml-2 text-sm text-gray-600">Cargando disponibilidad...</span>
                                </div>
                            ) : availability ? (
                                <div className="space-y-6">
                                    {/* Horarios de mañana */}
                                    {availability.time_blocks.morning.length > 0 && (
                                        <div>
                                            <h4 className="mb-3 flex items-center gap-2 font-medium text-gray-700">
                                                <Clock className="h-4 w-4" />
                                                Mañana
                                            </h4>
                                            {renderTimeSlots(availability.time_blocks.morning, 'mañana')}
                                        </div>
                                    )}

                                    {/* Horarios de tarde */}
                                    {availability.time_blocks.afternoon.length > 0 && (
                                        <div>
                                            <h4 className="mb-3 flex items-center gap-2 font-medium text-gray-700">
                                                <Clock className="h-4 w-4" />
                                                Tarde
                                            </h4>
                                            {renderTimeSlots(availability.time_blocks.afternoon, 'tarde')}
                                        </div>
                                    )}

                                    {availability.time_blocks.morning.length === 0 && availability.time_blocks.afternoon.length === 0 && (
                                        <Alert>
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                No hay horarios disponibles para esta fecha. Por favor, selecciona otra fecha.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            ) : (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>Error al cargar la disponibilidad. Por favor, intenta con otra fecha.</AlertDescription>
                                </Alert>
                            )}

                            {errors.time && <p className="text-sm text-red-600">{errors.time}</p>}
                        </div>
                    )}

                    {/* Mostrar errores generales */}
                    {/*  {errors.error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {errors.error}
              </AlertDescription>
            </Alert>
          )} */}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={!selectedDate || !selectedTime || processing}>
                            {processing ? 'Reagendando...' : 'Reagendar Cita'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
