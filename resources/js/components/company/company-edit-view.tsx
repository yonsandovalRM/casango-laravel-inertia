import BusinessHours from '@/components/company/business-hours';
import { CompanyHeader } from '@/components/company/company-header';
import { CompanyInfoCard } from '@/components/company/company-info-card';
import { VideoCallSettings } from '@/components/company/video-call-settings';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useCompanyForm } from '@/hooks/use-company-form';
import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
import { CompanyResource } from '@/interfaces/company';
import { AlertCircle, Save } from 'lucide-react';
import React from 'react';

interface CompanyEditViewProps {
    company: CompanyResource;
    t: any;
}

export const CompanyEditView: React.FC<CompanyEditViewProps> = ({ company, t }) => {
    const { hasPermission } = usePermissions();
    const canEdit = hasPermission(PERMISSIONS.company.edit);

    const { form, logoPreview, coverPreview, logoInputRef, coverInputRef, handleImageUpload, removeImage, handleScheduleChange, handleSubmit } =
        useCompanyForm(company);

    if (!canEdit) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{t('company.no_edit_permission')}</AlertDescription>
            </Alert>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Header */}
            <CompanyHeader
                company={company}
                logoPreview={logoPreview}
                coverPreview={coverPreview}
                isEditing={true}
                onLogoUpload={() => logoInputRef.current?.click()}
                onCoverUpload={() => coverInputRef.current?.click()}
                onRemoveLogo={() => removeImage('logo')}
                onRemoveCover={() => removeImage('cover')}
                companyName={form.data.name}
            />

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

            {/* Global Error Display */}
            {Object.keys(form.errors).length > 0 && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        <div className="space-y-1">
                            {Object.values(form.errors).map((error, index) => (
                                <p key={index}>{error}</p>
                            ))}
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Company Information */}
                <CompanyInfoCard form={form} isEditing={true} t={t} />

                {/* Video Call Settings */}
                <VideoCallSettings company={company} canEdit={true} t={t} />

                {/* Business Hours */}
                <div className="lg:col-span-2">
                    <BusinessHours data={form.data} handleScheduleChange={handleScheduleChange} canEdit={true} />
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button type="submit" disabled={form.processing} size="lg">
                    <Save className="mr-2 h-5 w-5" />
                    {form.processing ? t('company.saving') : t('company.save_changes')}
                </Button>
            </div>
        </form>
    );
};
