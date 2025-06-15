import BusinessHours from '@/components/company/business-hours';
import InputError from '@/components/input-error';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CompanyFormData, CompanyResource, Schedule } from '@/interfaces/company';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, Building2, Camera, Save, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';

interface Props {
    company: CompanyResource;
    t: any;
}

export const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default withTranslation()(CompanyIndex);

function CompanyIndex({ company, t }: Props) {
    const [logoPreview, setLogoPreview] = useState<string | null>(company?.logo ? `/storage/${company.logo}` : null);
    const [coverPreview, setCoverPreview] = useState<string | null>(company?.cover_image ? `/storage/${company.cover_image}` : null);

    const logoInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const initialSchedules = DAYS_OF_WEEK.map((day) => {
        const existingSchedule = company?.schedules?.find((s) => s.day_of_week === day);
        return (
            existingSchedule || {
                day_of_week: day,
                open_time: '09:00',
                close_time: '18:00',
                break_start_time: '12:00',
                break_end_time: '13:00',
                is_open: true,
                has_break: false,
            }
        );
    });

    const { data, setData, post, processing, errors, reset } = useForm<CompanyFormData>({
        id: company?.id || '',
        name: company?.name || '',
        email: company?.email || '',
        phone: company?.phone || '',
        phone2: company?.phone2 || '',
        address: company?.address || '',
        city: company?.city || '',
        country: company?.country || '',
        currency: company?.currency || '',
        timezone: company?.timezone || '',
        language: company?.language || '',
        logo: company?.logo ? new File([], company.logo as string) : null,
        cover_image: company?.cover_image ? new File([], company.cover_image as string) : null,
        schedules: initialSchedules,
    });

    useEffect(() => {
        return () => {
            if (logoPreview) URL.revokeObjectURL(logoPreview);
            if (coverPreview) URL.revokeObjectURL(coverPreview);
        };
    }, [logoPreview, coverPreview]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('company.title'),
            href: route('company.index'),
        },
    ];

    const handleImageUpload = (type: 'logo' | 'cover', file: File | null) => {
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            if (type === 'logo') {
                setLogoPreview(previewUrl);
                setData('logo', file);
            } else {
                setCoverPreview(previewUrl);
                setData('cover_image', file);
            }
        } else {
            // Limpiar la previsualización y los datos
            if (type === 'logo') {
                if (logoPreview) URL.revokeObjectURL(logoPreview);
                setLogoPreview(null);
                setData('logo', null);
            } else {
                if (coverPreview) URL.revokeObjectURL(coverPreview);
                setCoverPreview(null);
                setData('cover_image', null);
            }
        }
    };

    const removeImage = (type: 'logo' | 'cover') => {
        if (type === 'logo') {
            if (logoPreview) URL.revokeObjectURL(logoPreview); // Solo si usas URL.createObjectURL
            setLogoPreview(null);
            setData('logo', null);
            if (logoInputRef.current) logoInputRef.current.value = '';
        } else {
            if (coverPreview) URL.revokeObjectURL(coverPreview); // Solo si usas URL.createObjectURL
            setCoverPreview(null);
            setData('cover_image', null);
            if (coverInputRef.current) coverInputRef.current.value = '';
        }
    };

    const handleScheduleChange = (dayOfWeek: string, field: keyof Schedule, value: any) => {
        const updatedSchedules = data.schedules.map((schedule) => {
            if (schedule.day_of_week === dayOfWeek) {
                return { ...schedule, [field]: value };
            }
            return schedule;
        });

        // cuando has_break es false deben ser null los campos break_start_time y break_end_time
        const schedules = updatedSchedules.map((schedule) => {
            if (!schedule.has_break) {
                return { ...schedule, break_start_time: '', break_end_time: '' };
            }
            return schedule;
        });
        setData('schedules', schedules);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('company.update', { _method: 'PUT' }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('company.title')} />
            <div>
                {/* Header */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Cover Image Section */}
                    <div className="overflow-hidden rounded-2xl border border-border bg-card">
                        <div className="relative h-48 sm:h-64">
                            {coverPreview ? (
                                <img src={coverPreview} alt="Cover" className="h-full w-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 bg-muted"></div>
                            )}

                            {/* Cover Upload Controls */}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => coverInputRef.current?.click()}
                                    className="bg-opacity-90 hover:bg-opacity-100 rounded-full border border-border bg-card p-3 shadow-lg transition-all duration-200"
                                >
                                    <Camera className="h-5 w-5 text-muted-foreground" />
                                </button>
                                {coverPreview && (
                                    <button
                                        type="button"
                                        onClick={() => removeImage('cover')}
                                        className="bg-opacity-90 hover:bg-opacity-100 rounded-full border border-border bg-card p-3 shadow-lg transition-all duration-200"
                                    >
                                        <X className="h-5 w-5 text-muted-foreground" />
                                    </button>
                                )}
                            </div>

                            {/* Logo Section */}
                            <div className="absolute -bottom-16 left-8">
                                <div className="relative">
                                    <div className="h-32 w-32 overflow-hidden rounded-2xl border-4 border-border bg-card shadow-xl">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-muted">
                                                <Building2 className="h-12 w-12 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Logo Upload Controls */}
                                    <div className="absolute -right-2 -bottom-2 flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() => logoInputRef.current?.click()}
                                            className="rounded-full border border-border bg-card p-2 shadow-lg transition-all duration-200 hover:bg-card/80"
                                        >
                                            <Camera className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                        {logoPreview && (
                                            <button
                                                type="button"
                                                onClick={() => removeImage('logo')}
                                                className="rounded-full border border-border bg-card p-2 shadow-lg transition-all duration-200 hover:bg-card/80"
                                            >
                                                <X className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 pt-20 pb-8">
                            <h2 className="text-2xl font-bold text-foreground">{data.name || t('company.name_placeholder')}</h2>
                        </div>
                    </div>

                    {/* Hidden File Inputs */}
                    <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload('logo', e.target.files?.[0] || null)}
                    />
                    <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload('cover', e.target.files?.[0] || null)}
                    />
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Company Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('company.information')}</CardTitle>
                            </CardHeader>

                            <CardContent>
                                {Object.keys(errors).length > 0 && (
                                    <Alert variant="destructive" className="mb-4">
                                        <AlertCircle className="h-4 w-4" />
                                        <div className="flex flex-col gap-2">
                                            {Object.values(errors).map((error) => (
                                                <p key={error}>{error}</p>
                                            ))}
                                        </div>
                                    </Alert>
                                )}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Company Name */}
                                    <div className="md:col-span-2">
                                        <Label required>{t('company.form.name')}</Label>
                                        <Input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder={t('company.form.name_placeholder')}
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <Label required>{t('company.form.email')}</Label>
                                        <Input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder={t('company.form.email_placeholder')}
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <Label required>{t('company.form.phone')}</Label>
                                        <Input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder={t('company.form.phone_placeholder')}
                                        />
                                        <InputError message={errors.phone} />
                                    </div>

                                    {/* Phone 2 */}
                                    <div>
                                        <Label required>{t('company.form.phone2')}</Label>
                                        <Input
                                            type="tel"
                                            value={data.phone2}
                                            onChange={(e) => setData('phone2', e.target.value)}
                                            placeholder={t('company.form.phone2_placeholder')}
                                        />
                                        <InputError message={errors.phone2} />
                                    </div>

                                    {/* Address */}
                                    <div className="md:col-span-2">
                                        <Label required>{t('company.form.address')}</Label>
                                        <Input
                                            type="text"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder={t('company.form.address_placeholder')}
                                        />
                                        <InputError message={errors.address} />
                                    </div>

                                    {/* City */}
                                    <div>
                                        <Label required>{t('company.form.city')}</Label>
                                        <Input
                                            type="text"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            placeholder={t('company.form.city_placeholder')}
                                        />
                                        <InputError message={errors.city} />
                                    </div>

                                    {/* Country */}
                                    <div>
                                        <Label required>{t('company.form.country')}</Label>
                                        <Input
                                            type="text"
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                            placeholder={t('company.form.country_placeholder')}
                                        />
                                        <InputError message={errors.country} />
                                    </div>

                                    {/* Currency */}
                                    <div>
                                        <Label required>{t('company.form.currency')}</Label>
                                        <Input
                                            type="text"
                                            value={data.currency}
                                            onChange={(e) => setData('currency', e.target.value)}
                                            placeholder={t('company.form.currency_placeholder')}
                                        />
                                        <InputError message={errors.currency} />
                                    </div>

                                    {/* Timezone */}
                                    <div>
                                        <Label required>{t('company.form.timezone')}</Label>
                                        <Input
                                            type="text"
                                            value={data.timezone}
                                            onChange={(e) => setData('timezone', e.target.value)}
                                            placeholder={t('company.form.timezone_placeholder')}
                                        />
                                        <InputError message={errors.timezone} />
                                    </div>

                                    {/* Language */}
                                    <div>
                                        <Label required>{t('company.form.language')}</Label>
                                        <Input
                                            type="text"
                                            value={data.language}
                                            onChange={(e) => setData('language', e.target.value)}
                                            placeholder={t('company.form.language_placeholder')}
                                        />
                                        <InputError message={errors.language} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Business Hours */}
                        <BusinessHours data={data} handleScheduleChange={handleScheduleChange} />
                    </div>
                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            <Save className="h-5 w-5" />
                            {processing ? t('company.saving') : t('company.save_changes')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
