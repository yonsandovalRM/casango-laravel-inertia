import { CategoryResource } from '@/interfaces/category';
import { TFunction } from 'i18next';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    CheckCircle2,
    Copy,
    Download,
    Edit,
    Eye,
    Filter,
    Grid3X3,
    List,
    MoreHorizontal,
    Package,
    Plus,
    Power,
    PowerOff,
    Search,
    Settings,
    Trash2,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { AppHeaderPage } from '../app-header-page';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { EmptyState } from '../ui/empty-state';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CategoryCharts } from './category-charts';
import { useCategory } from './category-context';
import { CategoryStats } from './category-stats';
import { FormCategory } from './form-category';

interface ManageCategoryProps {
    categories: CategoryResource[];
    stats: any;
    chartData: any;
    t: TFunction;
}

export function ManageCategory({ categories, stats, chartData, t }: ManageCategoryProps) {
    const {
        setCategory,
        setOpen,
        onDelete,
        onToggleStatus,
        duplicateCategory,
        exportCategories,
        bulkDelete,
        bulkToggleStatus,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        filteredCategories,
        selectedCategories,
        toggleCategorySelection,
        selectAllCategories,
        clearSelection,
        loading,
        setCategoriesList,
    } = useCategory();

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showStats, setShowStats] = useState(true);

    // Inicializar categorías en el contexto
    useState(() => {
        setCategoriesList(categories);
    });

    const handleCreate = () => {
        setCategory(null);
        setOpen(true);
    };

    const handleEdit = (category: CategoryResource) => {
        setCategory(category);
        setOpen(true);
    };

    const handleSelectAll = () => {
        if (selectedCategories.length === filteredCategories.length) {
            clearSelection();
        } else {
            selectAllCategories();
        }
    };

    const handleBulkAction = (action: string) => {
        if (selectedCategories.length === 0) return;

        switch (action) {
            case 'delete':
                bulkDelete(selectedCategories);
                break;
            case 'activate':
                bulkToggleStatus(selectedCategories, true);
                break;
            case 'deactivate':
                bulkToggleStatus(selectedCategories, false);
                break;
        }
    };

    const toggleSort = (field: 'name' | 'created_at' | 'services_count') => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const getSortIcon = (field: string) => {
        if (sortBy !== field) return <ArrowUpDown className="h-4 w-4" />;
        return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <AppHeaderPage
                title={t('categories.title')}
                description={t('categories.description')}
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={exportCategories} disabled={loading} size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Exportar
                        </Button>
                        <Button onClick={handleCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('categories.manage.create')}
                        </Button>
                    </div>
                }
            />

            {/* Estadísticas */}
            {showStats && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Estadísticas</h3>
                        <Button variant="ghost" size="sm" onClick={() => setShowStats(!showStats)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ocultar
                        </Button>
                    </div>
                    <CategoryStats stats={stats} />
                    <CategoryCharts chartData={chartData} />
                </div>
            )}

            {/* Controles y Filtros */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Barra de búsqueda */}
                        <div className="flex max-w-md flex-1 items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                <Input
                                    placeholder="Buscar categorías..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Controles */}
                        <div className="flex items-center gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-32">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas</SelectItem>
                                    <SelectItem value="active">Activas</SelectItem>
                                    <SelectItem value="inactive">Inactivas</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={viewMode} onValueChange={(value: 'grid' | 'list') => setViewMode(value)}>
                                <SelectTrigger className="w-24">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="grid">
                                        <div className="flex items-center gap-2">
                                            <Grid3X3 className="h-4 w-4" />
                                            Tarjetas
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="list">
                                        <div className="flex items-center gap-2">
                                            <List className="h-4 w-4" />
                                            Lista
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {!showStats && (
                                <Button variant="outline" size="sm" onClick={() => setShowStats(true)}>
                                    <Settings className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Acciones en lote */}
                    {selectedCategories.length > 0 && (
                        <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted p-3">
                            <span className="text-sm text-muted-foreground">{selectedCategories.length} categoría(s) seleccionada(s)</span>
                            <div className="ml-auto flex items-center gap-1">
                                <Button variant="outline" size="sm" onClick={() => handleBulkAction('activate')}>
                                    <Power className="mr-1 h-4 w-4" />
                                    Activar
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleBulkAction('deactivate')}>
                                    <PowerOff className="mr-1 h-4 w-4" />
                                    Desactivar
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction('delete')}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="mr-1 h-4 w-4" />
                                    Eliminar
                                </Button>
                                <Button variant="ghost" size="sm" onClick={clearSelection}>
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Contenido principal */}
            {viewMode === 'grid' ? (
                // Vista de tarjetas
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCategories.length === 0 ? (
                        <div className="col-span-full">
                            <EmptyState
                                action={<Button onClick={handleCreate}>{t('categories.manage.create')}</Button>}
                                text={
                                    searchTerm || statusFilter !== 'all'
                                        ? 'No se encontraron categorías con los filtros aplicados'
                                        : t('categories.manage.no_categories')
                                }
                            />
                        </div>
                    ) : (
                        filteredCategories.map((category) => (
                            <Card key={category.id} className="group transition-all duration-200 hover:shadow-lg">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex flex-1 items-start gap-3">
                                            <Checkbox
                                                checked={selectedCategories.includes(category.id)}
                                                onCheckedChange={() => toggleCategorySelection(category.id)}
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground transition-colors">
                                                    {category.name}
                                                    {category.performance_score && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {category.performance_score}%
                                                        </Badge>
                                                    )}
                                                </CardTitle>
                                                <p className="mt-1 text-sm text-muted-foreground">{category.created_at_human}</p>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(category)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => duplicateCategory(category)}>
                                                    <Copy className="mr-2 h-4 w-4" />
                                                    Duplicar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onToggleStatus(category.id)}>
                                                    {category.is_active ? (
                                                        <>
                                                            <PowerOff className="mr-2 h-4 w-4" />
                                                            Desactivar
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Power className="mr-2 h-4 w-4" />
                                                            Activar
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => onDelete(category.id)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Badge variant={category.is_active ? 'default' : 'secondary'} className="flex items-center gap-1 text-xs">
                                                {category.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                {category.status_label}
                                            </Badge>
                                            {category.services_count !== undefined && (
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Package className="h-3 w-3" />
                                                    {category.services_count} servicios
                                                </div>
                                            )}
                                        </div>

                                        {category.performance_score && (
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Rendimiento</span>
                                                    <span className="font-medium">{category.performance_score}%</span>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-gray-200">
                                                    <div
                                                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                                                        style={{ width: `${category.performance_score}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            ) : (
                // Vista de lista
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b bg-muted/30">
                                    <tr>
                                        <th className="w-12 p-4 text-left">
                                            <Checkbox
                                                checked={filteredCategories.length > 0 && selectedCategories.length === filteredCategories.length}
                                                onCheckedChange={handleSelectAll}
                                                ref={(el) => {
                                                    if (el) {
                                                        el.indeterminate =
                                                            selectedCategories.length > 0 && selectedCategories.length < filteredCategories.length;
                                                    }
                                                }}
                                            />
                                        </th>
                                        <th className="p-4 text-left">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleSort('name')}
                                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                            >
                                                Nombre {getSortIcon('name')}
                                            </Button>
                                        </th>
                                        <th className="p-4 text-left">Estado</th>
                                        <th className="p-4 text-left">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleSort('services_count')}
                                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                            >
                                                Servicios {getSortIcon('services_count')}
                                            </Button>
                                        </th>
                                        <th className="p-4 text-left">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleSort('created_at')}
                                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                            >
                                                Creado {getSortIcon('created_at')}
                                            </Button>
                                        </th>
                                        <th className="p-4 text-left">Rendimiento</th>
                                        <th className="w-24 p-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCategories.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center">
                                                <EmptyState
                                                    action={<Button onClick={handleCreate}>{t('categories.manage.create')}</Button>}
                                                    text={
                                                        searchTerm || statusFilter !== 'all'
                                                            ? 'No se encontraron categorías con los filtros aplicados'
                                                            : t('categories.manage.no_categories')
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCategories.map((category) => (
                                            <tr key={category.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4">
                                                    <Checkbox
                                                        checked={selectedCategories.includes(category.id)}
                                                        onCheckedChange={() => toggleCategorySelection(category.id)}
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium">{category.name}</div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge
                                                        variant={category.is_active ? 'default' : 'secondary'}
                                                        className="flex w-fit items-center gap-1 text-xs"
                                                    >
                                                        {category.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                        {category.status_label}
                                                    </Badge>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <Package className="h-3 w-3" />
                                                        {category.services_count || 0}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-sm text-muted-foreground">{category.created_at_human}</span>
                                                </td>
                                                <td className="p-4">
                                                    {category.performance_score && (
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-2 w-16 rounded-full bg-gray-200">
                                                                <div
                                                                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                                                                    style={{ width: `${category.performance_score}%` }}
                                                                />
                                                            </div>
                                                            <span className="min-w-[35px] text-xs text-muted-foreground">
                                                                {category.performance_score}%
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEdit(category)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => duplicateCategory(category)}>
                                                                <Copy className="mr-2 h-4 w-4" />
                                                                Duplicar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => onToggleStatus(category.id)}>
                                                                {category.is_active ? (
                                                                    <>
                                                                        <PowerOff className="mr-2 h-4 w-4" />
                                                                        Desactivar
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Power className="mr-2 h-4 w-4" />
                                                                        Activar
                                                                    </>
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => onDelete(category.id)}
                                                                className="text-destructive focus:text-destructive"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Eliminar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Formulario modal */}
            <FormCategory />
        </div>
    );
}
