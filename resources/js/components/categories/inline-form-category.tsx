import { CategoryResource } from '@/interfaces/category';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InputError from '../input-error';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export const InlineFormCategory = ({ onSuccess }: { onSuccess: (category: CategoryResource) => void }) => {
    const { t } = useTranslation();
    const { data, setData, processing, errors } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newData = {
            ...data,
            is_active: true,
        };
        axios.post(route('categories.store.inline'), newData).then((response) => {
            onSuccess(response.data);
            setData('name', '');
        });
    };
    return (
        <div>
            <form onSubmit={handleSubmit} id="category-form">
                <div>
                    <Label required>{t('categories.form.name')}</Label>
                    <Input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder={t('categories.form.name')}
                    />
                    <InputError message={errors.name} />
                </div>
            </form>

            <Button form="category-form" type="submit" disabled={processing} className="mt-4">
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : t('categories.form.create')}
            </Button>
        </div>
    );
};
