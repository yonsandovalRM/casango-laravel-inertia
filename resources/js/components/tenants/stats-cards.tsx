import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    change?: {
        value: number;
        type: 'increase' | 'decrease' | 'neutral';
    };
    className?: string;
    variant?: 'default' | 'success' | 'warning' | 'destructive';
}

export function StatsCard({ title, value, description, icon: Icon, change, className, variant = 'default' }: StatsCardProps) {
    const variantStyles = {
        default: 'border-border',
        success: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50',
        warning: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/50',
        destructive: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50',
    };

    const iconStyles = {
        default: 'text-muted-foreground',
        success: 'text-green-600 dark:text-green-400',
        warning: 'text-yellow-600 dark:text-yellow-400',
        destructive: 'text-red-600 dark:text-red-400',
    };

    return (
        <Card className={cn(variantStyles[variant], className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={cn('h-4 w-4', iconStyles[variant])} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
                {change && (
                    <div className="mt-2 flex items-center">
                        <Badge
                            variant={change.type === 'increase' ? 'default' : change.type === 'decrease' ? 'destructive' : 'muted'}
                            className="text-xs"
                        >
                            {change.type === 'increase' ? '+' : change.type === 'decrease' ? '-' : ''}
                            {Math.abs(change.value)}%
                        </Badge>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
