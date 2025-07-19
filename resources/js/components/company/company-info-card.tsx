import InputError from '@/components/input-error';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { Building2, Mail } from 'lucide-react';
import React from 'react';

interface CompanyInfoCardProps {
    form: any;
    isEditing?: boolean;
    t: any;
}

const LOCALES = [
    { label: 'Español', value: 'es-CL' },
    { label: 'English', value: 'en-US' },
];

const CURRENCIES = ['CLP', 'USD', 'EUR'];

const TIMEZONES = [
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

export const CompanyInfoCard: React.FC<CompanyInfoCardProps> = ({ form, isEditing = false, t }) => {
    if (!isEditing) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {t('company.information')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">{t('company.form.name')}</p>
                                <p className="text-sm text-muted-foreground">{form.data.name || t('company.not_specified')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">{t('company.form.email')}</p>
                                <p className="text-sm text-muted-foreground">{form.data.email || t('company.not_specified')}</p>
                            </div>
                        </div>
                    </div>

                    {form.data.description && (
                        <div className="rounded-lg bg-muted/50 p-3">
                            <p className="text-sm font-medium">{t('company.form.description')}</p>
                            <p className="text-sm text-muted-foreground">{form.data.description}</p>
                        </div>
                    )}

                    {form.data.tagline && (
                        <div className="rounded-lg bg-muted/50 p-3">
                            <p className="text-sm font-medium">{t('company.form.tagline')}</p>
                            <p className="text-sm text-muted-foreground">{form.data.tagline}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {t('company.information')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Company Name */}
                    <div className="md:col-span-2">
                        <Label htmlFor="name" required>
                            {t('company.form.name')}
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            placeholder={t('company.form.name_placeholder')}
                            className={form.errors.name ? 'border-red-300 focus:border-red-500' : ''}
                        />
                        <InputError message={form.errors.name} />
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                        <Label htmlFor="email" required>
                            {t('company.form.email')}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={form.data.email}
                            onChange={(e) => form.setData('email', e.target.value)}
                            placeholder={t('company.form.email_placeholder')}
                            className={form.errors.email ? 'border-red-300 focus:border-red-500' : ''}
                        />
                        <InputError message={form.errors.email} />
                    </div>

                    {/* Tagline */}
                    <div className="md:col-span-2">
                        <Label htmlFor="tagline">{t('company.form.tagline')}</Label>
                        <Input
                            id="tagline"
                            type="text"
                            value={form.data.tagline}
                            onChange={(e) => form.setData('tagline', e.target.value)}
                            placeholder={t('company.form.tagline_placeholder')}
                            className={form.errors.tagline ? 'border-red-300 focus:border-red-500' : ''}
                        />
                        <InputError message={form.errors.tagline} />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <Label htmlFor="description">{t('company.form.description')}</Label>
                        <Textarea
                            id="description"
                            value={form.data.description}
                            onChange={(e) => form.setData('description', e.target.value)}
                            placeholder={t('company.form.description_placeholder')}
                            className={form.errors.description ? 'border-red-300 focus:border-red-500' : ''}
                            rows={3}
                        />
                        <InputError message={form.errors.description} />
                    </div>

                    {/* Currency */}
                    <div>
                        <Label>{t('company.form.currency')}</Label>
                        <Select value={form.data.currency} onValueChange={(value) => form.setData('currency', value)}>
                            <SelectTrigger className={form.errors.currency ? 'border-red-300 focus:border-red-500' : ''}>
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
                        <InputError message={form.errors.currency} />
                    </div>

                    {/* Timezone */}
                    <div>
                        <Label>{t('company.form.timezone')}</Label>
                        <Select value={form.data.timezone} onValueChange={(value) => form.setData('timezone', value)}>
                            <SelectTrigger className={form.errors.timezone ? 'border-red-300 focus:border-red-500' : ''}>
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
                        <InputError message={form.errors.timezone} />
                    </div>

                    {/* Locale */}
                    <div className="md:col-span-2">
                        <Label>{t('company.form.locale')}</Label>
                        <Select value={form.data.locale} onValueChange={(value) => form.setData('locale', value)}>
                            <SelectTrigger className={form.errors.locale ? 'border-red-300 focus:border-red-500' : ''}>
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
                        <InputError message={form.errors.locale} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
