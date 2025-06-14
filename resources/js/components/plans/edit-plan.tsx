import { PlanFormData, PlanResource } from '@/interfaces/plan';
import { useForm } from '@inertiajs/react';
import { PencilIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import FormPlan from './form-plan';

export default withTranslation()(EditPlan);
function EditPlan({ plan, t }: { plan: PlanResource; t: any }) {
    const [open, setOpen] = useState(false);

    const { data, setData, put, processing, errors, clearErrors, reset } = useForm<PlanFormData>({
        name: '',
        description: '',
        price_monthly: 0,
        price_annual: 0,
        currency: '',
        is_free: false,
        is_popular: false,
        features: [],
        trial_days: 0,
    });

    useEffect(() => {
        setData('name', plan.name);
        setData('description', plan.description);
        setData('price_monthly', plan.price_monthly);
        setData('price_annual', plan.price_annual);
        setData('currency', plan.currency);
        setData('is_free', plan.is_free);
        setData('is_popular', plan.is_popular);
        setData('features', plan.features);
        setData('trial_days', plan.trial_days);
    }, [plan]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('plans.update', plan.id), {
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
                <Button variant="outline" onClick={() => setOpen(true)}>
                    <PencilIcon className="size-4" />
                    {t('plans.edit.action')}
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{t('plans.edit.title')}</SheetTitle>
                    <SheetDescription>{t('plans.edit.description')}</SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-200px)]">
                    <form id="plan-form" onSubmit={handleSubmit}>
                        <FormPlan data={data} setData={setData} errors={errors} />
                    </form>
                </ScrollArea>
                <SheetFooter className="grid grid-cols-2 gap-4">
                    <Button type="submit" variant="default" form="plan-form" disabled={processing}>
                        {processing ? t('plans.edit.updating') : t('plans.edit.action')}
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline" onClick={handleCancel}>
                            {t('plans.edit.cancel')}
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
