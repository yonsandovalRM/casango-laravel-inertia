import BusinessHours from '@/components/company/business-hours';
import InputError from '@/components/input-error';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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
export const LOCALES = [
    {
        label: 'Español',
        value: 'es-CL',
    },
    {
        label: 'English',
        value: 'en-US',
    },
];
export const CURRENCIES = ['CLP', 'USD'];
export const TIMEZONES = [
    'America/Santiago',
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'America/Denver',
    'America/Phoenix',
    'America/Mexico_City',
    'America/Bogota',
    'America/Caracas',
    'America/Sao_Paulo',
    'America/Buenos_Aires',
    'America/Lima',
];

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
        tagline: company?.tagline || '',
        description: company?.description || '',
        currency: company?.currency || '',
        timezone: company?.timezone || '',
        locale: company?.locale || '',
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
            if (logoPreview) URL.revokeObjectURL(logoPreview);
            setLogoPreview(null);
            setData('logo', null);
            if (logoInputRef.current) logoInputRef.current.value = '';
        } else {
            if (coverPreview) URL.revokeObjectURL(coverPreview);
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
            <div className="p-4">
                {/* Header */}
                <form onSubmit={handleSubmit} className="space-y-6">
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
                                    <div className="md:col-span-2">
                                        <Label required>{t('company.form.email')}</Label>
                                        <Input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder={t('company.form.email_placeholder')}
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Description */}
                                    <div className="md:col-span-2">
                                        <Label>{t('company.form.description')}</Label>
                                        <Textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder={t('company.form.description_placeholder')}
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    {/* Tagline */}
                                    <div className="md:col-span-2">
                                        <Label>{t('company.form.tagline')}</Label>
                                        <Input
                                            type="text"
                                            value={data.tagline}
                                            onChange={(e) => setData('tagline', e.target.value)}
                                            placeholder={t('company.form.tagline_placeholder')}
                                        />
                                        <InputError message={errors.tagline} />
                                    </div>

                                    {/* Currency */}
                                    <div>
                                        <Label>{t('company.form.currency')}</Label>
                                        <Select value={data.currency} onValueChange={(value) => setData('currency', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('company.form.currency_placeholder')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CURRENCIES.map((currency) => (
                                                    <SelectItem key={currency} value={currency}>
                                                        {currency}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.currency} />
                                    </div>

                                    {/* Timezone */}
                                    <div>
                                        <Label>{t('company.form.timezone')}</Label>
                                        <Select value={data.timezone} onValueChange={(value) => setData('timezone', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('company.form.timezone_placeholder')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TIMEZONES.map((timezone) => (
                                                    <SelectItem key={timezone} value={timezone}>
                                                        {timezone}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.timezone} />
                                    </div>

                                    {/* Locale */}
                                    <div>
                                        <Label>{t('company.form.locale')}</Label>
                                        <Select value={data.locale} onValueChange={(value) => setData('locale', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('company.form.locale_placeholder')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {LOCALES.map((locale) => (
                                                    <SelectItem key={locale.value} value={locale.value}>
                                                        {locale.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.locale} />
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
