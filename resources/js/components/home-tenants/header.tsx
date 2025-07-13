import { useAuth } from '@/hooks/use-auth';
import { useCompany } from '@/hooks/use-company';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { useAppearance } from '@/store/theme-store';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './navbar';

// Esta data vendría de tu API/base de datos según el subdominio
const companyData = {
    name: 'Clínica Dental Sonrisas',
    logo: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=50&h=50&fit=crop&crop=center',
};

const Header = () => {
    const company = useCompany();
    const { auth } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { appearance, updateAppearance } = useAppearance();
    const { t } = useTranslation();

    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };
    return (
        <header className="fixed top-0 z-50 w-full shadow-lg">
            <Navbar />
        </header>
    );
};

export default Header;
