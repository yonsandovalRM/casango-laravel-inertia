import { ServiceResource, ServiceStatistics } from '@/interfaces/service';
import { formatCurrency } from '@/lib/utils';
import { BarChart3, Clock, DollarSign, TrendingUp, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

interface AdvancedMetricsProps {
    services: ServiceResource[];
    statistics: ServiceStatistics;
}

export function AdvancedServiceMetrics({ services, statistics }: AdvancedMetricsProps) {
    const { t } = useTranslation();

    // Calculate additional metrics
    const avgDuration = services.length > 0 ? Math.round(services.reduce((sum, service) => sum + service.duration, 0) / services.length) : 0;

    const paidServices = services.filter((service) => service.price && service.price > 0);
    const avgPrice = paidServices.length > 0 ? paidServices.reduce((sum, service) => sum + (service.price || 0), 0) / paidServices.length : 0;

    const totalProfessionals = services.reduce((sum, service) => sum + service.professionals_count, 0);

    const servicesByDuration = {
        short: services.filter((s) => s.duration <= 30).length,
        medium: services.filter((s) => s.duration > 30 && s.duration <= 60).length,
        long: services.filter((s) => s.duration > 60).length,
    };

    const activationRate = statistics.total > 0 ? Math.round((statistics.active / statistics.total) * 100) : 0;

    const professionalUtilization =
        totalProfessionals > 0 ? Math.round((services.filter((s) => s.professionals_count > 0).length / services.length) * 100) : 0;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Average Duration */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('services.metrics.avg_duration')}</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{avgDuration}min</div>
                    <div className="mt-2 space-y-2">
                        <div className="flex justify-between text-xs">
                            <span>≤30min: {servicesByDuration.short}</span>
                            <span>31-60min: {servicesByDuration.medium}</span>
                            <span>
                                {'>'}60min: {servicesByDuration.long}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <Progress value={(servicesByDuration.short / (statistics.total || 1)) * 100} className="h-1" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Average Price */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('services.metrics.avg_price')}</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{avgPrice > 0 ? formatCurrency(avgPrice) : t('services.price.free')}</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {paidServices.length} {t('services.metrics.paid_services')} / {services.length} {t('services.metrics.total')}
                    </p>
                    <div className="mt-2">
                        <Progress value={(paidServices.length / (services.length || 1)) * 100} className="h-1" />
                    </div>
                </CardContent>
            </Card>

            {/* Professional Coverage */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('services.metrics.professional_coverage')}</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalProfessionals}</div>
                    <p className="text-xs text-muted-foreground">{t('services.metrics.total_assignments')}</p>
                    <div className="mt-2">
                        <div className="mb-1 flex justify-between text-xs">
                            <span>{t('services.metrics.utilization')}</span>
                            <span>{professionalUtilization}%</span>
                        </div>
                        <Progress value={professionalUtilization} className="h-1" />
                    </div>
                </CardContent>
            </Card>

            {/* Activation Rate */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('services.metrics.activation_rate')}</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{activationRate}%</div>
                    <p className="text-xs text-muted-foreground">
                        {statistics.active} {t('services.metrics.active')} / {statistics.total} {t('services.metrics.total')}
                    </p>
                    <div className="mt-2">
                        <Progress value={activationRate} className="h-1" />
                    </div>
                </CardContent>
            </Card>

            {/* Service Type Distribution Chart */}
            <Card className="md:col-span-2 lg:col-span-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('services.metrics.type_distribution')}</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-blue-500" />
                                <span className="text-sm">{t('services.types.in_person')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{statistics.by_type.in_person}</span>
                                <Progress value={(statistics.by_type.in_person / (statistics.total || 1)) * 100} className="h-2 w-20" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-green-500" />
                                <span className="text-sm">{t('services.types.video_call')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{statistics.by_type.video_call}</span>
                                <Progress value={(statistics.by_type.video_call / (statistics.total || 1)) * 100} className="h-2 w-20" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-purple-500" />
                                <span className="text-sm">{t('services.types.hybrid')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{statistics.by_type.hybrid}</span>
                                <Progress value={(statistics.by_type.hybrid / (statistics.total || 1)) * 100} className="h-2 w-20" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
