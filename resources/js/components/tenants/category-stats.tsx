import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CategoryStat {
    name: string;
    count: number;
}

interface CategoryStatsProps {
    categoryStats: CategoryStat[];
    totalTenants: number;
}

export function CategoryStats({ categoryStats, totalTenants }: CategoryStatsProps) {
    // Ordenar por cantidad de negocios
    const sortedStats = [...categoryStats].sort((a, b) => b.count - a.count);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Distribución por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sortedStats.map((category) => {
                        const percentage = totalTenants > 0 ? (category.count / totalTenants) * 100 : 0;

                        return (
                            <div key={category.name} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{category.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                        {category.count} negocios
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <Progress value={percentage} className="h-2" />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{percentage.toFixed(1)}% del total</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
