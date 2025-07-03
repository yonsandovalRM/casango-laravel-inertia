import { Button } from '@/components/ui/button';
import { useCompany } from '@/hooks/use-company';
import { router } from '@inertiajs/react';
import { Calendar } from 'lucide-react';

const branches = [
    {
        name: 'Sucursal 1',
        address: 'Calle 123, Ciudad',
        phone: '1234567890',
    },
    {
        name: 'Sucursal 2',
        address: 'Calle 456, Ciudad',
        phone: '1234567890',
    },
];

const Hero = () => {
    const company = useCompany();
    return (
        <section id="inicio" className="relative overflow-hidden pt-20 pb-16">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=600&fit=crop"
                    alt="Background"
                    className="object-cover_image h-full w-full opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70 backdrop-blur-sm"></div>
            </div>

            <div className="relative z-10 container mx-auto mt-10">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    {/* Content */}
                    <div className="flex min-h-[400px] flex-col justify-center">
                        <div className="mb-6 flex items-center">
                            <img
                                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=100&h=100&fit=crop&crop=center"
                                alt={`${company.name} Logo`}
                                className="mr-4 h-16 w-16 rounded-lg"
                            />
                            {/* <h1 className="text-3xl font-bold text-white sm:text-4xl">{company.name}</h1> */}
                        </div>

                        <h2 className="mb-4 font-outfit text-4xl font-bold sm:text-5xl">
                            <span className="text-foreground">{company.tagline || 'Agrega un slogan para tu empresa.'}</span>
                        </h2>

                        <p className="mb-8 text-xl leading-relaxed text-foreground">
                            {company.description || 'Agrega una descripción para tu empresa en el panel de administración.'}
                        </p>

                        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                            <Button size="lg" onClick={() => router.visit(route('home.bookings'))}>
                                <Calendar className="mr-2 h-5 w-5" />
                                Reservar Cita
                            </Button>
                            <Button size="lg" variant="outline">
                                Ver Servicios
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-accent p-2 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1000&h=1000&crop=center"
                            alt={company.name}
                            className="h-96 w-full rounded-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
