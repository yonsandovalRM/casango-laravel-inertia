import Footer from '@/components/home-tenants/footer';
import Header from '@/components/home-tenants/header';
import Hero from '@/components/home-tenants/hero';
import PopularServices from '@/components/home-tenants/popular-services';
import ProfessionalsGrid from '@/components/home-tenants/professionals-grid';
import { CompanyResource } from '@/interfaces/company';
import { Head } from '@inertiajs/react';

interface HomeTenantsProps {
    company: CompanyResource;
}
export default function HomeTenants({ company }: HomeTenantsProps) {
    return (
        <div>
            <Head title="Home Tenants" />
            <Header company={company} />
            <Hero company={company} />
            <PopularServices />
            <ProfessionalsGrid />
            <Footer />
        </div>
    );
}
