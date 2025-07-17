import { TenantCategoryResource } from '@/interfaces/tenant-category';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet';
import { FormTenantCategory } from './form-tenant-category';

export const EditTenantCategory = ({
    tenantCategory,
    open,
    setOpen,
}: {
    tenantCategory: TenantCategoryResource | null;
    open: boolean;
    setOpen: (open: boolean) => void;
}) => {
    const { t } = useTranslation();

    const { data, setData, put, processing, errors, clearErrors, reset } = useForm({
        id: tenantCategory?.id,
        name: tenantCategory?.name,
        description: tenantCategory?.description,
        is_active: tenantCategory?.is_active,
    });

    useEffect(() => {
        setData({
            id: tenantCategory?.id,
            name: tenantCategory?.name,
            description: tenantCategory?.description,
            is_active: tenantCategory?.is_active,
        });
    }, [tenantCategory]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('tenant-categories.update', { tenantCategory: data.id }), {
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

    if (!tenantCategory) return null;

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{t('tenantCategories.actions.edit')}</SheetTitle>
                    <SheetDescription>{t('tenantCategories.actions.editDescription')}</SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-180px)]">
                    <form id="tenant-category-form" onSubmit={handleSubmit}>
                        <FormTenantCategory data={data} setData={setData} errors={errors} />
                    </form>
                </ScrollArea>
                <SheetFooter className="grid grid-cols-2 gap-6">
                    <Button type="submit" variant="default" form="tenant-category-form" disabled={processing}>
                        {processing ? t('tenantCategories.actions.editing') : t('tenantCategories.actions.edit')}
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline" onClick={handleCancel}>
                            {t('tenantCategories.actions.cancel')}
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
