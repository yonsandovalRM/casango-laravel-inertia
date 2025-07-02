import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';

// Esta data vendría de tu API/base de datos según el subdominio y los profesionales de la empresa
const professionals = [
    {
        id: 1,
        name: 'Dr. María González',
        specialty: 'Odontología General',
        description: 'Especialista en tratamientos preventivos y rehabilitación oral',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
        branch: 'Sucursal Centro',
        available: true,
        services: [
            { name: 'Consulta General', price: 75 },
            { name: 'Limpieza Dental', price: 120 },
            { name: 'Empaste', price: 150 },
        ],
    },
    {
        id: 2,
        name: 'Dr. Carlos Ruiz',
        specialty: 'Ortodoncia',
        description: 'Experto en corrección de maloclusiones y estética dental',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        branch: 'Sucursal Norte',
        available: true,
        services: [
            { name: 'Consulta Ortodóncica', price: 90 },
            { name: 'Brackets Metálicos', price: 2500 },
            { name: 'Invisalign', price: 4500 },
        ],
    },
    {
        id: 3,
        name: 'Dra. Ana Martínez',
        specialty: 'Endodoncia',
        description: 'Especialista en tratamientos de conducto y cirugía endodóntica',
        image: 'https://images.unsplash.com/photo-1494790108755-2616c963e3b4?w=150&h=150&fit=crop&crop=face',
        branch: 'Sucursal Centro',
        available: false,
        services: [
            { name: 'Endodoncia', price: 350 },
            { name: 'Retratamiento', price: 450 },
        ],
    },
    {
        id: 4,
        name: 'Dr. Roberto Silva',
        specialty: 'Cirugía Oral',
        description: 'Cirujano maxilofacial con amplia experiencia en implantes',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        branch: 'Sucursal Norte',
        available: true,
        services: [
            { name: 'Extracción Simple', price: 80 },
            { name: 'Implante Dental', price: 1200 },
            { name: 'Cirugía Compleja', price: 800 },
        ],
    },
];

const ProfessionalsGrid = () => {
    return (
        <section id="profesionales" className="bg-background px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 font-outfit text-4xl font-bold text-foreground">Nuestros Profesionales</h2>
                    <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                        Contamos con un equipo de especialistas altamente calificados, comprometidos con brindarte la mejor atención profesional.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {professionals.map((professional) => (
                        <div
                            key={professional.id}
                            className="rounded-xl border border-border bg-background/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-500 hover:shadow-2xl hover:shadow-violet-500/10"
                        >
                            <div className="mb-4 text-center">
                                <img src={professional.image} alt={professional.name} className="mx-auto mb-3 h-20 w-20 rounded-full object-cover" />
                                <div
                                    className={`mb-2 inline-block h-3 w-3 rounded-full ${professional.available ? 'bg-green-400' : 'bg-red-400'}`}
                                ></div>
                                <h3 className="text-lg font-semibold text-foreground">{professional.name}</h3>
                                <p className="font-medium text-blue-500 dark:text-blue-400">{professional.specialty}</p>
                            </div>

                            <p className="mb-4 text-center text-sm leading-relaxed text-muted-foreground">{professional.description}</p>

                            <div className="mb-4 flex items-center justify-center gap-2 space-y-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>{professional.branch}</span>
                                </div>
                            </div>

                            <Button disabled={!professional.available} className="w-full">
                                <Calendar className="mr-2 h-4 w-4" />
                                {professional.available ? 'Reservar Cita' : 'No disponible'}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProfessionalsGrid;
