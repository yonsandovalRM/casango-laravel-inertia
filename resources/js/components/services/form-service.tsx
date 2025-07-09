import { CategoryResource } from '@/interfaces/category';
import { Loader2, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InlineFormCategory } from '../categories/inline-form-category';
import InputError from '../input-error';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { SelectAutocomplete } from '../ui/select-autocomplete';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet';
import { useService } from './service-context';

export function FormService({ categories }: { categories: CategoryResource[] }) {
    const { t } = useTranslation();
    const [openModal, setOpenModal] = useState(false);
    const { open, handleSubmit, handleCancel, data, setData, errors, processing, service } = useService();

    return (
        <>
            <Sheet open={open} onOpenChange={handleCancel}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{service?.id ? t('services.form.edit') : t('services.form.create')}</SheetTitle>
                        <SheetDescription>
                            {service?.id ? t('services.form.edit_description') : t('services.form.create_description')}
                        </SheetDescription>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(100vh-180px)]">
                        <form id="service-form" onSubmit={handleSubmit}>
                            <div className="grid flex-1 auto-rows-min gap-6 px-4">
                                <div className="flex flex-col gap-6">
                                    <div className="space-y-6 pb-4">
                                        <div>
                                            <Label required>{t('services.form.name')}</Label>
                                            <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div>
                                            <Label>{t('services.form.description')}</Label>
                                            <Input value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
                                            <InputError message={errors.description} />
                                        </div>
                                        <div>
                                            <Label>{t('services.form.notes')}</Label>
                                            <Input value={data.notes} onChange={(e) => setData({ ...data, notes: e.target.value })} />
                                            <InputError message={errors.notes} />
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="flex-1">
                                                <Label required>{t('services.form.category')}</Label>
                                                <SelectAutocomplete
                                                    options={categories}
                                                    value={data.category_id}
                                                    onChange={(value) => setData({ ...data, category_id: value })}
                                                    placeholder={t('services.form.category')}
                                                />
                                                <InputError message={errors.category_id} />
                                            </div>
                                            <div>
                                                <Button type="button" variant="outline" className="mt-6 w-full" onClick={() => setOpenModal(true)}>
                                                    <PlusIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div>
                                            <Label>{t('services.form.price')}</Label>
                                            <Input value={data.price} onChange={(e) => setData({ ...data, price: Number(e.target.value) })} />
                                            <InputError message={errors.price} />
                                        </div>
                                        <div>
                                            <Label required>{t('services.form.duration')}</Label>
                                            <Input value={data.duration} onChange={(e) => setData({ ...data, duration: Number(e.target.value) })} />
                                            <InputError message={errors.duration} />
                                        </div>
                                        <div>
                                            <Label>{t('services.form.preparation_time')}</Label>
                                            <Input
                                                value={data.preparation_time}
                                                onChange={(e) => setData({ ...data, preparation_time: Number(e.target.value) })}
                                            />
                                            <InputError message={errors.preparation_time} />
                                        </div>
                                        <div>
                                            <Label>{t('services.form.post_service_time')}</Label>
                                            <Input
                                                value={data.post_service_time}
                                                onChange={(e) => setData({ ...data, post_service_time: Number(e.target.value) })}
                                            />
                                            <InputError message={errors.post_service_time} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="is_active"
                                                checked={data.is_active}
                                                onCheckedChange={(checked) => setData({ ...data, is_active: checked as boolean })}
                                            />
                                            <Label htmlFor="is_active">{t('services.form.is_active')}</Label>
                                            <InputError message={errors.is_active} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </ScrollArea>
                    <SheetFooter className="grid grid-cols-2 gap-6">
                        <Button type="submit" variant="default" form="service-form" disabled={processing}>
                            {processing ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : service?.id ? (
                                t('services.form.update')
                            ) : (
                                t('services.form.create')
                            )}
                        </Button>
                        <SheetClose asChild>
                            <Button variant="outline" onClick={handleCancel}>
                                {t('services.form.cancel')}
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('categories.form.create')}</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>{t('categories.form.create_description')}</DialogDescription>
                    <InlineFormCategory onSuccess={() => setOpenModal(false)} />
                </DialogContent>
            </Dialog>
        </>
    );
}
