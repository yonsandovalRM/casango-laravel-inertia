import { useServiceFilters } from '@/hooks/use-service-filters';
import { CategoryResource } from '@/interfaces/category';
import { ServiceResource, ServiceStatistics } from '@/interfaces/service';
import { formatCurrency } from '@/lib/utils';
import { TFunction } from 'i18next';
import { BarChart3, Clock, DollarSign, Edit, MapPin, Trash2, Users, Video } from 'lucide-react';
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
import { CardContent, CardDescription, CardHeader, CardItem, CardTitle } from '../ui/card';
import { EmptyState } from '../ui/empty-state';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AdvancedServiceMetrics } from './advanced-metrics';
import { FormService } from './form-service';
import { useService } from './service-context';
import { ServiceFiltersComponent } from './service-filters';
import { ServiceStats } from './service-stats';

interface ManageServiceProps {
    services: ServiceResource[];
    categories: CategoryResource[];
    statistics: ServiceStatistics;
    companyAllowsVideoCalls: boolean;
    t: TFunction;
}

export function ManageService({ services, categories, statistics, companyAllowsVideoCalls, t }: ManageServiceProps) {
    const { setService, setOpen, onDelete } = useService();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

    // Use the custom hook for filtering
    const { filters, setFilters, filteredServices, hasActiveFilters, clearFilters } = useServiceFilters(services);

    const handleDelete = (serviceId: string) => {
        setServiceToDelete(serviceId);
        setOpenDeleteModal(true);
    };

    const confirmDelete = () => {
        if (serviceToDelete) {
            onDelete(serviceToDelete);
            setOpenDeleteModal(false);
            setServiceToDelete(null);
        }
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

    const getServiceTypeIcon = (serviceType: string) => {
        switch (serviceType) {
            case 'video_call':
                return <Video className="h-4 w-4" />;
            case 'hybrid':
                return <Users className="h-4 w-4" />;
            default:
                return <MapPin className="h-4 w-4" />;
        }
    };

    const getServiceTypeColor = (serviceType: string) => {
        switch (serviceType) {
            case 'video_call':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'hybrid':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
            default:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
        }
    };

    return (
        <div className="space-y-6">
            <AppHeaderPage
                title={t('services.title')}
                description={t('services.description')}
                actions={<Button onClick={handleCreate}>{t('services.manage.create')}</Button>}
            />

            {/* Tabs for different views */}
            <div className="px-6">
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">General</TabsTrigger>
                        <TabsTrigger value="metrics">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Métricas
                        </TabsTrigger>
                        <TabsTrigger value="services">Servicios</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <ServiceStats statistics={statistics} />
                    </TabsContent>

                    <TabsContent value="metrics" className="space-y-6">
                        <AdvancedServiceMetrics services={services} statistics={statistics} />
                    </TabsContent>

                    <TabsContent value="services" className="space-y-6">
                        {/* Filters */}
                        <ServiceFiltersComponent
                            filters={filters}
                            onFiltersChange={setFilters}
                            categories={categories}
                            companyAllowsVideoCalls={companyAllowsVideoCalls}
                        />

                        {/* Services List Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">
                                {t('services.manage.services_list')} ({filteredServices.length})
                            </h3>
                            {filteredServices.length !== services.length && (
                                <p className="text-sm text-muted-foreground">
                                    {t('services.manage.filtered_results', {
                                        filtered: filteredServices.length,
                                        total: services.length,
                                    })}
                                </p>
                            )}
                        </div>

                        {/* Services Grid */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredServices.length === 0 && !hasActiveFilters && (
                                <div className="col-span-full">
                                    <EmptyState
                                        action={<Button onClick={handleCreate}>{t('services.manage.create')}</Button>}
                                        text={t('services.manage.no_services')}
                                    />
                                </div>
                            )}

                            {filteredServices.length === 0 && hasActiveFilters && (
                                <div className="col-span-full">
                                    <EmptyState
                                        text={t('services.manage.no_services_found')}
                                        action={
                                            <Button variant="outline" onClick={clearFilters}>
                                                {t('services.filters.clear')}
                                            </Button>
                                        }
                                    />
                                </div>
                            )}

                            {filteredServices.map((service) => (
                                <CardItem key={service.id} className="group transition-all hover:shadow-md">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                                                    {service.name}
                                                </CardTitle>
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
                                        <div className="space-y-4">
                                            {/* Badges Row */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge variant={service.is_active ? 'default' : 'secondary'} className="text-xs">
                                                    {service.category.name}
                                                </Badge>
                                                <Badge variant="outline" className={`text-xs ${getServiceTypeColor(service.service_type)}`}>
                                                    <div className="flex items-center gap-1">
                                                        {getServiceTypeIcon(service.service_type)}
                                                        <span>{service.service_type_label}</span>
                                                    </div>
                                                </Badge>
                                                <Badge variant={service.is_active ? 'default' : 'outline'} className="text-xs">
                                                    {service.is_active ? t('services.status.active') : t('services.status.inactive')}
                                                </Badge>
                                            </div>

                                            {/* Price and Duration */}
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <DollarSign className="h-4 w-4" />
                                                    <span className="font-medium text-foreground">
                                                        {service.price ? formatCurrency(service.price) : t('services.price.free')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{formatDuration(service.duration)}</span>
                                                </div>
                                            </div>

                                            {/* Professionals Count */}
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Users className="h-3 w-3" />
                                                <span>{t('services.professionals_count', { count: service.professionals_count })}</span>
                                            </div>

                                            {/* Notes */}
                                            {service.notes && (
                                                <p className="line-clamp-2 rounded bg-muted/30 p-2 text-xs text-muted-foreground">{service.notes}</p>
                                            )}

                                            {/* Time Details */}
                                            {(service.preparation_time > 0 || service.post_service_time > 0) && (
                                                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-medium">{t('services.preparation')}:</span>
                                                        <span>{formatDuration(service.preparation_time)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-medium">{t('services.post_service')}:</span>
                                                        <span>{formatDuration(service.post_service_time)}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </CardItem>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Form Modal */}
            <FormService categories={categories} companyAllowsVideoCalls={companyAllowsVideoCalls} />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('services.manage.dialog_delete.title')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('services.manage.dialog_delete.description')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setServiceToDelete(null)}>{t('services.manage.dialog_delete.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>{t('services.manage.dialog_delete.confirm')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
