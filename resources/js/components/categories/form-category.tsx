import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InputError from '../input-error';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet';
import { useCategory } from './category-context';

export function FormCategory() {
    const { t } = useTranslation();
    const { open, handleSubmit, handleCancel, data, setData, errors, processing, category } = useCategory();

    return (
        <Sheet open={open} onOpenChange={handleCancel}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{category?.id ? t('categories.form.edit') : t('categories.form.create')}</SheetTitle>
                    <SheetDescription>
                        {category?.id ? t('categories.form.edit_description') : t('categories.form.create_description')}
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-180px)]">
                    <form id="category-form" onSubmit={handleSubmit}>
                        <div className="grid flex-1 auto-rows-min gap-6 px-4">
                            <div className="flex flex-col gap-6">
                                <div className="space-y-6 pb-4">
                                    <div>
                                        <Label required>{t('services.form.name')}</Label>
                                        <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                                        <InputError message={errors.name} />
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
                    <Button type="submit" variant="default" form="category-form" disabled={processing}>
                        {processing ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : category?.id ? (
                            t('categories.form.update')
                        ) : (
                            t('categories.form.create')
                        )}
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline" onClick={handleCancel}>
                            {t('categories.form.cancel')}
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
