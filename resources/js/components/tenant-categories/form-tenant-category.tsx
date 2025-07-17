import InputError from '@/components/input-error';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type FormTenantCategoryProps = {
    data: any;
    setData: (name: string, value: any) => void;
    errors: any;
};

export const FormTenantCategory = ({ data, setData, errors }: FormTenantCategoryProps) => {
    const { t } = useTranslation();
    return (
        <div>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
                <div className="flex flex-col gap-6">
                    <div className="space-y-6 pb-4">
                        <div>
                            <Label htmlFor="name" required>
                                {t('tenantCategories.form.name')}
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder={t('tenantCategories.form.name')}
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div>
                            <Label htmlFor="description" required>
                                {t('tenantCategories.form.description')}
                            </Label>
                            <Input
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder={t('tenantCategories.form.description')}
                            />
                            <InputError message={errors.description} />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_active"
                                name="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', checked)}
                            />
                            <Label htmlFor="is_active">{t('tenantCategories.form.isActive')}</Label>
                            <InputError message={errors.is_active} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
