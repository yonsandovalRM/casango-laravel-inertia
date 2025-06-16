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
