import { RevenueAreaChart, ServiceStatsBarChart, StatusPieChart } from '@/components/dashboard/tenants/dashboard-charts';
import { EnhancedStatsCard, StatsGrid } from '@/components/dashboard/tenants/enhanced-stats-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserResource } from '@/interfaces/user';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    Award,
    BarChart3,
    Bell,
    Calendar,
    CheckCircle,
    Clock,
    Database,
    DollarSign,
    Download,
    Settings,
    Shield,
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

interface Professional {
    id: string;
    user: {
        name: string;
    };
    bookings_count: number;
    bookings_sum_total: number;
}

interface AdminDashboardProps {
    admin: UserResource;
    stats: {
        totalBookings: number;
        totalRevenue: number;
        totalProfessionals: number;
        totalClients: number;
        totalServices: number;
        monthlyStats: {
            bookings: number;
            revenue: number;
            newClients: number;
        };
        completionRate: number;
        cancellationRate: number;
        avgBookingValue: number;
    };
    popularServices: Service[];
    professionalPerformance: Professional[];
    busyHours: Array<{
        hour: string;
        bookings: number;
    }>;
    trends: {
        bookingTrend: number;
        predictedGrowth: number;
        seasonality: Array<{
            month: string;
            factor: number;
        }>;
    };
    chartData: {
        monthly: Array<{
            month: string;
            revenue: number;
            bookings: number;
            newClients: number;
        }>;
        hourly: Array<{
            hour: string;
            bookings: number;
        }>;
        services: Array<{
            name: string;
            bookings: number;
        }>;
    };
}

