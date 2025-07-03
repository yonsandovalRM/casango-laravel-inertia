import { RecentBookings } from '@/components/dashboard/tenants/recent-bookings';
import { StatsCard } from '@/components/dashboard/tenants/stats-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookingResource } from '@/interfaces/booking';
import { ProfessionalResource } from '@/interfaces/professional';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Calendar, ChevronRight, Clock, User } from 'lucide-react';

interface ProfessionalDashboardProps {
    professional: ProfessionalResource;
    bookings: BookingResource[];
    stats: {
        totalBookings: number;
        todayBookings: number;
        monthlyRevenue: number;
        completionRate: number;
    };
}

export default function ProfessionalDashboard({ professional, bookings, stats }: ProfessionalDashboardProps) {
    const todayBookings = bookings.filter((booking) => new Date(booking.date).toDateString() === new Date().toDateString());

    const upcomingBookings = bookings.filter((booking) => new Date(booking.date) >= new Date() && booking.status === 'confirmed').slice(0, 3);

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: route('dashboard') }]}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-4 p-4">
                {/* Welcome Section */}
                <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <h1 className="mb-2 font-outfit text-2xl font-bold">Bienvenido, {professional.user.name}</h1>
                    <p className="text-blue-100">
                        {professional.title} • {professional.specialty}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard title="Reservas del Mes" value={stats.totalBookings} icon={Calendar} trend={{ value: 12, isPositive: true }} />
                    <StatsCard title="Citas de Hoy" value={stats.todayBookings} icon={Clock} description="Reservas programadas" />
                    <StatsCard
                        title="Ingresos del Mes"
                        value={`$${stats.monthlyRevenue.toLocaleString()}`}
                        icon={User}
                        trend={{ value: 8, isPositive: true }}
                    />
                    <StatsCard title="Tasa de Finalización" value={`${stats.completionRate}%`} icon={ChevronRight} description="Citas completadas" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
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
                                <p className="py-8 text-center text-muted-foreground">No tienes citas programadas para hoy</p>
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

                {/* Recent Bookings */}
                <RecentBookings bookings={bookings} userType="professional" />
            </div>
        </AppLayout>
    );
}
