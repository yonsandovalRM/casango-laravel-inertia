import { PlanResource } from '@/pages/interfaces/plan';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';

export const EditPlan = ({ plan }: { plan: PlanResource }) => {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(true)}>
                    <PencilIcon className="size-4" />
                    Editar plan
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Editar plan</SheetTitle>
                    <SheetDescription>Edita el plan para tu aplicación</SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-200px)]">
                    <form id="plan-form" onSubmit={() => {}}>
                        {/* <FormPlan
            errors={errors}
            control={control}
            formErrors={formErrors}
            handleAddFeature={handleAddFeature}
            handleRemoveFeature={handleRemoveFeature}
            tempFeature={tempFeature}
            setTempFeature={setTempFeature}
            features={features as string[]}
            errorFeatures={errorFeatures}
            watch={watch}
            handleReorderFeatures={handleReorderFeatures}
          /> */}
                    </form>
                </ScrollArea>
                <SheetFooter className="grid grid-cols-2 gap-4">
                    <Button
                        type="submit"
                        variant="default"
                        // disabled={mutation.isPending}
                        form="plan-form"
                    >
                        {/* {mutation.isPending ? 'Actualizando...' : 'Actualizar plan'} */}
                        Actualizar plan
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
