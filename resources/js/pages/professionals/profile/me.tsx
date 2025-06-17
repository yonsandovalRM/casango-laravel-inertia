import { AppHeaderPage } from '@/components/app-header-page';
import { ManageProfile } from '@/components/professionals/profile/manage-profile';
import { ProfessionalExceptions } from '@/components/professionals/profile/professional-exceptions';
import { ProfessionalRequests } from '@/components/professionals/profile/professional-requests';
import { ProfessionalSchedule } from '@/components/professionals/profile/professional-schedule';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfessionalResource } from '@/interfaces/professional';
import AppLayout from '@/layouts/app-layout';

export default function ProfessionalProfileMe({ professional }: { professional: ProfessionalResource }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Perfil profesional', href: '/professional/profile' }]}>
            <AppHeaderPage title="Perfil profesional" description="Gestiona tu perfil profesional" />
            <div className="p-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <Card className="order-last lg:order-first">
                        <CardHeader>
                            <CardTitle>Perfil profesional</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                Usuario: {professional.user.name}
                                <br />
                                Email: {professional.user.email}
                            </div>
                            <ManageProfile professional={professional} />
                        </CardContent>
                    </Card>
                    <Tabs defaultValue="schedule" className="w-full lg:col-span-2">
                        <TabsList className="w-full">
                            <TabsTrigger value="schedule">Horario</TabsTrigger>
                            <TabsTrigger value="exceptions">Excepciones</TabsTrigger>
                            <TabsTrigger value="requests">Solicitudes</TabsTrigger>
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
