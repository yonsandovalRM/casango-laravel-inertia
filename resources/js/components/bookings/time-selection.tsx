import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfessionalAvailability } from '@/hooks/use-professional-availability';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import React, { useState } from 'react';
import { BookingConfirmation } from './booking-confirmation';

interface TimeSelectionProps {
    service: any;
    professional: any;
    selectedDate: string;
    onBack: () => void;
}

export const TimeSelection: React.FC<TimeSelectionProps> = ({ service, professional, selectedDate, onBack }) => {
    const [selectedTime, setSelectedTime] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const { availability, loading } = useProfessionalAvailability(professional.id, service.id, selectedDate);

    const handleTimeSelect = (timeSlot: any) => {
        setSelectedTime(timeSlot);
    };

    const handleConfirmBooking = () => {
        setShowConfirmation(true);
    };

    const handleBackToTimes = () => {
        setShowConfirmation(false);
        setSelectedTime(null);
    };

    if (showConfirmation && selectedTime) {
        return (
            <BookingConfirmation
                service={service}
                professional={professional}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                availability={availability}
                onBack={handleBackToTimes}
            />
        );
    }

    const finalPrice = availability?.service?.price || service.price;
    const finalDuration = availability?.service?.duration || service.duration;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-6 flex items-center">
                    <Button variant="ghost" onClick={onBack} className="mr-4 hover:bg-white/50">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a profesionales
                    </Button>
                </div>

                {/* Booking Summary */}
                <Card className="mb-8 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Resumen de tu reserva</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <h3 className="mb-2 text-lg font-semibold">{service.name}</h3>
                                <div className="mb-4 flex items-center space-x-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={professional.user?.photo} />
                                        <AvatarFallback className="bg-blue-100 text-blue-600">
                                            {professional.user?.name
                                                ?.split(' ')
                                                .map((n: string) => n[0])
                                                .join('') ||
                                                availability?.professional?.user?.name
                                                    ?.split(' ')
                                                    .map((n: string) => n[0])
                                                    .join('') ||
                                                'P'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">
                                            {professional.title} {professional.user?.name || availability?.professional?.user?.name}
                                        </p>
                                        <p className="text-sm text-gray-600">Profesional</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {new Date(selectedDate).toLocaleDateString('es-ES', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="mr-2 h-4 w-4" />
                                        {finalDuration} minutos
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="mb-2 text-3xl font-bold text-blue-600">${Number(finalPrice).toLocaleString()}</div>
                                <Badge variant="secondary">COP</Badge>
                                {finalPrice !== service.price && <p className="mt-2 text-sm text-gray-500">Precio personalizado del profesional</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Time Selection */}
                <Card className="bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Clock className="mr-2 h-5 w-5" />
                            Selecciona un horario
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                {['Mañana', 'Tarde'].map((period) => (
                                    <div key={period}>
                                        <h3 className="mb-3 font-semibold">{period}</h3>
                                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                                <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-200"></div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">{/* mostrar los horarios disponibles */}</div>
                        )}
                        {!loading && availability && Object.keys(availability.time_blocks || {}).length === 0 && (
                            <div className="py-8 text-center">
                                <Clock className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                                <p className="text-gray-600">No hay horarios disponibles para esta fecha</p>
                            </div>
                        )}

                        {selectedTime && (
                            <div className="mt-8 border-t pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">Horario seleccionado:</p>
                                        <p className="text-blue-600">
                                            {/* {selectedTime.time} - {selectedTime.period === 'morning' ? 'Mañana' : 'Tarde'} */}
                                        </p>
                                    </div>
                                    <Button onClick={handleConfirmBooking} className="bg-blue-600 hover:bg-blue-700" size="lg">
                                        Confirmar Reserva
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
