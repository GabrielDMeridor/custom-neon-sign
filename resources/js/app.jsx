import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ConfigProvider, theme } from 'antd';
import { CartProvider } from './Contexts/CartContext';

const appName = import.meta.env.VITE_APP_NAME || 'NeonSign AU';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ConfigProvider
                theme={{
                    algorithm: theme.darkAlgorithm,
                    token: {
                        colorPrimary: '#FF00CC',
                        colorBgBase: '#080810',
                        colorTextBase: '#e0e0e0',
                        borderRadius: 8,
                        fontFamily: "'Inter', sans-serif",
                    },
                }}
            >
                <CartProvider>
                    <App {...props} />
                </CartProvider>
            </ConfigProvider>
        );

        // Reveal page after first paint — eliminates flash of unstyled content
        requestAnimationFrame(() => requestAnimationFrame(() => {
            el.style.transition = 'opacity 0.4s ease';
            el.style.opacity = '1';
            const loader = document.getElementById('neon-loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 460);
            }
        }));
    },
    progress: {
        color: '#FF00CC',
    },
});

