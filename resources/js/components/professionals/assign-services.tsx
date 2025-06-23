import { ProfessionalResource } from '@/interfaces/professional';
import { ServiceResource } from '@/interfaces/service';
import { formatCurrency } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { TFunction } from 'i18next';
import { AlertCircleIcon, ClockIcon, DollarSignIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { EmptyState } from '../ui/empty-state';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface AssignServicesProps {
    services: ServiceResource[];
    t: TFunction;
    professional: ProfessionalResource;
}

export function AssignServices({ services, t, professional }: AssignServicesProps) {
    const [availableServices, setAvailableServices] = useState<ServiceResource[]>(
        services.filter((s) => !professional.services.some((ps) => ps.id === s.id)),
    );
    const [assignedServices, setAssignedServices] = useState<ServiceResource[]>(
        professional.services.map((ps) => {
            const fullService = services.find((s) => s.id === ps.id);
            return {
                ...(fullService || ps),
                price: ps.price,
                duration: ps.duration,
            };
        }),
    );
    const [searchAvailable, setSearchAvailable] = useState('');
    const [searchAssigned, setSearchAssigned] = useState('');
    const [isOpenAssignModal, setIsOpenAssignModal] = useState(false);
    const [isOpenAssignAllModal, setIsOpenAssignAllModal] = useState(false);
    const [formData, setFormData] = useState({
        service_id: '',
        duration: 0,
        price: 0,
    });

    const handleSubmitAssign = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleAssign(formData);
    };

    const handleAssign = (formData: { service_id: string; duration: number; price: number }) => {
        // Mover servicio de disponibles a asignados
        const newAvailable = availableServices.filter((s) => s.id !== formData.service_id);
        const service = services.find((s) => s.id === formData.service_id);
        if (!service) return;
        const newAssigned = [...assignedServices, { ...service, price: formData.price, duration: formData.duration }] as ServiceResource[];

        setAvailableServices(newAvailable);
        setAssignedServices(newAssigned);
        setIsOpenAssignModal(false);
    };

    const onAssign = () => {
        router.post(route('professionals.assign-services.assign', { professional: professional.id }), {
            services: assignedServices.map((s) => ({
                service_id: s.id,
                price: s.price,
                duration: s.duration,
            })),
        });
    };

    const handleRemove = (service: ServiceResource) => {
        const newAssigned = assignedServices.filter((s) => s.id !== service.id);

        const originalService = services.find((s) => s.id === service.id);
        if (!originalService) return;

        const newAvailable = [...availableServices, originalService].sort((a, b) => a.name.localeCompare(b.name));

        setAssignedServices(newAssigned);
        setAvailableServices(newAvailable);
    };

    const handleAssignAll = () => {
        const newAssigned = [...assignedServices, ...availableServices];
        setAssignedServices(newAssigned);
        setAvailableServices([]);
        setIsOpenAssignAllModal(false);
    };

    const handleRemoveAll = () => {
        const servicesToRestore = assignedServices.map((as) => {
            return services.find((s) => s.id === as.id) || as;
        });

        const newAvailable = [...availableServices, ...servicesToRestore]
            .filter((service, index, self) => index === self.findIndex((s) => s.id === service.id))
            .sort((a, b) => a.name.localeCompare(b.name));

        setAvailableServices(newAvailable);
        setAssignedServices([]);
    };

    // Filtrar servicios basados en la búsqueda
    const filteredAvailable = availableServices.filter(
        (service) =>
            service.name?.toLowerCase().includes(searchAvailable.toLowerCase()) ||
            service.description?.toLowerCase().includes(searchAvailable.toLowerCase()),
    );

    const filteredAssigned = assignedServices.filter(
        (service) =>
            service.name.toLowerCase().includes(searchAssigned.toLowerCase()) ||
            service.description.toLowerCase().includes(searchAssigned.toLowerCase()),
    );

    const handleOpenAssignModal = (service: ServiceResource) => {
        setIsOpenAssignModal(true);
        setFormData({
            service_id: service.id,
            duration: service.duration,
            price: service.price,
        });
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-4 lg:flex-row">
                {/* Servicios asignados */}
                <Card className="flex-1">
                    <CardContent>
                        <h3 className="mb-3 text-lg font-medium">
                            {t('professionals.assign_services.assigned')} ({assignedServices.length})
                        </h3>

                        <div className="mb-3">
                            <Input
                                type="text"
                                placeholder={t('professionals.assign_services.search_services')}
                                className="w-full"
                                value={searchAssigned}
                                onChange={(e) => setSearchAssigned(e.target.value)}
                            />
                        </div>

                        {filteredAssigned.length > 0 ? (
                            <ul className="max-h-60 space-y-3 overflow-y-auto">
                                {filteredAssigned.map((service) => (
                                    <li
                                        key={service.id}
                                        className="flex flex-col gap-2 rounded border p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-base font-semibold">{service.name}</p>
                                            <p className="text-sm text-muted-foreground">{service.description}</p>

                                            <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <span>{t('professionals.assign_services.duration')}:</span>
                                                    <span className="flex items-center gap-1 font-medium text-foreground">
                                                        <ClockIcon className="h-4 w-4" />
                                                        {service.duration} {t('professionals.assign_services.minutes')}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <span>{t('professionals.assign_services.price')}:</span>
                                                    <span className="flex items-center gap-1 font-medium text-foreground">
                                                        <DollarSignIcon className="h-4 w-4" />
                                                        {formatCurrency(service.price)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="self-end lg:self-auto">
                                            <Button onClick={() => handleRemove(service)} variant="outline" className="mt-2 lg:mt-0">
                                                <span className="hidden lg:block">{t('professionals.assign_services.remove')}</span>
                                                <TrashIcon className="h-4 w-4 lg:ml-2" />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <EmptyState text={t('professionals.assign_services.no_assigned')} />
                        )}

                        {assignedServices.length > 0 && (
                            <Button onClick={handleRemoveAll} variant="outline" className="mt-3">
                                {t('professionals.assign_services.remove_all')}
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Servicios disponibles */}
                <Card className="flex-1">
                    <CardContent>
                        <h3 className="mb-3 text-lg font-medium">
                            {t('professionals.assign_services.available')} ({availableServices.length})
                        </h3>

                        <div className="mb-3">
                            <Input
                                type="text"
                                placeholder={t('professionals.assign_services.search_services')}
                                className="w-full"
                                value={searchAvailable}
                                onChange={(e) => setSearchAvailable(e.target.value)}
                            />
                        </div>

                        {filteredAvailable.length > 0 ? (
                            <ul className="max-h-60 space-y-3 overflow-y-auto">
                                {filteredAvailable.map((service) => (
                                    <li
                                        key={service.id}
                                        className="flex flex-col gap-2 rounded border p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-base font-semibold">{service.name}</p>
                                            <p className="text-sm text-muted-foreground">{service.description}</p>

                                            <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <span>{t('professionals.assign_services.duration')}:</span>
                                                    <span className="flex items-center gap-1 font-medium text-foreground">
                                                        <ClockIcon className="h-4 w-4" />
                                                        {service.duration} {t('professionals.assign_services.minutes')}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <span>{t('professionals.assign_services.price')}:</span>
                                                    <span className="flex items-center gap-1 font-medium text-foreground">
                                                        <DollarSignIcon className="h-4 w-4" />
                                                        {formatCurrency(service.price)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="self-end lg:self-auto">
                                            <Button onClick={() => handleOpenAssignModal(service)} variant="outline" className="mt-2 lg:mt-0">
                                                <span className="hidden lg:block">{t('professionals.assign_services.assign')}</span>
                                                <PlusIcon className="h-4 w-4 lg:ml-2" />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <EmptyState
                                text={t('professionals.assign_services.no_available')}
                                action={
                                    <Link
                                        href={route('services.index')}
                                        className="flex items-center gap-2 text-blue-500 underline hover:text-blue-700"
                                    >
                                        <PlusIcon className="h-4 w-4" />
                                        {t('professionals.assign_services.create_service')}
                                    </Link>
                                }
                            />
                        )}

                        {availableServices.length > 0 && (
                            <Button onClick={() => setIsOpenAssignAllModal(true)} variant="outline" className="mt-3">
                                {t('professionals.assign_services.assign_all')}
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Resumen Mejorado */}
            <Card className="flex-1 shadow-md">
                <CardHeader className="border-b pb-3">
                    <CardTitle className="text-lg font-semibold text-foreground">{t('professionals.assign_services.summary')}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 pt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t('professionals.assign_services.total_assigned')}:</span>
                        <span className="font-medium text-foreground">{assignedServices.length}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t('professionals.assign_services.total_available')}:</span>
                        <span className="font-medium text-foreground">{availableServices.length}</span>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-3 border-t pt-4">
                    <Button onClick={() => router.visit(route('professionals.index'))} variant="outline">
                        {t('professionals.assign_services.cancel')}
                    </Button>

                    <Button onClick={onAssign} disabled={assignedServices.length === 0}>
                        {t('professionals.assign_services.assign')}
                    </Button>
                </CardFooter>
            </Card>

            <Dialog open={isOpenAssignModal} onOpenChange={setIsOpenAssignModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('professionals.assign_services.assign_service')}</DialogTitle>
                        <DialogDescription>{t('professionals.assign_services.assign_service_description')}</DialogDescription>
                    </DialogHeader>
                    <Alert variant="info" className="mb-4">
                        <AlertCircleIcon className="h-4 w-4" />
                        <AlertDescription>{t('professionals.assign_services.alert_assign')}</AlertDescription>
                    </Alert>

                    <form onSubmit={handleSubmitAssign}>
                        <div className="flex flex-col gap-4">
                            <Input
                                className="hidden"
                                type="text"
                                placeholder={t('professionals.assign_services.service_name')}
                                value={formData.service_id}
                                onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                            />
                            <div>
                                <Label>{t('professionals.assign_services.duration')}</Label>
                                <Input
                                    type="number"
                                    placeholder={t('professionals.assign_services.duration')}
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <Label>{t('professionals.assign_services.price')}</Label>
                                <Input
                                    type="number"
                                    placeholder={t('professionals.assign_services.price')}
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-4 flex justify-end">
                            <Button type="submit">{t('professionals.assign_services.assign')}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isOpenAssignAllModal} onOpenChange={setIsOpenAssignAllModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('professionals.assign_services.assign_all')}</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                        <Alert variant="warning">
                            <AlertCircleIcon className="h-4 w-4" />
                            <AlertDescription>{t('professionals.assign_services.alert_assign_all')}</AlertDescription>
                        </Alert>
                    </AlertDialogDescription>
                    <AlertDialogFooter className="flex justify-end">
                        <Button onClick={handleAssignAll} variant="default" className="w-full">
                            {t('professionals.assign_services.assign_all')}
                        </Button>
                        <Button onClick={() => setIsOpenAssignAllModal(false)} variant="outline">
                            {t('professionals.assign_services.close')}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
