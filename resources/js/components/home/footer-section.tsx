import { useAppearance } from '@/store/theme-store';
import { Mail, Phone } from 'lucide-react';

export function FooterSection() {
    const { appearance } = useAppearance();
    return (
        <footer className="bg-card px-6 py-16">
            <div className="mx-auto max-w-6xl">
                <div className="mb-12 grid gap-8 md:grid-cols-4">
                    <div>
                        <div className="mb-6 flex items-center space-x-3">
                            {appearance === 'dark' ? (
                                <img src="/logo/micita-12.svg" alt="Logo" className="h-8 w-auto" />
                            ) : (
                                <img src="/logo/micita-11.svg" alt="Logo" className="h-8 w-auto text-foreground" />
                            )}
                        </div>
                        <p className="text-muted-foreground">La plataforma más simple para gestión de citas profesionales</p>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold text-foreground">Producto</h4>
                        <ul className="space-y-3 text-muted-foreground">
                            <li>
                                <a href="#" className="hover:text-foreground">
                                    Características
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-foreground">
                                    Integraciones
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-foreground">
                                    Precios
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-foreground">
                                    API
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold text-foreground">Soporte</h4>
                        <ul className="space-y-3 text-muted-foreground">
                            <li>
                                <a href="#" className="hover:text-foreground">
                                    Centro de Ayuda
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-foreground">
                                    Documentación
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-foreground">
                                    Contacto
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold text-foreground">Contacto</h4>
                        <div className="space-y-3 text-muted-foreground">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-4 w-4" />
                                <span>hola@micita.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-4 w-4" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-border pt-8 text-center">
                    <p className="text-muted-foreground">&copy; 2024 MiCita. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
