import { StatsCard } from '@/components/tenants/stats-cards';
import { formatCurrency } from '@/lib/utils';
import { AlertTriangle, Building2, Calendar, Clock, DollarSign, Shield, TrendingUp, Users } from 'lucide-react';

interface TenantStats {
    total_tenants: number;
    active_tenants: number;
    trial_tenants: number;
    suspended_tenants: number;
    monthly_revenue: number;
    annual_revenue: number;
    grace_period_tenants: number;
    new_tenants_this_month: number;
}

interface TenantStatsGridProps {
    stats: TenantStats;
}

export function TenantStatsGrid({ stats }: TenantStatsGridProps) {
    const totalRevenue = stats.monthly_revenue + stats.annual_revenue;
    const activePercentage = stats.total_tenants > 0 ? ((stats.active_tenants / stats.total_tenants) * 100).toFixed(1) : '0';

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Total de Negocios" value={stats.total_tenants} description="Negocios registrados" icon={Building2} variant="default" />

            <StatsCard
                title="Negocios Activos"
                value={stats.active_tenants}
                description={`${activePercentage}% del total`}
                icon={Users}
                variant="success"
            />

            <StatsCard title="En Período de Prueba" value={stats.trial_tenants} description="Negocios en trial" icon={Clock} variant="warning" />

            <StatsCard
                title="Suspendidos"
                value={stats.suspended_tenants}
                description="Requieren atención"
                icon={AlertTriangle}
                variant="destructive"
            />

            <StatsCard
                title="Ingresos Totales"
                value={formatCurrency(totalRevenue)}
                description="Ingresos activos"
                icon={DollarSign}
                variant="success"
            />

            <StatsCard
                title="Nuevos Este Mes"
                value={stats.new_tenants_this_month}
                description="Negocios creados"
                icon={TrendingUp}
                variant="default"
            />

            <StatsCard title="Período de Gracia" value={stats.grace_period_tenants} description="Pagos pendientes" icon={Shield} variant="warning" />

            <StatsCard
                title="Ingresos Mensuales"
                value={formatCurrency(stats.monthly_revenue)}
                description="Suscripciones mensuales"
                icon={Calendar}
                variant="default"
            />
        </div>
    );
}
