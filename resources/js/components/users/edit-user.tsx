import { UserFormData, UserResource } from '@/interfaces/user';
import { useForm } from '@inertiajs/react';
import { PencilIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { FormUser } from './form-user';

export const EditUser = ({ user }: { user: UserResource }) => {
    const [open, setOpen] = useState(false);

    const { data, setData, put, processing, errors, clearErrors, reset } = useForm<UserFormData>({
        name: '',
        email: '',
        role: '',
    });

    useEffect(() => {
        setData('name', user.name);
        setData('email', user.email);
        setData('role', user.role);
    }, [user]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('users.update', user.id), {
            onSuccess: () => {
                handleCancel();
            },
        });
    };
    const handleCancel = () => {
        setOpen(false);
        reset();
        clearErrors();
    };
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => setOpen(true)}>
                    <PencilIcon className="size-4" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Editar usuario</SheetTitle>
                    <SheetDescription>Edita el usuario para tu aplicación</SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-200px)]">
                    <form id="user-form" onSubmit={handleSubmit}>
                        <FormUser data={data} setData={setData} errors={errors} />
                    </form>
                </ScrollArea>
                <SheetFooter className="grid grid-cols-2 gap-4">
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
