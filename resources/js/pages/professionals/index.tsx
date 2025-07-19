import { AppHeaderPage } from '@/components/app-header-page';
import { ProfessionalHeader } from '@/components/professionals/ui/professional-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardItem } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProfessionalResource } from '@/interfaces/professional';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { Head, router } from '@inertiajs/react';
import { Briefcase, Calendar, Clock, DollarSign, Plus, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export default function ProfessionalsIndex({ professionals }: { professionals: ProfessionalResource[] }) {
    const { t } = useTranslation();
    console.log({ professionals });
    const handleAssignService = (professionalId: string) => {
        router.visit(route('professionals.assign-services.show', professionalId));
    };
    const handleEditProfessional = (professionalId: string) => {
        console.log('Editar profesional:', professionalId);
        toast.success('Ver consola para detalles de edición');
    };
    const handleManageSchedule = (professionalId: string) => {
        console.log('Gestionar horario del profesional:', professionalId);
        toast.success('Ver consola para detalles de edición');
    };

    return (
        <AppLayout breadcrumbs={[{ title: t('professionals.title'), href: '/professionals' }]}>
            <Head title={t('professionals.title')} />
            <AppHeaderPage title={t('professionals.title')} description={t('professionals.description')} />
            <div className="flex flex-col gap-6 p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {professionals.map((professional) => (
                        <CardItem key={professional.id}>
                            <CardHeader className="pb-4">
                                <ProfessionalHeader professional={professional} />
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Schedule Info */}
                                <div className="flex items-center space-x-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                        {professional.is_company_schedule ? 'Horario corporativo' : 'Horario personalizado'}
                                    </span>
                                </div>

                                <Separator />

                                {/* Services Section */}
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <h4 className="font-semibold text-foreground">Servicios</h4>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleAssignService(professional.id)}
                                            className="text-primary hover:bg-primary/10 hover:text-primary"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Asignar
                                        </Button>
                                    </div>

                                    {professional.services.length > 0 ? (
                                        <div className="space-y-3">
                                            {professional.services.slice(0, 2).map((service) => (
                                                <div key={service.id} className="rounded-lg border border-border/50 bg-muted/30 p-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h5 className="mb-1 font-medium text-foreground">{service.name}</h5>
                                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                                <div className="flex items-center space-x-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    <span>{service.duration} min</span>
                                                                </div>
                                                                <div className="flex items-center space-x-1">
                                                                    <DollarSign className="h-3 w-3" />
                                                                    <span>{formatCurrency(service.price)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Badge variant={service.is_active ? 'default' : 'muted'} className="ml-2">
                                                            {service.is_active ? 'Activo' : 'Inactivo'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                            {professional.services.length > 2 && (
                                                <div className="py-2 text-center">
                                                    <span className="text-sm text-muted-foreground">
                                                        +{professional.services.length - 2} servicios más
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-4 text-center text-muted-foreground">
                                            <Briefcase className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                            <p className="text-sm">Sin servicios asignados</p>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEditProfessional(professional.id)} className="flex-1">
                                        <Settings className="h-4 w-4" />
                                        Editar
                                    </Button>
                                    <Button variant="muted" size="sm" onClick={() => handleManageSchedule(professional.id)} className="flex-1">
                                        <Calendar className="h-4 w-4" />
                                        Horario
                                    </Button>
                                </div>
                            </CardContent>
                        </CardItem>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
