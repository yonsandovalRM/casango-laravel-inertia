// resources/js/components/services/service-stats.tsx
import { ServiceStatistics } from '@/interfaces/service';
import { Calendar, CheckCircle, Users, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ServiceStatsProps {
    statistics: ServiceStatistics;
}

export function ServiceStats({ statistics }: ServiceStatsProps) {
    const { t } = useTranslation();

    const stats = [
        {
            title: t('services.stats.total'),
            value: statistics.total,
            icon: Calendar,
            description: t('services.stats.total_description'),
        },
        {
            title: t('services.stats.active'),
            value: statistics.active,
            icon: CheckCircle,
            description: t('services.stats.active_description'),
            className: 'text-green-600',
        },
        {
            title: t('services.stats.inactive'),
            value: statistics.inactive,
            icon: XCircle,
            description: t('services.stats.inactive_description'),
            className: 'text-red-600',
        },
        {
            title: t('services.stats.categories'),
            value: statistics.categories_count,
            icon: Users,
            description: t('services.stats.categories_description'),
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.className || 'text-muted-foreground'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </CardContent>
                </Card>
            ))}

            {/* Service Types Distribution */}
            <Card className="md:col-span-2 lg:col-span-4">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">{t('services.stats.by_type')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500" />
                            <span className="text-sm">
                                {t('services.types.in_person')}: {statistics.by_type.in_person}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                            <span className="text-sm">
                                {t('services.types.video_call')}: {statistics.by_type.video_call}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-purple-500" />
                            <span className="text-sm">
                                {t('services.types.hybrid')}: {statistics.by_type.hybrid}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
