import { Button } from '@/components/ui/button';
import { Calendar, MoonIcon, SunIcon } from 'lucide-react';

import { AnimatedFeaturesAccordion } from '@/components/home/animated-features-accordion';
import { CTASection } from '@/components/home/cta-section';
import { FAQSection } from '@/components/home/faq-section';
import { FooterSection } from '@/components/home/footer-section';
import HeroSection from '@/components/home/hero-section';
import { PricingSection } from '@/components/home/pricing-section';
import { useAppearance } from '@/hooks/use-appearance';
import { useAuth } from '@/hooks/use-auth';
import { Head, router } from '@inertiajs/react';

export default function Home() {
    const { appearance, updateAppearance } = useAppearance();
    const { auth } = useAuth();
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
                        <a href="#faq" className="font-medium text-muted-foreground hover:text-foreground">
                            FAQ's
                        </a>
                        <Button variant="outline" onClick={() => updateAppearance(appearance === 'light' ? 'dark' : 'light')}>
                            {appearance === 'light' ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
                        </Button>
                        {auth.user ? (
                            <Button variant="outline" onClick={() => router.visit(route('logout'), { method: 'post' })}>
                                Cerrar sesión
                            </Button>
                        ) : (
                            <Button variant="outline" onClick={() => router.visit(route('login'))}>
                                Iniciar sesión
                            </Button>
                        )}
                    </nav>
                </div>
            </header>

            <HeroSection />

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

            <PricingSection />

            <FAQSection />

            <CTASection />

            <FooterSection />
        </div>
    );
}
