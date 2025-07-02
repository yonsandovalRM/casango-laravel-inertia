import { Calendar } from 'lucide-react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BookingResource } from '@/interfaces/booking';
import { router } from '@inertiajs/react';
import { format, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle, Clock, CreditCard, Download, FileText, User, XCircle } from 'lucide-react';
import DotTimeline from './dot-timeline';

const formatDate = (dateString: string) => {
    const date = parseISO(dateString);

    if (isToday(date)) {
        return 'Hoy';
    } else if (isTomorrow(date)) {
        return 'Mañana';
    } else if (isYesterday(date)) {
        return 'Ayer';
    } else {
        return format(date, 'dd MMM yyyy', { locale: es });
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'confirmed':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'cancelled':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getPaymentStatusColor = (status?: string) => {
    switch (status) {
        case 'paid':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'pending':
            return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'failed':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

export default function BookingCardTimeline({
    booking,
    selectedBooking,
    setSelectedBooking,
}: {
    booking: BookingResource;
    selectedBooking: string | null;
    setSelectedBooking: (bookingId: string | null) => void;
}) {
    const handleConfirm = (bookingId: string) => {
        router.put(route('bookings.update', { booking: bookingId }), {
            status: 'confirmed',
        });
    };

    const handleCancel = (bookingId: string) => {
        router.put(route('bookings.update', { booking: bookingId }), {
            status: 'cancelled',
        });
    };

    const handleGoogleCalendarSync = (booking: BookingResource) => {
        const event = generateCalendarEvent(booking);
        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start.replace(/[-:]/g, '').split('.')[0]}Z/${event.end.replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
        window.open(googleUrl, '_blank');
    };

    const handleOutlookSync = (booking: BookingResource) => {
        const event = generateCalendarEvent(booking);
        const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${event.start}&enddt=${event.end}&body=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
        window.open(outlookUrl, '_blank');
    };

    const generateCalendarEvent = (booking: BookingResource) => {
        const startDate = new Date(`${booking.date}T${booking.time}`);
        const endDate = new Date(startDate.getTime() + booking.service.duration * 60000);

        return {
            title: `${booking.service.name} - ${booking.professional.title} ${booking.professional.user.name}`,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            description: `Servicio: ${booking.service.name}\nProfesional: ${booking.professional.title} ${booking.professional.user.name}\nNotas: ${booking.notes || 'Sin notas'}`,
            location: booking.professional.title,
        };
    };

    return (
        <div className="relative flex items-start gap-6">
            {/* Timeline dot */}
            <DotTimeline booking={booking} />

            {/* Booking Card */}
            <Card
                className={`flex-1 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedBooking === booking.id ? 'shadow-lg ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)}
            >
                <CardHeader className="pb-3">
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                        <div className="flex-1">
                            <CardTitle className="mb-2 text-xl font-semibold text-foreground">{booking.service.name}</CardTitle>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span className="font-medium">{formatDate(booking.date)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{booking.time}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                            <Badge className={getStatusColor(booking.status)}>
                                {booking.status === 'confirmed' ? 'Confirmada' : booking.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                            </Badge>
                            {booking.payment_status && (
                                <Badge className={getPaymentStatusColor(booking.payment_status)}>
                                    {booking.payment_status === 'paid'
                                        ? 'Pagado'
                                        : booking.payment_status === 'pending'
                                          ? 'Pago Pendiente'
                                          : 'Pago Fallido'}
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-0">
                    <div className="mb-4 flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={booking.professional.photo} alt={booking.professional.user.name} />
                            <AvatarFallback className="bg-blue-100 text-blue-700">{booking.professional.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h4 className="font-medium text-foreground">
                                {booking.professional.title} {booking.professional.user.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">{booking.professional.profession}</p>
                            <p className="text-sm text-muted-foreground">{booking.professional.specialty}</p>
                        </div>
                    </div>

                    {selectedBooking === booking.id && (
                        <div className="animate-fade-in mt-4 space-y-4">
                            <Separator />

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Cliente:</span>
                                        <span className="font-medium">{booking.client.name}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Duración:</span>
                                        <span className="font-medium">{booking.service.duration} min</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Total:</span>
                                        <span className="font-medium">${booking.total}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {booking.notes && (
                                        <div className="flex items-start gap-2 text-sm">
                                            <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <span className="text-muted-foreground">Notas:</span>
                                                <p className="mt-1 font-medium">{booking.notes}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                {/* Botones de acción para confirmar/cancelar */}
                                {booking.status === 'pending' && (
                                    <>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    <CheckCircle className="h-3 w-3" />
                                                    Confirmar
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Confirmar Reserva</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        ¿Estás seguro de que quieres <strong>confirmar esta reserva</strong>?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleConfirm(booking.id)}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        Confirmar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="soft-destructive"
                                                    className="flex items-center gap-1 text-xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    <XCircle className="h-3 w-3" />
                                                    Cancelar
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        ¿Estás seguro de que quieres cancelar esta reserva? Esta acción no se puede deshacer.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>No cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleCancel(booking.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Sí, cancelar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </>
                                )}

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleGoogleCalendarSync(booking);
                                    }}
                                    className="flex items-center gap-1 text-xs"
                                >
                                    <Download className="h-3 w-3" />
                                    Google Calendar
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOutlookSync(booking);
                                    }}
                                    className="flex items-center gap-1 text-xs"
                                >
                                    <Download className="h-3 w-3" />
                                    Outlook
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
