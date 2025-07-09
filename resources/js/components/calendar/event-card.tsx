import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BookingResource, bookingStatusMap, paymentStatusMap } from '@/interfaces/booking';
import { formatCurrency } from '@/lib/utils';
import { AlertCircle, Calendar, CheckCircle, Clock, CreditCard, DollarSign, FileText, Phone, User, XCircle } from 'lucide-react';

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'confirmed':
            return 'bg-green-100 text-green-800 hover:bg-green-200';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
        case 'cancelled':
            return 'bg-red-100 text-red-800 hover:bg-red-200';
        default:
            return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
};

const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'paid':
            return 'bg-green-100 text-green-800 hover:bg-green-200';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
        case 'failed':
            return 'bg-red-100 text-red-800 hover:bg-red-200';
        default:
            return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
};

export default function EventCard({ booking }: { booking: BookingResource }) {
    return (
        <div>
            <div className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={booking.professional.photo} alt={booking.professional.user.name} />
                            <AvatarFallback className="bg-blue-100 text-blue-700">{booking.professional.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-xl font-semibold text-foreground">{booking.service.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                {booking.professional.title} {booking.professional.user.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Badge className={getStatusColor(booking.status)}>
                            {booking.status === 'confirmed' ? (
                                <CheckCircle className="mr-1 h-3 w-3" />
                            ) : booking.status === 'pending' ? (
                                <AlertCircle className="mr-1 h-3 w-3" />
                            ) : (
                                <XCircle className="mr-1 h-3 w-3" />
                            )}
                            {bookingStatusMap[booking.status as keyof typeof bookingStatusMap]}
                        </Badge>
                        <Badge variant="outline" className={getPaymentStatusColor(booking.payment_status)}>
                            <CreditCard className="mr-1 h-3 w-3" />
                            {paymentStatusMap[booking.payment_status as keyof typeof paymentStatusMap]}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {/* Client Information */}
                <div className="rounded-lg bg-accent p-6">
                    <div className="mb-2 flex items-center space-x-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{booking.client.name}</span>
                    </div>
                    {booking.phone && (
                        <div className="flex items-center space-x-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{booking.phone}</span>
                        </div>
                    )}
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-cm-blue-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Fecha</p>
                            <p className="font-medium">{formatDate(booking.date)}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-cm-blue-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Hora</p>
                            <p className="font-medium">{formatTime(booking.time)}</p>
                        </div>
                    </div>
                </div>

                {/* Service Details */}
                <div className="rounded-lg bg-cm-blue-600/20 p-6">
                    <h4 className="mb-2 font-medium text-foreground">Detalles del servicio</h4>
                    <p className="mb-2 text-sm text-muted-foreground">{booking.service.description}</p>
                    <div className="grid grid-cols-2 gap-6 text-sm">
                        <div>
                            <span className="text-cm-blue-500">Duración:</span>
                            <span className="ml-2 font-medium">{booking.service.duration} min</span>
                        </div>
                        <div>
                            <span className="text-cm-blue-500">Categoría:</span>
                            <span className="ml-2 font-medium">{booking.service.category.name}</span>
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="rounded-lg bg-cm-green-600/20 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-cm-green-500" />
                            <span className="font-medium text-cm-green-500">Total</span>
                        </div>
                        <div className="text-right">
                            {booking.discount > 0 && <p className="text-sm text-muted-foreground line-through">${formatCurrency(booking.price)}</p>}
                            <p className="text-lg font-bold text-cm-green-500">${formatCurrency(booking.total)}</p>
                            {booking.discount > 0 && <p className="text-xs text-cm-green-500">Descuento: ${formatCurrency(booking.discount)}</p>}
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                    <div className="border-l-4 border-l-cm-blue-600/50 bg-cm-blue-600/10 p-4 pl-4">
                        <div className="flex items-start space-x-2">
                            <FileText className="mt-0.5 h-4 w-4 text-cm-blue-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Notas</p>
                                <p className="text-sm text-foreground">{booking.notes}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
