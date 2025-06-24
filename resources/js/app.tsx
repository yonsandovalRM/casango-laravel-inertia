import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { initializeTheme } from './hooks/use-appearance';
import './translations/i18n';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
ModuleRegistry.registerModules([AllCommunityModule]);

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <Toaster richColors position="top-center" duration={3000} />
            </>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
