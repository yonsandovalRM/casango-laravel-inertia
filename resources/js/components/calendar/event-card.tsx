import { Badge } from '@/components/ui/badge';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import { BookingResource, bookingStatusMap, paymentStatusMap } from '@/interfaces/booking';
import { formatCurrency, formatTimeAMPM } from '@/lib/utils';
import { AlertCircle, Calendar, CheckCircle, Clock, CreditCard, DollarSign, FileText, Phone, User, XCircle } from 'lucide-react';
import { ProfessionalHeader } from '../professionals/ui/professional-header';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
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
    const { formatDate } = useDateFormatter();
    return (
        <ScrollArea className="max-h-96">
            <div className="pb-4">
                <div className="flex items-start justify-between">
                    <ProfessionalHeader professional={booking.professional} />
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
                        <Badge className={getPaymentStatusColor(booking.payment_status)}>
                            <CreditCard className="mr-1 h-3 w-3" />
                            {paymentStatusMap[booking.payment_status as keyof typeof paymentStatusMap]}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {/* Client Information */}
                <div className="mb-2 flex items-center space-x-3">
                    <User className="h-4 w-4 text-cm-blue-500" />
                    <span className="font-medium text-foreground">{booking.client.name}</span>
                </div>
                {booking.phone && (
                    <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-cm-blue-500" />
                        <span className="text-sm text-foreground">{booking.phone}</span>
                    </div>
                )}

                {/* Date and Time */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(booking.date, { preset: 'medium' })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAMPM(booking.time)}</span>
                    </div>
                    <span>• {booking.service.duration}min</span>
                </div>

                <Separator className="my-4" />
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
        </ScrollArea>
    );
}
