import { AppHeaderPage } from '@/components/app-header-page';
import { CreateInvitation } from '@/components/invitations/create-invitation';
import { EnhancedUserList } from '@/components/users/enhanced-user-list';
import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
import { Role } from '@/interfaces/role';
import { UserResource } from '@/interfaces/user';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Usuarios',
        href: route('users.index'),
    },
];

interface UsersIndexProps {
    users: UserResource[];
    roles: Role[];
}

export default function UsersIndex({ users, roles }: UsersIndexProps) {
    const { hasPermission } = usePermissions();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />
            <AppHeaderPage
                title="Gestión de Usuarios"
                description="Administra y supervisa los usuarios de tu empresa"
                actions={hasPermission(PERMISSIONS.invitations.create) && <CreateInvitation />}
            />
            <div className="p-6">
                <EnhancedUserList users={users} roles={roles} />
            </div>
        </AppLayout>
    );
}
