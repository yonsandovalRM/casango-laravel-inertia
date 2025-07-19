import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
import { UserResource } from '@/interfaces/user';
import { router } from '@inertiajs/react';
import { AlertDialog } from '@radix-ui/react-alert-dialog';
import { Download, Mail, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface UserBulkActionsProps {
    users: UserResource[];
    selectedUsers: string[];
    onSelectionChange: (userIds: string[]) => void;
}

export const UserBulkActions = ({ users, selectedUsers, onSelectionChange }: UserBulkActionsProps) => {
    const { hasPermission } = usePermissions();
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            onSelectionChange(users.map((user) => user.id));
        } else {
            onSelectionChange([]);
        }
    };

    const handleBulkDelete = () => {
        // Implementar eliminación en lote
        selectedUsers.forEach((userId) => {
            router.delete(route('users.destroy', { user: userId }), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast('Usuarios eliminados correctamente');
                },
            });
        });
        setShowBulkDeleteDialog(false);
        onSelectionChange([]);
    };

    const handleExportUsers = () => {
        const selectedUserData = users.filter((user) => selectedUsers.includes(user.id));
        const csvContent = convertToCSV(selectedUserData);
        downloadCSV(csvContent, 'usuarios_exportados.csv');
    };

    const convertToCSV = (data: UserResource[]) => {
        const headers = ['Nombre', 'Email', 'Rol', 'Fecha de creación'];
        const csvData = data.map((user) => [user.name, user.email, user.role_display_name, user.created_at]);

        return [headers, ...csvData].map((row) => row.join(',')).join('\n');
    };

    const downloadCSV = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isAllSelected = users.length > 0 && selectedUsers.length === users.length;
    const isIndeterminate = selectedUsers.length > 0 && selectedUsers.length < users.length;

    return (
        <>
            <div className="flex items-center justify-between rounded-lg border bg-white p-4">
                <div className="flex items-center space-x-4">
                    <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Seleccionar todos los usuarios"
                        className={isIndeterminate ? 'data-[state=checked]:bg-primary' : ''}
                    />
                    <div className="flex items-center text-sm text-gray-600">
                        <Users className="mr-2 h-4 w-4" />
                        {selectedUsers.length > 0 ? (
                            <span>{selectedUsers.length} usuario(s) seleccionado(s)</span>
                        ) : (
                            <span>Seleccionar usuarios</span>
                        )}
                    </div>
                </div>

                {selectedUsers.length > 0 && (
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={handleExportUsers}>
                            <Download className="mr-2 h-4 w-4" />
                            Exportar
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    Acciones
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={handleExportUsers}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Exportar seleccionados
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Enviar invitación
                                </DropdownMenuItem>
                                {hasPermission(PERMISSIONS.users.delete) && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600" onSelect={() => setShowBulkDeleteDialog(true)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Eliminar seleccionados
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>

            <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{`¿Eliminar ${selectedUsers.length} usuario(s)?`}</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminarán permanentemente los usuarios seleccionados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowBulkDeleteDialog(false)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
