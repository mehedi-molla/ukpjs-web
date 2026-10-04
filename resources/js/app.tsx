import './index.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from './context/LanguageContext';

const appName = import.meta.env.VITE_APP_NAME || 'Umarkhali Kistupur Probashi Jubo Songho';
const pages = import.meta.glob('./pages/**/*.tsx');

createInertiaApp({
    title: (title) => `${title} — ${appName}`,
    resolve: async (name) => {
        const page = pages[`./pages/${name}.tsx`] || pages[`./pages/${name.replace(/^([^/]+)/, (segment) => segment.toLowerCase())}.tsx`];

        if (!page) {
            throw new Error(`Inertia page not found: ${name}`);
        }

        return (await page()) as any;
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <LanguageProvider>
                <App {...props} />
            </LanguageProvider>,
        );
    },
});
