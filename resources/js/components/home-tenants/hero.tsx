import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Phone } from 'lucide-react';

// Esta data vendría de tu API/base de datos según el subdominio
const companyData = {
    name: 'Clínica Dental Sonrisas',
    logo: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=100&h=100&fit=crop&crop=center',
    backgroundImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=600&fit=crop',
    description:
        'Tu salud dental es nuestra prioridad. Contamos con los mejores especialistas y tecnología de vanguardia para brindarte el mejor cuidado.',
    tagline: 'Sonríe con confianza',
    schedule: {
        weekdays: 'Lunes a Viernes: 8:00 AM - 6:00 PM',
        saturday: 'Sábados: 9:00 AM - 2:00 PM',
        sunday: 'Domingos: Cerrado',
    },
    branches: [
        {
            name: 'Sucursal Centro',
            address: 'Av. Principal 123, Centro',
            phone: '+1 234-567-8900',
        },
        {
            name: 'Sucursal Norte',
            address: 'Calle Norte 456, Zona Norte',
            phone: '+1 234-567-8901',
        },
    ],
};

const Hero = () => {
    return (
        <section id="inicio" className="relative overflow-hidden px-4 pt-20 pb-16 sm:px-6 lg:px-8">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img src={companyData.backgroundImage} alt="Background" className="h-full w-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 to-gray-950/70"></div>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    {/* Content */}
                    <div>
                        <div className="mb-6 flex items-center">
                            <img src={companyData.logo} alt={`${companyData.name} Logo`} className="mr-4 h-16 w-16 rounded-lg" />
                            <h1 className="text-3xl font-bold text-white sm:text-4xl">{companyData.name}</h1>
                        </div>

                        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
                            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                {companyData.tagline}
                            </span>
                        </h2>

                        <p className="mb-8 text-xl leading-relaxed text-gray-300">{companyData.description}</p>

                        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-3 text-lg text-white hover:from-violet-700 hover:to-blue-700"
                            >
                                <Calendar className="mr-2 h-5 w-5" />
                                Reservar Cita
                            </Button>
                            <Button size="lg" variant="outline" className="border-gray-600 px-8 py-3 text-lg text-gray-300 hover:bg-gray-800">
                                Ver Servicios
                            </Button>
                        </div>
                    </div>

                    {/* Company Info Card */}
                    <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
                        <h3 className="mb-6 text-xl font-bold text-white">Información</h3>

                        {/* Schedule */}
                        <div className="mb-6">
                            <h4 className="mb-3 flex items-center font-medium text-white">
                                <Clock className="mr-2 h-5 w-5 text-violet-400" />
                                Horarios de Atención
                            </h4>
                            <div className="space-y-1 text-gray-300">
                                <p className="text-sm">{companyData.schedule.weekdays}</p>
                                <p className="text-sm">{companyData.schedule.saturday}</p>
                                <p className="text-sm text-red-400">{companyData.schedule.sunday}</p>
                            </div>
                        </div>

                        {/* Branches */}
                        <div>
                            <h4 className="mb-3 flex items-center font-medium text-white">
                                <MapPin className="mr-2 h-5 w-5 text-blue-400" />
                                Nuestras Sucursales
                            </h4>
                            <div className="space-y-3">
                                {companyData.branches.map((branch, index) => (
                                    <div key={index} className="rounded-lg bg-gray-700/30 p-3">
                                        <p className="text-sm font-medium text-white">{branch.name}</p>
                                        <p className="text-sm text-gray-400">{branch.address}</p>
                                        <p className="mt-1 flex items-center text-sm text-violet-400">
                                            <Phone className="mr-1 h-3 w-3" />
                                            {branch.phone}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