export default function EnhancedAdminDashboard({
    admin,
    stats,
    popularServices,
    professionalPerformance,
    busyHours,
    trends,
    chartData,
}: AdminDashboardProps) {
    // Datos para gráfico de distribución de servicios
    const serviceChartData = popularServices.slice(0, 5).map((service) => ({
        name: service.name,
        bookings: service.bookings_count,
        revenue: service.bookings_count * stats.avgBookingValue,
    }));

    // Datos para gráfico de estado del negocio
    const businessHealthData = [
        { name: 'Completadas', value: Math.round(stats.totalBookings * (stats.completionRate / 100)), color: '#10B981' },
        { name: 'Canceladas', value: Math.round(stats.totalBookings * (stats.cancellationRate / 100)), color: '#EF4444' },
        { name: 'En Proceso', value: Math.round(stats.totalBookings * 0.1), color: '#3B82F6' },
    ];

    // Alertas y notificaciones
    const alerts = [
        { type: 'warning', message: 'Tasa de cancelación superior al promedio (8%)', action: 'Revisar' },
        { type: 'info', message: '3 profesionales sin citas esta semana', action: 'Gestionar' },
        { type: 'success', message: 'Nuevo récord de ingresos mensuales', action: 'Ver detalles' },
    ];

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'warning':
                return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
            case 'success':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            default:
                return <Bell className="h-4 w-4 text-blue-600" />;
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard Administrativo', href: route('dashboard') }]}>
            <Head title="Dashboard Administrativo" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header administrativo */}
                <div className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="flex items-center gap-2 text-2xl font-bold">
                                <Shield className="h-8 w-8" />
                                Panel Administrativo
                            </h1>
                            <p className="mt-2 text-purple-100">
                                Gestión completa del negocio • <span className="font-bold">{stats.totalBookings}</span> reservas totales •{' '}
                                <span className="font-bold">${formatCurrency(stats.totalRevenue)}</span> en ingresos
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                <BarChart3 className="h-8 w-8 text-white" />
                            </div>
                            <div className="mt-2 text-sm">
                                <div className="font-bold">{stats.completionRate}%</div>
                                <div className="text-purple-200">Eficiencia</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alertas importantes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-orange-500" />
                            Alertas y Notificaciones
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {alerts.map((alert, index) => (
                                <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="flex items-center gap-3">
                                        {getAlertIcon(alert.type)}
                                        <span className="text-sm">{alert.message}</span>
                                    </div>
                                    <Button size="sm" variant="outline">
                                        {alert.action}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Stats principales */}
                <StatsGrid columns={4}>
                    <EnhancedStatsCard
                        title="Total Reservas"
                        value={stats.totalBookings}
                        icon={Calendar}
                        description="Todas las reservas"
                        gradient
                        iconColor="text-blue-600"
                    />

                    <EnhancedStatsCard
                        title="Ingresos Totales"
                        value={stats.totalRevenue}
                        icon={DollarSign}
                        description="Todos los ingresos"
                        isRevenue
                        gradient
                        iconColor="text-green-600"
                    />

                    <EnhancedStatsCard
                        title="Profesionales"
                        value={stats.totalProfessionals}
                        icon={UserCheck}
                        description="En el equipo"
                        iconColor="text-purple-600"
                    />

                    <EnhancedStatsCard
                        title="Clientes"
                        value={stats.totalClients}
                        icon={Users}
                        description="Base de clientes"
                        iconColor="text-orange-600"
                    />
                </StatsGrid>

                {/* Métricas del mes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                            Métricas del Mes Actual
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="text-center">
                                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                    <Calendar className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="text-3xl font-bold text-blue-600">{stats.monthlyStats.bookings}</div>
                                <div className="text-sm text-muted-foreground">Reservas del Mes</div>
                                <Badge variant="secondary" className="mt-2">
                                    {trends.bookingTrend >= 0 ? '+' : ''}
                                    {trends.bookingTrend}% vs mes anterior
                                </Badge>
                            </div>

                            <div className="text-center">
                                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <DollarSign className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="text-3xl font-bold text-green-600">${formatCurrency(stats.monthlyStats.revenue)}</div>
                                <div className="text-sm text-muted-foreground">Ingresos del Mes</div>
                                <Badge variant="secondary" className="mt-2">
                                    Proyección: +{trends.predictedGrowth}%
                                </Badge>
                            </div>

                            <div className="text-center">
                                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                                    <Users className="h-8 w-8 text-purple-600" />
                                </div>
                                <div className="text-3xl font-bold text-purple-600">{stats.monthlyStats.newClients}</div>
                                <div className="text-sm text-muted-foreground">Nuevos Clientes</div>
                                <Badge variant="secondary" className="mt-2">
                                    Adquisición activa
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs para diferentes vistas */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Resumen</TabsTrigger>
                        <TabsTrigger value="performance">Rendimiento</TabsTrigger>
                        <TabsTrigger value="analytics">Análisis</TabsTrigger>
                        <TabsTrigger value="reports">Reportes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Gráfico de ingresos */}
                            <RevenueAreaChart data={chartData.monthly} title="Evolución del Negocio" description="Últimos 12 meses" />

                            {/* Estado del negocio */}
                            <StatusPieChart data={businessHealthData} title="Estado General del Negocio" total={stats.totalBookings} />
                        </div>

                        {/* Servicios populares */}
                        <ServiceStatsBarChart data={serviceChartData} title="Top 5 Servicios Más Demandados" />
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-6">
                        {/* KPIs de rendimiento */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5 text-blue-500" />
                                    Indicadores Clave de Rendimiento (KPIs)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Tasa de Finalización</span>
                                            <span className="text-sm text-muted-foreground">{stats.completionRate}%</span>
                                        </div>
                                        <Progress value={stats.completionRate} className="h-2" />
                                        <p className="text-xs text-muted-foreground">Objetivo: 90%</p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Satisfacción Cliente</span>
                                            <span className="text-sm text-muted-foreground">94%</span>
                                        </div>
                                        <Progress value={94} className="h-2" />
                                        <p className="text-xs text-muted-foreground">Objetivo: 95%</p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Utilización Personal</span>
                                            <span className="text-sm text-muted-foreground">78%</span>
                                        </div>
                                        <Progress value={78} className="h-2" />
                                        <p className="text-xs text-muted-foreground">Objetivo: 80%</p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Retención Clientes</span>
                                            <span className="text-sm text-muted-foreground">85%</span>
                                        </div>
                                        <Progress value={85} className="h-2" />
                                        <p className="text-xs text-muted-foreground">Objetivo: 90%</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top profesionales */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-yellow-500" />
                                    Rendimiento de Profesionales
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {professionalPerformance.slice(0, 10).map((professional, index) => (
                                        <div key={professional.id} className="flex items-center justify-between rounded-lg border p-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${
                                                        index === 0
                                                            ? 'bg-yellow-500'
                                                            : index === 1
                                                              ? 'bg-gray-400'
                                                              : index === 2
                                                                ? 'bg-orange-600'
                                                                : 'bg-blue-500'
                                                    }`}
                                                >
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{professional.user.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {professional.bookings_count} servicios completados
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">${formatCurrency(professional.bookings_sum_total || 0)}</p>
                                                <p className="text-sm text-muted-foreground">ingresos generados</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-6">
                        {/* Análisis de horarios pico */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-purple-500" />
                                    Análisis de Horarios Pico
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-6">
                                    {busyHours.map((hourData, index) => (
                                        <div key={index} className="text-center">
                                            <div className="text-sm font-medium">{hourData.hour}</div>
                                            <div className="relative mt-1 h-20 overflow-hidden rounded bg-gray-100">
                                                <div
                                                    className="absolute bottom-0 w-full bg-blue-500 transition-all duration-300"
                                                    style={{
                                                        height: `${Math.max((hourData.bookings / Math.max(...busyHours.map((h) => h.bookings))) * 100, 5)}%`,
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-1 text-xs text-muted-foreground">{hourData.bookings}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Análisis de estacionalidad */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-green-500" />
                                    Análisis de Estacionalidad
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 md:grid-cols-6">
                                    {trends.seasonality.map((month, index) => (
                                        <div key={index} className="rounded-lg border p-3 text-center">
                                            <div className="font-medium">{month.month}</div>
                                            <div className="mt-1 text-2xl font-bold">{(month.factor * 100).toFixed(0)}%</div>
                                            <div className="text-xs text-muted-foreground">factor estacional</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="reports" className="space-y-6">
                        {/* Generación de reportes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="h-5 w-5 text-blue-500" />
                                    Generación de Reportes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <Button className="h-20 flex-col gap-2" variant="outline">
                                        <Download className="h-6 w-6" />
                                        Reporte Financiero
                                    </Button>
                                    <Button className="h-20 flex-col gap-2" variant="outline">
                                        <Users className="h-6 w-6" />
                                        Reporte de Clientes
                                    </Button>
                                    <Button className="h-20 flex-col gap-2" variant="outline">
                                        <UserCheck className="h-6 w-6" />
                                        Reporte de Personal
                                    </Button>
                                    <Button className="h-20 flex-col gap-2" variant="outline">
                                        <Star className="h-6 w-6" />
                                        Reporte de Servicios
                                    </Button>
                                    <Button className="h-20 flex-col gap-2" variant="outline">
                                        <BarChart3 className="h-6 w-6" />
                                        Análisis Completo
                                    </Button>
                                    <Button className="h-20 flex-col gap-2" variant="outline">
                                        <Settings className="h-6 w-6" />
                                        Reporte Personalizado
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Resumen ejecutivo */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Resumen Ejecutivo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="rounded-lg bg-green-50 p-4">
                                        <h4 className="font-semibold text-green-800">Fortalezas</h4>
                                        <ul className="mt-2 text-sm text-green-700">
                                            <li>• Alta tasa de finalización ({stats.completionRate}%)</li>
                                            <li>• Crecimiento sostenido en reservas</li>
                                            <li>• Buena satisfacción del cliente</li>
                                        </ul>
                                    </div>

                                    <div className="rounded-lg bg-yellow-50 p-4">
                                        <h4 className="font-semibold text-yellow-800">Áreas de Mejora</h4>
                                        <ul className="mt-2 text-sm text-yellow-700">
                                            <li>• Reducir tasa de cancelación</li>
                                            <li>• Optimizar utilización de profesionales</li>
                                            <li>• Mejorar conversión de nuevos clientes</li>
                                        </ul>
                                    </div>

                                    <div className="rounded-lg bg-blue-50 p-4">
                                        <h4 className="font-semibold text-blue-800">Recomendaciones</h4>
                                        <ul className="mt-2 text-sm text-blue-700">
                                            <li>• Implementar recordatorios automáticos</li>
                                            <li>• Capacitación adicional para profesionales</li>
                                            <li>• Programa de fidelización mejorado</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
