import Footer from '@/components/home-tenants/footer';
import Header from '@/components/home-tenants/header';
import Hero from '@/components/home-tenants/hero';
import ProfessionalsGrid from '@/components/home-tenants/professionals-grid';
import { Head } from '@inertiajs/react';

export default function HomeTenants() {
    return (
        <div>
            <Head title="Home Tenants" />
            <Header />
            <Hero />
            <ProfessionalsGrid />
            <Footer />
        </div>
    );
}
