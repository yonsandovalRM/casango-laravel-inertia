import { useServices } from '@/hooks/use-services';
import { router } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function PopularServices() {
    const { highlightedServices } = useServices('', '', '');
    return (
        <>
            {/* Popular Services */}
            <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold text-foreground">Servicios Populares</h2>
                <p className="mb-8 text-muted-foreground">Los servicios más solicitados por nuestros clientes</p>
            </div>

            <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {highlightedServices.map((service, index) => (
                    <Card key={index} className="group cursor-pointer bg-card transition-all duration-300 hover:shadow-lg">
                        <CardHeader className="pb-3">
                            <div className="text-sm font-medium text-primary">{service.category.name}</div>
                            <CardTitle className="text-lg transition-colors group-hover:text-primary">{service.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-3 flex items-center justify-between">
                                <span className="font-semibold text-primary">{service.price}</span>
                                <span className="text-sm text-muted-foreground">{service.duration}</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full group-hover:border-blue-300 group-hover:bg-blue-50"
                                onClick={() => router.visit(route('home.bookings.service', service.id))}
                            >
                                Ver Disponibilidad
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* CTA Section */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center text-white">
                <h2 className="mb-4 text-3xl font-bold">¡Comienza a Reservar Hoy!</h2>
                <p className="mb-8 text-xl opacity-90">Únete a miles de clientes satisfechos que confían en nuestros profesionales</p>
                <Button size="lg" variant="secondary" className="px-8 py-6 text-lg" onClick={() => router.visit(route('home.bookings'))}>
                    <Calendar className="mr-2 h-5 w-5" />
                    Explorar Servicios
                </Button>
            </div>
        </>
    );
}
