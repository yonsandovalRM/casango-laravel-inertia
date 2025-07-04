import { AppHeaderPage } from '@/components/app-header-page';
import { ManageProfile } from '@/components/professionals/profile/manage-profile';
import { ProfessionalExceptions } from '@/components/professionals/profile/professional-exceptions';
import { ProfessionalSchedule } from '@/components/professionals/profile/professional-schedule';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfessionalResource } from '@/interfaces/professional';
import { CompanyScheduleObject, ProfessionalScheduleResource } from '@/interfaces/schedules';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface ProfessionalProfileMeProps {
    professional: ProfessionalResource;
    professional_schedules: ProfessionalScheduleResource[];
    company_schedules: CompanyScheduleObject;
}

export default function ProfessionalProfileMe({ professional, professional_schedules, company_schedules }: ProfessionalProfileMeProps) {
    const { t } = useTranslation();
    return (
        <AppLayout breadcrumbs={[{ title: 'Perfil profesional', href: '/professional/profile' }]}>
            <Head title={t('professional.profile.title')} />
            <AppHeaderPage title={t('professional.profile.title')} description={t('professional.profile.description')} />
            <div className="p-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <ManageProfile professional={professional} />
                    <Tabs defaultValue="schedule" className="w-full lg:col-span-2">
                        <TabsList className="w-full">
                            <TabsTrigger value="schedule">{t('professional.profile.schedule')}</TabsTrigger>
                            <TabsTrigger value="exceptions">{t('professional.profile.exceptions')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="schedule">
                            <ProfessionalSchedule
                                isFullTime={professional.is_company_schedule}
                                professional_schedules={professional_schedules}
                                company_schedules={company_schedules}
                            />
                        </TabsContent>
                        <TabsContent value="exceptions">
                            <ProfessionalExceptions exceptions={professional.exceptions} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
