import { FAQSection } from '@/components/home-tenants/faq-section';
import Footer from '@/components/home-tenants/footer';
import Header from '@/components/home-tenants/header';
import Hero from '@/components/home-tenants/hero';
import PopularServices from '@/components/home-tenants/popular-services';
import ProfessionalsGrid from '@/components/home-tenants/professionals-grid';
import { Head } from '@inertiajs/react';

export default function HomeTenants() {
    return (
        <div>
            <Head title="Home Tenants" />
            <Header />
            <Hero />
            <PopularServices />
            <ProfessionalsGrid />
            <FAQSection />
            <Footer />
        </div>
    );
}
