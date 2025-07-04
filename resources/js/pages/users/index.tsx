import { AppHeaderPage } from '@/components/app-header-page';
import { CreateInvitation } from '@/components/invitations/create-invitation';
import { TenantFilters } from '@/components/tenants/tenant-filters';
import { UserList } from '@/components/users/user-list';
import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
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

export default function UsersIndex({ users }: { users: UserResource[] }) {
    const { hasPermission } = usePermissions();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />
            <AppHeaderPage
                title="Usuarios"
                description="Gestiona los usuarios de tu empresa"
                actions={hasPermission(PERMISSIONS.invitations.create) && <CreateInvitation />}
            />
            <div className="p-4">
                <TenantFilters />

                <div className="mt-4">
                    <UserList users={users} />
                </div>
            </div>
        </AppLayout>
    );
}
