import { AppHeaderPage } from '@/components/app-header-page';
import { CreateService } from '@/components/services/create-service';
import { EditService } from '@/components/services/edit-service';
import { Button } from '@/components/ui/button';
import { ServiceResource } from '@/interfaces/service';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';

export default withTranslation()(ServicesIndex);
interface ServicesIndexProps {
    t: TFunction;
    services: ServiceResource[];
}

function ServicesIndex({ t, services }: ServicesIndexProps) {
    const handleDelete = (serviceId: string) => {
        console.log(serviceId);
    };

    return (
        <AppLayout breadcrumbs={[{ title: t('services.title'), href: '/services' }]}>
            <Head title={t('services.title')} />
            <AppHeaderPage title={t('services.title')} actions={<CreateService />} />
            <div className="flex flex-col gap-4">
                <h1>{t('services.title')}</h1>
                <div className="flex flex-col gap-4">
                    {services.map((service) => (
                        <div key={service.id} className="flex flex-col gap-2">
                            <h2 className="text-lg font-bold">{service.name}</h2>
                            <p className="text-sm text-gray-500">{service.description}</p>
                            <p className="text-sm text-gray-500">{service.notes}</p>
                            <p className="text-sm text-gray-500">{service.category}</p>
                            <p className="text-sm text-gray-500">{service.price}</p>
                            <p className="text-sm text-gray-500">{service.duration}</p>
                            <p className="text-sm text-gray-500">{service.preparation_time}</p>
                            <p className="text-sm text-gray-500">{service.post_service_time}</p>
                            <p className="text-sm text-gray-500">{service.is_active ? t('services.active') : t('services.inactive')}</p>
                            <EditService service={service} />
                            <Button variant="soft-destructive" size="sm" onClick={() => handleDelete(service.id)}>
                                {t('services.delete')}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
