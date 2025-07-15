import { RevenueAreaChart } from '@/components/dashboard/tenants/dashboard-charts';
import { EnhancedStatsCard, StatsGrid } from '@/components/dashboard/tenants/enhanced-stats-card';
import { RecentBookings } from '@/components/dashboard/tenants/recent-bookings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookingResource } from '@/interfaces/booking';
import { UserResource } from '@/interfaces/user';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Award, Calendar, Clock, DollarSign, Gift, Heart, MapPin, Phone, Star, Target, TrendingUp, User } from 'lucide-react';

interface ClientDashboardProps {
    client: UserResource;
    bookings: BookingResource[];
    stats: {
        totalBookings: number;
        upcomingBookings: number;
        favoriteServices: Array<{
            service_name: string;
            count: number;
            total_spent: number;
        }>;
        totalSpent: number;
        monthlySpent: number;
        completedBookings: number;
        cancelledBookings: number;
        satisfactionRate: number;
        avgBookingValue: number;
    };
    chartData: Array<{
        month: string;
        spent: number;
        bookings: number;
    }>;
    upcomingBookings: BookingResource[];
    favoriteServices: Array<{
        service: any;
        count: number;
        total_spent: number;
    }>;
}

export default function EnhancedClientDashboard({ client, bookings, stats, chartData, upcomingBookings, favoriteServices }: ClientDashboardProps) {
    const nextBooking = upcomingBookings[0];

    // Calcular nivel de lealtad
    const getLoyaltyLevel = (totalBookings: number) => {
        if (totalBookings >= 50) return { level: 'Diamante', color: 'bg-purple-500', progress: 100 };
        if (totalBookings >= 25) return { level: 'Oro', color: 'bg-yellow-500', progress: (totalBookings / 50) * 100 };
        if (totalBookings >= 10) return { level: 'Plata', color: 'bg-gray-400', progress: (totalBookings / 25) * 100 };
        return { level: 'Bronce', color: 'bg-orange-500', progress: (totalBookings / 10) * 100 };
    };

    const loyaltyInfo = getLoyaltyLevel(stats.totalBookings);

    const statusKeys = ['completed', 'confirmed', 'cancelled', 'pending'] as const;
    type StatusKey = (typeof statusKeys)[number];

    const getStatusBadge = (status: string) => {
        const variants: Record<StatusKey, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            completed: 'default',
            confirmed: 'secondary',
            cancelled: 'destructive',
            pending: 'outline',
        };

        const labels: Record<StatusKey, string> = {
            completed: 'Completada',
            confirmed: 'Confirmada',
            cancelled: 'Cancelada',
            pending: 'Pendiente',
        };

        if (statusKeys.includes(status as StatusKey)) {
            return <Badge variant={variants[status as StatusKey]}>{labels[status as StatusKey]}</Badge>;
        }
        return <Badge variant="outline">{status}</Badge>;
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Mi Dashboard', href: route('dashboard') }]}>
            <Head title="Mi Dashboard" />

            <div className="space-y-6 p-6">
                {/* Header personalizado */}
                <div className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">¡Hola, {client.name}! 👋</h1>
                            <p className="mt-2 text-indigo-100">
                                Has completado <span className="font-bold">{stats.completedBookings}</span> servicios y gastado{' '}
                                <span className="font-bold">${formatCurrency(stats.totalSpent)}</span> en total
                            </p>
                        </div>
                        <div className="text-center">
                            <div className={`inline-flex h-16 w-16 items-center justify-center rounded-full ${loyaltyInfo.color} text-white`}>
                                <Award className="h-8 w-8" />
                            </div>
                            <div className="mt-2 text-sm">
                                <div className="font-bold">{loyaltyInfo.level}</div>
                                <div className="text-indigo-200">Nivel de lealtad</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats principales */}
                <StatsGrid columns={4}>
                    <EnhancedStatsCard
                        title="Total de Reservas"
                        value={stats.totalBookings}
                        icon={Calendar}
                        description="Servicios reservados"
                        gradient
                        iconColor="text-blue-600"
                    />

                    <EnhancedStatsCard
                        title="Próximas Citas"
                        value={stats.upcomingBookings}
                        icon={Clock}
                        description="Citas confirmadas"
                        iconColor="text-green-600"
                    />

                    <EnhancedStatsCard
                        title="Total Invertido"
                        value={stats.totalSpent}
                        icon={DollarSign}
                        description="En servicios completados"
                        isRevenue
                        gradient
                        iconColor="text-purple-600"
                    />

                    <EnhancedStatsCard
                        title="Gasto Mensual"
                        value={stats.monthlySpent}
                        icon={TrendingUp}
                        description="Este mes"
                        isRevenue
                        iconColor="text-orange-600"
                    />
                </StatsGrid>

                {/* Nivel de lealtad y progreso */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            Programa de Lealtad
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Nivel actual: {loyaltyInfo.level}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {stats.totalBookings} de{' '}
                                        {loyaltyInfo.level === 'Diamante'
                                            ? 50
                                            : loyaltyInfo.level === 'Oro'
                                              ? 50
                                              : loyaltyInfo.level === 'Plata'
                                                ? 25
                                                : 10}{' '}
                                        servicios
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold">{Math.round(loyaltyInfo.progress)}%</p>
                                    <p className="text-sm text-muted-foreground">Completado</p>
                                </div>
                            </div>
                            <Progress value={loyaltyInfo.progress} className="h-3" />
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                <div className="rounded-lg bg-orange-50 p-3 text-center">
                                    <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500">
                                        <span className="text-xs font-bold text-white">B</span>
                                    </div>
                                    <p className="text-xs font-medium">Bronce</p>
                                    <p className="text-xs text-muted-foreground">10 servicios</p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-3 text-center">
                                    <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-400">
                                        <span className="text-xs font-bold text-white">P</span>
                                    </div>
                                    <p className="text-xs font-medium">Plata</p>
                                    <p className="text-xs text-muted-foreground">25 servicios</p>
                                </div>
                                <div className="rounded-lg bg-yellow-50 p-3 text-center">
                                    <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500">
                                        <span className="text-xs font-bold text-white">O</span>
                                    </div>
                                    <p className="text-xs font-medium">Oro</p>
                                    <p className="text-xs text-muted-foreground">50 servicios</p>
                                </div>
                                <div className="rounded-lg bg-purple-50 p-3 text-center">
                                    <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500">
                                        <span className="text-xs font-bold text-white">D</span>
                                    </div>
                                    <p className="text-xs font-medium">Diamante</p>
                                    <p className="text-xs text-muted-foreground">50+ servicios</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Próxima cita */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-blue-500" />
                                Próxima Cita
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {nextBooking ? (
                                <div className="space-y-4">
                                    <div className="rounded-lg border border-border bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-bold">{nextBooking.service.name}</h3>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <User className="h-4 w-4" />
                                                    <span>con {nextBooking.professional.user.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{format(new Date(nextBooking.date), "EEEE, d 'de' MMMM", { locale: es })}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Clock className="h-4 w-4" />
                                                    <span>
                                                        {nextBooking.time} • {nextBooking.service.duration} min
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {getStatusBadge(nextBooking.status)}
                                                <p className="mt-2 text-xl font-bold text-blue-600">${formatCurrency(nextBooking.total)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <MapPin className="mr-2 h-4 w-4" />
                                            Ver Ubicación
                                        </Button>
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Phone className="mr-2 h-4 w-4" />
                                            Contactar
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant="outline" size="sm" className="w-full">
                                            Reagendar
                                        </Button>
                                        <Button variant="destructive" size="sm" className="w-full">
                                            Cancelar
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                    <p className="mb-4 text-muted-foreground">No tienes citas programadas</p>
                                    <Button>
                                        <Gift className="mr-2 h-4 w-4" />
                                        Reservar Ahora
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Servicios favoritos */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                Mis Servicios Favoritos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {favoriteServices.map((favorite, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 font-bold text-white">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium">{favorite.service.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {favorite.count} veces • ${formatCurrency(favorite.total_spent)} total
                                                </p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline">
                                            Reservar
                                        </Button>
                                    </div>
                                ))}
                                {favoriteServices.length === 0 && (
                                    <div className="py-8 text-center text-muted-foreground">
                                        <Star className="mx-auto mb-2 h-8 w-8" />
                                        <p>Aún no tienes servicios favoritos</p>
                                        <p className="text-sm">¡Explora nuestros servicios!</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Gráfico de gastos */}
                <RevenueAreaChart
                    data={chartData.map((item) => ({
                        month: item.month,
                        revenue: item.spent,
                        bookings: item.bookings,
                    }))}
                    title="Mi Historial de Gastos"
                    description="Últimos 6 meses"
                />

                {/* Métricas adicionales */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Target className="h-8 w-8 text-green-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Servicios Completados</p>
                                    <p className="text-2xl font-bold">{stats.completedBookings}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {stats.totalBookings > 0 ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0}% de éxito
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <DollarSign className="h-8 w-8 text-blue-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Gasto Promedio</p>
                                    <p className="text-2xl font-bold">${formatCurrency(stats.avgBookingValue)}</p>
                                    <p className="text-xs text-muted-foreground">por servicio</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Heart className="h-8 w-8 text-red-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Satisfacción</p>
                                    <p className="text-2xl font-bold">{stats.satisfactionRate}%</p>
                                    <p className="text-xs text-muted-foreground">promedio general</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Historial reciente */}
                <RecentBookings bookings={bookings} userType="client" />

                {/* Panel de acciones rápidas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Acciones Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <Button className="h-16 flex-col gap-2" variant="outline">
                                <Calendar className="h-6 w-6" />
                                Nueva Reserva
                            </Button>
                            <Button className="h-16 flex-col gap-2" variant="outline">
                                <Star className="h-6 w-6" />
                                Mis Favoritos
                            </Button>
                            <Button className="h-16 flex-col gap-2" variant="outline">
                                <Gift className="h-6 w-6" />
                                Ofertas Especiales
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
