import { AppHeaderPage } from '@/components/app-header-page';
import { ListServices } from '@/components/professionals/list-services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfessionalResource } from '@/interfaces/professional';
import { ServiceResource } from '@/interfaces/service';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface ProfessionalsAssignServicesProps {
    professional: ProfessionalResource;
    services: ServiceResource[];
}

export default function ProfessionalsAssignServices({ professional, services }: ProfessionalsAssignServicesProps) {
    const { t } = useTranslation();

    return (
        <AppLayout breadcrumbs={[{ title: t('professionals.title'), href: '/professionals' }]}>
            <Head title={t('professionals.title')} />

            <AppHeaderPage title={t('professionals.assign-services.title')} description={t('professionals.assign-services.description')} />

            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('professionals.assign-services.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h1>Datos del profesional</h1>
                        <p>
                            {professional.title} {professional.user.name}
                        </p>
                        <p>{professional.bio}</p>
                        <p>
                            {professional.is_company_schedule
                                ? t('professionals.assign-services.company_schedule')
                                : t('professionals.assign-services.professional_schedule')}
                        </p>
                    </CardContent>
                </Card>

                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>{t('professionals.assign-services.services')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ListServices services={services} t={t} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
