import { useEffect } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Appearance = 'light' | 'dark' | 'system';

const prefersDark = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') return;
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const applyTheme = (appearance: Appearance) => {
    const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark());
    document.documentElement.classList.toggle('dark', isDark);
};

const mediaQuery = () => {
    if (typeof window === 'undefined') return null;
    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = () => {
    const currentAppearance = localStorage.getItem('appearance') as Appearance;
    applyTheme(currentAppearance || 'system');
};

export const initializeTheme = () => {
    const savedAppearance = (localStorage.getItem('appearance') as Appearance) || 'system';
    applyTheme(savedAppearance);
    mediaQuery()?.addEventListener('change', handleSystemThemeChange);
};

interface ThemeState {
    appearance: Appearance;
    updateAppearance: (mode: Appearance) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            appearance: 'system',
            updateAppearance: (mode: Appearance) => {
                set({ appearance: mode });
                localStorage.setItem('appearance', mode);
                setCookie('appearance', mode);
                applyTheme(mode);
            },
        }),
        {
            name: 'theme-storage', // nombre para el localStorage
            storage: createJSONStorage(() => localStorage), // opcional, pero recomendado
            onRehydrateStorage: () => (state) => {
                if (state) {
                    applyTheme(state.appearance);
                    mediaQuery()?.addEventListener('change', handleSystemThemeChange);
                }
            },
        },
    ),
);

// Hook personalizado para usar el tema
export const useAppearance = () => {
    const { appearance, updateAppearance } = useThemeStore();

    useEffect(() => {
        initializeTheme();
        return () => mediaQuery()?.removeEventListener('change', handleSystemThemeChange);
    }, []);

    return { appearance, updateAppearance };
};
