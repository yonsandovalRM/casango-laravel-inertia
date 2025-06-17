import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfessionalResource } from '@/interfaces/professional';
import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ManageProfile({ professional }: { professional: ProfessionalResource }) {
    const { t } = useTranslation();

    const { data, setData, post, errors, processing } = useForm({
        photo: professional.photo,
        bio: professional.bio,
        title: professional.title,
        is_full_time: professional.is_full_time,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('professional.update.me', { _method: 'PUT' }));
    };

    const titles = [
        t('professional.form.title.mr'),
        t('professional.form.title.ms'),
        t('professional.form.title.dr'),
        t('professional.form.title.prof'),
    ];
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    <div>
                        <Label>Foto</Label>
                        <Input type="text" name="photo" value={data.photo} onChange={(e) => setData('photo', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <div>
                            {/* Sr. Dr. */}
                            <Select value={data.title} onValueChange={(value) => setData({ ...data, title: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('professional.form.title')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {titles.map((title) => (
                                        <SelectItem key={title} value={title}>
                                            {title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="text-sm text-foreground">{professional.user.name}</div>
                    </div>
                    <div>
                        <Label>Bio</Label>
                        <Input type="text" name="bio" value={data.bio} onChange={(e) => setData('bio', e.target.value)} />
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="is_full_time"
                            name="is_full_time"
                            checked={data.is_full_time}
                            onCheckedChange={(checked) => setData('is_full_time', checked as boolean)}
                        />
                        <Label htmlFor="is_full_time">Trabajo a tiempo completo</Label>
                    </div>
                    <Button type="submit" disabled={processing}>
                        {processing ? <Loader2 className="animate-spin" /> : 'Guardar'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
