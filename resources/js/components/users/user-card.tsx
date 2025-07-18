import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
import { UserResource } from '@/interfaces/user';
import { router } from '@inertiajs/react';
import { Calendar, Edit, Mail, MoreVertical, Shield, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../ui/alert-dialog';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { EditUser } from './edit-user';

interface UserCardProps {
    user: UserResource;
}

export const UserCard = ({ user }: UserCardProps) => {
    const { hasPermission } = usePermissions();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditUser, setShowEditUser] = useState(false);

    const handleDelete = () => {
        router.delete(route('users.destroy', { user: user.id }));
        setShowDeleteDialog(false);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-800';
            case 'manager':
                return 'bg-blue-100 text-blue-800';
            case 'employee':
                return 'bg-green-100 text-green-800';
            case 'owner':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
        }
    };

    return (
        <>
            <Card className="transition-shadow duration-200 hover:shadow-md">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-14 w-14 border-2 border-primary/20">
                                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
                                <div className="mt-1 flex items-center text-sm text-muted-foreground">
                                    <Mail className="mr-1 h-4 w-4" />
                                    {user.email}
                                </div>
                            </div>
                        </div>{' '}
                        {hasPermission(PERMISSIONS.users.edit) && (
                            <Button onClick={() => setShowEditUser(true)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </Button>
                        )}
                        {(hasPermission(PERMISSIONS.users.edit) || hasPermission(PERMISSIONS.users.delete)) && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {hasPermission(PERMISSIONS.users.edit) && (
                                        <DropdownMenuItem onSelect={() => setShowEditUser(true)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Editar
                                        </DropdownMenuItem>
                                    )}
                                    {hasPermission(PERMISSIONS.users.delete) && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600" onSelect={() => setShowDeleteDialog(true)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Eliminar
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="pt-0">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Badge className={getRoleBadgeColor(user.role)}>
                                <Shield className="mr-1 h-3 w-3" />
                                {user.role_display_name}
                            </Badge>
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Creado el {user.created_at}</span>
                        </div>

                        {user.updated_at !== user.created_at && <div className="text-xs text-gray-400">Última actualización: {user.updated_at}</div>}
                    </div>
                </CardContent>
            </Card>

            <EditUser user={user} open={showEditUser} onOpenChange={setShowEditUser} />

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {`¿Estás seguro de que deseas eliminar a ${user.name}? Esta acción no se puede deshacer.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
