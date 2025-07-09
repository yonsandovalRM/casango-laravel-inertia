import { useAppearance } from '@/hooks/use-appearance';
import { useAuth } from '@/hooks/use-auth';
import { useCompany } from '@/hooks/use-company';
import { router } from '@inertiajs/react';
import { MoonIcon, SunIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';

const Navbar = () => {
    const company = useCompany();
    const { auth } = useAuth();
    const { appearance, updateAppearance } = useAppearance();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, width: 0 });
    const navRef = useRef<HTMLDivElement>(null);

    const navItems = [
        { id: 'home', label: 'Inicio', href: route('home') },
        { id: 'services', label: 'Servicios', href: '#services' },
        { id: 'faq', label: 'FAQ', href: '#faq' },
        { id: 'contact', label: 'Contacto', href: '#contact' },
    ];

    const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement>, itemId: string) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const navRect = navRef.current?.getBoundingClientRect();

        if (navRect) {
            setHoverPosition({
                x: rect.left - navRect.left,
                width: rect.width,
            });
        }
        setHoveredItem(itemId);
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    return (
        <div className="w-full border-b border-border bg-navbar-bg">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="rounded-lg bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">{company.name}</div>
                    </div>

                    {/* Navigation */}
                    <div ref={navRef} className="relative flex items-center space-x-1" onMouseLeave={handleMouseLeave}>
                        {/* Hover indicator */}
                        {hoveredItem && (
                            <div
                                className="absolute top-1/2 h-10 -translate-y-1/2 rounded-full bg-navbar-hover transition-all duration-200 ease-out"
                                style={{
                                    left: hoverPosition.x,
                                    width: hoverPosition.width,
                                }}
                            />
                        )}

                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => router.visit(item.href)}
                                className="relative z-10 rounded-full px-4 py-2 text-sm font-medium text-navbar-text transition-colors duration-200 hover:text-navbar-text-hover"
                                onMouseEnter={(e) => handleMouseEnter(e, item.id)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="hidden items-center space-x-4 md:flex">
                        <Button variant="ghost" onClick={() => updateAppearance(appearance === 'light' ? 'dark' : 'light')}>
                            {appearance === 'light' ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
                        </Button>

                        {auth.user ? (
                            <>
                                <Button variant="ghost" className="text-foreground" onClick={() => router.visit(route('bookings.client'))}>
                                    Dashboard
                                </Button>
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
                </div>
            </div>
        </div>
    );
};

export default Navbar;
