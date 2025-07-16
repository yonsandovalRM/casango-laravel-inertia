import { CalendarFilters as FilterType } from '@/interfaces/calendar';
import { Filter, Search } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';

interface CalendarFiltersProps {
    show: boolean;
    filters: FilterType;
    onFiltersChange: (filters: FilterType) => void;
}

export const CalendarFilters: React.FC<CalendarFiltersProps> = ({ show, filters, onFiltersChange }) => {
    if (!show) return null;

    const handleSearchChange = (search: string) => {
        onFiltersChange({ ...filters, search });
    };

    const handleStatusChange = (status: string) => {
        onFiltersChange({ ...filters, status });
    };

    const handleClearFilters = () => {
        onFiltersChange({ status: 'all', search: '' });
    };

    return (
        <div className="border-b border-border bg-gray-50 p-4 dark:bg-card">
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <Search size={16} className="text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar cliente o servicio..."
                        value={filters.search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="rounded-lg border border-border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-500" />
                    <select
                        value={filters.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="rounded-lg border border-border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="pending">Pendientes</option>
                        <option value="confirmed">Confirmadas</option>
                        <option value="cancelled">Canceladas</option>
                        <option value="completed">Completadas</option>
                        <option value="no_show">No asistió</option>
                        <option value="rescheduled">Reagendadas</option>
                    </select>
                </div>

                <Button variant="ghost" onClick={handleClearFilters}>
                    Limpiar filtros
                </Button>
            </div>
        </div>
    );
};
