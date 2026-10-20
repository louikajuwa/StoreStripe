import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import NotificationProvider from '@/Components/Notifications/NotificationProvider';

createInertiaApp({
    title: (title) => title ? `${title} - Store` : 'Store',
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(
            <NotificationProvider>
                <App {...props} />
            </NotificationProvider>
        );
    },
});
