import { UserResource } from '@/interfaces/user';
import { Shield, UserCheck, Users, UserX } from 'lucide-react';

interface UserStatsProps {
    users: UserResource[];
}

export const UserStats = ({ users }: UserStatsProps) => {
    const totalUsers = users.length;
    const activeUsers = users.filter((user) => !user.deleted_at).length;
    const inactiveUsers = users.filter((user) => user.deleted_at).length;
    const adminUsers = users.filter((user) => user.role === 'admin').length;

    const stats = [
        {
            title: 'Total de Usuarios',
            value: totalUsers,
            icon: Users,
            color: 'text-blue-600 dark:text-blue-100',
            bgColor: 'bg-blue-50 dark:bg-blue-900 dark:text-blue-100',
        },
        {
            title: 'Usuarios Activos',
            value: activeUsers,
            icon: UserCheck,
            color: 'text-green-600 dark:text-green-100',
            bgColor: 'bg-green-50 dark:bg-green-900 dark:text-green-100',
        },
        {
            title: 'Usuarios Inactivos',
            value: inactiveUsers,
            icon: UserX,
            color: 'text-red-600 dark:text-red-100',
            bgColor: 'bg-red-50 dark:bg-red-900 dark:text-red-100',
        },
        {
            title: 'Administradores',
            value: adminUsers,
            icon: Shield,
            color: 'text-purple-600 dark:text-purple-100',
            bgColor: 'bg-purple-50 dark:bg-purple-900 dark:text-purple-100',
        },
    ];

    return (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div key={stat.title} className="rounded-lg border bg-card p-6">
                        <div className="flex items-center">
                            <div className={`${stat.bgColor} rounded-lg p-3`}>
                                <Icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
