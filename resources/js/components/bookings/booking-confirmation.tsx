import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Calendar, CheckCircle, Clock, DollarSign, Mail, Phone, User } from 'lucide-react';
import React, { useState } from 'react';

interface BookingConfirmationProps {
    service: any;
    professional: any;
    selectedDate: string;
    selectedTime: any;
    availability: any;
    onBack: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
    service,
    professional,
    selectedDate,
    selectedTime,
    availability,
    onBack,
}) => {
    const [bookingData, setBookingData] = useState({
        name: '',
        email: '',
        phone: '',
        notes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const finalPrice = availability?.service?.price || service.price;
    const finalDuration = availability?.service?.duration || service.duration;

    const handleInputChange = (field: string, value: string) => {
        setBookingData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleConfirmBooking = async () => {
        if (!bookingData.name || !bookingData.email || !bookingData.phone) {
            console.log('Error');
            return;
        }

        setIsSubmitting(true);

        // Simular llamada a API
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log('Reserva confirmada:', {
                service: service.id,
                professional: professional.id,
                date: selectedDate,
                time: selectedTime.time,
                client: bookingData,
                price: finalPrice,
                duration: finalDuration,
            });

            setIsConfirmed(true);
            console.log('Reserva confirmada');
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isConfirmed) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
                <div className="mx-auto max-w-2xl pt-20">
                    <Card className="bg-white/80 text-center backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                            <CardTitle className="text-2xl text-green-700">¡Reserva Confirmada!</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-600">Tu cita ha sido agendada exitosamente. Recibirás un correo de confirmación en breve.</p>

                            <div className="space-y-2 rounded-lg bg-green-50 p-4 text-left">
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4 text-green-600" />
                                    <span className="font-semibold">Fecha:</span> {new Date(selectedDate).toLocaleDateString('es-ES')}
                                </div>
                                <div className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4 text-green-600" />
                                    <span className="font-semibold">Hora:</span> {selectedTime.time}
                                </div>
                                <div className="flex items-center">
                                    <User className="mr-2 h-4 w-4 text-green-600" />
                                    <span className="font-semibold">Profesional:</span> {professional.title}{' '}
                                    {professional.user?.name || availability?.professional?.name}
                                </div>
                                <div className="flex items-center">
                                    <DollarSign className="mr-2 h-4 w-4 text-green-600" />
                                    <span className="font-semibold">Total:</span> ${Number(finalPrice).toLocaleString()} COP
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button variant="outline" onClick={() => window.location.reload()} className="flex-1">
                                    Nueva Reserva
                                </Button>
                                <Button onClick={() => (window.location.href = '/')} className="flex-1">
                                    Ir al Inicio
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-6 flex items-center">
                    <Button variant="ghost" onClick={onBack} className="mr-4 hover:bg-white/50">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a horarios
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Booking Summary */}
                    <Card className="bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <CheckCircle className="mr-2 h-5 w-5" />
                                Resumen de Reserva
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Service Info */}
                            <div>
                                <h3 className="mb-2 text-lg font-semibold">{service.name}</h3>
                                <p className="mb-4 text-sm text-gray-600">{service.description}</p>

                                <div className="mb-4 flex items-center space-x-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={professional.user?.photo || availability?.professional?.photo} />
                                        <AvatarFallback className="bg-blue-100 text-blue-600">
                                            {(professional.user?.name || availability?.professional?.name)
                                                ?.split(' ')
                                                .map((n: string) => n[0])
                                                .join('') || 'P'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">
                                            {professional.title} {professional.user?.name || availability?.professional?.name}
                                        </p>
                                        <Badge variant="secondary">Profesional</Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <Calendar className="mr-3 h-4 w-4 text-blue-600" />
                                    <div>
                                        <p className="font-medium">Fecha</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(selectedDate).toLocaleDateString('es-ES', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Clock className="mr-3 h-4 w-4 text-blue-600" />
                                    <div>
                                        <p className="font-medium">Hora y Duración</p>
                                        <p className="text-sm text-gray-600">
                                            {selectedTime.time} • {finalDuration} minutos
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="rounded-lg bg-blue-50 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">Total a pagar:</span>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">${Number(finalPrice).toLocaleString()}</div>
                                        <div className="text-sm text-gray-600">COP</div>
                                    </div>
                                </div>
                                {finalPrice !== service.price && <p className="mt-2 text-xs text-gray-500">* Precio personalizado del profesional</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Client Information Form */}
                    <Card className="bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="mr-2 h-5 w-5" />
                                Información de Contacto
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nombre completo *</Label>
                                <Input
                                    id="name"
                                    value={bookingData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Tu nombre completo"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">Correo electrónico *</Label>
                                <div className="relative">
                                    <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={bookingData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="tu@email.com"
                                        className="mt-1 pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="phone">Teléfono *</Label>
                                <div className="relative">
                                    <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={bookingData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        placeholder="+57 300 123 4567"
                                        className="mt-1 pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                                <Textarea
                                    id="notes"
                                    value={bookingData.notes}
                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                    placeholder="Cualquier información adicional que quieras compartir..."
                                    className="mt-1"
                                    rows={3}
                                />
                            </div>

                            <div className="pt-4">
                                <Button
                                    onClick={handleConfirmBooking}
                                    disabled={isSubmitting || !bookingData.name || !bookingData.email || !bookingData.phone}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    size="lg"
                                >
                                    {isSubmitting ? 'Confirmando...' : 'Confirmar Reserva'}
                                </Button>
                            </div>

                            <p className="text-center text-xs text-gray-500">Al confirmar, aceptas nuestros términos y condiciones de servicio.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
