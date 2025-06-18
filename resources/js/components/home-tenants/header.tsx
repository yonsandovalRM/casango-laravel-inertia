import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

// Esta data vendría de tu API/base de datos según el subdominio
const companyData = {
    name: 'Clínica Dental Sonrisas',
    logo: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=50&h=50&fit=crop&crop=center',
};

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 z-50 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-lg">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <div className="flex items-center">
                            <img src={companyData.logo} alt={`${companyData.name} Logo`} className="h-10 w-10 rounded-lg" />
                            <span className="ml-3 text-xl font-bold text-white">{companyData.name}</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden space-x-8 md:flex">
                        <a href="#inicio" className="text-gray-300 transition-colors hover:text-white">
                            Inicio
                        </a>
                        <a href="#servicios" className="text-gray-300 transition-colors hover:text-white">
                            Servicios
                        </a>
                        <a href="#profesionales" className="text-gray-300 transition-colors hover:text-white">
                            Profesionales
                        </a>
                        <a href="#contacto" className="text-gray-300 transition-colors hover:text-white">
                            Contacto
                        </a>
                    </nav>

                    {/* CTA Buttons */}
                    <div className="hidden items-center space-x-4 md:flex">
                        <Button variant="ghost" className="text-gray-300 hover:text-white" onClick={() => router.visit(route('login'))}>
                            Iniciar Sesión
                        </Button>
                        <Button className="bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700">
                            Reservar Cita
                        </Button>
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
                                <Button variant="ghost" className="w-full text-gray-300">
                                    Iniciar Sesión
                                </Button>
                                <Button className="w-full bg-gradient-to-r from-violet-600 to-blue-600">Reservar Cita</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
