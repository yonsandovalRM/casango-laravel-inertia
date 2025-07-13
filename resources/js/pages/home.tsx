import { AnimatedFeaturesAccordion } from '@/components/home/animated-features-accordion';
import { CTASection } from '@/components/home/cta-section';
import { FAQSection } from '@/components/home/faq-section';
import { FooterSection } from '@/components/home/footer-section';
import HeroSection from '@/components/home/hero-section';
import { Navbar } from '@/components/home/navbar';
import { PricingSection } from '@/components/home/pricing-section';
import { PlanResource } from '@/interfaces/plan';
import { Head } from '@inertiajs/react';

export default function Home({ plans }: { plans: PlanResource[] }) {
    return (
        <div className="min-h-screen bg-background">
            <Head title="Gestión de citas" />
            <Navbar />
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

            <PricingSection plans={plans} />

            <FAQSection />

            <CTASection />

            <FooterSection />
        </div>
    );
}
