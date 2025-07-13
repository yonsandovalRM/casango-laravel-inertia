import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useScrollEffect } from '@/hooks/use-scroll-effects';
import { cn } from '@/lib/utils';
import { LogoWords } from '@/logos/logo-words';
import { useAppearance } from '@/store/theme-store';
import { router } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Características', href: '#caracteristicas' },
    { name: 'Precios', href: '#precios' },
    { name: 'Contacto', href: '#contacto' },
];

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { appearance } = useAppearance();
    const isScrolled = useScrollEffect(20);

    const { auth } = useAuth();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav
            className={cn(
                'fixed top-0 right-0 left-0 z-50 transition-all duration-500 ease-in-out',
                isScrolled ? 'border-b border-border/50 bg-background/80 shadow-lg backdrop-blur-md' : 'bg-transparent',
            )}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="flex items-center space-x-4">
                                <img src="/logo/micita.svg" alt="Logo" className="h-8 w-auto" />

                                <LogoWords className="hidden h-4 w-auto text-foreground md:block" />
                            </div>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-1">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="group relative px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground"
                                >
                                    <span className="relative z-10">{item.name}</span>
                                    <div className="absolute inset-0 rounded-lg bg-accent/50 opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Desktop CTA and Theme Toggle */}
                    <div className="hidden items-center space-x-4 md:flex">
                        <ThemeToggle />
                        <Button variant="ghost" className="text-sm font-medium" onClick={() => router.visit(route('login'))}>
                            Iniciar Sesión
                        </Button>
                        <Button className="bg-primary text-primary-foreground transition-all duration-300 hover:scale-105 hover:bg-primary/90">
                            Comenzar Gratis
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center space-x-2 md:hidden">
                        <ThemeToggle />
                        <Button variant="ghost" size="icon" onClick={toggleMenu} className="h-9 w-9">
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div
                className={cn(
                    'overflow-hidden transition-all duration-300 ease-in-out md:hidden',
                    isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
                )}
            >
                <div className="space-y-1 border-t border-border/50 bg-background/95 px-2 pt-2 pb-3 backdrop-blur-md">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground transition-all duration-200 hover:bg-accent/50 hover:text-foreground"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.name}
                        </a>
                    ))}
                    <div className="mt-4 border-t border-border/50 pt-4 pb-2">
                        <div className="space-y-2">
                            <Button variant="ghost" className="w-full justify-start text-sm font-medium" onClick={() => router.visit(route('login'))}>
                                Iniciar Sesión
                            </Button>
                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setIsMenuOpen(false)}>
                                Comenzar Gratis
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
