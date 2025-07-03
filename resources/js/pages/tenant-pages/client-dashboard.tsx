import { RecentBookings } from '@/components/dashboard/tenants/recent-bookings';
import { StatsCard } from '@/components/dashboard/tenants/stats-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingResource } from '@/interfaces/booking';
import { UserResource } from '@/interfaces/user';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, Star, User } from 'lucide-react';

interface ClientDashboardProps {
    client: UserResource;
    bookings: BookingResource[];
    stats: {
        totalBookings: number;
        upcomingBookings: number;
        favoriteServices: string[];
        totalSpent: number;
    };
}

export default function ClientDashboard({ client, bookings, stats }: ClientDashboardProps) {
    const upcomingBookings = bookings.filter((booking) => new Date(booking.date) >= new Date() && booking.status === 'confirmed').slice(0, 3) || [];

    const nextBooking = upcomingBookings[0];

    console.log(stats, bookings, client);

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: route('dashboard') }]}>
            <Head title="Dashboard" />
            <div className="p-4">
                {/* Welcome Section */}
                <div className="rounded-lg bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
                    <h1 className="mb-2 font-outfit text-2xl font-bold">Hola, {client.name}</h1>
                    <p className="text-green-100">Gestiona tus reservas y descubre nuevos servicios</p>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Button className="flex h-20 flex-col items-center justify-center space-y-2">
                        <Calendar className="h-6 w-6" />
                        <span>Nueva Reserva</span>
                    </Button>
                    <Button variant="outline" className="flex h-20 flex-col items-center justify-center space-y-2">
                        <Clock className="h-6 w-6" />
                        <span>Mis Citas</span>
                    </Button>
                    <Button variant="outline" className="flex h-20 flex-col items-center justify-center space-y-2">
                        <Star className="h-6 w-6" />
                        <span>Favoritos</span>
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard title="Total de Reservas" value={stats.totalBookings} icon={Calendar} description="Todas las reservas" />
                    <StatsCard title="Próximas Citas" value={stats.upcomingBookings} icon={Clock} description="Reservas confirmadas" />
                    <StatsCard title="Servicios Favoritos" value={stats.favoriteServices.length} icon={Star} description="Servicios más usados" />
                    <StatsCard title="Total Gastado" value={`$${stats.totalSpent.toLocaleString()}`} icon={User} description="Este año" />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Next Appointment */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Próxima Cita</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {nextBooking ? (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                                        <div className="flex-shrink-0">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                                <Calendar className="h-6 w-6 text-blue-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{nextBooking.service.name}</h3>
                                            <p className="mb-1 text-sm text-muted-foreground">con {nextBooking.professional.user.name}</p>
                                            <p className="text-sm font-medium">
                                                {format(new Date(nextBooking.date), "EEEE, d 'de' MMMM", { locale: es })}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {nextBooking.time} • {nextBooking.service.duration} minutos
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="default">Confirmada</Badge>
                                            <p className="mt-2 text-lg font-bold">${nextBooking.total}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button size="sm" variant="outline" className="flex-1">
                                            Reagendar
                                        </Button>
                                        <Button size="sm" variant="destructive" className="flex-1">
                                            Cancelar
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                    <p className="text-muted-foreground">No tienes citas programadas</p>
                                    <Button className="mt-4">Hacer una Reserva</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Favorite Services */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Servicios Favoritos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {stats.favoriteServices.map((service, index) => (
                                    <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                                <Star className="h-4 w-4 text-green-600" />
                                            </div>
                                            <span className="font-medium">{service}</span>
                                        </div>
                                        <Button size="sm" variant="outline">
                                            Reservar
                                        </Button>
                                    </div>
                                ))}
                                {stats.favoriteServices.length === 0 && (
                                    <p className="py-4 text-center text-muted-foreground">Aún no tienes servicios favoritos</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Bookings */}
                <RecentBookings bookings={bookings} userType="client" />
            </div>
        </AppLayout>
    );
}
