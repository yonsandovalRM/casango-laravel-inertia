import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingResource } from '@/interfaces/booking';
import { formatCurrency } from '@/lib/utils';
import { Calendar, ChevronRight, Clock, Download, Filter, MapPin, MessageCircle, Phone, Star } from 'lucide-react';
import React from 'react';

interface RecentBookingsProps {
    bookings: BookingResource[];
    userType: 'professional' | 'client' | 'owner' | 'admin';
    title?: string;
    limit?: number;
    showActions?: boolean;
    showFilters?: boolean;
}

export const RecentBookings: React.FC<RecentBookingsProps> = ({
    bookings,
    userType,
    title = 'Reservas Recientes',
    limit = 10,
    showActions = true,
    showFilters = false,
}) => {
    const getStatusBadgeVariant = (status: string) => {
        const variants = {
            confirmed: 'default',
            pending: 'secondary',
            cancelled: 'destructive',
            completed: 'outline',
            no_show: 'destructive',
        } as const;

        return variants[status as keyof typeof variants] || 'secondary';
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

    const getStatusColor = (status: string) => {
        const colors = {
            confirmed: 'bg-green-100 text-green-800 border-green-200',
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
            completed: 'bg-blue-100 text-blue-800 border-blue-200',
            no_show: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getPriorityLevel = (booking: BookingResource) => {
        const now = new Date();
        const bookingDate = new Date(booking.date);
        const hoursDiff = (bookingDate.getTime() - now.getTime()) / (1000 * 3600);

        if (hoursDiff <= 2 && booking.status === 'confirmed') return 'high';
        if (hoursDiff <= 24 && booking.status === 'confirmed') return 'medium';
        if (booking.status === 'pending') return 'medium';
        return 'low';
    };

    const getPriorityIcon = (priority: string) => {
        if (priority === 'high') return '🔴';
        if (priority === 'medium') return '🟡';
        return '🟢';
    };

    const displayedBookings = bookings.slice(0, limit);

    const renderPersonInfo = (booking: BookingResource) => {
        if (userType === 'professional' || userType === 'owner' || userType === 'admin') {
            return {
                name: booking.client.name,
                avatar: booking.client.avatar || '',
                role: 'Cliente',
            };
        } else {
            return {
                name: booking.professional.user.name,
                avatar: booking.professional.photo || '',
                role: 'Profesional',
            };
        }
    };

    const renderActionButtons = (booking: BookingResource) => {
        if (!showActions) return null;

        const commonActions = (
            <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Phone className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <MessageCircle className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <MapPin className="h-3 w-3" />
                </Button>
            </div>
        );

        if (userType === 'professional') {
            return (
                <div className="flex gap-1">
                    {booking.status === 'pending' && (
                        <Button size="sm" variant="outline" className="h-7">
                            Confirmar
                        </Button>
                    )}
                    {booking.status === 'confirmed' && (
                        <Button size="sm" variant="outline" className="h-7">
                            Completar
                        </Button>
                    )}
                    {commonActions}
                </div>
            );
        }

        if (userType === 'client') {
            return (
                <div className="flex gap-1">
                    {(booking.status === 'confirmed' || booking.status === 'pending') && (
                        <>
                            <Button size="sm" variant="outline" className="h-7">
                                Reagendar
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-red-600">
                                Cancelar
                            </Button>
                        </>
                    )}
                    {booking.status === 'completed' && (
                        <Button size="sm" variant="outline" className="h-7">
                            <Star className="mr-1 h-3 w-3" />
                            Calificar
                        </Button>
                    )}
                    {commonActions}
                </div>
            );
        }

        return commonActions;
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    {title}
                    <Badge variant="secondary">{bookings.length}</Badge>
                </CardTitle>
                <div className="flex gap-2">
                    {showFilters && (
                        <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Filtros
                        </Button>
                    )}
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {displayedBookings.length === 0 ? (
                    <div className="py-12 text-center">
                        <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">No hay reservas recientes</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {displayedBookings.map((booking) => {
                            const personInfo = renderPersonInfo(booking);
                            const priority = getPriorityLevel(booking);

                            return (
                                <div
                                    key={booking.id}
                                    className="group flex items-center space-x-4 rounded-lg border p-4 transition-all duration-200 hover:bg-muted/50 hover:shadow-sm"
                                >
                                    {/* Avatar y información personal */}
                                    <div className="flex-shrink-0">
                                        <div className="relative">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={personInfo.avatar} alt={personInfo.name} />
                                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 font-bold text-white">
                                                    {personInfo.name.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            {priority !== 'low' && (
                                                <div className="absolute -top-1 -right-1 text-xs">{getPriorityIcon(priority)}</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Información principal */}
                                    <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <p className="truncate font-medium">{personInfo.name}</p>
                                                <p className="truncate text-sm text-muted-foreground">
                                                    {booking.service.name}
                                                    {userType !== 'client' && <span className="ml-2 text-xs">• {personInfo.role}</span>}
                                                </p>

                                                {/* Fecha y hora */}
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>
                                                            {new Date(booking.date).toLocaleDateString('es-CL', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric',
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{booking.time}</span>
                                                    </div>
                                                    <span>• {booking.service.duration}min</span>
                                                </div>
                                            </div>

                                            {/* Estado y precio */}
                                            <div className="space-y-2 text-right">
                                                <Badge variant={getStatusBadgeVariant(booking.status)} className={getStatusColor(booking.status)}>
                                                    {getStatusText(booking.status)}
                                                </Badge>
                                                <p className="text-lg font-bold text-green-600">${formatCurrency(booking.total)}</p>
                                            </div>
                                        </div>

                                        {/* Información adicional para admin/owner */}
                                        {(userType === 'admin' || userType === 'owner') && (
                                            <div className="flex items-center gap-4 border-t pt-2 text-xs text-muted-foreground">
                                                <span>Cliente: {booking.client.name}</span>
                                                <span>•</span>
                                                <span>Profesional: {booking.professional.user.name}</span>
                                                <span>•</span>
                                                <span>ID: #{booking.id.slice(-6)}</span>
                                            </div>
                                        )}

                                        {/* Acciones */}
                                        <div className="flex items-center justify-between pt-2">
                                            {renderActionButtons(booking)}
                                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Mostrar más */}
                {bookings.length > limit && (
                    <div className="mt-6 text-center">
                        <Button variant="outline">Ver todas las reservas ({bookings.length})</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
