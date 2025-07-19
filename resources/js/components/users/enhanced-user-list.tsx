import { Role } from '@/interfaces/role';
import { UserResource } from '@/interfaces/user';
import { Grid3X3, LayoutGrid, List } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { UserBulkActions } from './user-bulk-actions';
import { UserCard } from './user-card';
import { UserCardWithSelection } from './user-card-with-selection';
import { UserFilters } from './user-filters';
import { UserRoleTabs } from './user-role-tabs';
import { UserStats } from './user-stats';

interface EnhancedUserListProps {
    users: UserResource[];
    roles: Role[];
}

export const getRoleBadgeColor = (role: string) => {
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

export const EnhancedUserList = ({ users, roles }: EnhancedUserListProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [viewMode, setViewMode] = useState<'tabs' | 'grid' | 'selection'>('tabs');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const filteredUsers = useMemo(() => {
        let filtered = users;

        // Filtro por búsqueda
        if (searchQuery) {
            filtered = filtered.filter(
                (user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }

        // Filtro por rol
        if (selectedRole !== 'all') {
            filtered = filtered.filter((user) => user.role === selectedRole);
        }

        return filtered;
    }, [users, searchQuery, selectedRole]);

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedRole('all');
    };

    const handleUserSelection = (userId: string, selected: boolean) => {
        if (selected) {
            setSelectedUsers((prev) => [...prev, userId]);
        } else {
            setSelectedUsers((prev) => prev.filter((id) => id !== userId));
        }
    };

    const handleSelectionChange = (userIds: string[]) => {
        setSelectedUsers(userIds);
    };

    const hasActiveFilters = searchQuery !== '' || selectedRole !== 'all';

    return (
        <div className="space-y-6">
            <UserStats users={users} />

            <UserFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
                roles={roles}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
            />

            {viewMode === 'selection' && (
                <UserBulkActions users={filteredUsers} selectedUsers={selectedUsers} onSelectionChange={handleSelectionChange} />
            )}

            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Mostrando {filteredUsers.length} de {users.length} usuarios
                </div>

                <div className="flex items-center gap-2">
                    <Button variant={viewMode === 'tabs' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('tabs')}>
                        <List className="mr-2 h-4 w-4" />
                        Roles
                    </Button>
                    <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')}>
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        Grid
                    </Button>
                    <Button variant={viewMode === 'selection' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('selection')}>
                        <Grid3X3 className="mr-2 h-4 w-4" />
                        Selección
                    </Button>
                </div>
            </div>

            {viewMode === 'tabs' ? (
                <UserRoleTabs users={users} roles={roles} searchQuery={searchQuery} />
            ) : viewMode === 'selection' ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredUsers.map((user) => (
                        <UserCardWithSelection
                            key={user.id}
                            user={user}
                            isSelected={selectedUsers.includes(user.id)}
                            onSelectionChange={handleUserSelection}
                        />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredUsers.map((user) => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>
            )}

            {filteredUsers.length === 0 && hasActiveFilters && (
                <div className="py-12 text-center">
                    <div className="mb-2 text-lg text-gray-400">No se encontraron usuarios</div>
                    <div className="mb-4 text-sm text-gray-500">Intenta ajustar tus filtros de búsqueda</div>
                    <Button variant="outline" onClick={handleClearFilters}>
                        Limpiar filtros
                    </Button>
                </div>
            )}
        </div>
    );
};
