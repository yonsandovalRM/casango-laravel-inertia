import { AppHeaderPage } from '@/components/app-header-page';
import { SessionMessages } from '@/components/session-messages';
import { TenantFilters } from '@/components/tenants/tenant-filters';
import { CreateUser } from '@/components/users/create-user';
import { UserList } from '@/components/users/user-list';
import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
import { UserResource } from '@/interfaces/user';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Usuarios',
        href: '/usuarios',
    },
];

export default function UsersIndex({ users }: { users: UserResource[] }) {
    const { hasPermission } = usePermissions();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />
            <AppHeaderPage
                title="Usuarios"
                description="Gestiona los usuarios de tu empresa"
                actions={hasPermission(PERMISSIONS.users.create) && <CreateUser />}
            />

            <TenantFilters />
            <SessionMessages />

            <div className="mt-4">
                <UserList users={users} />
            </div>
        </AppLayout>
    );
}
