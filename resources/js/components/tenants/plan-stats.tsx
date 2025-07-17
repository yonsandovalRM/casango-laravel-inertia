import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';

interface PlanStat {
    name: string;
    count: number;
    revenue: number;
}

interface PlanStatsProps {
    planStats: PlanStat[];
    totalTenants: number;
}

export function PlanStats({ planStats, totalTenants }: PlanStatsProps) {
    const totalRevenue = planStats.reduce((sum, plan) => sum + plan.revenue, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Distribución por Plan</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {planStats.map((plan) => {
                        const percentage = totalTenants > 0 ? (plan.count / totalTenants) * 100 : 0;
                        const revenuePercentage = totalRevenue > 0 ? (plan.revenue / totalRevenue) * 100 : 0;

                        return (
                            <div key={plan.name} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{plan.name}</span>
                                        <Badge variant="outline" className="text-xs">
                                            {plan.count} negocios
                                        </Badge>
                                    </div>
                                    <span className="text-sm font-medium">{formatCurrency(plan.revenue)}</span>
                                </div>
                                <div className="space-y-1">
                                    <Progress value={percentage} className="h-2" />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{percentage.toFixed(1)}% de negocios</span>
                                        <span>{revenuePercentage.toFixed(1)}% de ingresos</span>
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
