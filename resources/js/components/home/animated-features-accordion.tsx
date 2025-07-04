import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Mail, MessageSquare, PauseIcon, PlayIcon, User, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';

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

// Sistema de colores mejorado con variantes más completas
const COLOR_SCHEMES = [
    {
        name: 'violet',
        active: {
            text: 'text-white',
            bg: 'bg-cm-violet-600',
            border: 'border-cm-violet-200 dark:border-cm-violet-800',
            progress: 'bg-cm-violet-600',
        },
        inactive: {
            text: 'text-cm-violet-600',
            bg: 'bg-cm-violet-50',
            iconContainer: 'bg-card',
        },
    },
    {
        name: 'blue',
        active: {
            text: 'text-white',
            bg: 'bg-cm-blue-600',
            border: 'border-cm-blue-200 dark:border-cm-blue-800',
            progress: 'bg-cm-blue-600',
        },
        inactive: {
            text: 'text-cm-blue-600',
            bg: 'bg-cm-blue-50',
            iconContainer: 'bg-card',
        },
    },
    {
        name: 'green',
        active: {
            text: 'text-white',
            bg: 'bg-cm-green-600',
            border: 'border-cm-green-200 dark:border-cm-green-800',
            progress: 'bg-cm-green-600',
        },
        inactive: {
            text: 'text-cm-green-600',
            bg: 'bg-cm-green-50',
            iconContainer: 'bg-card',
        },
    },
    {
        name: 'orange',
        active: {
            text: 'text-white',
            bg: 'bg-cm-orange-600',
            border: 'border-cm-orange-200 dark:border-cm-orange-800',
            progress: 'bg-cm-orange-600',
        },
        inactive: {
            text: 'text-cm-orange-600',
            bg: 'bg-cm-orange-50',
            iconContainer: 'bg-card',
        },
    },
    {
        name: 'pink',
        active: {
            text: 'text-white',
            bg: 'bg-cm-pink-600',
            border: 'border-cm-pink-200 dark:border-cm-pink-800',
            progress: 'bg-cm-pink-600',
        },
        inactive: {
            text: 'text-cm-pink-600',
            bg: 'bg-cm-pink-50',
            iconContainer: 'bg-card',
        },
    },
];

export function AnimatedFeaturesAccordion() {
    const [activeItem, setActiveItem] = useState<string>(features[0].id);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const animationRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const duration = 6000; // 6 segundos por item

    // Obtener el esquema de color para un feature específico
    const getColorScheme = (featureIndex: number) => {
        return COLOR_SCHEMES[featureIndex % COLOR_SCHEMES.length];
    };

    // Efecto para manejar la transición automática
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

    // Animación del progress bar
    const animateProgress = () => {
        if (!isAutoPlaying) {
            cancelAnimationFrame(animationRef.current);
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
        return () => cancelAnimationFrame(animationRef.current);
    };

    // Iniciar/restablecer animación
    useEffect(() => {
        startTimeRef.current = performance.now();
        animateProgress();
    }, [activeItem, isAutoPlaying]);

    const handleAccordionChange = (value: string) => {
        if (!value) return;
        setActiveItem(value);
        setIsAutoPlaying(false);
        setProgress(0);
        cancelAnimationFrame(animationRef.current);
    };

    const activeFeature = features.find((f) => f.id === activeItem);
    const activeIndex = features.findIndex((f) => f.id === activeItem);
    const activeColorScheme = getColorScheme(activeIndex);

    return (
        <section className="px-6 py-24" id="features">
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
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setIsAutoPlaying(!isAutoPlaying);
                                    if (!isAutoPlaying) {
                                        startTimeRef.current = performance.now() - (progress / 100) * duration;
                                        animateProgress();
                                    }
                                }}
                                className="flex items-center gap-2 text-sm"
                            >
                                {isAutoPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                                {isAutoPlaying ? 'Pausar' : 'Reproducir'} tour
                            </Button>
                        </div>

                        <Accordion type="single" value={activeItem} onValueChange={handleAccordionChange} className="space-y-3">
                            {features.map((feature, index) => {
                                const isActive = activeItem === feature.id;
                                const IconComponent = feature.icon;
                                const colorScheme = getColorScheme(index);

                                return (
                                    <AccordionItem
                                        key={feature.id}
                                        value={feature.id}
                                        className={cn(
                                            'overflow-hidden rounded-xl border border-border transition-all duration-300',
                                            isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100',
                                        )}
                                    >
                                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                            <div className="flex items-center space-x-4 text-left">
                                                <div
                                                    className={cn(
                                                        'flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300',
                                                        isActive ? colorScheme.active.bg : colorScheme.inactive.iconContainer,
                                                    )}
                                                >
                                                    <IconComponent
                                                        className={cn(
                                                            'h-6 w-6 transition-all duration-300',
                                                            isActive ? colorScheme.active.text : colorScheme.inactive.text,
                                                        )}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4
                                                        className={cn(
                                                            'font-semibold transition-all duration-300',
                                                            isActive ? 'text-lg text-foreground' : 'text-sm text-muted-foreground',
                                                        )}
                                                    >
                                                        {feature.title}
                                                    </h4>
                                                </div>
                                            </div>
                                        </AccordionTrigger>

                                        <AccordionContent className="px-6 pb-4">
                                            <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
                                        </AccordionContent>

                                        {isActive && (
                                            <div className="px-6 pb-6">
                                                <Progress value={progress} className={cn('h-0.5', colorScheme.active.progress)} />
                                            </div>
                                        )}
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    </div>

                    {/* Image Section */}
                    <div className="lg:sticky lg:top-24">
                        <div
                            className="rounded-2xl bg-card p-4 shadow-xl"
                            style={{
                                borderTop: `4px solid ${isAutoPlaying ? activeColorScheme.active.bg : 'transparent'}`,
                                transition: 'border-color 0.3s ease',
                            }}
                        >
                            <div className="aspect-video overflow-hidden rounded-xl">
                                <img
                                    src={activeFeature?.image}
                                    alt={activeFeature?.title}
                                    className="h-full w-full object-cover transition-all duration-700 ease-in-out hover:scale-105"
                                />
                            </div>
                            <div className="mt-4 p-4">
                                <h4 className="mb-2 font-outfit text-lg font-semibold text-gray-900 dark:text-white">{activeFeature?.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{activeFeature?.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
