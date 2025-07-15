import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, DollarSign, TrendingUp } from 'lucide-react';
import React from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

// Colores para los gráficos
const CHART_COLORS = {
    primary: '#3B82F6',
    secondary: '#10B981',
    tertiary: '#F59E0B',
    danger: '#EF4444',
    purple: '#8B5CF6',
    pink: '#EC4899',
};

// Componente para gráfico de área con gradiente
interface RevenueAreaChartProps {
    data: Array<{
        month: string;
        revenue: number;
        bookings: number;
    }>;
    title?: string;
    description?: string;
}

export const RevenueAreaChart: React.FC<RevenueAreaChartProps> = ({ data, title = 'Ingresos y Reservas', description = 'Últimos 6 meses' }) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}
                            formatter={(value: number, name: string) => [
                                name === 'revenue' ? formatCurrency(value) : value,
                                name === 'revenue' ? 'Ingresos' : 'Reservas',
                            ]}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke={CHART_COLORS.primary}
                            fillOpacity={1}
                            fill="url(#revenueGradient)"
                            strokeWidth={2}
                        />
                        <Area
                            type="monotone"
                            dataKey="bookings"
                            stroke={CHART_COLORS.secondary}
                            fillOpacity={1}
                            fill="url(#bookingsGradient)"
                            strokeWidth={2}
                        />
                        <Legend />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

// Componente para gráfico de barras
interface ServiceStatsBarChartProps {
    data: Array<{
        name: string;
        bookings: number;
        revenue: number;
    }>;
    title?: string;
}

export const ServiceStatsBarChart: React.FC<ServiceStatsBarChartProps> = ({ data, title = 'Servicios Más Populares' }) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                name === 'revenue' ? formatCurrency(value) : value,
                                name === 'revenue' ? 'Ingresos' : 'Reservas',
                            ]}
                        />
                        <Bar dataKey="bookings" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} name="Reservas" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

// Componente para gráfico circular
interface StatusPieChartProps {
    data: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    title?: string;
    total?: number;
}

export const StatusPieChart: React.FC<StatusPieChartProps> = ({ data, title = 'Distribución de Estados', total }) => {
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {total && <CardDescription>Total: {total}</CardDescription>}
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [value, 'Cantidad']} />
                    </PieChart>
                </ResponsiveContainer>

                {/* Leyenda personalizada */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                    {data.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-sm text-muted-foreground">
                                {entry.name}: {entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

// Componente para línea de tiempo de actividad
interface ActivityTimelineProps {
    data: Array<{
        time: string;
        bookings: number;
        revenue: number;
    }>;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ data }) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-purple-500" />
                    Actividad Diaria
                </CardTitle>
                <CardDescription>Reservas e ingresos por hora</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                name === 'revenue' ? formatCurrency(value) : value,
                                name === 'revenue' ? 'Ingresos' : 'Reservas',
                            ]}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="bookings" fill={CHART_COLORS.secondary} name="Reservas" />
                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke={CHART_COLORS.primary} strokeWidth={3} name="Ingresos" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

// Componente compacto para mini-gráficos
interface MiniChartProps {
    data: Array<{ value: number }>;
    color?: string;
    type?: 'area' | 'line' | 'bar';
}

export const MiniChart: React.FC<MiniChartProps> = ({ data, color = CHART_COLORS.primary, type = 'area' }) => {
    return (
        <ResponsiveContainer width="100%" height={40}>
            {type === 'area' ? (
                <AreaChart data={data}>
                    <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.3} strokeWidth={2} />
                </AreaChart>
            ) : type === 'line' ? (
                <LineChart data={data}>
                    <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
                </LineChart>
            ) : (
                <BarChart data={data}>
                    <Bar dataKey="value" fill={color} />
                </BarChart>
            )}
        </ResponsiveContainer>
    );
};

// Componente para gráfico de líneas múltiples
interface MultiLineChartProps {
    data: Array<{
        month: string;
        [key: string]: any;
    }>;
    lines: Array<{
        dataKey: string;
        name: string;
        color: string;
    }>;
    title?: string;
    description?: string;
}

export const MultiLineChart: React.FC<MultiLineChartProps> = ({
    data,
    lines,
    title = 'Tendencias Múltiples',
    description = 'Comparación de métricas',
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {lines.map((line, index) => (
                            <Line key={index} type="monotone" dataKey={line.dataKey} stroke={line.color} strokeWidth={2} name={line.name} />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
