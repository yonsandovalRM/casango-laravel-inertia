import { StatsCard } from '@/components/dashboard/tenants/stats-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookingResource } from '@/interfaces/booking';
import { UserResource } from '@/interfaces/user';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { Award, Calendar, ChevronRight, DollarSign, Star, TrendingUp, UserCheck, Users } from 'lucide-react';

interface Service {
    id: string;
    name: string;
    bookings_count: number;
}

interface TopProfessional {
    id: string;
    user: {
        name: string;
    };
    bookings_count: number;
    bookings_sum_total: number;
}

interface OwnerDashboardProps {
    owner: UserResource;
    stats: {
        totalBookings: number;
        totalRevenue: number;
        totalProfessionals: number;
        totalClients: number;
        monthlyBookings: number;
        monthlyRevenue: number;
        bookingsGrowth: number;
        revenueGrowth: number;
        avgBookingValue: number;
        completionRate: number;
    };
    recentBookings: BookingResource[];
    topServices: Service[];
    topProfessionals: TopProfessional[];
}

export default function OwnerDashboard({ owner, stats, recentBookings, topServices, topProfessionals }: OwnerDashboardProps) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: route('dashboard') }]}>
            <Head title="Dashboard - Owner" />
            <div className="flex flex-col gap-6 p-6">
                {/* Main Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Reservas del Mes"
                        value={stats.monthlyBookings}
                        icon={Calendar}
                        trend={{
                            value: stats.bookingsGrowth,
                            isPositive: stats.bookingsGrowth >= 0,
                        }}
                        description="vs mes anterior"
                    />
                    <StatsCard
                        title="Ingresos del Mes"
                        value={`$${formatCurrency(stats.monthlyRevenue)}`}
                        icon={DollarSign}
                        trend={{
                            value: stats.revenueGrowth,
                            isPositive: stats.revenueGrowth >= 0,
                        }}
                        description="vs mes anterior"
                    />
                    <StatsCard title="Total Clientes" value={stats.totalClients} icon={Users} description="clientes registrados" />
                    <StatsCard title="Profesionales Activos" value={stats.totalProfessionals} icon={UserCheck} description="en tu equipo" />
                </div>

                {/* Secondary Stats */}
                <div className="grid gap-6 md:grid-cols-3">
                    <StatsCard
                        title="Valor Promedio"
                        value={`$${formatCurrency(stats.avgBookingValue)}`}
                        icon={TrendingUp}
                        description="por reserva"
                    />
                    <StatsCard title="Tasa de Finalización" value={`${stats.completionRate}%`} icon={Award} description="servicios completados" />
                    <StatsCard title="Total Reservas" value={stats.totalBookings} icon={Calendar} description="desde el inicio" />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Top Services */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                Servicios Más Populares
                            </CardTitle>
                            <Button variant="outline" size="sm">
                                Ver Todos
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topServices.map((service, index) => (
                                    <div key={service.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-sm font-bold text-white">
                                                {index + 1}
                                            </div>
                                            <span className="font-medium">{service.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">{service.bookings_count} reservas</Badge>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                ))}
                                {topServices.length === 0 && (
                                    <p className="py-4 text-center text-muted-foreground">No hay datos suficientes este mes</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Professionals */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-green-500" />
                                Mejores Profesionales
                            </CardTitle>
                            <Button variant="outline" size="sm">
                                Ver Todos
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topProfessionals.map((professional, index) => (
                                    <div key={professional.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-sm font-bold text-white">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium">{professional.user.name}</p>
                                                <p className="text-sm text-muted-foreground">{professional.bookings_count} reservas</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">${formatCurrency(professional.bookings_sum_total || 0)}</p>
                                            <p className="text-sm text-muted-foreground">ingresos</p>
                                        </div>
                                    </div>
                                ))}
                                {topProfessionals.length === 0 && (
                                    <p className="py-4 text-center text-muted-foreground">No hay datos suficientes este mes</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Business Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-500" />
                            Rendimiento del Negocio
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-sm font-medium">Tasa de Finalización</span>
                                        <span className="text-sm text-muted-foreground">{stats.completionRate}%</span>
                                    </div>
                                    <Progress value={stats.completionRate} className="h-2" />
                                </div>
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-sm font-medium">Ocupación Mensual</span>
                                        <span className="text-sm text-muted-foreground">78%</span>
                                    </div>
                                    <Progress value={78} className="h-2" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-green-800 dark:text-green-200">Ingresos Totales</p>
                                            <p className="text-2xl font-bold text-green-900 dark:text-green-200">
                                                ${formatCurrency(stats.totalRevenue)}
                                            </p>
                                        </div>
                                        <DollarSign className="h-8 w-8 text-green-600" />
                                    </div>
                                </div>
                                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Reservas</p>
                                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                                                {stats.totalBookings.toLocaleString()}
                                            </p>
                                        </div>
                                        <Calendar className="h-8 w-8 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Actividad Reciente</CardTitle>
                        <Button variant="outline" size="sm">
                            Ver Todas las Reservas
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentBookings.slice(0, 8).map((booking) => (
                                <div key={booking.id} className="flex items-center space-x-4 rounded-lg border p-3">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                            <Calendar className="h-5 w-5 text-gray-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium">{booking.client.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {booking.service.name} con {booking.professional.user.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(booking.date).toLocaleDateString()} - {booking.time}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <Badge
                                                    variant={
                                                        booking.status === 'completed'
                                                            ? 'default'
                                                            : booking.status === 'confirmed'
                                                              ? 'secondary'
                                                              : booking.status === 'cancelled'
                                                                ? 'destructive'
                                                                : 'outline'
                                                    }
                                                >
                                                    {booking.status === 'completed'
                                                        ? 'Completada'
                                                        : booking.status === 'confirmed'
                                                          ? 'Confirmada'
                                                          : booking.status === 'cancelled'
                                                            ? 'Cancelada'
                                                            : booking.status === 'pending'
                                                              ? 'Pendiente'
                                                              : booking.status}
                                                </Badge>
                                                <p className="mt-1 text-sm font-medium">${formatCurrency(booking.total)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
