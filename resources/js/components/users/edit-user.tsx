import { Role } from '@/interfaces/role';
import { UserFormData, UserResource } from '@/interfaces/user';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
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

    const { data, setData, put, processing, errors, clearErrors, reset } = useForm<UserFormData>({
        name: '',
        email: '',
        role: '',
    });

    useEffect(() => {
        if (open) {
            setData('name', user.name);
            setData('email', user.email);
            setData('role', user.role);
        }
    }, [user, open]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('users.update', user.id), {
            onSuccess: () => {
                handleCancel();
            },
        });
    };

    const handleCancel = () => {
        onOpenChange(false);
        reset();
        clearErrors();
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Editar usuario</SheetTitle>
                    <SheetDescription>Edita la información del usuario {user.name}</SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-200px)]">
                    <form id="user-form" onSubmit={handleSubmit}>
                        <FormUser data={data} setData={setData} errors={errors} roles={roles} />
                    </form>
                </ScrollArea>
                <SheetFooter className="grid grid-cols-2 gap-6">
                    <Button type="submit" variant="default" form="user-form" disabled={processing}>
                        {processing ? 'Actualizando...' : 'Actualizar usuario'}
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline" onClick={handleCancel}>
                            Cancelar
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
