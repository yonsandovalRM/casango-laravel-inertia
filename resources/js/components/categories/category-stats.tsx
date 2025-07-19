import { Activity, BarChart3, Package, Target, TrendingUp, Users } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

interface StatsData {
    total_categories: number;
    active_categories: number;
    inactive_categories: number;
    categories_with_services: number;
    empty_categories: number;
    total_services: number;
    avg_services_per_category: number;
    most_used_category: {
        name: string;
        services_count: number;
    } | null;
    recent_categories: number;
}

interface CategoryStatsProps {
    stats: StatsData;
}

export function CategoryStats({ stats }: CategoryStatsProps) {
    const activePercentage = stats.total_categories > 0 ? (stats.active_categories / stats.total_categories) * 100 : 0;

    const withServicesPercentage = stats.total_categories > 0 ? (stats.categories_with_services / stats.total_categories) * 100 : 0;

    const efficiency =
        stats.total_categories > 0
            ? Math.round(((stats.categories_with_services + stats.active_categories) / (stats.total_categories * 2)) * 100)
            : 0;

    const statCards = [
        {
            title: 'Total de Categorías',
            value: stats.total_categories,
            icon: Package,
            description: `${stats.recent_categories} nuevas este mes`,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Categorías Activas',
            value: stats.active_categories,
            icon: Activity,
            description: `${Math.round(activePercentage)}% del total`,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Con Servicios',
            value: stats.categories_with_services,
            icon: Target,
            description: `${Math.round(withServicesPercentage)}% utilizadas`,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Promedio de Servicios',
            value: stats.avg_services_per_category,
            icon: TrendingUp,
            description: 'Por categoría',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Tarjetas principales de estadísticas */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="transition-shadow hover:shadow-md">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                        <p className="text-2xl font-bold">
                                            {typeof stat.value === 'number' && stat.value % 1 !== 0 ? stat.value.toFixed(1) : stat.value}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
                                    </div>
                                    <div className={`${stat.bgColor} rounded-full p-3`}>
                                        <Icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Tarjetas de métricas avanzadas */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Eficiencia General */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <BarChart3 className="h-4 w-4" />
                            Eficiencia General
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Eficiencia</span>
                                <span className="font-medium">{efficiency}%</span>
                            </div>
                            <Progress value={efficiency} className="h-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Activas</p>
                                <p className="font-semibold text-green-600">{stats.active_categories}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Inactivas</p>
                                <p className="font-semibold text-red-600">{stats.inactive_categories}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Utilización */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Users className="h-4 w-4" />
                            Utilización
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Con servicios</span>
                                <span className="font-medium">{Math.round(withServicesPercentage)}%</span>
                            </div>
                            <Progress value={withServicesPercentage} className="h-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Utilizadas</p>
                                <p className="font-semibold text-blue-600">{stats.categories_with_services}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Vacías</p>
                                <p className="font-semibold text-gray-500">{stats.empty_categories}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Categoría Destacada */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Target className="h-4 w-4" />
                            Más Utilizada
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {stats.most_used_category ? (
                            <>
                                <div className="text-center">
                                    <p className="text-lg font-semibold">{stats.most_used_category.name}</p>
                                    <Badge variant="secondary" className="mt-1">
                                        {stats.most_used_category.services_count} servicios
                                    </Badge>
                                </div>
                                <div className="text-center text-sm text-muted-foreground">La categoría con más servicios asociados</div>
                            </>
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <p>No hay datos disponibles</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Resumen rápido */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Resumen Ejecutivo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-4">
                        <div className="rounded-lg bg-blue-50 p-3 text-center">
                            <p className="font-semibold text-blue-600">{stats.total_services}</p>
                            <p className="text-muted-foreground">Total Servicios</p>
                        </div>
                        <div className="rounded-lg bg-green-50 p-3 text-center">
                            <p className="font-semibold text-green-600">{stats.avg_services_per_category}</p>
                            <p className="text-muted-foreground">Promedio por Categoría</p>
                        </div>
                        <div className="rounded-lg bg-purple-50 p-3 text-center">
                            <p className="font-semibold text-purple-600">{Math.round(activePercentage)}%</p>
                            <p className="text-muted-foreground">Categorías Activas</p>
                        </div>
                        <div className="rounded-lg bg-orange-50 p-3 text-center">
                            <p className="font-semibold text-orange-600">{stats.recent_categories}</p>
                            <p className="text-muted-foreground">Nuevas este Mes</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
