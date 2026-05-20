import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

/* ─── Theme Definitions ───────────────────────────────────── */
const DARK = {
    bg:              '#07071a',
    sidebar:         '#0a0a1e',
    sidebarBorder:   'rgba(255,0,204,0.15)',
    topbar:          '#09091f',
    topbarBorder:    'rgba(255,255,255,0.05)',
    card:            '#0c0c22',
    cardBorder:      'rgba(255,255,255,0.06)',
    text:            '#e0e0e0',
    textMuted:       '#888',
    navText:         '#566',
    navActive:       'rgba(255,0,204,0.12)',
    navActiveBorder: 'rgba(255,0,204,0.35)',
    navActiveText:   '#FF00CC',
    navHover:        'rgba(255,255,255,0.04)',
    accent:          '#FF00CC',
};
const LIGHT = {
    bg:              '#f0f2f8',
    sidebar:         '#ffffff',
    sidebarBorder:   'rgba(0,0,0,0.07)',
    topbar:          '#ffffff',
    topbarBorder:    'rgba(0,0,0,0.07)',
    card:            '#ffffff',
    cardBorder:      'rgba(0,0,0,0.07)',
    text:            '#1a1a2e',
    textMuted:       '#666',
    navText:         '#8899aa',
    navActive:       'rgba(200,0,160,0.07)',
    navActiveBorder: 'rgba(200,0,160,0.38)',
    navActiveText:   '#c000a0',
    navHover:        'rgba(0,0,0,0.04)',
    accent:          '#c000a0',
};

/* ─── Theme Context ─────────────────────────────────────────── */
export const AdminThemeCtx = createContext({ dark: true, t: DARK, toggle: () => {} });
export const useAdminTheme = () => useContext(AdminThemeCtx);

/* ─── Nav Config ────────────────────────────────────────────── */
const NAV = [
    { href: '/admin',           label: 'Dashboard', exact: true, icon: IconDashboard },
    { href: '/admin/products',  label: 'Products',               icon: IconProducts  },
    { href: '/admin/orders',    label: 'Orders',                  icon: IconOrders    },
    { href: '/admin/gallery',   label: 'Gallery',                 icon: IconGallery   },
    { href: '/admin/content',   label: 'Content',                 icon: IconContent   },
];

function isNavActive(url, item) {
    if (item.exact) return url === item.href;
    return url === item.href || url.startsWith(item.href + '/');
}

