import { ServiceFormData, ServiceResource } from '@/interfaces/service';
import { useForm } from '@inertiajs/react';
import { createContext, useContext, useEffect, useState } from 'react';

interface ServiceContextType {
    service: ServiceResource | null;
    setService: (service: ServiceResource | null) => void;
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

export const ServiceContext = createContext<ServiceContextType>({
    service: null,
    setService: () => {},
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

export const ServiceProvider = ({ children }: { children: React.ReactNode }) => {
    const [service, setService] = useState<ServiceResource | null>(null);
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
    } = useForm<ServiceFormData>({
        name: '',
        description: '',
        notes: '',
        category: '',
        price: 0,
        duration: 0,
        preparation_time: 0,
        post_service_time: 0,
        is_active: true,
    });
    useEffect(() => {
        if (service) {
            setData({
                name: service.name || '',
                description: service.description || '',
                notes: service.notes || '',
                category: service.category || '',
                price: service.price || 0,
                duration: service.duration || 0,
                preparation_time: service.preparation_time || 0,
                post_service_time: service.post_service_time || 0,
                is_active: service.is_active || true,
            });
        }
    }, [service, open]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (service?.id) {
            put(route('services.update', service.id), {
                onSuccess: () => {
                    handleCancel();
                },
            });
        } else {
            post(route('services.store'), {
                onSuccess: () => {
                    handleCancel();
                },
            });
        }
    };

    const handleCancel = () => {
        setOpen(false);
        setService(null);
        reset();
        clearErrors();
    };

    const onDelete = (serviceId: string) => {
        destroy(route('services.destroy', serviceId), {
            onSuccess: () => {
                handleCancel();
            },
        });
    };

    return (
        <ServiceContext.Provider
            value={{
                service,
                setService,
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
        </ServiceContext.Provider>
    );
};

export const useService = () => {
    return useContext(ServiceContext);
};
