// resources/js/components/services/form-service.tsx
import { CategoryResource } from '@/interfaces/category';
import { SERVICE_TYPE_OPTIONS, ServiceType } from '@/interfaces/service';
import { Info, Loader2, PlusIcon } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SelectAutocomplete } from '../ui/select-autocomplete';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet';
import { Textarea } from '../ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useService } from './service-context';

interface FormServiceProps {
    categories: CategoryResource[];
    companyAllowsVideoCalls?: boolean;
}

export function FormService({ categories, companyAllowsVideoCalls = false }: FormServiceProps) {
    const { t } = useTranslation();
    const [openModal, setOpenModal] = useState(false);
    const { open, handleSubmit, handleCancel, data, setData, errors, processing, service } = useService();

    // Filter service type options based on company settings
    const availableServiceTypes = SERVICE_TYPE_OPTIONS.filter((option) => {
        if (!companyAllowsVideoCalls) {
            return option.value === ServiceType.IN_PERSON;
        }
        return true;
    });

    const selectedServiceType = SERVICE_TYPE_OPTIONS.find((option) => option.value === data.service_type);

    return (
        <>
            <Sheet open={open} onOpenChange={handleCancel}>
                <SheetContent className="w-full sm:max-w-[600px]">
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
                                        {/* Basic Information */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium">{t('services.form.basic_info')}</h3>

                                            <div>
                                                <Label required>{t('services.form.name')}</Label>
                                                <Input
                                                    value={data.name}
                                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                                    placeholder={t('services.form.name_placeholder')}
                                                />
                                                <InputError message={errors.name} />
                                            </div>

                                            <div>
                                                <Label>{t('services.form.description')}</Label>
                                                <Textarea
                                                    value={data.description}
                                                    onChange={(e) => setData({ ...data, description: e.target.value })}
                                                    placeholder={t('services.form.description_placeholder')}
                                                    rows={3}
                                                />
                                                <InputError message={errors.description} />
                                            </div>

                                            <div>
                                                <Label>{t('services.form.notes')}</Label>
                                                <Textarea
                                                    value={data.notes}
                                                    onChange={(e) => setData({ ...data, notes: e.target.value })}
                                                    placeholder={t('services.form.notes_placeholder')}
                                                    rows={2}
                                                />
                                                <InputError message={errors.notes} />
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="flex-1">
                                                    <Label required>{t('services.form.category')}</Label>
                                                    <SelectAutocomplete
                                                        options={categories}
                                                        value={data.category_id}
                                                        onChange={(value) => setData({ ...data, category_id: value })}
                                                        placeholder={t('services.form.category_placeholder')}
                                                    />
                                                    <InputError message={errors.category_id} />
                                                </div>
                                                <div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="mt-6 w-full"
                                                        onClick={() => setOpenModal(true)}
                                                    >
                                                        <PlusIcon className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Service Type */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium">{t('services.form.service_type_section')}</h3>

                                            <div>
                                                <Label required>{t('services.form.service_type')}</Label>
                                                <Select
                                                    value={data.service_type}
                                                    onValueChange={(value) => setData({ ...data, service_type: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('services.form.service_type_placeholder')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {availableServiceTypes.map((type) => (
                                                            <SelectItem key={type.value} value={type.value}>
                                                                <div className="flex items-center gap-2">
                                                                    <span>{type.icon}</span>
                                                                    <span>{type.label}</span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <InputError message={errors.service_type} />

                                                {selectedServiceType && (
                                                    <div className="mt-2 rounded-md bg-muted/30 p-3 text-sm">
                                                        <div className="flex items-start gap-2">
                                                            <Info className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                            <div>
                                                                <p className="font-medium">{selectedServiceType.label}</p>
                                                                <p className="text-muted-foreground">
                                                                    {t(`services.types.${selectedServiceType.value}_description`)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {!companyAllowsVideoCalls && (
                                                <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
                                                    <p>{t('services.form.video_calls_disabled_notice')}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Pricing & Duration */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium">{t('services.form.pricing_duration')}</h3>

                                            <div className="grid grid-cols-2 gap-2">
                                                {/* Price */}
                                                <div className="flex flex-col">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Label className="flex items-center gap-1">
                                                                    {t('services.form.price')}
                                                                    <Info className="h-3 w-3" />
                                                                </Label>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{t('services.form.price_tooltip')}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={data.price}
                                                        onChange={(e) => setData({ ...data, price: Number(e.target.value) })}
                                                        placeholder="0.00"
                                                        className="h-10"
                                                    />
                                                    <InputError message={errors.price} />
                                                </div>

                                                {/* Duration */}
                                                <div className="flex flex-col">
                                                    <Label required>{t('services.form.duration')}</Label>
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            min="5"
                                                            step="5"
                                                            value={data.duration}
                                                            onChange={(e) => setData({ ...data, duration: Number(e.target.value) })}
                                                            placeholder="30"
                                                            className="h-10"
                                                        />
                                                        <span className="absolute top-2.5 right-3 text-sm text-muted-foreground">min</span>
                                                    </div>
                                                    <InputError message={errors.duration} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Preparation Time */}
                                                <div className="flex flex-col">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Label className="flex h-5 items-center gap-1">
                                                                    {t('services.form.preparation_time')}
                                                                    <Info className="h-3 w-3" />
                                                                </Label>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{t('services.form.preparation_time_tooltip')}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="5"
                                                            value={data.preparation_time}
                                                            onChange={(e) => setData({ ...data, preparation_time: Number(e.target.value) })}
                                                            placeholder="0"
                                                            className="h-10"
                                                        />
                                                        <span className="absolute top-2.5 right-3 text-sm text-muted-foreground">min</span>
                                                    </div>
                                                    <InputError message={errors.preparation_time} />
                                                </div>

                                                {/* Post Service Time */}
                                                <div className="flex flex-col">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Label className="flex h-5 items-center gap-1">
                                                                    {t('services.form.post_service_time')}
                                                                    <Info className="h-3 w-3" />
                                                                </Label>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{t('services.form.post_service_time_tooltip')}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="5"
                                                            value={data.post_service_time}
                                                            onChange={(e) => setData({ ...data, post_service_time: Number(e.target.value) })}
                                                            placeholder="0"
                                                            className="h-10"
                                                        />
                                                        <span className="absolute top-2.5 right-3 text-sm text-muted-foreground">min</span>
                                                    </div>
                                                    <InputError message={errors.post_service_time} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Settings */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium">{t('services.form.settings')}</h3>

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
