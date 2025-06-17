import { AppHeaderPage } from '@/components/app-header-page';
import { ManageProfile } from '@/components/professionals/profile/manage-profile';
import { ProfessionalExceptions } from '@/components/professionals/profile/professional-exceptions';
import { ProfessionalRequests } from '@/components/professionals/profile/professional-requests';
import { ProfessionalSchedule } from '@/components/professionals/profile/professional-schedule';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfessionalResource } from '@/interfaces/professional';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function ProfessionalProfileMe({ professional }: { professional: ProfessionalResource }) {
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
                            <TabsTrigger value="requests">{t('professional.profile.requests')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="schedule">
                            <ProfessionalSchedule />
                        </TabsContent>
                        <TabsContent value="exceptions">
                            <ProfessionalExceptions />
                        </TabsContent>
                        <TabsContent value="requests">
                            <ProfessionalRequests />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
