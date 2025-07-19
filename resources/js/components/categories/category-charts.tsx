import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ChartData {
    categories_by_status: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    services_distribution: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    monthly_growth: Array<{
        month: string;
        count: number;
    }>;
}

interface CategoryChartsProps {
    chartData: ChartData;
}

export function CategoryCharts({ chartData }: CategoryChartsProps) {
    // Custom tooltip para los gráficos
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                    <p className="font-semibold">{label}</p>
                    <p className="text-blue-600">{`${payload[0].dataKey}: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    // Preparar datos para el gráfico de crecimiento mensual
    const monthlyData = chartData.monthly_growth.map((item) => ({
        ...item,
        monthName: new Intl.DateTimeFormat('es', {
            month: 'short',
            year: '2-digit',
        }).format(new Date(item.month + '-01')),
    }));

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Gráfico de estado de categorías */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Estado de Categorías</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData.categories_by_status}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                                >
                                    {chartData.categories_by_status.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex justify-center gap-4">
                        {chartData.categories_by_status.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-sm text-muted-foreground">
                                    {item.name} ({item.value})
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Gráfico de distribución de servicios */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Distribución de Servicios</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData.services_distribution.slice(0, 6)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {chartData.services_distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Gráfico de crecimiento mensual */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="text-base">Crecimiento Mensual</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="monthName" fontSize={12} />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-sm text-muted-foreground">Nuevas categorías creadas por mes en los últimos 12 meses</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
