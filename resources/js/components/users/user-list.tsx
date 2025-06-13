import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
import { UserResource } from '@/interfaces/user';
import { Copy, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { GridView } from '../ui/grid-view';

export const UserList = ({ users }: { users: UserResource[] }) => {
    const { hasPermission } = usePermissions();
    const [colDefs, setColDefs] = useState([
        { field: 'name', headerName: 'Nombre' },
        { field: 'email', headerName: 'Correo' },
        { field: 'role', headerName: 'Rol', cellRenderer: (params: any) => <Badge variant="outline">{params.data.role}</Badge> },
        { field: 'created_at', headerName: 'Creado el' },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 150,
            pinned: 'right',
            cellRenderer: (params: any) => (
                <div className="flex items-center gap-2">
                    {hasPermission(PERMISSIONS.users.edit) && (
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <Pencil className="size-4" />
                        </Button>
                    )}
                    {hasPermission(PERMISSIONS.users.delete) && (
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <Trash className="size-4" />
                        </Button>
                    )}
                    <CopyToClipboard text={JSON.stringify(params.data)}>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <Copy className="size-4" />
                        </Button>
                    </CopyToClipboard>
                </div>
            ),
        },
    ]);

    return <GridView rowData={users} columnDefs={colDefs} />;
};
