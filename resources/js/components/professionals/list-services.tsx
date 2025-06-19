import { ServiceResource } from '@/interfaces/service';
import { TFunction } from 'i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ListServicesProps {
    services: ServiceResource[];
    t: TFunction;
}

export function ListServices({ services, t }: ListServicesProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
                <Card key={service.id}>
                    <CardHeader>
                        <CardTitle>{service.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{service.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
