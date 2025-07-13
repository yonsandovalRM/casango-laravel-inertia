import { Button } from '@/components/ui/button';
import { Calendar, ChevronRight, Play, Star, Users, Zap } from 'lucide-react';
import AnimatedBackground from './animated-background';

const HeroSection = () => {
    return (
        <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-20 pb-32">
            <AnimatedBackground />

            {/* Gradient overlays for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

            <div className="relative z-10 mx-auto max-w-6xl text-center">
                {/* Badge */}
                <div className="animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    <Zap className="h-4 w-4" />
                    Plataforma líder en gestión de citas
                </div>

                {/* Main heading with improved typography */}
                <h1 className="animate-fade-in mb-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text font-outfit text-5xl leading-tight font-bold text-transparent md:text-7xl lg:text-8xl dark:from-gray-100 dark:via-gray-200 dark:to-gray-400">
                    Gestión de citas
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text font-outfit text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-blue-600">
                        sin complicaciones
                    </span>
                </h1>

                {/* Enhanced description */}
                <p className="animate-fade-in mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl dark:text-gray-300">
                    La plataforma más <span className="font-semibold text-blue-600 dark:text-blue-400">simple e intuitiva</span> para profesionales
                    que buscan optimizar su tiempo y brindar la mejor experiencia a sus clientes.
                </p>

                {/* Improved CTA buttons */}
                <div className="animate-fade-in mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                    <Button
                        size="lg"
                        className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Comenzar gratis
                            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="group border-2 px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                    >
                        <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                        Ver demo
                    </Button>
                </div>

                {/* Trust indicators */}
                <div className="animate-fade-in mb-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <span>+1000 profesionales</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span>95% satisfacción</span>
                    </div>
                </div>

                {/* Enhanced preview section */}
                <div className="animate-fade-in mx-auto max-w-5xl">
                    <div className="group hover:shadow-3xl relative rounded-3xl bg-gradient-to-br from-white/80 to-gray-50/50 p-3 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] dark:from-gray-800/80 dark:to-gray-900/50">
                        {/* Browser mockup header */}
                        <div className="mb-4 flex items-center gap-2 rounded-t-2xl bg-gray-100 px-4 py-3 dark:bg-gray-700">
                            <div className="flex gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                                <div className="h-3 w-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="ml-4 flex-1 rounded bg-white px-3 py-1 text-sm text-gray-500 dark:bg-gray-600 dark:text-gray-300">
                                micita.app/dashboard
                            </div>
                        </div>

                        {/* Dashboard preview */}
                        <div className="relative h-96 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30">
                            {/* Floating elements for visual appeal */}
                            <div className="absolute top-6 left-6 rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur dark:bg-gray-800/90">
                                <div className="mb-2 h-2 w-16 rounded bg-blue-200 dark:bg-blue-700"></div>
                                <div className="h-1 w-12 rounded bg-gray-200 dark:bg-gray-600"></div>
                            </div>

                            <div className="absolute top-6 right-6 rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur dark:bg-gray-800/90">
                                <div className="mb-2 h-2 w-20 rounded bg-green-200 dark:bg-green-700"></div>
                                <div className="h-1 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
                            </div>

                            <div className="absolute bottom-6 left-6 rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur dark:bg-gray-800/90">
                                <div className="mb-2 h-2 w-14 rounded bg-purple-200 dark:bg-purple-700"></div>
                                <div className="h-1 w-10 rounded bg-gray-200 dark:bg-gray-600"></div>
                            </div>

                            {/* Central icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-6 shadow-2xl transition-transform duration-300 group-hover:scale-110">
                                    <Calendar className="h-12 w-12 text-white" />
                                </div>
                            </div>

                            {/* Main content area */}
                            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center">
                                <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-200">Dashboard de MiCita</h3>
                                <p className="text-lg text-gray-600 dark:text-gray-400">Interfaz intuitiva para gestionar todas tus citas</p>
                            </div>

                            {/* Animated particles */}
                            <div className="absolute top-12 left-12 h-2 w-2 animate-pulse rounded-full bg-blue-400"></div>
                            <div className="absolute top-24 right-16 h-1 w-1 animate-pulse rounded-full bg-purple-400 delay-300"></div>
                            <div className="absolute right-12 bottom-20 h-1.5 w-1.5 animate-pulse rounded-full bg-green-400 delay-700"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
