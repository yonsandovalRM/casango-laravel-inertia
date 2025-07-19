import { CategoryFormData, CategoryResource } from '@/interfaces/category';
import { router, useForm } from '@inertiajs/react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface CategoryContextType {
    // Estados principales
    category: CategoryResource | null;
    setCategory: (category: CategoryResource | null) => void;
    categories: CategoryResource[];
    setCategoriesList: (categories: CategoryResource[]) => void;

    // Estados de UI
    open: boolean;
    setOpen: (open: boolean) => void;
    loading: boolean;
    processing: boolean;

    // Estados de filtrado y búsqueda
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: 'all' | 'active' | 'inactive';
    setStatusFilter: (status: 'all' | 'active' | 'inactive') => void;
    sortBy: 'name' | 'created_at' | 'services_count';
    setSortBy: (sort: 'name' | 'created_at' | 'services_count') => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: (order: 'asc' | 'desc') => void;

    // Datos del formulario
    data: CategoryFormData;
    setData: (data: any) => void;
    errors: any;
    reset: () => void;
    clearErrors: () => void;

    // Acciones principales
    handleSubmit: (e: any) => void;
    handleCancel: () => void;
    onDelete: (categoryId: string) => void;
    onToggleStatus: (categoryId: string) => void;

    // Funciones de filtrado
    filteredCategories: CategoryResource[];

    // Funciones de utilidad
    duplicateCategory: (category: CategoryResource) => void;
    exportCategories: () => void;
    bulkDelete: (categoryIds: string[]) => void;
    bulkToggleStatus: (categoryIds: string[], status: boolean) => void;

    // Estados de selección múltiple
    selectedCategories: string[];
    setSelectedCategories: (ids: string[]) => void;
    toggleCategorySelection: (id: string) => void;
    selectAllCategories: () => void;
    clearSelection: () => void;

    // Estadísticas en tiempo real
    getStatistics: () => {
        total: number;
        active: number;
        inactive: number;
        withServices: number;
        empty: number;
    };
}

export const CategoryContext = createContext<CategoryContextType>({
    category: null,
    setCategory: () => {},
    categories: [],
    setCategoriesList: () => {},
    open: false,
    setOpen: () => {},
    loading: false,
    processing: false,
    searchTerm: '',
    setSearchTerm: () => {},
    statusFilter: 'all',
    setStatusFilter: () => {},
    sortBy: 'name',
    setSortBy: () => {},
    sortOrder: 'asc',
    setSortOrder: () => {},
    data: { name: '', is_active: true },
    setData: () => {},
    errors: null,
    reset: () => {},
    clearErrors: () => {},
    handleSubmit: () => {},
    handleCancel: () => {},
    onDelete: () => {},
    onToggleStatus: () => {},
    filteredCategories: [],
    duplicateCategory: () => {},
    exportCategories: () => {},
    bulkDelete: () => {},
    bulkToggleStatus: () => {},
    selectedCategories: [],
    setSelectedCategories: () => {},
    toggleCategorySelection: () => {},
    selectAllCategories: () => {},
    clearSelection: () => {},
    getStatistics: () => ({ total: 0, active: 0, inactive: 0, withServices: 0, empty: 0 }),
});

interface CategoryProviderProps {
    children: React.ReactNode;
    initialCategories?: CategoryResource[];
}

