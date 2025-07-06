import { Card, CardContent } from '@/components/ui/card';
import { BookingResource } from '@/interfaces/booking';
import { formatCurrency } from '@/lib/utils';
import { Calendar, Clock, DollarSign, Phone, User } from 'lucide-react';

interface BookingClientInfoProps {
    booking: BookingResource;
}

export function BookingClientInfo({ booking }: BookingClientInfoProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
            case 'confirmada':
                return 'bg-green-100 text-green-800';
            case 'pending':
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
            case 'cancelada':
                return 'bg-red-100 text-red-800';
            case 'completed':
            case 'completada':
                return 'bg-blue-100 text-blue-800';
            case 'no_show':
            case 'no_asistio':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card>
            <CardContent>
                <div className="mb-6 flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-foreground">{booking.client.name}</h2>
                            <p className="text-muted-foreground">{booking.client.email}</p>
                        </div>
                    </div>

                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(booking.status)}`}>{booking.status}</span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium text-foreground">Fecha</p>
                            <p className="text-sm text-muted-foreground">{formatDate(booking.date)}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium text-foreground">Hora</p>
                            <p className="text-sm text-muted-foreground">{booking.time}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium text-foreground">Total</p>
                            <p className="text-sm text-muted-foreground">${formatCurrency(booking.total)}</p>
                        </div>
                    </div>

                    {booking.phone && (
                        <div className="flex items-center space-x-3">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium text-foreground">Teléfono</p>
                                <p className="text-sm text-muted-foreground">{booking.phone}</p>
                            </div>
                        </div>
                    )}
                </div>

                {booking.service && (
                    <div className="mt-4 border-t border-border pt-4">
                        <div className="flex items-center space-x-3">
                            <div>
                                <p className="text-sm font-medium text-foreground">Servicio</p>
                                <p className="text-sm text-muted-foreground">{booking.service.name}</p>
                            </div>
                        </div>
                    </div>
                )}

                {booking.notes && (
                    <div className="mt-4 border-t border-border pt-4">
                        <p className="mb-2 text-sm font-medium text-foreground">Notas</p>
                        <p className="text-sm text-muted-foreground">{booking.notes}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
