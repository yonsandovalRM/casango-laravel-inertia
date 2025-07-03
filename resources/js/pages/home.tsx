import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Check, Mail, Phone } from 'lucide-react';

import { AnimatedFeaturesAccordion } from '@/components/home/animated-features-accordion';
import { FAQSection } from '@/components/home/faq-section';
import HeroSection from '@/components/home/hero-section';
import { useAppearance } from '@/hooks/use-appearance';
import { Head } from '@inertiajs/react';

export default function Home() {
    const { appearance } = useAppearance();
    return (
        <div className="min-h-screen bg-background">
            <Head title="Gestión de citas" />
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                            <Calendar className="h-5 w-5 text-foreground" />
                        </div>
                        <span className="font-outfit text-2xl font-semibold text-foreground">MiCita</span>
                    </div>
                    <nav className="hidden items-center space-x-8 font-outfit md:flex">
                        <a href="#features" className="font-medium text-muted-foreground hover:text-foreground">
                            Características
                        </a>
                        <a href="#pricing" className="font-medium text-muted-foreground hover:text-foreground">
                            Precios
                        </a>
                    </nav>
                </div>
            </header>

            <HeroSection />

            {/* Features Section - New Animated Accordion */}
            <AnimatedFeaturesAccordion />

            {/* Social Proof */}
            <section className="bg-card/50 px-6 py-20">
                <div className="mx-auto max-w-4xl text-center">
                    <p className="mb-8 text-muted-foreground">Más de 1,000 profesionales confían en MiCita</p>
                    <div className="grid grid-cols-2 items-center gap-8 opacity-60 md:grid-cols-4">
                        <div className="flex h-12 items-center justify-center rounded bg-gray-200 dark:bg-gray-700">Logo 1</div>
                        <div className="flex h-12 items-center justify-center rounded bg-gray-200 dark:bg-gray-700">Logo 2</div>
                        <div className="flex h-12 items-center justify-center rounded bg-gray-200 dark:bg-gray-700">Logo 3</div>
                        <div className="flex h-12 items-center justify-center rounded bg-gray-200 dark:bg-gray-700">Logo 4</div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="bg-background px-6 py-24">
                <div className="container mx-auto">
                    <div className="mb-16 text-center">
                        <h2 className="mb-6 font-outfit text-4xl font-bold text-foreground">Precios simples y transparentes</h2>
                        <p className="text-xl text-muted-foreground">Elige el plan que mejor se adapte a tu negocio</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <Card className="border-0 bg-accent shadow-lg">
                            <CardHeader className="pb-8 text-center">
                                <CardTitle className="font-outfit text-lg font-medium text-foreground">Básico</CardTitle>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold text-foreground">$29</span>
                                    <span className="text-muted-foreground">/mes</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-green-500" />
                                    <span className="text-muted-foreground">Hasta 500 citas/mes</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-green-500" />
                                    <span className="text-muted-foreground">1 profesional</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-green-500" />
                                    <span className="text-muted-foreground">Recordatorios email</span>
                                </div>
                                <Button className="mt-8 w-full" variant="outline">
                                    Comenzar prueba
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="scale-105 border-0 bg-primary text-foreground shadow-xl">
                            <CardHeader className="pb-8 text-center">
                                <Badge className="mx-auto mb-4 bg-white text-blue-600">Más popular</Badge>
                                <CardTitle className="font-outfit text-lg font-medium">Profesional</CardTitle>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold">$79</span>
                                    <span className="text-blue-200">/mes</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-white" />
                                    <span>Citas ilimitadas</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-white" />
                                    <span>Hasta 5 profesionales</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-white" />
                                    <span>WhatsApp + Email</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-white" />
                                    <span>Videollamadas</span>
                                </div>
                                <Button className="mt-8 w-full bg-white text-blue-600 hover:bg-gray-100">Comenzar prueba</Button>
                            </CardContent>
                        </Card>

                        <Card className="border-0 bg-accent shadow-lg">
                            <CardHeader className="pb-8 text-center">
                                <CardTitle className="font-outfit text-lg font-medium text-foreground">Enterprise</CardTitle>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold text-foreground">$199</span>
                                    <span className="text-muted-foreground">/mes</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-green-500" />
                                    <span className="text-muted-foreground dark:text-gray-300">Todo ilimitado</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-green-500" />
                                    <span className="text-muted-foreground dark:text-gray-300">Soporte prioritario</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-green-500" />
                                    <span className="text-muted-foreground dark:text-gray-300">Personalización completa</span>
                                </div>
                                <Button variant="outline" className="mt-8 w-full">
                                    Contactar ventas
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <FAQSection />

            {/* CTA Section */}
            <section className="bg-background px-6 py-24">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="mb-6 font-outfit text-4xl font-bold text-foreground">¿Listo para simplificar tu agenda?</h2>
                    <p className="mb-12 text-xl text-muted-foreground">Únete a miles de profesionales que ya optimizaron su gestión de citas</p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Button size="lg" className="bg-blue-600 px-8 py-4 text-lg font-medium hover:bg-blue-700">
                            Comenzar gratis
                        </Button>
                        <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-medium">
                            Solicitar demo
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-card px-6 py-16">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-12 grid gap-8 md:grid-cols-4">
                        <div>
                            <div className="mb-6 flex items-center space-x-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                                    <Calendar className="h-5 w-5 text-foreground" />
                                </div>
                                <span className="text-xl font-semibold text-foreground">MiCita</span>
                            </div>
                            <p className="text-muted-foreground">La plataforma más simple para gestión de citas profesionales</p>
                        </div>
                        <div>
                            <h4 className="mb-4 font-semibold text-foreground">Producto</h4>
                            <ul className="space-y-3 text-muted-foreground">
                                <li>
                                    <a href="#" className="hover:text-foreground">
                                        Características
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-foreground">
                                        Integraciones
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-foreground">
                                        Precios
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-foreground">
                                        API
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 font-semibold text-foreground">Soporte</h4>
                            <ul className="space-y-3 text-muted-foreground">
                                <li>
                                    <a href="#" className="hover:text-foreground">
                                        Centro de Ayuda
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-foreground">
                                        Documentación
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-foreground">
                                        Contacto
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 font-semibold text-foreground">Contacto</h4>
                            <div className="space-y-3 text-muted-foreground">
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-4 w-4" />
                                    <span>hola@micita.com</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Phone className="h-4 w-4" />
                                    <span>+1 (555) 123-4567</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-border pt-8 text-center">
                        <p className="text-muted-foreground">&copy; 2024 MiCita. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
