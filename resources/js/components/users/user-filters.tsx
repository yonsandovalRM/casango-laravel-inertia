import { Role } from '@/interfaces/role';
import { Search, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface UserFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedRole: string;
    onRoleChange: (value: string) => void;
    roles: Role[];
    onClearFilters: () => void;
    hasActiveFilters: boolean;
}

export const UserFilters = ({
    searchQuery,
    onSearchChange,
    selectedRole,
    onRoleChange,
    roles,
    onClearFilters,
    hasActiveFilters,
}: UserFiltersProps) => {
    return (
        <div className="mb-6 rounded-lg border bg-card p-4">
            <div className="flex flex-col items-center gap-4 lg:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre o email..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="w-full lg:w-48">
                    <Select value={selectedRole} onValueChange={onRoleChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filtrar por rol" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los roles</SelectItem>
                            {roles.map((role) => (
                                <SelectItem key={role.id} value={role.name}>
                                    {role.display_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {hasActiveFilters && (
                    <Button variant="outline" onClick={onClearFilters} className="w-full lg:w-auto">
                        <X className="mr-2 h-4 w-4" />
                        Limpiar filtros
                    </Button>
                )}
            </div>
        </div>
    );
};
