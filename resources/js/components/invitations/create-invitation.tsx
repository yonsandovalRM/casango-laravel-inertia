import { InvitationFormData } from '@/interfaces/invitation';
import { Role } from '@/interfaces/role';
import { useForm, usePage } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { FormInvitation } from './form-invitation';

export const CreateInvitation = () => {
    const { roles } = usePage<{ roles: Role[] }>().props;
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm<InvitationFormData>({
        name: '',
        email: '',
        role: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('invitations.store'), {
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
                <Button variant="default" onClick={() => setOpen(true)}>
                    <PlusIcon className="size-4" />
                    Crear invitación
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Crear invitación</SheetTitle>
                    <SheetDescription>Crea una nueva invitación para un usuario</SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-180px)]">
                    <form id="invitation-form" onSubmit={handleSubmit}>
                        <FormInvitation data={data} setData={setData} errors={errors} roles={roles} />
                    </form>
                </ScrollArea>
                <SheetFooter className="grid grid-cols-2 gap-6">
                    <Button type="submit" variant="default" form="invitation-form" disabled={processing}>
                        {processing ? 'Creando...' : 'Crear invitación'}
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
