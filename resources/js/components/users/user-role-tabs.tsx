import { Role } from '@/interfaces/role';
import { UserResource } from '@/interfaces/user';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { UserCard } from './user-card';

interface UserRoleTabsProps {
    users: UserResource[];
    roles: Role[];
    searchQuery: string;
}

export const UserRoleTabs = ({ users, roles, searchQuery }: UserRoleTabsProps) => {
    const filteredUsers = users.filter(
        (user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const getUsersByRole = (roleName: string) => {
        if (roleName === 'all') return filteredUsers;
        return filteredUsers.filter((user) => user.role === roleName);
    };

    const allRoles = [{ id: 'all', name: 'all', display_name: 'Todos' }, ...roles];

    return (
        <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6 grid h-full w-full grid-cols-2 lg:grid-cols-5">
                {allRoles.map((role) => {
                    const userCount = getUsersByRole(role.name).length;
                    return (
                        <TabsTrigger key={role.id} value={role.name} className="flex items-center gap-2">
                            {role.display_name}
                            <Badge variant="muted" className="ml-1 text-xs">
                                {userCount}
                            </Badge>
                        </TabsTrigger>
                    );
                })}
            </TabsList>

            {allRoles.map((role) => {
                const roleUsers = getUsersByRole(role.name);
                return (
                    <TabsContent key={role.id} value={role.name} className="mt-0">
                        {roleUsers.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {roleUsers.map((user) => (
                                    <UserCard key={user.id} user={user} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <div className="mb-2 text-lg text-gray-400">No hay usuarios</div>
                                <div className="text-sm text-gray-500">
                                    {searchQuery
                                        ? 'No se encontraron usuarios que coincidan con tu búsqueda'
                                        : `No hay usuarios con el rol ${role.display_name.toLowerCase()}`}
                                </div>
                            </div>
                        )}
                    </TabsContent>
                );
            })}
        </Tabs>
    );
};
