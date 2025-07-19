import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ProfessionalResource } from '@/interfaces/professional';
import { useForm } from '@inertiajs/react';
import { Camera, Loader2, Pencil, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function ManageProfile({ professional }: { professional: ProfessionalResource }) {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(professional.photo ? `/storage/${professional.photo}` : null);
    const photoInputRef = useRef<HTMLInputElement>(null);
    const { data, setData, post, errors, processing } = useForm({
        photo: professional?.photo ? new File([], professional.photo as string) : null,
        bio: professional.bio || '',
        title: professional.title,
        profession: professional.profession || '',
        specialty: professional.specialty || '',
        is_company_schedule: professional.is_company_schedule,
    });

    useEffect(() => {
        return () => {
            if (photoPreview) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('professional.update.me', { _method: 'PUT' }), {
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    const handlePhotoUpload = (file: File | null) => {
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPhotoPreview(previewUrl);
            setData('photo', file);
        } else {
            if (photoPreview) {
                URL.revokeObjectURL(photoPreview);
            }
            setPhotoPreview(null);
            setData('photo', null);
        }
    };

    const removePhoto = () => {
        if (photoPreview) {
            URL.revokeObjectURL(photoPreview);
        }
        setPhotoPreview(null);
        setData('photo', null);
        if (photoInputRef.current) photoInputRef.current.value = '';
    };

    const titles = [
        t('professional.form.title.mr'),
        t('professional.form.title.ms'),
        t('professional.form.title.dr'),
        t('professional.form.title.prof'),
    ];
    return (
        <div className="order-last lg:order-first">
            <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                    <Pencil className="h-4 w-4" />
                </Button>
            </div>
            <div className="p-6">
                {isEditing ? (
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="relative pt-4">
                                        <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-border bg-muted shadow-lg">
                                            {photoPreview ? (
                                                <img src={photoPreview} alt="Profile" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <User className="h-12 w-12 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Photo Upload Controls */}
                                        <div className="absolute -right-2 -bottom-2 flex gap-1">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="muted"
                                                className="h-10 w-10 rounded-full p-0 shadow-lg"
                                                onClick={() => photoInputRef.current?.click()}
                                            >
                                                <Camera className="h-4 w-4" />
                                            </Button>
                                            {photoPreview && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    className="h-10 w-10 rounded-full p-0 shadow-lg"
                                                    onClick={removePhoto}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold">
                                            {data.title ? `${data.title} ` : ''}
                                            {professional.user.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">{professional.user.email}</p>
                                        {professional.profession && <p className="text-sm text-muted-foreground">{professional.profession}</p>}
                                        {professional.specialty && <p className="text-sm text-muted-foreground">{professional.specialty}</p>}
                                    </div>
                                </div>

                                {/* Hidden File Input */}
                                <input
                                    ref={photoInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handlePhotoUpload(e.target.files?.[0] || null)}
                                />
                                <div className="space-y-4">
                                    <div>
                                        <Label>{t('professional.profile.form.title')}</Label>
                                        <Select value={data.title} onValueChange={(value) => setData({ ...data, title: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('professional.profile.form.title')} />
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
                                    <div>
                                        <Label>{t('professional.profile.form.bio')}</Label>
                                        <Textarea
                                            name="bio"
                                            value={data.bio}
                                            onChange={(e) => setData('bio', e.target.value)}
                                            rows={4}
                                            className="resize-none"
                                        />
                                    </div>
                                    <div>
                                        <Label>{t('professional.profile.form.profession')}</Label>
                                        <Input value={data.profession} onChange={(e) => setData('profession', e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>{t('professional.profile.form.specialty')}</Label>
                                        <Input value={data.specialty} onChange={(e) => setData('specialty', e.target.value)} />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="is_company_schedule"
                                            name="is_company_schedule"
                                            checked={data.is_company_schedule}
                                            onCheckedChange={(checked) => setData('is_company_schedule', checked as boolean)}
                                        />
                                        <Label htmlFor="is_company_schedule">Trabajo a tiempo completo</Label>
                                    </div>
                                    <div>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? <Loader2 className="animate-spin" /> : t('professional.profile.form.save')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="flex flex-col items-center pt-4">
                                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-border bg-muted shadow-lg">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <User className="h-12 w-12 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 text-center">
                                    <h3 className="text-lg font-semibold">
                                        {data.title ? `${data.title} ` : ''}
                                        {professional.user.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{professional.user.email}</p>
                                    {professional.profession && <p className="text-sm text-muted-foreground">{professional.profession}</p>}
                                    {professional.specialty && <p className="text-sm text-muted-foreground">{professional.specialty}</p>}
                                </div>
                            </div>
                            <div className="flex flex-col gap-6">
                                <div className="text-sm text-muted-foreground">{professional.bio}</div>

                                <div className="text-sm text-muted-foreground">
                                    {professional.is_company_schedule ? 'Trabajo a tiempo completo' : 'Trabajo a tiempo parcial'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
