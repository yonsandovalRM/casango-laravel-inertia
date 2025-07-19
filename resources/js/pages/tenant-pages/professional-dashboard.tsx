import { RevenueAreaChart, StatusPieChart } from '@/components/dashboard/tenants/dashboard-charts';
import { EnhancedStatsCard, StatsGrid } from '@/components/dashboard/tenants/enhanced-stats-card';
import { RecentBookings } from '@/components/dashboard/tenants/recent-bookings';
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
import { Activity, Award, Calendar, Clock, Coffee, DollarSign, MessageCircle, Phone, Star, Target, TrendingUp, Users, Zap } from 'lucide-react';

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
        topClient: any;
        clientSatisfaction: number;
    };
    chartData: Array<{
        month: string;
        revenue: number;
        bookings: number;
    }>;
    todaySchedule: BookingResource[];
    weeklyStats: {
        totalBookings: number;
        completedBookings: number;
        revenue: number;
        busyDay: string;
    };
}

export default function EnhancedProfessionalDashboard({
    professional,
    bookings,
    stats,
    chartData,
    todaySchedule,
    weeklyStats,
}: ProfessionalDashboardProps) {
    const getStatusBadge = (status: string) => {
        const variants = {
            completed: { variant: 'default' as const, label: 'Completada', color: 'bg-green-100 text-green-800' },
            confirmed: { variant: 'muted' as const, label: 'Confirmada', color: 'bg-blue-100 text-blue-800' },
            cancelled: { variant: 'destructive' as const, label: 'Cancelada', color: 'bg-red-100 text-red-800' },
            pending: { variant: 'outline' as const, label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
        };

        type StatusKey = keyof typeof variants;
        const config =
            status in variants ? variants[status as StatusKey] : { variant: 'outline' as const, label: status, color: 'bg-gray-100 text-gray-800' };

        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const getPerformanceLevel = (completionRate: number) => {
        if (completionRate >= 95) return { level: 'Excelente', color: 'text-green-600', bgColor: 'bg-green-100' };
        if (completionRate >= 85) return { level: 'Muy Bueno', color: 'text-blue-600', bgColor: 'bg-blue-100' };
        if (completionRate >= 75) return { level: 'Bueno', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
        return { level: 'Mejorable', color: 'text-red-600', bgColor: 'bg-red-100' };
    };

    const performance = getPerformanceLevel(stats.completionRate);

    const pieData = [
        { name: 'Completadas', value: Math.round(stats.totalBookings * (stats.completionRate / 100)), color: '#10B981' },
        { name: 'Canceladas', value: Math.round(stats.totalBookings * (stats.cancelledRate / 100)), color: '#EF4444' },
        { name: 'Pendientes', value: Math.round(stats.totalBookings * 0.1), color: '#F59E0B' },
    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Mi Dashboard', href: route('dashboard') }]}>
            <Head title="Dashboard Profesional" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header personalizado para profesional */}
                <div className="rounded-lg bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">¡Hola, {professional.user.name}! 💼</h1>
                            <p className="mt-2 text-green-100">
                                Has completado <span className="font-bold">{Math.round(stats.totalBookings * (stats.completionRate / 100))}</span>{' '}
                                servicios y generado <span className="font-bold">${formatCurrency(stats.monthlyRevenue)}</span> este mes
                            </p>
                        </div>
                        <div className="text-center">
                            <div className={`inline-flex h-16 w-16 items-center justify-center rounded-full ${performance.bgColor}`}>
                                <Award className={`h-8 w-8 ${performance.color}`} />
                            </div>
                            <div className="mt-2 text-sm">
                                <div className="font-bold">{performance.level}</div>
                                <div className="text-green-200">Rendimiento</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats principales */}
                <StatsGrid columns={4}>
                    <EnhancedStatsCard
                        title="Total Reservas"
                        value={stats.totalBookings}
                        icon={Calendar}
                        description="Servicios realizados"
                        gradient
                        iconColor="text-blue-600"
                    />

                    <EnhancedStatsCard
                        title="Citas de Hoy"
                        value={stats.todayBookings}
                        icon={Clock}
                        description="Agenda del día"
                        iconColor="text-green-600"
                    />

                    <EnhancedStatsCard
                        title="Ingresos del Mes"
                        value={stats.monthlyRevenue}
                        icon={DollarSign}
                        description="Solo completadas"
                        isRevenue
                        gradient
                        iconColor="text-purple-600"
                    />

                    <EnhancedStatsCard
                        title="Tasa de Finalización"
                        value={`${stats.completionRate}%`}
                        icon={TrendingUp}
                        description="Citas completadas"
                        iconColor="text-orange-600"
                    />
                </StatsGrid>

                {/* Métricas de rendimiento */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-blue-500" />
                            Rendimiento Semanal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-4">
                            <div className="text-center">
                                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                    <Calendar className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="text-2xl font-bold">{weeklyStats.totalBookings}</div>
                                <div className="text-sm text-muted-foreground">Reservas esta semana</div>
                            </div>

                            <div className="text-center">
                                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                    <Target className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="text-2xl font-bold">{weeklyStats.completedBookings}</div>
                                <div className="text-sm text-muted-foreground">Completadas</div>
                            </div>

                            <div className="text-center">
                                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                                    <DollarSign className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="text-2xl font-bold">${formatCurrency(weeklyStats.revenue)}</div>
                                <div className="text-sm text-muted-foreground">Ingresos</div>
                            </div>

                            <div className="text-center">
                                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                                    <Zap className="h-6 w-6 text-orange-600" />
                                </div>
                                <div className="text-2xl font-bold">{weeklyStats.busyDay}</div>
                                <div className="text-sm text-muted-foreground">Día más ocupado</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Agenda de hoy */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Coffee className="h-5 w-5 text-orange-500" />
                                Agenda de Hoy
                            </CardTitle>
                            <Badge variant="muted">{todaySchedule.length} citas</Badge>
                        </CardHeader>
                        <CardContent>
                            {todaySchedule.length === 0 ? (
                                <div className="py-8 text-center">
                                    <Clock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                    <p className="text-muted-foreground">No tienes citas programadas para hoy</p>
                                    <p className="mt-1 text-sm text-muted-foreground">¡Disfruta tu día libre! 🎉</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {todaySchedule.map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="flex items-center space-x-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="flex-shrink-0">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-green-500 font-bold text-white">
                                                    {booking.time.substring(0, 2)}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{booking.client.name}</p>
                                                <p className="text-sm text-muted-foreground">{booking.service.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {booking.time} • {booking.service.duration}min
                                                </p>
                                            </div>
                                            <div className="space-y-1 text-right">
                                                {getStatusBadge(booking.status)}
                                                <p className="text-sm font-medium">${formatCurrency(booking.total)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Distribución de citas */}
                    <StatusPieChart data={pieData} title="Distribución de Citas" total={stats.totalBookings} />
                </div>

                {/* Gráfico de ingresos */}
                <RevenueAreaChart data={chartData} title="Evolución de Ingresos" description="Últimos 6 meses" />

                {/* Información del cliente favorito y métricas adicionales */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                Cliente Frecuente
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stats.topClient ? (
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 font-bold text-white">
                                            {stats.topClient.client_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium">{stats.topClient.client_name}</p>
                                            <p className="text-sm text-muted-foreground">{stats.topClient.booking_count} reservas</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="flex-1">
                                            <Phone className="mr-2 h-3 w-3" />
                                            Llamar
                                        </Button>
                                        <Button size="sm" variant="outline" className="flex-1">
                                            <MessageCircle className="mr-2 h-3 w-3" />
                                            Mensaje
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-6 text-center text-muted-foreground">
                                    <Users className="mx-auto mb-2 h-8 w-8" />
                                    <p className="text-sm">Aún no tienes clientes frecuentes</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <DollarSign className="h-8 w-8 text-green-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Valor Promedio</p>
                                    <p className="text-2xl font-bold">${formatCurrency(stats.avgBookingValue)}</p>
                                    <p className="text-xs text-muted-foreground">por servicio</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Award className="h-8 w-8 text-purple-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Satisfacción</p>
                                    <p className="text-2xl font-bold">{stats.clientSatisfaction}%</p>
                                    <p className="text-xs text-muted-foreground">promedio clientes</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Métricas detalladas de rendimiento */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                            Métricas de Rendimiento
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium">Tasa de Finalización</span>
                                    <span className="text-sm text-muted-foreground">{stats.completionRate}%</span>
                                </div>
                                <Progress value={stats.completionRate} className="h-2" />
                            </div>
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium">Satisfacción del Cliente</span>
                                    <span className="text-sm text-muted-foreground">{stats.clientSatisfaction}%</span>
                                </div>
                                <Progress value={stats.clientSatisfaction} className="h-2" />
                            </div>
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium">Puntualidad</span>
                                    <span className="text-sm text-muted-foreground">92%</span>
                                </div>
                                <Progress value={92} className="h-2" />
                            </div>
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium">Tasa de Cancelación</span>
                                    <span className="text-sm text-muted-foreground">{stats.cancelledRate}%</span>
                                </div>
                                <Progress value={stats.cancelledRate} className="h-2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Próximas citas */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-500" />
                            Próximas Citas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.upcomingBookings === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                <Calendar className="mx-auto mb-4 h-12 w-12" />
                                <p>No tienes citas próximas programadas</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {bookings
                                    .filter((booking) => new Date(booking.date) >= new Date() && ['confirmed', 'pending'].includes(booking.status))
                                    .slice(0, 5)
                                    .map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                        >
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
                                                <p className="font-medium">${formatCurrency(booking.total)}</p>
                                                {getStatusBadge(booking.status)}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Historial reciente */}
                <RecentBookings bookings={bookings} userType="professional" />

                {/* Panel de acciones rápidas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Acciones Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Button className="h-20 flex-col gap-2" variant="outline">
                                <Calendar className="h-6 w-6" />
                                Ver Agenda
                            </Button>
                            <Button className="h-20 flex-col gap-2" variant="outline">
                                <Users className="h-6 w-6" />
                                Mis Clientes
                            </Button>
                            <Button className="h-20 flex-col gap-2" variant="outline">
                                <Clock className="h-6 w-6" />
                                Horarios
                            </Button>
                            <Button className="h-20 flex-col gap-2" variant="outline">
                                <TrendingUp className="h-6 w-6" />
                                Reportes
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
