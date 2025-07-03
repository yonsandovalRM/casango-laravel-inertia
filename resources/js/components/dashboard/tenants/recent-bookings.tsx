import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingResource } from '@/interfaces/booking';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface RecentBookingsProps {
    bookings: BookingResource[];
    userType: 'professional' | 'client';
}

export const RecentBookings = ({ bookings, userType }: RecentBookingsProps) => {
    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'cancelled':
                return 'destructive';
            case 'completed':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    const getStatusText = (status: string) => {
        const statusMap: { [key: string]: string } = {
            pending: 'Pendiente',
            confirmed: 'Confirmada',
            cancelled: 'Cancelada',
            completed: 'Completada',
            no_show: 'No asistió',
        };
        return statusMap[status] || status;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reservas Recientes</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex items-center space-x-4">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={userType === 'professional' ? booking.client.avatar : booking.professional.photo} alt="Avatar" />
                                <AvatarFallback>
                                    {userType === 'professional'
                                        ? booking.client.name.slice(0, 2).toUpperCase()
                                        : booking.professional.user.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm leading-none font-medium">
                                    {userType === 'professional' ? booking.client.name : booking.professional.user.name}
                                </p>
                                <p className="text-sm text-muted-foreground">{booking.service.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {format(new Date(booking.date), "d 'de' MMMM, yyyy", { locale: es })} - {booking.time}
                                </p>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                                <Badge variant={getStatusBadgeVariant(booking.status)}>{getStatusText(booking.status)}</Badge>
                                <span className="text-sm font-medium">${formatCurrency(booking.total)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
