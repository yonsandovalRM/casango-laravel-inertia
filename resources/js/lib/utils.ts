import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'CLP', locale = 'es-CL') {
    return new Intl.NumberFormat(locale, {
        currency: currency,
    }).format(amount);
}

export const isRouteActive = (currentUrl: string, targetPath: string): boolean => {
    // Extraer solo el path de la URL (ignorar protocolo, dominio, etc.)
    const normalizePath = (url: string) => {
        try {
            // Si es una URL completa, extraemos el pathname
            if (url.startsWith('http')) {
                const parsed = new URL(url);
                return parsed.pathname;
            }
            // Si es una URL relativa, devolvemos tal cual
            return url.split('?')[0];
        } catch {
            return url.split('?')[0];
        }
    };

    const currentPath = normalizePath(currentUrl);
    const target = normalizePath(targetPath);

    if (target === '/') return currentPath === target;

    return currentPath === target;
};

export const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
};
