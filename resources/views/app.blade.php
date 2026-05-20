<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'NeonSign AU') }}</title>

        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="/cns_assets/favicon/favicon.ico">
        <link rel="icon" type="image/svg+xml" href="/cns_assets/favicon/favicon.svg">
        <link rel="icon" type="image/png" sizes="96x96" href="/cns_assets/favicon/favicon-96x96.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/cns_assets/favicon/apple-touch-icon.png">
        <link rel="manifest" href="/cns_assets/favicon/site.webmanifest">

        <!-- SEO: Indexing & robots -->
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">

        <!-- SEO: Geo targeting Australia -->
        <meta name="geo.region" content="AU">
        <meta name="geo.placename" content="Australia">
        <meta name="language" content="en-AU">

        <!-- SEO: Theme & branding -->
        <meta name="theme-color" content="#FF00CC">
        <meta name="msapplication-TileColor" content="#07071a">

        <!-- SEO: Open Graph defaults (overridden per-page) -->
        <meta property="og:site_name" content="Custom Neon Signs Australia">
        <meta property="og:locale" content="en_AU">
        <meta property="og:type" content="website">

        <!-- SEO: Twitter Card defaults (overridden per-page) -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@customneonsignsau">

        <!-- Neon Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Lobster&family=Oswald:wght@400;700&family=Dancing+Script:wght@700&family=Bebas+Neue&family=Rajdhani:wght@600&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead

        <style>
            #app { opacity: 0; }
            #neon-loader {
                position: fixed; inset: 0; z-index: 9999;
                background: #07071a;
                display: flex; flex-direction: column;
                align-items: center; justify-content: center; gap: 24px;
                transition: opacity 0.45s ease;
            }
            #neon-loader img { height: 56px; width: auto; filter: drop-shadow(0 0 14px rgba(255,0,204,0.7)); animation: loader-pulse 1.6s ease-in-out infinite; }
            #neon-loader .loader-ring {
                width: 52px; height: 52px;
                border-radius: 50%;
                border: 2px solid transparent;
                border-top-color: #FF00CC;
                border-right-color: #00FFFF;
                animation: loader-spin 0.9s linear infinite;
                box-shadow: 0 0 16px rgba(255,0,204,0.35);
            }
            @keyframes loader-pulse { 0%,100% { opacity:0.7; transform:scale(0.97); } 50% { opacity:1; transform:scale(1.04); } }
            @keyframes loader-spin  { to { transform: rotate(360deg); } }
        </style>
    </head>
    <body class="font-sans antialiased" style="background:#07071a; margin:0;">
        <div id="neon-loader">
            <img src="/CNS aus.png" alt="Loading..." />
            <div class="loader-ring"></div>
        </div>
        @inertia
    </body>
</html>

