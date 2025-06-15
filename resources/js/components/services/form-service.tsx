import { ServiceFormData } from '@/interfaces/service';
import { useTranslation } from 'react-i18next';
import InputError from '../input-error';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface FormServiceProps {
    data: ServiceFormData;
    setData: (data: ServiceFormData) => void;
    errors: any;
}

export function FormService({ data, setData, errors }: FormServiceProps) {
    const { t } = useTranslation();
    return (
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <div className="flex flex-col gap-4">
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
                    <div>
                        <Label required>{t('services.form.category')}</Label>
                        <Input value={data.category} onChange={(e) => setData({ ...data, category: e.target.value })} />
                        <InputError message={errors.category} />
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
                        <Input value={data.preparation_time} onChange={(e) => setData({ ...data, preparation_time: Number(e.target.value) })} />
                        <InputError message={errors.preparation_time} />
                    </div>
                    <div>
                        <Label>{t('services.form.post_service_time')}</Label>
                        <Input value={data.post_service_time} onChange={(e) => setData({ ...data, post_service_time: Number(e.target.value) })} />
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
    );
}
