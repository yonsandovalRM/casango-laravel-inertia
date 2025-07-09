import { CategoryResource } from '@/interfaces/category';
import { ServiceResource } from '@/interfaces/service';
import { formatCurrency } from '@/lib/utils';
import { TFunction } from 'i18next';
import { Clock, DollarSign, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AppHeaderPage } from '../app-header-page';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../ui/alert-dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { EmptyState } from '../ui/empty-state';
import { FormService } from './form-service';
import { useService } from './service-context';

export function ManageService({ services, categories, t }: { services: ServiceResource[]; categories: CategoryResource[]; t: TFunction }) {
    const { setService, setOpen, onDelete } = useService();
    const [openModal, setOpenModal] = useState(false);
    const [serviceId, setServiceId] = useState<string | null>(null);

    const handleDelete = (serviceId: string) => {
        setServiceId(serviceId);
        setOpenModal(true);
    };
    const handleCreate = () => {
        setService(null);
        setOpen(true);
    };
    const handleEdit = (service: ServiceResource) => {
        setService(service);
        setOpen(true);
    };
    const formatDuration = (minutes: number) => `${minutes}min`;

    return (
        <div>
            <AppHeaderPage
                title={t('services.title')}
                description={t('services.description')}
                actions={<Button onClick={handleCreate}>{t('services.manage.create')}</Button>}
            />
            <div className="flex flex-col gap-6 p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.length === 0 && (
                        <EmptyState
                            action={<Button onClick={handleCreate}>{t('services.manage.create')}</Button>}
                            text={t('services.manage.no_services')}
                        />
                    )}
                    {services.map((service) => (
                        <Card key={service.id} className="group transition-all duration-200 hover:shadow-lg">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg font-semibold text-foreground transition-colors">{service.name}</CardTitle>
                                        {service.description && (
                                            <CardDescription className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                {service.description}
                                            </CardDescription>
                                        )}
                                    </div>
                                    <div className="ml-2 flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(service)}
                                            className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(service.id)}
                                            className="h-8 w-8 p-0 text-destructive opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Badge variant={service.is_active ? 'default' : 'secondary'} className="text-xs">
                                            {service.category.name}
                                        </Badge>
                                        <Badge variant={service.is_active ? 'default' : 'outline'} className="text-xs">
                                            {service.is_active ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <DollarSign className="h-4 w-4" />
                                            <span className="font-medium text-foreground">{formatCurrency(service.price)}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>{formatDuration(service.duration)}</span>
                                        </div>
                                    </div>

                                    {service.notes && (
                                        <p className="line-clamp-2 rounded bg-muted/30 p-2 text-xs text-muted-foreground">{service.notes}</p>
                                    )}

                                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                        <div>Preparación: {formatDuration(service.preparation_time)}</div>
                                        <div>Post-servicio: {formatDuration(service.post_service_time)}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <FormService categories={categories} />
            <AlertDialog open={openModal} onOpenChange={setOpenModal}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('services.manage.dialog_delete.title')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('services.manage.dialog_delete.description')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('services.manage.dialog_delete.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(serviceId!)}>{t('services.manage.dialog_delete.confirm')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
