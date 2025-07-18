import { Role } from '@/interfaces/role';
import { UserFormData, UserResource } from '@/interfaces/user';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet';
import { FormUser } from './form-user';

interface EditUserProps {
    user: UserResource;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EditUser = ({ user, open, onOpenChange }: EditUserProps) => {
    const { roles } = usePage<{ roles: Role[] }>().props;
    const formRef = useRef<HTMLFormElement>(null);

    const { data, setData, put, processing, errors, clearErrors, reset } = useForm<UserFormData>({
        name: '',
        email: '',
        role: '',
    });

    useEffect(() => {
        if (open && user) {
            // Reset form and clear errors when opening
            clearErrors();
            setData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || '',
            });
        }
    }, [user, open, setData, clearErrors]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user?.id) return;

        put(route('users.update', user.id), {
            onSuccess: () => {
                handleCancel();
            },
            onError: () => {
                // Keep the sheet open if there are errors
                console.log('Form submission failed');
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCancel = () => {
        // Close the sheet first
        onOpenChange(false);

        // Then reset form data and clear errors
        setTimeout(() => {
            reset();
            clearErrors();
        }, 100);
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            handleCancel();
        } else {
            onOpenChange(newOpen);
        }
    };

    // Don't render if user is not defined
    if (!user) return null;

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent
                className="w-[400px] sm:w-[540px]"
                onInteractOutside={(e) => {
                    // Prevent closing when clicking outside if form is processing
                    if (processing) {
                        e.preventDefault();
                    }
                }}
                onEscapeKeyDown={(e) => {
                    // Prevent closing with escape key if form is processing
                    if (processing) {
                        e.preventDefault();
                    }
                }}
            >
                <SheetHeader>
                    <SheetTitle>Editar usuario</SheetTitle>
                    <SheetDescription>Edita la información del usuario {user.name}</SheetDescription>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                    <form ref={formRef} id="edit-user-form" onSubmit={handleSubmit} className="py-4">
                        <FormUser data={data} setData={setData} errors={errors} roles={roles} />
                    </form>
                </ScrollArea>

                <SheetFooter className="flex-col gap-2 sm:flex-row sm:gap-4">
                    <Button type="submit" form="edit-user-form" disabled={processing} className="w-full sm:w-auto">
                        {processing ? 'Actualizando...' : 'Actualizar usuario'}
                    </Button>
                    <SheetClose asChild>
                        <Button type="button" variant="outline" onClick={handleCancel} disabled={processing} className="w-full sm:w-auto">
                            Cancelar
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
