import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { FormPlan } from './form-plan';

export const CreatePlan = () => {
    const [open, setOpen] = useState(false);
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="default" onClick={() => setOpen(true)}>
                    <PlusIcon className="size-4" />
                    Crear plan
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Crear plan</SheetTitle>
                    <SheetDescription>Crea un nuevo plan para tu aplicación</SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-200px)]">
                    <form id="plan-form" onSubmit={() => {}}>
                        <FormPlan />
                    </form>
                </ScrollArea>
                <SheetFooter className="grid grid-cols-2 gap-4">
                    <Button
                        type="submit"
                        variant="default"
                        // disabled={isPending}
                        form="plan-form"
                    >
                        {/* {isPending ? 'Creando...' : 'Crear plan'} */}
                        Crear plan
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
