import { AppHeaderPage } from '@/components/app-header-page';
import { SessionMessages } from '@/components/session-messages';
import { TenantFilters } from '@/components/tenants/tenant-filters';
import { Button } from '@/components/ui/button';
import { DialogConfirm } from '@/components/ui/dialog-confirm';
import { UserCard } from '@/components/users/user-card';
import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
import { UserResource } from '@/interfaces/user';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash } from 'lucide-react';
import { useState } from 'react';

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
    const [open, setOpen] = useState(false);
    const { hasPermission } = usePermissions();

    const handleConfirmDelete = (userId: string) => {
        setOpen(false);
        router.delete(route('users.destroy', { user: userId }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />
            <AppHeaderPage
                title="Usuarios"
                description="Gestiona los usuarios de tu empresa"
                actions={
                    <Button asChild>
                        <Link href="#">
                            <Plus className="size-4" />
                            Nuevo Usuario
                        </Link>
                    </Button>
                }
            />

            <TenantFilters />
            <SessionMessages />

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                    <UserCard
                        key={user.id}
                        user={user}
                        actions={
                            <>
                                {hasPermission(PERMISSIONS.users.edit) && (
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Pencil className="size-4" />
                                        Editar
                                    </Button>
                                )}

                                {hasPermission(PERMISSIONS.users.delete) && (
                                    <DialogConfirm
                                        variant="destructive"
                                        title="Eliminar usuario"
                                        description="¿Estás seguro de querer eliminar este usuario? Esta acción no se puede deshacer."
                                        onConfirm={() => handleConfirmDelete(user.id)}
                                        onCancel={() => setOpen(false)}
                                    >
                                        <Button variant="soft-destructive" onClick={() => setOpen(true)}>
                                            <Trash className="size-4" />
                                            Eliminar
                                        </Button>
                                    </DialogConfirm>
                                )}
                            </>
                        }
                    />
                ))}
            </div>
        </AppLayout>
    );
}
