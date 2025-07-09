import BusinessHours from '@/components/company/business-hours';
import InputError from '@/components/input-error';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
import { CompanyFormData, CompanyResource, Schedule } from '@/interfaces/company';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, Building2, Camera, Clock, DollarSign, Globe, Mail, Save, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

const CompanyReadOnlyView = ({ company, t }: Props) => {
    const logoUrl = company?.logo ? `/storage/${company.logo}` : null;
    const coverUrl = company?.cover_image ? `/storage/${company.cover_image}` : null;

    return (
        <div className="space-y-6">
            {/* Company Header */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="relative h-48 sm:h-64">
                    {coverUrl ? (
                        <img src={coverUrl} alt="Cover" className="h-full w-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"></div>
                    )}

                    {/* Logo Section */}
                    <div className="absolute -bottom-16 left-8">
                        <div className="h-32 w-32 overflow-hidden rounded-2xl border-4 border-border bg-card shadow-xl">
                            {logoUrl ? (
                                <img src={logoUrl} alt="Logo" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-accent">
                                    <Building2 className="h-12 w-12 text-foreground" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-8 pt-20 pb-8">
                    <div className="flex flex-col gap-6">
                        <div>
                            <h1 className="font-outfit text-3xl font-bold text-foreground">{company?.name || t('company.name_placeholder')}</h1>
                            {company?.tagline && <p className="mt-2 text-lg text-muted-foreground">{company.tagline}</p>}
                        </div>

                        {company?.description && <p className="max-w-3xl leading-relaxed text-muted-foreground">{company.description}</p>}
                    </div>
                </div>
            </div>

            {/* Company Details Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            {t('company.contact_information')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">{t('company.form.email')}</p>
                                <p className="text-sm text-muted-foreground">{company?.email || t('company.not_specified')}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Business Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            {t('company.business_settings')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">{t('company.form.currency')}</p>
                                    <p className="text-sm text-muted-foreground">{company?.currency || t('company.not_specified')}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">{t('company.form.timezone')}</p>
                                    <p className="text-sm text-muted-foreground">{company?.timezone || t('company.not_specified')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">{t('company.form.locale')}</p>
                                <p className="text-sm text-muted-foreground">
                                    {LOCALES.find((l) => l.value === company?.locale)?.label || company?.locale || t('company.not_specified')}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Business Hours */}
                <div className="lg:col-span-2">
                    <BusinessHours data={{ schedules: company?.schedules || [] }} handleScheduleChange={() => {}} canEdit={false} />
                </div>
            </div>
        </div>
    );
};

const CompanyEditView = ({ company, t }: Props) => {
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

    const { data, setData, post, processing, errors } = useForm<CompanyFormData>({
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
                            <div className="h-32 w-32 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
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
                <BusinessHours data={data} handleScheduleChange={handleScheduleChange} canEdit={true} />
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                    <Save className="h-5 w-5" />
                    {processing ? t('company.saving') : t('company.save_changes')}
                </Button>
            </div>
        </form>
    );
};

export default function CompanyIndex({ company }: Props) {
    const { t } = useTranslation();
    const { hasPermission } = usePermissions();
    const canEdit = hasPermission(PERMISSIONS.company.edit);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('company.title'),
            href: route('company.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('company.title')} />
            <div className="p-6">{canEdit ? <CompanyEditView company={company} t={t} /> : <CompanyReadOnlyView company={company} t={t} />}</div>
        </AppLayout>
    );
}
