import { CategoryFormData, CategoryResource } from '@/interfaces/category';
import { useForm } from '@inertiajs/react';
import { createContext, useContext, useEffect, useState } from 'react';

interface CategoryContextType {
    category: CategoryResource | null;
    setCategory: (category: CategoryResource | null) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleCancel: () => void;
    data: any;
    setData: (data: any) => void;
    put: (url: string, options: any) => void;
    post: (url: string, options: any) => void;
    errors: any;
    reset: () => void;
    clearErrors: () => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    processing: boolean;
    onDelete: (serviceId: string) => void;
}

export const CategoryContext = createContext<CategoryContextType>({
    category: null,
    setCategory: () => {},
    handleSubmit: () => {},
    handleCancel: () => {},
    data: null,
    setData: () => {},
    put: () => {},
    post: () => {},
    errors: null,
    reset: () => {},
    clearErrors: () => {},
    open: false,
    setOpen: () => {},
    processing: false,
    onDelete: () => {},
});

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
    const [category, setCategory] = useState<CategoryResource | null>(null);
    const [open, setOpen] = useState(false);

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
    useEffect(() => {
        if (category) {
            setData({
                name: category.name || '',
                is_active: category.is_active || true,
            });
        }
    }, [category, open]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (category?.id) {
            put(route('categories.update', category.id), {
                onSuccess: () => {
                    handleCancel();
                },
            });
        } else {
            post(route('categories.store'), {
                onSuccess: () => {
                    handleCancel();
                },
            });
        }
    };

    const handleCancel = () => {
        setOpen(false);
        setCategory(null);
        reset();
        clearErrors();
    };

    const onDelete = (categoryId: string) => {
        destroy(route('categories.destroy', categoryId), {
            onSuccess: () => {
                handleCancel();
            },
        });
    };

    return (
        <CategoryContext.Provider
            value={{
                category,
                setCategory,
                handleSubmit,
                handleCancel,
                data,
                setData,
                put,
                post,
                errors,
                reset,
                clearErrors,
                open,
                setOpen,
                processing,
                onDelete,
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => {
    return useContext(CategoryContext);
};
