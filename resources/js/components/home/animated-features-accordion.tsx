import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Mail, MessageSquare, User, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Feature {
    id: string;
    icon: React.ElementType;
    title: string;
    description: string;
    image: string;
}

const features: Feature[] = [
    {
        id: 'appointment-management',
        icon: Calendar,
        title: 'Gestión Inteligente de Citas',
        description:
            'Sistema completo para programar y gestionar citas con disponibilidad en tiempo real. Calendario intuitivo que se sincroniza con todas tus plataformas favoritas.',
        image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
    },
    {
        id: 'multi-professional',
        icon: Users,
        title: 'Multi-Profesional',
        description:
            'Gestiona múltiples profesionales con horarios y servicios personalizados. Cada miembro de tu equipo puede tener su propia configuración y disponibilidad.',
        image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop',
    },
    {
        id: 'flexible-scheduling',
        icon: Clock,
        title: 'Bloques Horarios Flexibles',
        description:
            'Configura disponibilidad, excepciones y vacaciones de manera sencilla. Define bloques de tiempo personalizados para diferentes tipos de servicios.',
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop',
    },
    {
        id: 'automatic-reminders',
        icon: Mail,
        title: 'Recordatorios Automáticos',
        description:
            'Envía notificaciones por email y WhatsApp para reducir ausencias. Personaliza los mensajes y horarios de envío según tus necesidades.',
        image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=600&h=400&fit=crop',
    },
    {
        id: 'video-calls',
        icon: MessageSquare,
        title: 'Videollamadas Integradas',
        description: 'Citas online con videollamadas generadas automáticamente. Enlaces únicos y seguros para cada sesión virtual con tus clientes.',
        image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=600&h=400&fit=crop',
    },
    {
        id: 'custom-profiles',
        icon: User,
        title: 'Fichas Personalizadas',
        description: 'Historial de clientes adaptado al tipo de negocio. Guarda información relevante y personaliza los campos según tu profesión.',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    },
];

export function AnimatedFeaturesAccordion() {
    const [activeItem, setActiveItem] = useState<string>(features[0].id);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const animationRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const duration = 6000; // 6 segundos por item

    // Efecto para manejar la transición entre items
    useEffect(() => {
        if (!isAutoPlaying) return;

        const transitionToNextItem = () => {
            const currentIndex = features.findIndex((f) => f.id === activeItem);
            const nextIndex = (currentIndex + 1) % features.length;
            setActiveItem(features[nextIndex].id);
            setProgress(0);
            startTimeRef.current = performance.now();
            animateProgress();
        };

        const timeoutId = setTimeout(transitionToNextItem, duration);

        return () => clearTimeout(timeoutId);
    }, [activeItem, isAutoPlaying]);

    // Animación suave del progress bar usando requestAnimationFrame
    const animateProgress = () => {
        if (!isAutoPlaying) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            return;
        }

        const animate = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;

            const elapsed = timestamp - startTimeRef.current;
            const newProgress = Math.min((elapsed / duration) * 100, 100);

            setProgress(newProgress);

            if (newProgress < 100) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    };

    // Iniciar animación cuando cambia el item activo o se reanuda el autoplay
    useEffect(() => {
        startTimeRef.current = performance.now();
        animateProgress();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [activeItem, isAutoPlaying]);

    const handleAccordionChange = (value: string) => {
        if (value) {
            setActiveItem(value);
            setIsAutoPlaying(false);
            setProgress(0);

            // Cancelar cualquier animación en curso
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        }
    };

    const activeFeature = features.find((f) => f.id === activeItem);

    return (
        <section className="bg-card px-6 py-24" id="features">
            <div className="mx-auto max-w-7xl">
                <div className="mb-16 text-center">
                    <h2 className="mb-6 font-outfit text-4xl font-bold text-foreground">Todo lo que necesitas</h2>
                    <p className="mx-auto max-w-2xl text-xl text-muted-foreground">Funcionalidades diseñadas para simplificar tu día a día</p>
                </div>

                <div className="grid items-start gap-16 lg:grid-cols-2">
                    {/* Accordion Section */}
                    <div className="space-y-4">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-lg font-medium text-foreground">Características principales</h3>
                            <button
                                onClick={() => {
                                    setIsAutoPlaying(!isAutoPlaying);
                                    if (isAutoPlaying) {
                                        if (animationRef.current) {
                                            cancelAnimationFrame(animationRef.current);
                                        }
                                    } else {
                                        startTimeRef.current = performance.now() - (progress / 100) * duration;
                                        animateProgress();
                                    }
                                }}
                                className="text-sm text-blue-600 transition-colors duration-200 hover:underline"
                            >
                                {isAutoPlaying ? 'Pausar' : 'Reproducir'} tour
                            </button>
                        </div>

                        <Accordion type="single" value={activeItem} onValueChange={handleAccordionChange} className="space-y-3">
                            {features.map((feature) => {
                                const isActive = activeItem === feature.id;
                                const IconComponent = feature.icon;

                                return (
                                    <AccordionItem
                                        key={feature.id}
                                        value={feature.id}
                                        className={`overflow-hidden rounded-xl border transition-all duration-500 ease-in-out ${
                                            isActive
                                                ? 'border-blue-200 bg-background shadow-lg dark:border-blue-900'
                                                : 'border-border bg-background/50'
                                        }`}
                                    >
                                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                            <div className="flex items-center space-x-4 text-left">
                                                <div
                                                    className={`flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300 ${
                                                        isActive ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-border'
                                                    }`}
                                                >
                                                    <IconComponent
                                                        className={`h-6 w-6 transition-colors duration-300 ${
                                                            isActive ? 'text-blue-600' : 'text-muted-foreground'
                                                        }`}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4
                                                        className={`font-outfit text-lg font-semibold transition-colors duration-300 ${
                                                            isActive ? 'text-foreground' : 'text-muted-foreground'
                                                        }`}
                                                    >
                                                        {feature.title}
                                                    </h4>
                                                </div>
                                            </div>
                                        </AccordionTrigger>

                                        <AccordionContent className="px-6 pb-4">
                                            <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
                                        </AccordionContent>

                                        {/* Progress Bar at the bottom of the card */}
                                        {isActive && (
                                            <div className="px-6 pb-6">
                                                <Progress value={progress} className="h-1 bg-gray-200 dark:bg-gray-700" />
                                            </div>
                                        )}
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    </div>

                    {/* Image Section */}
                    <div className="lg:sticky lg:top-24">
                        <div className="rounded-2xl bg-background p-4 shadow-xl">
                            <div className="aspect-video overflow-hidden rounded-xl">
                                <img
                                    src={activeFeature?.image}
                                    alt={activeFeature?.title}
                                    className="h-full w-full object-cover transition-all duration-700 ease-in-out hover:scale-105"
                                />
                            </div>
                            <div className="mt-4 p-4">
                                <h4 className="mb-2 font-outfit text-lg font-semibold text-foreground transition-all duration-500">
                                    {activeFeature?.title}
                                </h4>
                                <p className="text-sm text-muted-foreground transition-all duration-500">{activeFeature?.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
