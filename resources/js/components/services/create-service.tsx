import { ServiceFormData } from '@/interfaces/service';
import { useForm } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { FormService } from './form-service';

export function CreateService() {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const { data, setData, post, errors, processing, reset, clearErrors } = useForm<ServiceFormData>({
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('services.store'), {
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
                    {t('services.create')}
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{t('services.create_title')}</SheetTitle>
                    <SheetDescription>{t('services.create_description')}</SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-180px)]">
                    <form id="service-form" onSubmit={handleSubmit}>
                        <FormService data={data} setData={setData} errors={errors} />
                    </form>
                </ScrollArea>
                <SheetFooter className="grid grid-cols-2 gap-4">
                    <Button type="submit" variant="default" form="service-form" disabled={processing}>
                        {processing ? t('services.creating') : t('services.create')}
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline" onClick={handleCancel}>
                            {t('services.cancel')}
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
