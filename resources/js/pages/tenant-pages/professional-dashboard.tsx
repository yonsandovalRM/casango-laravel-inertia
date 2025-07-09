import { RecentBookings } from '@/components/dashboard/tenants/recent-bookings';
import { StatsCard } from '@/components/dashboard/tenants/stats-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookingResource } from '@/interfaces/booking';
import { ProfessionalResource } from '@/interfaces/professional';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, ChevronRight, Clock, DollarSign, TrendingUp } from 'lucide-react';

interface ProfessionalDashboardProps {
    professional: ProfessionalResource;
    bookings: BookingResource[];
    stats: {
        totalBookings: number;
        todayBookings: number;
        weekBookings: number;
        monthlyRevenue: number;
        completionRate: number;
        upcomingBookings: number;
        avgBookingValue: number;
        cancelledRate: number;
    };
}

export default function ProfessionalDashboard({ professional, bookings, stats }: ProfessionalDashboardProps) {
    const todayBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.date);
        const today = new Date();
        return bookingDate.toDateString() === today.toDateString();
    });

    const upcomingBookings = bookings
        .filter((booking) => new Date(booking.date) >= new Date() && ['confirmed', 'pending'].includes(booking.status))
        .slice(0, 5);

    // Función para obtener el estado de la badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-green-100 text-green-800">Confirmada</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
            case 'completed':
                return <Badge className="bg-blue-100 text-blue-800">Completada</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: route('dashboard') }]}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard title="Total Reservas" value={stats.totalBookings} icon={Calendar} description="Todas las reservas" />
                    <StatsCard title="Citas de Hoy" value={stats.todayBookings} icon={Clock} description="Reservas programadas hoy" />
                    <StatsCard
                        title="Ingresos del Mes"
                        value={`$${formatCurrency(stats.monthlyRevenue)}`}
                        icon={DollarSign}
                        description="Solo completadas"
                    />
                    <StatsCard title="Tasa de Finalización" value={`${stats.completionRate}%`} icon={TrendingUp} description="Citas completadas" />
                </div>

                {/* Secondary Stats */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Esta Semana</p>
                                    <p className="font-semibold">{stats.weekBookings}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Valor Promedio</p>
                                    <p className="font-semibold">${formatCurrency(stats.avgBookingValue)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                                    <ChevronRight className="h-4 w-4 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Próximas Citas</p>
                                    <p className="font-semibold">{stats.upcomingBookings}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Today's Schedule */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Agenda de Hoy</CardTitle>
                            <Button variant="outline" size="sm">
                                Ver Todo
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {todayBookings.length === 0 ? (
                                <div className="py-8 text-center">
                                    <Clock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                    <p className="text-muted-foreground">No tienes citas programadas para hoy</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {todayBookings.map((booking) => (
                                        <div key={booking.id} className="flex items-center space-x-4 rounded-lg border p-3">
                                            <div className="flex-shrink-0">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                                    <Clock className="h-5 w-5 text-blue-600" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{booking.client.name}</p>
                                                <p className="text-sm text-muted-foreground">{booking.service.name}</p>
                                                <p className="text-sm text-muted-foreground">{booking.time}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">${booking.total}</p>
                                                <p className="text-sm text-muted-foreground">{booking.service.duration}min</p>
                                                {getStatusBadge(booking.status)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Performance Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumen de Rendimiento</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium">Servicios Completados</span>
                                    <span className="text-sm text-muted-foreground">{stats.completionRate}%</span>
                                </div>
                                <Progress value={stats.completionRate} className="h-2" />
                            </div>
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium">Tasa de Cancelación</span>
                                    <span className="text-sm text-muted-foreground">{stats.cancelledRate}%</span>
                                </div>
                                <Progress value={stats.cancelledRate} className="h-2" />
                            </div>
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium">Satisfacción del Cliente</span>
                                    <span className="text-sm text-muted-foreground">95%</span>
                                </div>
                                <Progress value={95} className="h-2" />
                            </div>
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium">Puntualidad</span>
                                    <span className="text-sm text-muted-foreground">92%</span>
                                </div>
                                <Progress value={92} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Upcoming Appointments */}
                <Card>
                    <CardHeader>
                        <CardTitle>Próximas Citas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {upcomingBookings.length === 0 ? (
                            <p className="py-4 text-center text-muted-foreground">No tienes citas próximas programadas</p>
                        ) : (
                            <div className="space-y-3">
                                {upcomingBookings.map((booking) => (
                                    <div key={booking.id} className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                                <Calendar className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{booking.client.name}</p>
                                                <p className="text-sm text-muted-foreground">{booking.service.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {format(new Date(booking.date), "d 'de' MMM", { locale: es })} • {booking.time}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">${booking.total}</p>
                                            {getStatusBadge(booking.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Bookings */}
                <RecentBookings bookings={bookings} userType="professional" />
            </div>
        </AppLayout>
    );
}