export const CategoryProvider = ({ children, initialCategories = [] }: CategoryProviderProps) => {
    // Estados principales
    const [category, setCategory] = useState<CategoryResource | null>(null);
    const [categories, setCategoriesList] = useState<CategoryResource[]>(initialCategories);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Estados de filtrado
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'services_count'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Estados de selección múltiple
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // Formulario
    const {
        data,
        setData,
        put,
        post,
        errors,
        processing,
        reset,
        clearErrors,
        delete: destroy,
    } = useForm<CategoryFormData>({
        name: '',
        is_active: true,
    });

    // Sincronizar datos del formulario con la categoría seleccionada
    useEffect(() => {
        if (category && open) {
            setData({
                name: category.name || '',
                is_active: category.is_active ?? true,
            });
        } else if (!category && open) {
            reset();
        }
    }, [category, open]);

    // Categorías filtradas
    const filteredCategories = useCallback(() => {
        let filtered = [...categories];

        // Filtro por término de búsqueda
        if (searchTerm) {
            filtered = filtered.filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // Filtro por estado
        if (statusFilter !== 'all') {
            filtered = filtered.filter((cat) => (statusFilter === 'active' ? cat.is_active : !cat.is_active));
        }

        // Ordenamiento
        filtered.sort((a, b) => {
            let aValue: any = a[sortBy];
            let bValue: any = b[sortBy];

            // Manejar valores de fecha
            if (sortBy === 'created_at') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            // Manejar valores numéricos
            if (sortBy === 'services_count') {
                aValue = aValue || 0;
                bValue = bValue || 0;
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [categories, searchTerm, statusFilter, sortBy, sortOrder]);

    // Función para manejar el envío del formulario
    const handleSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            if (category?.id) {
                put(route('categories.update', category.id), {
                    onSuccess: () => {
                        toast.success('Categoría actualizada correctamente');
                        handleCancel();
                        // Actualizar la lista local
                        setCategoriesList((prev) =>
                            prev.map((cat) => (cat.id === category.id ? { ...cat, ...data, updated_at: new Date().toISOString() } : cat)),
                        );
                    },
                    onError: () => {
                        toast.error('Error al actualizar la categoría');
                    },
                });
            } else {
                post(route('categories.store'), {
                    onSuccess: (response: any) => {
                        toast.success('Categoría creada correctamente');
                        handleCancel();
                        // Agregar la nueva categoría a la lista local
                        if (response.props?.category) {
                            setCategoriesList((prev) => [response.props.category, ...prev]);
                        }
                    },
                    onError: () => {
                        toast.error('Error al crear la categoría');
                    },
                });
            }
        },
        [category, data, put, post],
    );

    // Función para cancelar y resetear
    const handleCancel = useCallback(() => {
        setOpen(false);
        setCategory(null);
        reset();
        clearErrors();
        clearSelection();
    }, [reset, clearErrors]);

    // Función para eliminar categoría
    const onDelete = useCallback(
        (categoryId: string) => {
            if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
                destroy(route('categories.destroy', categoryId), {
                    onSuccess: () => {
                        toast.success('Categoría eliminada correctamente');
                        setCategoriesList((prev) => prev.filter((cat) => cat.id !== categoryId));
                        clearSelection();
                    },
                    onError: () => {
                        toast.error('Error al eliminar la categoría');
                    },
                });
            }
        },
        [destroy],
    );

    // Función para cambiar estado de categoría
    const onToggleStatus = useCallback(
        (categoryId: string) => {
            const categoryToUpdate = categories.find((cat) => cat.id === categoryId);
            if (!categoryToUpdate) return;

            const newStatus = !categoryToUpdate.is_active;

            router.put(
                route('categories.update', categoryId),
                {
                    data: {
                        name: categoryToUpdate.name,
                        is_active: newStatus,
                    } as any,
                },
                {
                    onSuccess: () => {
                        toast.success(`Categoría ${newStatus ? 'activada' : 'desactivada'} correctamente`);
                        setCategoriesList((prev) => prev.map((cat) => (cat.id === categoryId ? { ...cat, is_active: newStatus } : cat)));
                    },
                    onError: () => {
                        toast.error('Error al cambiar el estado de la categoría');
                    },
                },
            );
        },
        [categories, put],
    );

    // Función para duplicar categoría
    const duplicateCategory = useCallback(
        (categoryToDuplicate: CategoryResource) => {
            const newCategoryData = {
                name: `${categoryToDuplicate.name} (Copia)`,
                is_active: categoryToDuplicate.is_active,
            };

            router.post(
                route('categories.store'),
                {
                    data: newCategoryData as any,
                },
                {
                    onSuccess: (response: any) => {
                        toast.success('Categoría duplicada correctamente');
                        if (response.props?.category) {
                            setCategoriesList((prev) => [response.props.category, ...prev]);
                        }
                    },
                    onError: () => {
                        toast.error('Error al duplicar la categoría');
                    },
                },
            );
        },
        [post],
    );

    // Función para exportar categorías
    const exportCategories = useCallback(() => {
        setLoading(true);

        // Simular exportación - aquí harías la llamada real a la API
        setTimeout(() => {
            const csvContent = [
                ['Nombre', 'Estado', 'Servicios', 'Fecha de Creación'],
                ...filteredCategories().map((cat) => [
                    cat.name,
                    cat.is_active ? 'Activa' : 'Inactiva',
                    cat.services_count || 0,
                    new Date(cat.created_at || '').toLocaleDateString(),
                ]),
            ]
                .map((row) => row.join(','))
                .join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `categorias_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            setLoading(false);
            toast.success('Categorías exportadas correctamente');
        }, 1000);
    }, [filteredCategories]);

    // Funciones de selección múltiple
    const toggleCategorySelection = useCallback((id: string) => {
        setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]));
    }, []);

    const selectAllCategories = useCallback(() => {
        setSelectedCategories(filteredCategories().map((cat) => cat.id));
    }, [filteredCategories]);

    const clearSelection = useCallback(() => {
        setSelectedCategories([]);
    }, []);

    // Operaciones en lote
    const bulkDelete = useCallback((categoryIds: string[]) => {
        if (confirm(`¿Estás seguro de que quieres eliminar ${categoryIds.length} categorías?`)) {
            // Aquí harías llamadas individuales o una llamada bulk a la API
            Promise.all(categoryIds.map((id) => fetch(route('categories.destroy', id), { method: 'DELETE' })))
                .then(() => {
                    setCategoriesList((prev) => prev.filter((cat) => !categoryIds.includes(cat.id)));
                    clearSelection();
                    toast.success(`${categoryIds.length} categorías eliminadas correctamente`);
                })
                .catch(() => {
                    toast.error('Error al eliminar las categorías');
                });
        }
    }, []);

    const bulkToggleStatus = useCallback(
        (categoryIds: string[], status: boolean) => {
            // Implementar operación en lote para cambiar estado
            Promise.all(
                categoryIds.map((id) => {
                    const category = categories.find((cat) => cat.id === id);
                    if (!category) return Promise.resolve();

                    return fetch(route('categories.update', id), {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: category.name,
                            is_active: status,
                        }),
                    });
                }),
            )
                .then(() => {
                    setCategoriesList((prev) => prev.map((cat) => (categoryIds.includes(cat.id) ? { ...cat, is_active: status } : cat)));
                    clearSelection();
                    toast.success(`${categoryIds.length} categorías ${status ? 'activadas' : 'desactivadas'} correctamente`);
                })
                .catch(() => {
                    toast.error('Error al cambiar el estado de las categorías');
                });
        },
        [categories],
    );

    // Función para obtener estadísticas
    const getStatistics = useCallback(() => {
        return {
            total: categories.length,
            active: categories.filter((cat) => cat.is_active).length,
            inactive: categories.filter((cat) => !cat.is_active).length,
            withServices: categories.filter((cat) => (cat.services_count || 0) > 0).length,
            empty: categories.filter((cat) => (cat.services_count || 0) === 0).length,
        };
    }, [categories]);

    const value: CategoryContextType = {
        // Estados principales
        category,
        setCategory,
        categories,
        setCategoriesList,

        // Estados de UI
        open,
        setOpen,
        loading,
        processing,

        // Estados de filtrado
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,

        // Datos del formulario
        data,
        setData,
        errors,
        reset,
        clearErrors,

        // Acciones principales
        handleSubmit,
        handleCancel,
        onDelete,
        onToggleStatus,

        // Funciones de filtrado
        filteredCategories: filteredCategories(),

        // Funciones de utilidad
        duplicateCategory,
        exportCategories,
        bulkDelete,
        bulkToggleStatus,

        // Estados de selección múltiple
        selectedCategories,
        setSelectedCategories,
        toggleCategorySelection,
        selectAllCategories,
        clearSelection,

        // Estadísticas
        getStatistics,
    };

    return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};

export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategory must be used within a CategoryProvider');
    }
    return context;
};