export default function AdminLayout({ children, title = 'Admin' }) {
    const { url, props } = usePage();
    const auth = props.auth;

    const [dark, setDark] = useState(() => {
        try { return localStorage.getItem('adminTheme') !== 'light'; } catch { return true; }
    });

    const toggle = useCallback(() => {
        setDark(d => {
            const next = !d;
            try { localStorage.setItem('adminTheme', next ? 'dark' : 'light'); } catch {}
            return next;
        });
    }, []);

    const t = dark ? DARK : LIGHT;

    return (
        <AdminThemeCtx.Provider value={{ dark, t, toggle }}>
            <div
                data-admin-theme={dark ? 'dark' : 'light'}
                style={{
                    display: 'flex', minHeight: '100vh',
                    background: t.bg, color: t.text,
                    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
                    transition: 'background 0.25s, color 0.25s',
                }}
            >
                {/* ── Sidebar ── */}
                <aside style={{
                    width: 240, minWidth: 240,
                    background: t.sidebar,
                    borderRight: `1px solid ${t.sidebarBorder}`,
                    display: 'flex', flexDirection: 'column',
                    position: 'sticky', top: 0, height: '100vh',
                    overflowY: 'auto',
                    transition: 'background 0.25s, border-color 0.25s',
                    boxShadow: dark ? '2px 0 20px rgba(0,0,0,0.4)' : '2px 0 8px rgba(0,0,0,0.06)',
                }}>
                    {/* Logo */}
                    <div style={{
                        padding: '18px 20px 14px',
                        borderBottom: `1px solid ${t.topbarBorder}`,
                        flexShrink: 0,
                    }}>
                        <Link href="/" style={{ display: 'block', textDecoration: 'none' }}>
                            <img
                                src="/CNS aus.png"
                                alt="Custom Neon Signs Australia"
                                style={{
                                    width: '100%', maxWidth: 178, height: 'auto',
                                    objectFit: 'contain',
                                    filter: dark
                                        ? 'brightness(1.1) saturate(1.2) drop-shadow(0 0 8px rgba(255,0,204,0.35))'
                                        : 'saturate(0.9) brightness(0.92)',
                                    transition: 'filter 0.25s',
                                }}
                            />
                        </Link>
                        <div style={{
                            marginTop: 4, fontSize: 9.5, letterSpacing: '0.22em',
                            textTransform: 'uppercase', color: t.navText,
                            fontWeight: 600, paddingLeft: 2,
                        }}>
                            Admin Panel
                        </div>
                    </div>

                    {/* Nav */}
                    <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
                        {NAV.map(item => {
                            const active = isNavActive(url, item);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '9px 13px',
                                        borderRadius: 8, marginBottom: 2,
                                        textDecoration: 'none',
                                        fontSize: 13.5,
                                        fontWeight: active ? 600 : 400,
                                        color: active ? t.navActiveText : t.navText,
                                        background: active ? t.navActive : 'transparent',
                                        borderLeft: `3px solid ${active ? t.accent : 'transparent'}`,
                                        transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = t.navHover; e.currentTarget.style.color = t.text; } }}
                                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.navText; } }}
                                >
                                    <span style={{ flexShrink: 0, display: 'flex' }}>
                                        <Icon size={16} color={active ? t.accent : t.navText} />
                                    </span>
                                    <span>{item.label}</span>
                                    {active && (
                                        <span style={{
                                            marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%',
                                            background: t.accent,
                                            boxShadow: dark ? `0 0 6px ${t.accent}` : 'none',
                                            flexShrink: 0,
                                        }} />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom: View Site + Logout */}
                    <div style={{
                        padding: '10px 8px',
                        borderTop: `1px solid ${t.topbarBorder}`,
                        flexShrink: 0,
                        display: 'flex', flexDirection: 'column', gap: 2,
                    }}>
                        <Link
                            href="/"
                            style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '9px 13px', borderRadius: 8,
                                textDecoration: 'none', fontSize: 13,
                                color: t.navText, transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = t.navHover; e.currentTarget.style.color = t.text; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.navText; }}
                        >
                            <IconViewSite size={15} color={t.navText} />
                            <span>View Site</span>
                        </Link>
                        <button
                            onClick={() => router.post('/logout')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '9px 13px', borderRadius: 8,
                                border: 'none', background: 'transparent',
                                fontSize: 13, color: t.navText,
                                cursor: 'pointer', width: '100%', textAlign: 'left',
                                transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,80,80,0.08)'; e.currentTarget.style.color = '#ff6b6b'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.navText; }}
                        >
                            <IconLogout size={15} color={t.navText} />
                            <span>Log Out</span>
                        </button>
                    </div>
                </aside>

                {/* ── Main Area ── */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    {/* Topbar */}
                    <header style={{
                        height: 58,
                        background: t.topbar,
                        borderBottom: `1px solid ${t.topbarBorder}`,
                        display: 'flex', alignItems: 'center', padding: '0 28px', gap: 14,
                        position: 'sticky', top: 0, zIndex: 100,
                        flexShrink: 0,
                        transition: 'background 0.25s, border-color 0.25s',
                        boxShadow: dark ? '0 1px 16px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.05)',
                    }}>
                        <div style={{ flex: 1 }}>
                            <span style={{ fontSize: 15.5, fontWeight: 600, color: t.text, letterSpacing: '-0.01em' }}>
                                {title}
                            </span>
                        </div>

                        {/* Theme toggle */}
                        <button
                            onClick={toggle}
                            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                            style={{
                                width: 34, height: 34, borderRadius: 8,
                                border: `1px solid ${t.cardBorder}`,
                                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                                cursor: 'pointer', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                fontSize: 15, transition: 'all 0.15s', flexShrink: 0,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = t.navHover; e.currentTarget.style.borderColor = t.navActiveBorder; }}
                            onMouseLeave={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = t.cardBorder; }}
                        >
                            {dark ? '☀️' : '🌙'}
                        </button>

                        {/* User badge */}
                        {auth?.user && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '5px 12px', borderRadius: 8,
                                background: t.navActive,
                                border: `1px solid ${t.cardBorder}`,
                            }}>
                                <div style={{
                                    width: 26, height: 26, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #FF00CC, #BF5FFF)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
                                }}>
                                    {(auth.user.name || auth.user.email || 'A')[0].toUpperCase()}
                                </div>
                                <span style={{ fontSize: 13, color: t.text, maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {auth.user.name || auth.user.email}
                                </span>
                            </div>
                        )}
                    </header>

                    {/* Flash messages */}
                    <FlashMessages t={t} />

                    {/* Page content */}
                    <main style={{ flex: 1, padding: '28px', overflow: 'auto' }}>
                        {children}
                    </main>
                </div>
            </div>
        </AdminThemeCtx.Provider>
    );
}

/* ─── Flash Messages ─────────────────────────────────────── */
function FlashMessages({ t }) {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(true);
    useEffect(() => { setVisible(true); }, [flash]);

    if (!flash?.success && !flash?.error) return null;
    if (!visible) return null;

    const isError = !!flash.error;
    return (
        <div style={{
            margin: '12px 28px 0',
            padding: '10px 16px', borderRadius: 8,
            background: isError ? 'rgba(255,60,60,0.08)' : 'rgba(57,255,20,0.07)',
            border: isError ? '1px solid rgba(255,60,60,0.25)' : '1px solid rgba(57,255,20,0.2)',
            color: isError ? '#ff6666' : '#39FF14',
            fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
            <span>{flash.success || flash.error}</span>
            <button
                onClick={() => setVisible(false)}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 0 0 12px' }}
            >×</button>
        </div>
    );
}

/* ─── SVG Icons ──────────────────────────────────────────── */
function IconDashboard({ size = 16, color = 'currentColor' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    );
}
function IconProducts({ size = 16, color = 'currentColor' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
        </svg>
    );
}
function IconOrders({ size = 16, color = 'currentColor' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
        </svg>
    );
}
function IconGallery({ size = 16, color = 'currentColor' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
        </svg>
    );
}
function IconContent({ size = 16, color = 'currentColor' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}
function IconViewSite({ size = 16, color = 'currentColor' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
        </svg>
    );
}
function IconLogout({ size = 16, color = 'currentColor' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    );
}

