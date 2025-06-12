import { LayoutGrid, List, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export const TenantFilters = () => {
    return (
        <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Input type="text" placeholder="Buscar" />
                <Button variant="outline">
                    <Search className="size-4" />
                    Buscar
                </Button>
            </div>
            {/* ordenar */}
            <div className="flex items-center gap-2">
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Ordenar" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Nombre</SelectItem>
                        <SelectItem value="created_at">Fecha de creación</SelectItem>
                        <SelectItem value="updated_at">Fecha de actualización</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline">
                    <LayoutGrid className="size-4" />
                </Button>
                <Button variant="outline">
                    <List className="size-4" />
                </Button>
            </div>
        </div>
    );
};
