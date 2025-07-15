import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    Activity,
    BarChart3,
    Building2,
    Calendar,
    CreditCard,
    DollarSign,
    PieChart,
    Star,
    Target,
    TrendingDown,
    TrendingUp,
    Users,
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface MainDashboardProps {
    stats: {
        totalTenants: number;
        totalUsers: number;
        totalSubscriptions: number;
        totalRevenue: number;
        monthlyTenants: number;
        monthlyUsers: number;
        monthlySubscriptions: number;
        monthlyRevenue: number;
        tenantsGrowth: number;
        usersGrowth: number;
        subscriptionsGrowth: number;
        revenueGrowth: number;
        conversionRate: number;
        avgRevenuePerTenant: number;
        freePlansCount: number;
        paidPlansCount: number;
        freeSubscriptions: number;
        paidSubscriptions: number;
        activeSubscriptions: number;
        trialSubscriptions: number;
        cancelledSubscriptions: number;
        suspendedSubscriptions: number;
    };
    chartData: Array<{
        month: string;
        tenants: number;
        subscriptions: number;
        revenue: number;
    }>;
    topPlans: Array<{
        id: string;
        name: string;
        subscriptions_count: number;
        is_free: boolean;
        price_monthly: number;
    }>;
    recentTenants: Array<{
        id: string;
        name: string;
        category: string;
        created_at: string;
        plan: {
            name: string;
            is_free: boolean;
        };
    }>;
    tenantsByCategory: Array<{
        category: string;
        count: number;
    }>;
    subscriptionStats: Record<string, number>;
}

const StatsCard = ({
    title,
    value,
    description,
    icon: Icon,
    trend,
    isRevenue = false,
}: {
    title: string;
    value: string | number;
    description?: string;
    icon: any;
    trend?: { value: number; isPositive: boolean };
    isRevenue?: boolean;
}) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{isRevenue ? `$${Number(value).toLocaleString()}` : value}</div>
            {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
            {trend && (
                <div className="mt-2 flex items-center">
                    {trend.isPositive ? (
                        <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                    ) : (
                        <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                    )}
                    <span className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {trend.isPositive ? '+' : ''}
                        {trend.value}%
                    </span>
                    <span className="ml-1 text-xs text-muted-foreground">vs mes anterior</span>
                </div>
            )}
        </CardContent>
    </Card>
);

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
    }).format(value);
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function MainDashboard({ stats, chartData, topPlans, recentTenants, tenantsByCategory, subscriptionStats }: MainDashboardProps) {
    const pieData = [
        { name: 'Activas', value: stats.activeSubscriptions, color: '#10B981' },
        { name: 'Prueba', value: stats.trialSubscriptions, color: '#3B82F6' },
        { name: 'Canceladas', value: stats.cancelledSubscriptions, color: '#EF4444' },
        { name: 'Suspendidas', value: stats.suspendedSubscriptions, color: '#F59E0B' },
    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard Principal', href: '/dashboard' }]}>
            <Head title="Dashboard Principal" />

            <div className="space-y-6 p-6">
                {/* Estadísticas Principales */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Negocios"
                        value={stats.totalTenants}
                        icon={Building2}
                        trend={{
                            value: stats.tenantsGrowth,
                            isPositive: stats.tenantsGrowth >= 0,
                        }}
                        description="Negocios registrados"
                    />
                    <StatsCard
                        title="Total Usuarios"
                        value={stats.totalUsers}
                        icon={Users}
                        trend={{
                            value: stats.usersGrowth,
                            isPositive: stats.usersGrowth >= 0,
                        }}
                        description="Usuarios activos"
                    />
                    <StatsCard
                        title="Suscripciones"
                        value={stats.totalSubscriptions}
                        icon={CreditCard}
                        trend={{
                            value: stats.subscriptionsGrowth,
                            isPositive: stats.subscriptionsGrowth >= 0,
                        }}
                        description="Suscripciones totales"
                    />
                    <StatsCard
                        title="Ingresos Totales"
                        value={stats.totalRevenue}
                        icon={DollarSign}
                        trend={{
                            value: stats.revenueGrowth,
                            isPositive: stats.revenueGrowth >= 0,
                        }}
                        description="Ingresos acumulados"
                        isRevenue
                    />
                </div>

                {/* Métricas Secundarias */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Target className="h-8 w-8 text-blue-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Tasa de Conversión</p>
                                    <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <BarChart3 className="h-8 w-8 text-green-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Ingreso Promedio</p>
                                    <p className="text-2xl font-bold">{formatCurrency(stats.avgRevenuePerTenant)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Activity className="h-8 w-8 text-purple-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Suscripciones Activas</p>
                                    <p className="text-2xl font-bold">{stats.activeSubscriptions}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Gráfico de Crecimiento */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Crecimiento de Negocios y Suscripciones</CardTitle>
                            <CardDescription>Últimos 6 meses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="tenants"
                                        stackId="1"
                                        stroke="#8884d8"
                                        fill="#8884d8"
                                        fillOpacity={0.6}
                                        name="Negocios"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="subscriptions"
                                        stackId="2"
                                        stroke="#82ca9d"
                                        fill="#82ca9d"
                                        fillOpacity={0.6}
                                        name="Suscripciones"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Distribución de Suscripciones */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Estado de Suscripciones</CardTitle>
                            <CardDescription>Distribución actual</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <RechartsPieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Planes Más Populares */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                Planes Más Populares
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topPlans.map((plan, index) => (
                                    <div key={plan.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-sm font-bold text-white">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <span className="font-medium">{plan.name}</span>
                                                {plan.is_free && (
                                                    <Badge variant="secondary" className="ml-2">
                                                        Gratis
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{plan.subscriptions_count} suscripciones</p>
                                            {!plan.is_free && (
                                                <p className="text-sm text-muted-foreground">{formatCurrency(plan.price_monthly)}/mes</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Negocios por Categoría */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="h-5 w-5 text-green-500" />
                                Negocios por Categoría
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {tenantsByCategory.map((category, index) => (
                                    <div key={category.category} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium capitalize">{category.category}</span>
                                            <span className="text-sm text-muted-foreground">{category.count}</span>
                                        </div>
                                        <Progress value={(category.count / stats.totalTenants) * 100} className="h-2" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Negocios Recientes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-500" />
                            Negocios Recientes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTenants.map((tenant) => (
                                <div key={tenant.id} className="flex items-center space-x-4 rounded-lg border p-3">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-green-500 font-bold text-white">
                                            {tenant.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium">{tenant.name}</p>
                                                <p className="text-sm text-muted-foreground capitalize">{tenant.category || 'Sin categoría'}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(tenant.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant={tenant.plan.is_free ? 'secondary' : 'default'}>{tenant.plan.name}</Badge>
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
