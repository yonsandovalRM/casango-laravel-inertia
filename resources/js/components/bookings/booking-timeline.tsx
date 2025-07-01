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
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { BookingResource } from '@/interfaces/booking';
import { format, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, CheckCircle, Clock, CreditCard, Download, FileText, Search, User, XCircle } from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface BookingTimelineProps {
    bookings: BookingResource[];
    onSyncGoogle?: () => void;
    onSyncOutlook?: () => void;
    onConfirmBooking?: (bookingId: string) => void;
    onCancelBooking?: (bookingId: string) => void;
}

const ITEMS_PER_PAGE = 5;

const BookingTimeline: React.FC<BookingTimelineProps> = ({ bookings, onSyncGoogle, onSyncOutlook, onConfirmBooking, onCancelBooking }) => {
    const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [serviceFilter, setServiceFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);

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

    // Filtrar y buscar reservas
    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            console.log(booking);
            const matchesSearch =
                booking.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.professional.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.client.name.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
            const matchesService = serviceFilter === 'all' || booking.service.id === serviceFilter;

            return matchesSearch && matchesStatus && matchesService;
        });
    }, [bookings, searchTerm, statusFilter, serviceFilter]);

    // Ordenar reservas
    const sortedBookings = useMemo(() => {
        return [...filteredBookings].sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime());
    }, [filteredBookings]);

    // Paginación
    const totalPages = Math.ceil(sortedBookings.length / ITEMS_PER_PAGE);
    const paginatedBookings = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [sortedBookings, currentPage]);

    // Obtener servicios únicos para el filtro
    const uniqueServices = useMemo(() => {
        const services = bookings.map((booking) => booking.service);
        return services.filter((service, index, self) => index === self.findIndex((s) => s.id === service.id));
    }, [bookings]);

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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setSelectedBooking(null);
    };

    const handleConfirm = (bookingId: string) => {
        onConfirmBooking?.(bookingId);
    };

    const handleCancel = (bookingId: string) => {
        onCancelBooking?.(bookingId);
    };

    return (
        <div className="mx-auto max-w-6xl space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Mis Reservas</h1>
                    <p className="mt-1 text-muted-foreground">Gestiona y sincroniza tus citas</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button variant="outline" onClick={onSyncGoogle} className="flex items-center gap-2 hover:bg-blue-50">
                        <Calendar className="h-4 w-4" />
                        Sincronizar con Google
                    </Button>
                    <Button variant="outline" onClick={onSyncOutlook} className="flex items-center gap-2 hover:bg-orange-50">
                        <Calendar className="h-4 w-4" />
                        Sincronizar con Outlook
                    </Button>
                </div>
            </div>

            {/* Filtros y búsqueda */}
            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                            <Input
                                placeholder="Buscar por servicio, profesional o cliente..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="confirmed">Confirmada</SelectItem>
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="cancelled">Cancelada</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={serviceFilter} onValueChange={setServiceFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Servicio" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los servicios</SelectItem>
                                {uniqueServices.map((service) => (
                                    <SelectItem key={service.id} value={service.id}>
                                        {service.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex items-center text-sm text-muted-foreground">
                            {filteredBookings.length} de {bookings.length} reservas
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Timeline */}
            {paginatedBookings.length > 0 ? (
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200 dark:from-blue-900 dark:via-blue-800 dark:to-blue-900"></div>

                    <div className="space-y-6">
                        {paginatedBookings.map((booking, index) => (
                            <div key={booking.id} className="relative flex items-start gap-6">
                                {/* Timeline dot */}
                                <div
                                    className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 ${
                                        booking.status === 'confirmed'
                                            ? 'border-green-200 bg-green-500 dark:border-green-900 dark:bg-green-800'
                                            : booking.status === 'pending'
                                              ? 'border-yellow-200 bg-yellow-500 dark:border-yellow-900 dark:bg-yellow-800'
                                              : 'border-red-200 bg-red-500 dark:border-red-900 dark:bg-red-800'
                                    } shadow-lg`}
                                >
                                    <Calendar
                                        className={`h-6 w-6 text-foreground ${booking.status === 'confirmed' ? 'text-green-800 dark:text-green-200' : booking.status === 'pending' ? 'text-yellow-800 dark:text-yellow-200' : 'text-red-800 dark:text-red-200'}`}
                                    />
                                </div>

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
                                                    {booking.status === 'confirmed'
                                                        ? 'Confirmada'
                                                        : booking.status === 'pending'
                                                          ? 'Pendiente'
                                                          : 'Cancelada'}
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
                                                <AvatarFallback className="bg-blue-100 text-blue-700">
                                                    {booking.professional.user.name.charAt(0)}
                                                </AvatarFallback>
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
                                                                        variant="default"
                                                                        className="flex items-center gap-1 bg-green-600 text-xs hover:bg-green-700"
                                                                    >
                                                                        <CheckCircle className="h-3 w-3" />
                                                                        Confirmar
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Confirmar Reserva</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            ¿Estás seguro de que quieres confirmar esta reserva? Esta acción no se
                                                                            puede deshacer.
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
                                                                        variant="destructive"
                                                                        className="flex items-center gap-1 text-xs"
                                                                    >
                                                                        <XCircle className="h-3 w-3" />
                                                                        Cancelar
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            ¿Estás seguro de que quieres cancelar esta reserva? Esta acción no se
                                                                            puede deshacer.
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
                        ))}
                    </div>
                </div>
            ) : (
                <Card className="py-12 text-center">
                    <CardContent>
                        <div className="text-muted-foreground">
                            <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
                            <h3 className="mb-2 text-lg font-medium">
                                {searchTerm || statusFilter !== 'all' || serviceFilter !== 'all'
                                    ? 'No se encontraron reservas'
                                    : 'No tienes reservas'}
                            </h3>
                            <p>
                                {searchTerm || statusFilter !== 'all' || serviceFilter !== 'all'
                                    ? 'Prueba ajustando los filtros de búsqueda.'
                                    : 'Cuando hagas una reserva, aparecerá aquí.'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink onClick={() => handlePageChange(page)} isActive={currentPage === page} className="cursor-pointer">
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default BookingTimeline;
