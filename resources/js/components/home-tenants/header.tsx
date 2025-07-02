import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { useAuth } from '@/hooks/use-auth';
import { useCompany } from '@/hooks/use-company';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { Link, router } from '@inertiajs/react';
import { LogOut, Menu, MoonIcon, SunIcon, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
        <header className="fixed top-0 z-50 w-full bg-background shadow-lg">
            <div className="container mx-auto">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <div className="flex items-center">
                            <span className="font-outfit text-xl font-bold text-foreground">{company.name}</span>
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

                        {auth.user ? (
                            <>
                                <Button variant="ghost" className="text-foreground" onClick={() => router.visit(route('bookings.client'))}>
                                    Mis Reservas
                                </Button>
                                <Link
                                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none hover:bg-accent hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-3 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2" />
                                    Cerrar Sesión
                                </Link>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" className="text-foreground" onClick={() => router.visit(route('login'))}>
                                    Iniciar Sesión
                                </Button>
                                <Button>Reservar Cita</Button>
                            </>
                        )}
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
