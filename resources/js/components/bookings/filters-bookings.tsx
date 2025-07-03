import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import { BookingFilters, BookingResource, ServiceOption } from '@/interfaces/booking';
import { router } from '@inertiajs/react';
import { ArrowUpDown, ChevronDownIcon, Filter, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale'; // Opcional: para español

interface FiltersBookingsProps {
    bookings: BookingResource[];
    filters: BookingFilters;
    services: ServiceOption[];
}

export default function FiltersBookings({ bookings, filters, services }: FiltersBookingsProps) {
    const [localFilters, setLocalFilters] = useState<BookingFilters>(filters);
    const [isFiltering, setIsFiltering] = useState(false);
    const [openDateFrom, setOpenDateFrom] = useState(false);
    const [openDateTo, setOpenDateTo] = useState(false);

    // Debounce para la búsqueda
    const debouncedSearch = useDebounce(localFilters.search, 500);

    // Estados de filtros disponibles
    const statusOptions = [
        { value: 'all', label: 'Todos los estados' },
        { value: 'pending', label: 'Pendiente' },
        { value: 'confirmed', label: 'Confirmada' },
        { value: 'cancelled', label: 'Cancelada' },
        { value: 'completed', label: 'Completada' },
    ];

    const sortOptions = [
        { value: 'date', label: 'Fecha' },
        { value: 'time', label: 'Hora' },
        { value: 'status', label: 'Estado' },
        { value: 'total', label: 'Total' },
        { value: 'created_at', label: 'Creación' },
    ];

    // Actualizar filtros cuando cambie la búsqueda con debounce
    useEffect(() => {
        if (debouncedSearch !== filters.search) {
            updateFilters({ search: debouncedSearch });
        }
    }, [debouncedSearch]);
    // Función para formatear fecha en formato legible (DD/MM/YYYY)
    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return 'Seleccionar fecha';
        return format(parseISO(dateString), 'dd/MM/yyyy', { locale: es }); // Opcional: locale para español
    };

    // Función para formatear fecha en formato YYYY-MM-DD (para inputs)
    const formatInputDate = (date: Date) => {
        return format(date, 'yyyy-MM-dd');
    };

    // Función para actualizar filtros en la URL
    const updateFilters = (newFilters: Partial<BookingFilters>) => {
        const updatedFilters = { ...localFilters, ...newFilters };

        // Limpiar filtros vacíos para URL más limpia
        const cleanFilters = Object.entries(updatedFilters).reduce(
            (acc, [key, value]) => {
                if (value && value !== 'all' && value !== '') {
                    acc[key] = value;
                }
                return acc;
            },
            {} as Record<string, string>,
        );

        setIsFiltering(true);

        router.get(window.location.pathname, cleanFilters, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsFiltering(false),
        });
    };

    // Limpiar todos los filtros
    const clearFilters = () => {
        setLocalFilters({
            search: '',
            status: 'all',
            service: 'all',
            date_from: formatInputDate(new Date()),
            date_to: formatInputDate(new Date()),
            sort_by: 'date',
            sort_direction: 'asc',
        });

        router.get(
            window.location.pathname,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Cambiar dirección de ordenamiento
    const toggleSortDirection = () => {
        const newDirection = localFilters.sort_direction === 'asc' ? 'desc' : 'asc';
        setLocalFilters((prev) => ({ ...prev, sort_direction: newDirection }));
        updateFilters({ sort_direction: newDirection });
    };

    // Contar filtros activos
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.search) count++;
        if (filters.status !== 'all') count++;
        if (filters.service !== 'all') count++;
        if (filters.date_from !== new Date().toISOString().split('T')[0]) count++;
        if (filters.date_to !== new Date().toISOString().split('T')[0]) count++;
        return count;
    }, [filters]);

    // Obtener bookings filtrados para mostrar el conteo
    const filteredCount = bookings.length;

    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-4">
                    {/* Primera fila: Búsqueda y contadores */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-md flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                            <Input
                                placeholder="Buscar por servicio o profesional..."
                                className="pl-10"
                                value={localFilters.search}
                                onChange={(e) => setLocalFilters((prev) => ({ ...prev, search: e.target.value }))}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            {activeFiltersCount > 0 && (
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Filter className="h-3 w-3" />
                                        {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''}
                                    </Badge>
                                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
                                        <X className="h-3 w-3" />
                                        Limpiar
                                    </Button>
                                </div>
                            )}

                            <div className="text-sm text-muted-foreground">
                                {isFiltering ? (
                                    <span className="flex items-center gap-1">
                                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        Filtrando...
                                    </span>
                                ) : (
                                    `${filteredCount} reserva${filteredCount !== 1 ? 's' : ''}`
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Segunda fila: Filtros */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {/* Estado */}
                        <Select
                            value={localFilters.status}
                            onValueChange={(value) => {
                                setLocalFilters((prev) => ({ ...prev, status: value }));
                                updateFilters({ status: value });
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Servicio */}
                        <Select
                            value={localFilters.service}
                            onValueChange={(value) => {
                                setLocalFilters((prev) => ({ ...prev, service: value }));
                                updateFilters({ service: value });
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Servicio" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los servicios</SelectItem>
                                {services.map((service) => (
                                    <SelectItem key={service.id} value={service.id}>
                                        {service.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Fecha desde */}
                        <div className="relative">
                            <Popover open={openDateFrom} onOpenChange={setOpenDateFrom}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" id="date" className="w-48 justify-between font-normal">
                                        {formatDisplayDate(localFilters.date_from)}
                                        <ChevronDownIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={localFilters.date_from ? parseISO(localFilters.date_from) : undefined}
                                        onSelect={(date) => {
                                            if (date) {
                                                const newDateFrom = formatInputDate(date);
                                                const dateTo = parseISO(localFilters.date_to);

                                                // Si la nueva fecha from es posterior a la fecha to, actualiza ambas
                                                if (date > dateTo) {
                                                    setLocalFilters((prev) => ({
                                                        ...prev,
                                                        date_from: newDateFrom,
                                                        date_to: newDateFrom, // Establece la misma fecha
                                                    }));
                                                    updateFilters({
                                                        date_from: newDateFrom,
                                                        date_to: newDateFrom,
                                                    });
                                                } else {
                                                    setLocalFilters((prev) => ({ ...prev, date_from: newDateFrom }));
                                                    updateFilters({ date_from: newDateFrom });
                                                }
                                                setOpenDateFrom(false);
                                            }
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Fecha hasta */}
                        <div className="relative">
                            <Popover open={openDateTo} onOpenChange={setOpenDateTo}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" id="date" className="w-48 justify-between font-normal">
                                        {formatDisplayDate(localFilters.date_to)}
                                        <ChevronDownIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={localFilters.date_to ? parseISO(localFilters.date_to) : undefined}
                                        onSelect={(date) => {
                                            if (date) {
                                                const newDateTo = formatInputDate(date);
                                                const dateFrom = parseISO(localFilters.date_from);

                                                // Si la nueva fecha to es anterior a la fecha from, actualiza from
                                                if (date < dateFrom) {
                                                    setLocalFilters((prev) => ({
                                                        ...prev,
                                                        date_from: newDateTo,
                                                        date_to: newDateTo,
                                                    }));
                                                    updateFilters({
                                                        date_from: newDateTo,
                                                        date_to: newDateTo,
                                                    });
                                                } else {
                                                    setLocalFilters((prev) => ({ ...prev, date_to: newDateTo }));
                                                    updateFilters({ date_to: newDateTo });
                                                }
                                                setOpenDateTo(false);
                                            }
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Ordenamiento */}
                        <div className="flex gap-2">
                            <Select
                                value={localFilters.sort_by}
                                onValueChange={(value) => {
                                    setLocalFilters((prev) => ({ ...prev, sort_by: value }));
                                    updateFilters({ sort_by: value });
                                }}
                            >
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Ordenar por" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sortOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={toggleSortDirection}
                                className="shrink-0"
                                title={`Ordenar ${localFilters.sort_direction === 'asc' ? 'descendente' : 'ascendente'}`}
                            >
                                <ArrowUpDown
                                    className={`h-4 w-4 transition-transform ${localFilters.sort_direction === 'desc' ? 'rotate-180' : ''}`}
                                />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
