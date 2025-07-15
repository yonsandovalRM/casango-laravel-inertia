import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';

interface EnhancedStatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
        label?: string;
    };
    className?: string;
    iconColor?: string;
    gradient?: boolean;
    isRevenue?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const EnhancedStatsCard: React.FC<EnhancedStatsCardProps> = ({
    title,
    value,
    description,
    icon: Icon,
    trend,
    className,
    iconColor = 'text-muted-foreground',
    gradient = false,
    isRevenue = false,
    size = 'md',
}) => {
    const formatValue = (val: string | number) => {
        if (isRevenue && typeof val === 'number') {
            return new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP',
                minimumFractionDigits: 0,
            }).format(val);
        }
        return val;
    };

    const cardSize = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    const titleSize = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    const valueSize = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-3xl',
    };

    const iconSize = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
    };

    return (
        <Card
            className={cn(
                'relative overflow-hidden transition-all duration-300 hover:shadow-lg',
                gradient && 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800',
                className,
            )}
        >
            {gradient && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10" />
            )}

            <CardHeader className={cn('relative z-10 flex flex-row items-center justify-between space-y-0 pb-2', cardSize[size])}>
                <CardTitle className={cn('font-medium', titleSize[size])}>{title}</CardTitle>
                <div className={cn('rounded-full p-2 transition-colors', gradient ? 'bg-white/80 shadow-sm backdrop-blur-sm' : 'bg-muted/20')}>
                    <Icon className={cn(iconSize[size], iconColor)} />
                </div>
            </CardHeader>

            <CardContent className={cn('relative z-10', cardSize[size], 'pt-0')}>
                <div className={cn('font-bold', valueSize[size])}>{formatValue(value)}</div>

                {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}

                {trend && (
                    <div className="mt-3 flex items-center space-x-2">
                        <div
                            className={cn(
                                'flex items-center rounded-full px-2 py-1 text-xs font-medium',
                                trend.isPositive
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                            )}
                        >
                            {trend.isPositive ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                            <span>
                                {trend.isPositive ? '+' : ''}
                                {trend.value}%
                            </span>
                        </div>
                        {trend.label && <span className="text-xs text-muted-foreground">{trend.label}</span>}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// Componente especializado para métricas de ingresos
export const RevenueStatsCard: React.FC<Omit<EnhancedStatsCardProps, 'isRevenue'>> = (props) => (
    <EnhancedStatsCard {...props} isRevenue gradient iconColor="text-green-600" />
);

// Componente especializado para métricas de crecimiento
export const GrowthStatsCard: React.FC<EnhancedStatsCardProps> = (props) => <EnhancedStatsCard {...props} gradient iconColor="text-blue-600" />;

// Componente especializado para métricas de usuario
export const UserStatsCard: React.FC<EnhancedStatsCardProps> = (props) => <EnhancedStatsCard {...props} iconColor="text-purple-600" />;

// Componente para mostrar una grilla de stats
interface StatsGridProps {
    children: React.ReactNode;
    columns?: 2 | 3 | 4;
    className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ children, columns = 4, className }) => {
    const gridCols = {
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-2 lg:grid-cols-4',
    };

    return <div className={cn('grid gap-6', gridCols[columns], className)}>{children}</div>;
};
