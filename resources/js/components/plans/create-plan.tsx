import { PlanFormData } from '@/interfaces/plan';
import { useForm } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { FormPlan } from './form-plan';

export const CreatePlan = () => {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm<PlanFormData>({
        name: '',
        description: '',
        price_monthly: 0,
        price_annual: 0,
        currency: 'USD',
        is_free: false,
        is_popular: false,
        features: [],
        trial_days: 0,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('plans.store'), {
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
                    Crear plan
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Crear plan</SheetTitle>
                    <SheetDescription>Crea un nuevo plan para tu aplicación</SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-180px)]">
                    <form id="plan-form" onSubmit={handleSubmit}>
                        <FormPlan data={data} setData={setData} errors={errors} />
                    </form>
                </ScrollArea>
                <SheetFooter className="grid grid-cols-2 gap-4">
                    <Button type="submit" variant="default" form="plan-form" disabled={processing}>
                        {processing ? 'Creando...' : 'Crear plan'}
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
