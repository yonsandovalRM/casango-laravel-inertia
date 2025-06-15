import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
import { UserResource } from '@/interfaces/user';
import { router } from '@inertiajs/react';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DialogConfirm } from '../ui/dialog-confirm';
import { GridView } from '../ui/grid-view';
import { EditUser } from './edit-user';

export const UserList = ({ users }: { users: UserResource[] }) => {
    const { t } = useTranslation();
    const { hasPermission } = usePermissions();

    const handleDelete = (userId: string) => {
        router.delete(route('users.destroy', { user: userId }));
    };

    const [colDefs, setColDefs] = useState([
        { field: 'name', headerName: 'Nombre' },
        { field: 'email', headerName: 'Correo' },
        { field: 'role', headerName: 'Rol', cellRenderer: (params: any) => <Badge variant="outline">{params.data.role}</Badge> },
        { field: 'created_at', headerName: 'Creado el' },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 120,
            pinned: 'right',
            cellRenderer: (params: any) => (
                <div className="flex items-center gap-2">
                    {hasPermission(PERMISSIONS.users.edit) && <EditUser user={params.data} />}
                    {hasPermission(PERMISSIONS.users.delete) && (
                        <DialogConfirm
                            variant="destructive"
                            title={t('users.list.dialog.title')}
                            description={t('users.list.dialog.description')}
                            onConfirm={() => handleDelete(params.data.id)}
                            onCancel={() => {}}
                        >
                            <Button variant="soft-destructive">
                                <TrashIcon className="size-4" />
                            </Button>
                        </DialogConfirm>
                    )}
                </div>
            ),
        },
    ]);

    return <GridView rowData={users} columnDefs={colDefs} />;
};
