import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { useCompany } from '@/hooks/use-company';
import { router } from '@inertiajs/react';
import { Menu, MoonIcon, SunIcon, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Esta data vendría de tu API/base de datos según el subdominio
const companyData = {
    name: 'Clínica Dental Sonrisas',
    logo: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=50&h=50&fit=crop&crop=center',
};

const Header = () => {
    const company = useCompany();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { appearance, updateAppearance } = useAppearance();
    const { t } = useTranslation();

    return (
        <header className="fixed top-0 z-50 w-full bg-background shadow-lg">
            <div className="container mx-auto">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-foreground">{company.name}</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden space-x-8 md:flex">
                        <a href="#inicio" className="text-foreground transition-colors">
                            Inicio
                        </a>
                        <a href="#servicios" className="text-foreground transition-colors">
                            Servicios
                        </a>
                        <a href="#profesionales" className="text-foreground transition-colors">
                            Profesionales
                        </a>
                        <a href="#contacto" className="text-foreground transition-colors">
                            Contacto
                        </a>
                    </nav>

                    {/* CTA Buttons */}
                    <div className="hidden items-center space-x-4 md:flex">
                        <Button variant="ghost" onClick={() => updateAppearance(appearance === 'light' ? 'dark' : 'light')}>
                            {appearance === 'light' ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
                        </Button>
                        <Button variant="ghost" className="text-foreground" onClick={() => router.visit(route('login'))}>
                            Iniciar Sesión
                        </Button>
                        <Button>Reservar Cita</Button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="mt-2 space-y-1 rounded-lg bg-gray-900 px-2 pt-2 pb-3 sm:px-3">
                            <a href="#inicio" className="block px-3 py-2 text-gray-300 hover:text-white">
                                Inicio
                            </a>
                            <a href="#servicios" className="block px-3 py-2 text-gray-300 hover:text-white">
                                Servicios
                            </a>
                            <a href="#profesionales" className="block px-3 py-2 text-gray-300 hover:text-white">
                                Profesionales
                            </a>
                            <a href="#contacto" className="block px-3 py-2 text-gray-300 hover:text-white">
                                Contacto
                            </a>
                            <div className="space-y-2 pt-2">
                                <Button variant="ghost" className="w-full text-foreground">
                                    Iniciar Sesión
                                </Button>
                                <Button className="w-full">Reservar Cita</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
