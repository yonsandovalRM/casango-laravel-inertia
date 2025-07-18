import { RevenueAreaChart, ServiceStatsBarChart, StatusPieChart } from '@/components/dashboard/tenants/dashboard-charts';
import { EnhancedStatsCard, StatsGrid } from '@/components/dashboard/tenants/enhanced-stats-card';
import { RecentBookings } from '@/components/dashboard/tenants/recent-bookings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingResource } from '@/interfaces/booking';
import { UserResource } from '@/interfaces/user';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    Award,
    BarChart3,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Eye,
    Star,
    Target,
    TrendingUp,
    UserCheck,
    Users,
} from 'lucide-react';

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
    chartData?: Array<{
        month: string;
        revenue: number;
        bookings: number;
        newClients: number;
    }>;
    performanceMetrics?: {
        customerRetention: number;
        averageSessionTime: number;
        bookingConversion: number;
        professionalUtilization: number;
    };
}

export default function CompleteOwnerDashboard({
    owner,
    stats,
    recentBookings,
    topServices,
    topProfessionals,
    chartData = [],
    performanceMetrics = {
        customerRetention: 78,
        averageSessionTime: 45,
        bookingConversion: 85,
        professionalUtilization: 82,
    },
}: OwnerDashboardProps) {
    // Datos para el gráfico de área
    const defaultChartData =
        chartData.length > 0
            ? chartData
            : [
                  { month: 'Ene', revenue: 4200, bookings: 24, newClients: 8 },
                  { month: 'Feb', revenue: 3800, bookings: 22, newClients: 12 },
                  { month: 'Mar', revenue: 5100, bookings: 29, newClients: 15 },
                  { month: 'Abr', revenue: 4600, bookings: 26, newClients: 10 },
                  { month: 'May', revenue: 5800, bookings: 32, newClients: 18 },
                  { month: 'Jun', revenue: stats.monthlyRevenue, bookings: stats.monthlyBookings, newClients: 14 },
              ];

    // Datos para el gráfico de servicios
    const serviceChartData = topServices.map((service) => ({
        name: service.name,
        bookings: service.bookings_count,
        revenue: service.bookings_count * stats.avgBookingValue,
    }));

    // Datos para el gráfico de estados
    const statusData = [
        { name: 'Completadas', value: Math.round(stats.totalBookings * (stats.completionRate / 100)), color: '#10B981' },
        { name: 'Pendientes', value: Math.round(stats.totalBookings * 0.15), color: '#F59E0B' },
        { name: 'Canceladas', value: Math.round(stats.totalBookings * 0.08), color: '#EF4444' },
        { name: 'En Proceso', value: Math.round(stats.totalBookings * 0.05), color: '#3B82F6' },
    ];

    const getStatusBadge = (status: string) => {
        const variants = {
            completed: 'default',
            confirmed: 'secondary',
            cancelled: 'destructive',
            pending: 'outline',
        } as const;

        const labels = {
            completed: 'Completada',
            confirmed: 'Confirmada',
            cancelled: 'Cancelada',
            pending: 'Pendiente',
        };

        type StatusKey = keyof typeof variants;

        const isStatusKey = (key: string): key is StatusKey => key in variants;

        return <Badge variant={isStatusKey(status) ? variants[status] : 'outline'}>{isStatusKey(status) ? labels[status] : status}</Badge>;
    };

    // Alertas del negocio
    const businessAlerts = [
        {
            type: 'success',
            icon: <CheckCircle className="h-4 w-4" />,
            message: `Excelente mes! ${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth}% de crecimiento`,
            action: 'Ver detalles',
        },
        {
            type: 'warning',
            icon: <AlertCircle className="h-4 w-4" />,
            message: 'Horario de 2-4 PM tiene baja ocupación',
            action: 'Optimizar',
        },
        {
            type: 'info',
            icon: <Target className="h-4 w-4" />,
            message: 'Meta mensual alcanzada al 85%',
            action: 'Revisar',
        },
    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: route('dashboard') }]}>
            <Head title="Dashboard - Owner" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header ejecutivo */}
                <div className="pattern rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="flex items-center gap-2 font-outfit text-2xl font-bold text-foreground">¡Bienvenido, {owner.name}!</h1>
                            <p className="mt-2 text-muted-foreground">
                                Tu negocio ha generado <span className="font-bold">${formatCurrency(stats.totalRevenue)}</span> en total con una tasa
                                de éxito del <span className="font-bold">{stats.completionRate}%</span>
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-background backdrop-blur-sm">
                                <TrendingUp className="h-8 w-8 text-foreground" />
                            </div>
                            <div className="mt-2 text-sm">
                                <div className="font-bold">
                                    {stats.revenueGrowth >= 0 ? '+' : ''}
                                    {stats.revenueGrowth}%
                                </div>
                                <div className="text-muted-foreground">Crecimiento</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alertas importantes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-orange-500" />
                            Estado del Negocio
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 md:grid-cols-3">
                            {businessAlerts.map((alert, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between rounded-lg border p-3 ${
                                        alert.type === 'success'
                                            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900'
                                            : alert.type === 'warning'
                                              ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900'
                                              : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`${
                                                alert.type === 'success'
                                                    ? 'text-green-600'
                                                    : alert.type === 'warning'
                                                      ? 'text-yellow-600'
                                                      : 'text-blue-600'
                                            }`}
                                        >
                                            {alert.icon}
                                        </div>
                                        <span className="text-sm font-medium">{alert.message}</span>
                                    </div>
                                    <Button size="sm" variant="outline">
                                        {alert.action}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Estadísticas principales */}
                <StatsGrid columns={4}>
                    <EnhancedStatsCard
                        title="Reservas del Mes"
                        value={stats.monthlyBookings}
                        icon={Calendar}
                        trend={{
                            value: stats.bookingsGrowth,
                            isPositive: stats.bookingsGrowth >= 0,
                            label: 'vs mes anterior',
                        }}
                        gradient
                    />

                    <EnhancedStatsCard
                        title="Ingresos del Mes"
                        value={stats.monthlyRevenue}
                        icon={DollarSign}
                        trend={{
                            value: stats.revenueGrowth,
                            isPositive: stats.revenueGrowth >= 0,
                            label: 'vs mes anterior',
                        }}
                        isRevenue
                        gradient
                    />

                    <EnhancedStatsCard
                        title="Total Clientes"
                        value={stats.totalClients}
                        icon={Users}
                        description="clientes registrados"
                        iconColor="text-purple-600"
                    />

                    <EnhancedStatsCard
                        title="Profesionales"
                        value={stats.totalProfessionals}
                        icon={UserCheck}
                        description="en tu equipo"
                        iconColor="text-green-600"
                    />
                </StatsGrid>

                {/* Tabs para diferentes vistas */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Resumen General</TabsTrigger>
                        <TabsTrigger value="performance">Rendimiento</TabsTrigger>
                        <TabsTrigger value="team">Equipo</TabsTrigger>
                        <TabsTrigger value="analytics">Análisis</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        {/* Métricas secundarias */}
                        <div className="grid gap-6 md:grid-cols-3">
                            <EnhancedStatsCard
                                title="Valor Promedio"
                                value={stats.avgBookingValue}
                                icon={TrendingUp}
                                description="por reserva"
                                isRevenue
                                iconColor="text-blue-600"
                            />

                            <EnhancedStatsCard
                                title="Tasa de Finalización"
                                value={`${stats.completionRate}%`}
                                icon={Award}
                                description="servicios completados"
                                iconColor="text-yellow-600"
                            />

                            <EnhancedStatsCard
                                title="Total Reservas"
                                value={stats.totalBookings}
                                icon={Target}
                                description="desde el inicio"
                                iconColor="text-indigo-600"
                            />
                        </div>

                        {/* Gráficos principales */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            <RevenueAreaChart data={defaultChartData} title="Evolución del Negocio" description="Últimos 6 meses" />

                            <StatusPieChart data={statusData} title="Estado de Reservas" total={stats.totalBookings} />
                        </div>

                        {/* Servicios más populares con gráfico */}
                        {topServices.length > 0 && <ServiceStatsBarChart data={serviceChartData} title="Servicios Más Demandados" />}
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-6">
                        {/* KPIs de rendimiento */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-blue-500" />
                                    Indicadores de Rendimiento
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                    <div className="text-center">
                                        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                            <Activity className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <div className="text-2xl font-bold">{stats.completionRate}%</div>
                                        <div className="text-sm text-muted-foreground">Tasa de Finalización</div>
                                        <Progress value={stats.completionRate} className="mt-2 h-2" />
                                    </div>

                                    <div className="text-center">
                                        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                            <Users className="h-8 w-8 text-green-600" />
                                        </div>
                                        <div className="text-2xl font-bold">{performanceMetrics.customerRetention}%</div>
                                        <div className="text-sm text-muted-foreground">Retención Clientes</div>
                                        <Progress value={performanceMetrics.customerRetention} className="mt-2 h-2" />
                                    </div>

                                    <div className="text-center">
                                        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                                            <Clock className="h-8 w-8 text-purple-600" />
                                        </div>
                                        <div className="text-2xl font-bold">{performanceMetrics.averageSessionTime}min</div>
                                        <div className="text-sm text-muted-foreground">Tiempo Promedio</div>
                                        <Progress value={(performanceMetrics.averageSessionTime / 60) * 100} className="mt-2 h-2" />
                                    </div>

                                    <div className="text-center">
                                        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                                            <Target className="h-8 w-8 text-orange-600" />
                                        </div>
                                        <div className="text-2xl font-bold">{performanceMetrics.bookingConversion}%</div>
                                        <div className="text-sm text-muted-foreground">Conversión</div>
                                        <Progress value={performanceMetrics.bookingConversion} className="mt-2 h-2" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Comparación con objetivos */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Objetivos vs Resultados</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Ingresos Mensuales</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-muted-foreground">${formatCurrency(stats.monthlyRevenue)} / $50,000</span>
                                            <Progress value={(stats.monthlyRevenue / 50000) * 100} className="h-2 w-32" />
                                            <span className="text-sm font-medium">{Math.round((stats.monthlyRevenue / 50000) * 100)}%</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Nuevos Clientes</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-muted-foreground">25 / 30</span>
                                            <Progress value={(25 / 30) * 100} className="h-2 w-32" />
                                            <span className="text-sm font-medium">83%</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Satisfacción Cliente</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-muted-foreground">4.7 / 5.0</span>
                                            <Progress value={94} className="h-2 w-32" />
                                            <span className="text-sm font-medium">94%</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="team" className="space-y-6">
                        {/* Top Professionals */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-green-500" />
                                    Mejores Profesionales
                                </CardTitle>
                                <Button variant="outline" size="sm">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver Todos
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {topProfessionals.length > 0 ? (
                                    <div className="space-y-4">
                                        {topProfessionals.map((professional, index) => (
                                            <div
                                                key={professional.id}
                                                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-sm font-bold text-white">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{professional.user.name}</p>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Calendar className="h-3 w-3" />
                                                            {professional.bookings_count} servicios
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-green-600">
                                                        ${formatCurrency(professional.bookings_sum_total || 0)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">ingresos generados</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-muted-foreground">
                                        <Award className="mx-auto mb-4 h-12 w-12" />
                                        <p>No hay datos suficientes este mes</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Utilización del equipo */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Utilización del Equipo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Utilización General</span>
                                            <span className="text-sm text-muted-foreground">{performanceMetrics.professionalUtilization}%</span>
                                        </div>
                                        <Progress value={performanceMetrics.professionalUtilization} className="h-2" />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Disponibilidad</span>
                                            <span className="text-sm text-muted-foreground">78%</span>
                                        </div>
                                        <Progress value={78} className="h-2" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-6">
                        {/* Análisis detallado */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Top Services */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Star className="h-5 w-5 text-yellow-500" />
                                        Análisis de Servicios
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {topServices.length > 0 ? (
                                        <div className="space-y-4">
                                            {topServices.map((service, index) => {
                                                const percentage = stats.totalBookings > 0 ? (service.bookings_count / stats.totalBookings) * 100 : 0;

                                                return (
                                                    <div key={service.id} className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-sm font-bold text-white">
                                                                    {index + 1}
                                                                </div>
                                                                <span className="font-medium">{service.name}</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <Badge variant="secondary">{service.bookings_count} reservas</Badge>
                                                                <p className="mt-1 text-xs text-muted-foreground">
                                                                    {percentage.toFixed(1)}% del total
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Progress value={percentage} className="h-2" />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center text-muted-foreground">No hay datos suficientes este mes</div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Insights del negocio */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Insights del Negocio</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="rounded-lg bg-green-50 p-4">
                                            <h4 className="font-semibold text-green-800">Fortalezas</h4>
                                            <ul className="mt-2 text-sm text-green-700">
                                                <li>• Alta tasa de finalización ({stats.completionRate}%)</li>
                                                <li>• Crecimiento sostenido en reservas</li>
                                                <li>• Buen promedio por servicio</li>
                                            </ul>
                                        </div>

                                        <div className="rounded-lg bg-yellow-50 p-4">
                                            <h4 className="font-semibold text-yellow-800">Oportunidades</h4>
                                            <ul className="mt-2 text-sm text-yellow-700">
                                                <li>• Optimizar horarios menos ocupados</li>
                                                <li>• Aumentar frecuencia de clientes</li>
                                                <li>• Expandir servicios populares</li>
                                            </ul>
                                        </div>

                                        <div className="rounded-lg bg-blue-50 p-4">
                                            <h4 className="font-semibold text-blue-800">Recomendaciones</h4>
                                            <ul className="mt-2 text-sm text-blue-700">
                                                <li>• Implementar programa de fidelización</li>
                                                <li>• Promociones en horarios valle</li>
                                                <li>• Capacitación continua del equipo</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Historial de reservas */}
                <RecentBookings
                    bookings={recentBookings}
                    userType="owner"
                    title="Actividad Reciente"
                    limit={8}
                    showActions={false}
                    showFilters={true}
                />

                {/* Panel de acciones rápidas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Acciones Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Button className="h-20 flex-col gap-2" variant="outline">
                                <Calendar className="h-6 w-6" />
                                Nueva Reserva
                            </Button>
                            <Button className="h-20 flex-col gap-2" variant="outline">
                                <Users className="h-6 w-6" />
                                Gestionar Clientes
                            </Button>
                            <Button className="h-20 flex-col gap-2" variant="outline">
                                <Star className="h-6 w-6" />
                                Configurar Servicios
                            </Button>
                            <Button className="h-20 flex-col gap-2" variant="outline">
                                <BarChart3 className="h-6 w-6" />
                                Ver Reportes
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
