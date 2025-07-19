import BusinessHours from '@/components/company/business-hours';
import { CompanyHeader } from '@/components/company/company-header';
import { CompanyInfoCard } from '@/components/company/company-info-card';
import { VideoCallSettings } from '@/components/company/video-call-settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
import { CompanyResource } from '@/interfaces/company';
import { Clock, DollarSign, Globe } from 'lucide-react';
import React from 'react';

interface CompanyReadViewProps {
    company: CompanyResource;
    t: any;
}

const LOCALES = [
    { label: 'Español', value: 'es-CL' },
    { label: 'English', value: 'en-US' },
];

export const CompanyReadView: React.FC<CompanyReadViewProps> = ({ company, t }) => {
    const { hasPermission } = usePermissions();
    const canEdit = hasPermission(PERMISSIONS.company.edit);

    return (
        <div className="space-y-6">
            {/* Company Header */}
            <CompanyHeader company={company} />

            {/* Company Details Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

                {/* Video Call Settings */}
                <VideoCallSettings company={company} canEdit={canEdit} t={t} />

                {/* Company Information */}
                <CompanyInfoCard form={{ data: company, errors: {} } as any} isEditing={false} t={t} />

                {/* Business Hours */}
                <div className="lg:col-span-2">
                    <BusinessHours data={{ schedules: company?.schedules || [] }} handleScheduleChange={() => {}} canEdit={false} />
                </div>
            </div>
        </div>
    );
};
