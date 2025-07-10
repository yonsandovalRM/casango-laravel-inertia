import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompany } from '@/hooks/use-company';
import { useProfessionalAvailability } from '@/hooks/use-professional-availability';
import { ArrowLeft, Calendar, CheckCircle, Clock } from 'lucide-react';
import React, { useState } from 'react';
import { ProfessionalHeader } from '../professionals/ui/professional-header';
import { BookingConfirmation } from './booking-confirmation';

interface TimeSlot {
    time: string;
    available: boolean;
    period: 'morning' | 'afternoon';
}

interface TimeSelectionProps {
    service: any;
    professional: any;
    selectedDate: string;
    onBack?: () => void;
    onTimeSelect?: (timeSlot: any, availability: any) => void;
    hideHeader?: boolean;
}

export const TimeSelection: React.FC<TimeSelectionProps> = ({ service, professional, selectedDate, onBack, onTimeSelect, hideHeader = false }) => {
    const company = useCompany();

    const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const { availability, loading } = useProfessionalAvailability(professional.id, service.id, selectedDate);

    const handleTimeSelect = (timeSlot: TimeSlot) => {
        setSelectedTime(timeSlot);
    };

    const handleConfirmSelection = () => {
        if (onTimeSelect && selectedTime) {
            onTimeSelect(selectedTime, availability);
        }
    };

    const handleBackToTimes = () => {
        setShowConfirmation(false);
        setSelectedTime(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
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

    // Verificar si hay horarios disponibles
    const hasAvailableSlots =
        availability?.time_blocks && (availability.time_blocks.morning?.length > 0 || availability.time_blocks.afternoon?.length > 0);

    return (
        <div className={hideHeader ? '' : 'min-h-screen p-4'}>
            <div className={hideHeader ? '' : 'mx-auto max-w-4xl'}>
                {/* Header */}
                {!hideHeader && onBack && (
                    <div className="mb-6 flex items-center">
                        <Button variant="ghost" onClick={onBack} className="mr-4 hover:bg-white/50">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver a profesionales
                        </Button>
                    </div>
                )}

                {/* Booking Summary */}
                <Card className="mb-8 bg-card">
                    <CardContent>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <ProfessionalHeader professional={professional} />
                                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4 text-primary" />
                                        {formatDate(selectedDate)}
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="mr-2 h-4 w-4 text-primary" />
                                        {finalDuration} minutos
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="mb-2 text-3xl font-bold text-primary">${Number(finalPrice).toLocaleString()}</div>
                                <Badge variant="secondary" className="bg-primary/10 text-primary">
                                    {company.currency}
                                </Badge>
                                {finalPrice !== service.price && (
                                    <p className="mt-2 text-sm text-muted-foreground">Precio personalizado del profesional</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Time Selection */}
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="flex items-center text-foreground">
                            <Clock className="mr-2 h-5 w-5 text-primary" />
                            Selecciona un horario
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-6">
                                {['Mañana', 'Tarde'].map((period) => (
                                    <div key={period}>
                                        <h3 className="mb-3 font-semibold text-foreground">{period}</h3>
                                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                                <div key={i} className="h-12 animate-pulse rounded-lg bg-secondary" />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : hasAvailableSlots ? (
                            <div className="space-y-6">
                                {/* Horarios de Mañana */}
                                {availability.time_blocks.morning && availability.time_blocks.morning.length > 0 && (
                                    <div>
                                        <h3 className="mb-4 flex items-center text-lg font-semibold text-foreground">
                                            <div className="mr-2 h-2 w-2 rounded-full bg-yellow-400"></div>
                                            Mañana
                                        </h3>
                                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                                            {availability.time_blocks.morning.map((timeSlot: any, index: number) => (
                                                <Button
                                                    key={`morning-${index}`}
                                                    variant={selectedTime?.time === timeSlot.time ? 'default' : 'outline'}
                                                    className={`h-12 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                                                        selectedTime?.time === timeSlot.time
                                                            ? 'border-primary bg-primary text-primary-foreground shadow-lg hover:bg-primary/90'
                                                            : 'border-border bg-accent text-foreground hover:border-primary hover:bg-primary/90 hover:text-primary-foreground'
                                                    } `}
                                                    disabled={!timeSlot.available}
                                                    onClick={() =>
                                                        handleTimeSelect({
                                                            time: timeSlot.time || timeSlot,
                                                            available: true,
                                                            period: 'morning',
                                                        })
                                                    }
                                                >
                                                    <div className="flex items-center">
                                                        {selectedTime?.time === (timeSlot.time || timeSlot) && (
                                                            <CheckCircle className="mr-1 h-3 w-3" />
                                                        )}
                                                        {timeSlot.time || timeSlot}
                                                    </div>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Horarios de Tarde */}
                                {availability.time_blocks.afternoon && availability.time_blocks.afternoon.length > 0 && (
                                    <div>
                                        <h3 className="mb-4 flex items-center text-lg font-semibold text-foreground">
                                            <div className="mr-2 h-2 w-2 rounded-full bg-orange-400"></div>
                                            Tarde
                                        </h3>
                                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                                            {availability.time_blocks.afternoon.map((timeSlot: any, index: number) => (
                                                <Button
                                                    key={`afternoon-${index}`}
                                                    variant={selectedTime?.time === timeSlot.time ? 'default' : 'outline'}
                                                    className={`h-12 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                                                        selectedTime?.time === (timeSlot.time || timeSlot)
                                                            ? 'border-primary bg-primary text-primary-foreground shadow-lg hover:bg-primary/90'
                                                            : 'border-border bg-accent text-foreground hover:border-primary hover:bg-primary/90 hover:text-primary-foreground'
                                                    } `}
                                                    disabled={!timeSlot.available}
                                                    onClick={() =>
                                                        handleTimeSelect({
                                                            time: timeSlot.time || timeSlot,
                                                            available: true,
                                                            period: 'afternoon',
                                                        })
                                                    }
                                                >
                                                    <div className="flex items-center">
                                                        {selectedTime?.time === (timeSlot.time || timeSlot) && (
                                                            <CheckCircle className="mr-1 h-3 w-3" />
                                                        )}
                                                        {timeSlot.time || timeSlot}
                                                    </div>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <Clock className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-medium text-foreground">No hay horarios disponibles</h3>
                                <p className="text-muted-foreground">
                                    Para esta fecha no hay horarios disponibles.
                                    <br />
                                    Por favor, selecciona otra fecha.
                                </p>
                            </div>
                        )}

                        {/* Botón de avanzar */}
                        {selectedTime && (
                            <div className="mt-8 border-t pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">Horario seleccionado:</p>
                                        <p className="text-foreground">
                                            {selectedTime.time} - {selectedTime.period === 'morning' ? 'Por la mañana' : 'Por la tarde'}
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        {onBack && (
                                            <Button variant="outline" onClick={onBack} size="lg">
                                                Volver
                                            </Button>
                                        )}
                                        <Button onClick={handleConfirmSelection} size="lg">
                                            Continuar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
