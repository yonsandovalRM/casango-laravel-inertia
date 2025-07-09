import { ProfessionalResource } from '@/interfaces/professional';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InputError from '../input-error';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet';
import { useProfessional } from './professional-context';

export function FormProfessional({ professionals }: { professionals: ProfessionalResource[] }) {
    const { t } = useTranslation();
    const { open, handleSubmit, handleCancel, data, setData, errors, processing, professional } = useProfessional();

    return (
        <Sheet open={open} onOpenChange={handleCancel}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{professional?.id ? t('professionals.form.edit') : t('professionals.form.create')}</SheetTitle>
                    <SheetDescription>
                        {professional?.id ? t('professionals.form.edit_description') : t('professionals.form.create_description')}
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-180px)]">
                    <form id="professional-form" onSubmit={handleSubmit}>
                        <div className="grid flex-1 auto-rows-min gap-6 px-4">
                            <div className="flex flex-col gap-6">
                                <div className="space-y-6 pb-4">
                                    {/* Photo */}

                                    <div>
                                        <Label>{t('professionals.form.bio')}</Label>
                                        <Input value={data.bio} onChange={(e) => setData({ ...data, bio: e.target.value })} />
                                        <InputError message={errors.bio} />
                                    </div>
                                    <div>
                                        <Label>{t('professionals.form.title')}</Label>
                                        <Input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
                                        <InputError message={errors.title} />
                                    </div>
                                    <div>
                                        <Label>{t('professionals.form.profession')}</Label>
                                        <Input value={data.profession} onChange={(e) => setData({ ...data, profession: e.target.value })} />
                                        <InputError message={errors.profession} />
                                    </div>
                                    <div>
                                        <Label>{t('professionals.form.specialty')}</Label>
                                        <Input value={data.specialty} onChange={(e) => setData({ ...data, specialty: e.target.value })} />
                                        <InputError message={errors.specialty} />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="is_company_schedule"
                                            checked={data.is_company_schedule}
                                            onCheckedChange={(checked) => setData({ ...data, is_company_schedule: checked as boolean })}
                                        />
                                        <Label htmlFor="is_company_schedule">{t('professionals.form.is_company_schedule')}</Label>
                                        <InputError message={errors.is_company_schedule} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </ScrollArea>
                <SheetFooter className="grid grid-cols-2 gap-6">
                    <Button type="submit" variant="default" form="professional-form" disabled={processing}>
                        {processing ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : professional?.id ? (
                            t('professionals.form.update')
                        ) : (
                            t('professionals.form.create')
                        )}
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline" onClick={handleCancel}>
                            {t('professionals.form.cancel')}
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
