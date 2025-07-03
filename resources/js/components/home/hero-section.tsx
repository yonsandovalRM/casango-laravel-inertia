import { Button } from '@/components/ui/button';
import AnimatedBackground from './animated-background';

const HeroSection = () => {
    return (
        <section className="relative flex min-h-screen items-center px-6 pt-20 pb-24">
            <AnimatedBackground />
            <div className="relative z-10 mx-auto max-w-4xl text-center">
                <h1 className="mb-8 font-outfit text-5xl leading-tight font-bold text-foreground md:text-7xl">
                    Gestión de citas
                    <br />
                    <span className="text-blue-600 dark:text-blue-500">sin complicaciones</span>
                </h1>
                <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-muted-foreground dark:text-gray-300">
                    La plataforma más simple para profesionales que buscan optimizar su tiempo y brindar la mejor experiencia a sus clientes.
                </p>
                <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                        size="lg"
                        className="bg-blue-600 px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105 hover:bg-blue-700"
                    >
                        Comenzar gratis
                    </Button>
                    <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105">
                        Ver demo
                    </Button>
                </div>

                <div className="mx-auto max-w-4xl">
                    <div className="rounded-2xl bg-accent p-2 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                        <div className="flex h-96 w-full items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600">
                                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-foreground">Dashboard de MiCita</h3>
                                <p className="text-muted-foreground">Interfaz intuitiva para gestionar todas tus citas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
