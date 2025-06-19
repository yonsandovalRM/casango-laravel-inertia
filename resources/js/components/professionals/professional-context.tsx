import { ProfessionalFormData, ProfessionalResource } from '@/interfaces/professional';
import { useForm } from '@inertiajs/react';
import { createContext, useContext, useEffect, useState } from 'react';

interface ProfessionalContextType {
    professional: ProfessionalResource | null;
    setProfessional: (professional: ProfessionalResource | null) => void;
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

export const ProfessionalContext = createContext<ProfessionalContextType>({
    professional: null,
    setProfessional: () => {},
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

export const ProfessionalProvider = ({ children }: { children: React.ReactNode }) => {
    const [professional, setProfessional] = useState<ProfessionalResource | null>(null);
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
    } = useForm<ProfessionalFormData>({
        photo: '',
        bio: '',
        title: '',
        is_company_schedule: false,
    });
    useEffect(() => {
        if (professional) {
            setData({
                photo: professional.photo || '',
                bio: professional.bio || '',
                title: professional.title || '',
                is_company_schedule: professional.is_company_schedule || false,
            });
        }
    }, [professional, open]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (professional?.id) {
            put(route('professionals.update', professional.id), {
                onSuccess: () => {
                    handleCancel();
                },
            });
        } else {
            post(route('professionals.store'), {
                onSuccess: () => {
                    handleCancel();
                },
            });
        }
    };

    const handleCancel = () => {
        setOpen(false);
        setProfessional(null);
        reset();
        clearErrors();
    };

    const onDelete = (professionalId: string) => {
        destroy(route('professionals.destroy', professionalId), {
            onSuccess: () => {
                handleCancel();
            },
        });
    };

    return (
        <ProfessionalContext.Provider
            value={{
                professional,
                setProfessional,
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
        </ProfessionalContext.Provider>
    );
};

export const useProfessional = () => {
    return useContext(ProfessionalContext);
};
