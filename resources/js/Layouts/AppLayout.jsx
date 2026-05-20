import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { Badge, Drawer, Button, InputNumber, Divider, Empty } from 'antd';
import useBreakpoint from '@/hooks/useBreakpoint';
import {
    ShoppingCartOutlined,
    MenuOutlined,
    CloseOutlined,
    DeleteOutlined,
    PhoneOutlined,
    MailOutlined,
} from '@ant-design/icons';
import { useCart } from '@/Contexts/CartContext';

const NAV_LINKS = [
    { href: '/',         label: 'Home' },
    { href: '/designer', label: '✦ Design Yours', highlight: true },
];

const SHOP_CATEGORIES = [
    {
        href: '/catalog?category=prebuilt',
        title: 'Pre-built Signs',
        desc: 'Best-selling designs ready to order.',
        previewText: 'OPEN',
        previewFont: "'Bebas Neue', cursive",
        previewSize: 32,
        color: '#FF00CC',
    },
    {
        href: '/catalog?category=custom',
        title: 'Custom Text',
        desc: 'Your words, your font, any colour.',
        previewText: 'Hello',
        previewFont: "'Pacifico', cursive",
        previewSize: 26,
        color: '#00FFFF',
    },
    {
        href: '/designer',
        title: 'Design Studio',
        desc: 'Build your sign in our live editor.',
        previewText: 'DESIGN',
        previewFont: "'Rajdhani', sans-serif",
        previewSize: 28,
        color: '#BF5FFF',
    },
    {
        href: '/logo-upload',
        title: 'Logo to Neon',
        desc: 'Upload your logo — we make it glow.',
        previewText: 'LOGO',
        previewFont: "'Oswald', sans-serif",
        previewSize: 28,
        color: '#FF8C00',
    },
];

function NeonSignPreview({ text, font, size, color }) {
    const glow = `0 0 6px ${color}, 0 0 14px ${color}cc, 0 0 28px ${color}66`;
    return (
        <div style={{
            background: 'radial-gradient(ellipse 85% 70% at 50% 60%, #0d0d26 0%, #050510 100%)',
            border: `1px solid ${color}30`,
            borderRadius: 8,
            height: 68,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            marginBottom: 10,
        }}>
            {/* ambient orb */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse 70% 60% at 50% 55%, ${color}14 0%, transparent 70%)`,
                pointerEvents: 'none',
            }} />
            {/* neon tube border glow */}
            <div style={{
                position: 'absolute', inset: 0,
                boxShadow: `inset 0 0 10px ${color}18`,
                borderRadius: 8, pointerEvents: 'none',
            }} />
            <span style={{
                fontFamily: font,
                fontSize: size,
                color: color,
                textShadow: glow,
                letterSpacing: '0.05em',
                zIndex: 1,
                userSelect: 'none',
            }}>{text}</span>
        </div>
    );
}

export default function AppLayout({ children }) {
    const { cartCount, cartItems, cartTotal, removeItem, updateQty, drawerOpen, setDrawerOpen } = useCart();
    const { isMd } = useBreakpoint();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [shopOpen, setShopOpen] = useState(false);
    const shopRef = useRef(null);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);

    useEffect(() => {
        if (!shopOpen) return;
        const handler = (e) => {
            if (shopRef.current && !shopRef.current.contains(e.target)) setShopOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [shopOpen]);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>

            {/* ── Top Bar ── */}
            <div style={{
                background: 'linear-gradient(90deg, rgba(255,0,204,0.18) 0%, #0a0818 30%, #0a0818 70%, rgba(0,255,255,0.12) 100%)',
                borderBottom: '1px solid rgba(255,0,204,0.25)',
                padding: '7px 24px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: 12,
            }}>
                <span style={{ color: '#FF6EC7', fontWeight: 600, letterSpacing: '0.05em', textShadow: '0 0 10px rgba(255,110,199,0.4)' }}>🚀 Free shipping on orders over $300 · Australia-wide delivery</span>
                <div className="topbar-contact" style={{ gap: 20, color: 'rgba(255,255,255,0.45)' }}>
                    <span><PhoneOutlined style={{ marginRight: 4, color: '#00FFFF' }} />1800 NEON AU</span>
                    <span><MailOutlined style={{ marginRight: 4, color: '#00FFFF' }} />hello@neonsignau.com.au</span>
                </div>
            </div>

            {/* ── Navbar ── */}
            <nav style={{
                position: 'sticky', top: 0, zIndex: 200,
                background: scrolled ? 'rgba(6,6,15,0.98)' : 'rgba(6,6,15,0.88)',
                backdropFilter: 'blur(20px)',
                borderBottom: scrolled ? '1px solid rgba(255,0,204,0.2)' : '1px solid rgba(0,255,255,0.08)',
                boxShadow: scrolled ? '0 4px 40px rgba(255,0,204,0.08)' : 'none',
                transition: 'all 0.3s ease',
            }}>
                <div style={{
                    maxWidth: 1280, margin: '0 auto',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    height: scrolled ? 56 : 68, padding: '0 24px',
                    transition: 'height 0.3s ease',
                }}>
                    {/* Logo */}
                    <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <img
                            src="/CNS aus.png"
                            alt="CNS Australia"
                            style={{
                                height: 48,
                                width: 'auto',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 0 8px rgba(255,0,204,0.5))',
                            }}
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="desktop-nav" style={{ gap: 4, alignItems: 'center' }}>
                        {/* Home link */}
                        <Link href="/" style={{ textDecoration: 'none' }}>
                            <div style={{ padding: '9px 16px', borderRadius: 8, fontWeight: 700, fontSize: 14, color: '#aaa', background: 'transparent', transition: 'all 0.2s', cursor: 'pointer' }}>Home</div>
                        </Link>

                        {/* SHOP dropdown */}
                        <div ref={shopRef} style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShopOpen(v => !v)}
                                style={{
                                    padding: '9px 16px', borderRadius: 8, fontWeight: 700, fontSize: 14,
                                    color: shopOpen ? '#FF6EC7' : '#aaa',
                                    background: shopOpen ? 'rgba(255,0,204,0.08)' : 'transparent',
                                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                                    transition: 'all 0.2s',
                                }}
                            >
                                Shop
                                <span style={{ fontSize: 10, transition: 'transform 0.2s', transform: shopOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>▼</span>
                            </button>

                            {/* Dropdown panel */}
                            {shopOpen && (
                                <div style={{
                                    position: 'absolute', top: 'calc(100% + 8px)', left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: '#0d0d20',
                                    border: '1px solid rgba(255,0,204,0.2)',
                                    borderRadius: 14, padding: 16,
                                    display: 'grid', gridTemplateColumns: 'repeat(4, 185px)', gap: 10,
                                    boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 40px rgba(255,0,204,0.08)',
                                    zIndex: 400,
                                    animation: 'fadeInDown 0.18s ease',
                                }}>
                                    {SHOP_CATEGORIES.map(cat => (
                                        <Link key={cat.href} href={cat.href} onClick={() => setShopOpen(false)} style={{ textDecoration: 'none' }}>
                                            <div style={{
                                                padding: '14px 16px', borderRadius: 10,
                                                border: `1px solid ${cat.color}25`,
                                                background: `${cat.color}08`,
                                                cursor: 'pointer', transition: 'all 0.18s',
                                            }}
                                                onMouseEnter={e => { e.currentTarget.style.background = `${cat.color}16`; e.currentTarget.style.borderColor = `${cat.color}50`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = `${cat.color}08`; e.currentTarget.style.borderColor = `${cat.color}25`; e.currentTarget.style.transform = 'translateY(0)'; }}
                                            >
                                                <NeonSignPreview text={cat.previewText} font={cat.previewFont} size={cat.previewSize} color={cat.color} />
                                                <div style={{ fontWeight: 700, fontSize: 13, color: cat.color, marginBottom: 4, textShadow: `0 0 8px ${cat.color}60` }}>{cat.title}</div>
                                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{cat.desc}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Extra pages */}
                        {[{ href: '/gallery', label: 'Gallery' }, { href: '/about', label: 'About' }, { href: '/faq', label: 'FAQ' }].map(link => (
                            <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                                <div style={{ padding: '9px 14px', borderRadius: 8, fontWeight: 700, fontSize: 14, color: '#aaa', background: 'transparent', transition: 'all 0.2s', cursor: 'pointer' }}
                                    onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = '#aaa'; e.currentTarget.style.background = 'transparent'; }}
                                >{link.label}</div>
                            </Link>
                        ))}

                        {/* Design Yours CTA */}
                        {NAV_LINKS.filter(l => l.highlight).map(link => (
                            <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    padding: '9px 22px', borderRadius: 8, fontWeight: 700, fontSize: 14,
                                    color: '#000', background: 'linear-gradient(135deg, #FF00CC, #FF6EC7)',
                                    boxShadow: '0 0 18px rgba(255,0,204,0.5), 0 0 36px rgba(255,0,204,0.2)',
                                    transition: 'all 0.2s', cursor: 'pointer', whiteSpace: 'nowrap',
                                }}>
                                    {link.label}
                                </div>
                            </Link>
                        ))}

                        {/* Cart */}
                        <Badge count={cartCount} color="#FF00CC" offset={[-3, 3]}>
                            <button
                                onClick={() => setDrawerOpen(true)}
                                style={{
                                    marginLeft: 8,
                                    background: cartCount > 0 ? 'rgba(0,255,255,0.06)' : 'transparent',
                                    border: '1px solid rgba(0,255,255,0.25)',
                                    borderRadius: 8,
                                    padding: '9px 16px',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    color: '#00FFFF',
                                    fontWeight: 600, fontSize: 13,
                                    transition: 'all 0.2s',
                                }}
                            >
                                <ShoppingCartOutlined style={{ fontSize: 18 }} />
                                {cartCount > 0 && <span>${cartTotal.toFixed(0)}</span>}
                            </button>
                        </Badge>
                    </div>

                    {/* Mobile */}
                    <div className="mobile-nav" style={{ alignItems: 'center', gap: 8 }}>
                        <Badge count={cartCount} color="#FF00CC" offset={[-3, 3]}>
                            <Button type="text" icon={<ShoppingCartOutlined style={{ color: '#00FFFF', fontSize: 20 }} />}
                                onClick={() => setDrawerOpen(true)} />
                        </Badge>
                        <Button type="text"
                            icon={mobileMenuOpen
                                ? <CloseOutlined style={{ color: '#FF00CC' }} />
                                : <MenuOutlined style={{ color: '#e0e0e0' }} />}
                            onClick={() => setMobileMenuOpen(v => !v)}
                        />
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div style={{ background: '#0a0a16', borderTop: '1px solid rgba(0,255,255,0.08)', padding: '20px 24px' }}>
                        <div style={{ marginBottom: 18 }}>
                            <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ccc', textDecoration: 'none', fontWeight: 700, fontSize: 17 }}>Home</Link>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                            <div style={{ color: '#555', fontSize: 11, letterSpacing: '0.1em', marginBottom: 12 }}>SHOP</div>
                            {SHOP_CATEGORIES.map(cat => (
                                <div key={cat.href} style={{ marginBottom: 14 }}>
                                    <Link href={cat.href} onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{ fontSize: 18 }}>{cat.icon}</span>
                                        <span style={{ color: cat.color, fontWeight: 700, fontSize: 15 }}>{cat.title}</span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <Link href="/designer" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FF00CC', textDecoration: 'none', fontWeight: 700, fontSize: 17, textShadow: '0 0 8px #FF00CC' }}>✦ Design Yours</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* ── Page Content (no max-width wrapper — pages control their own layout) ── */}
            {children}

            {/* ── Footer ── */}
            <footer style={{ background: '#04040c', borderTop: '1px solid rgba(255,0,204,0.1)', padding: '60px 24px 0' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
                        <div>
                            <div style={{ fontFamily: "'Pacifico', cursive", fontSize: 22, color: '#FF00CC', textShadow: '0 0 12px #FF00CC', marginBottom: 12 }}>
                                NeonSign AU
                            </div>
                            <p style={{ color: '#444', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
                                Australia's premier custom LED neon sign maker. Bringing spaces to life since 2019.
                            </p>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {['#FF00CC', '#FF6EC7', '#00FFFF', '#39FF14', '#BF5FFF'].map(c => (
                                    <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}` }} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 style={{ color: '#888', marginBottom: 16, fontSize: 11, letterSpacing: '0.12em' }}>QUICK LINKS</h4>
                            {[
                                { href: '/', label: 'Home' },
                                { href: '/catalog', label: 'Shop Signs' },
                                { href: '/designer', label: 'Design Studio' },
                                { href: '/cart', label: 'Cart' },
                            ].map(l => (
                                <div key={l.href} style={{ marginBottom: 10 }}>
                                    <Link href={l.href} style={{ color: '#444', textDecoration: 'none', fontSize: 13 }}>{l.label}</Link>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h4 style={{ color: '#888', marginBottom: 16, fontSize: 11, letterSpacing: '0.12em' }}>CONTACT</h4>
                            {[
                                { icon: '📞', text: '1800 NEON AU' },
                                { icon: '✉️', text: 'hello@neonsignau.com.au' },
                                { icon: '📍', text: 'Sydney, NSW, Australia' },
                                { icon: '⏰', text: 'Mon–Fri 9am–5pm AEST' },
                            ].map(item => (
                                <div key={item.text} style={{ color: '#444', fontSize: 13, marginBottom: 10 }}>{item.icon} {item.text}</div>
                            ))}
                        </div>
                        <div>
                            <h4 style={{ color: '#888', marginBottom: 16, fontSize: 11, letterSpacing: '0.12em' }}>TRUST & QUALITY</h4>
                            {['✅ 2-Year Warranty', '🚚 Fast Nationwide Shipping', '🎨 Unlimited Custom Designs', '⚡ LED — 50,000hr Lifespan', '🔒 Secure Checkout'].map(t => (
                                <div key={t} style={{ color: '#444', fontSize: 13, marginBottom: 10 }}>{t}</div>
                            ))}
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, color: '#333', fontSize: 12 }}>
                        <span>© {new Date().getFullYear()} Custom Neon Signs Australia. All rights reserved.</span>
                        <div style={{ display: 'flex', gap: 16 }}>
                            {['Privacy Policy', 'Terms', 'Shipping', 'Returns'].map(t => (
                                <span key={t} style={{ cursor: 'pointer', color: '#333' }}>{t}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

            {/* ── Cart Drawer ── */}
            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <ShoppingCartOutlined style={{ color: '#00FFFF', fontSize: 20 }} />
                        <span style={{ color: '#e0e0e0', fontWeight: 700 }}>
                            Cart <span style={{ color: '#555', fontWeight: 400, fontSize: 13 }}>({cartCount} items)</span>
                        </span>
                    </div>
                }
                placement="right"
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                width={isMd ? '100%' : 420}
                styles={{
                    body: { background: '#09090f', padding: 20 },
                    header: { background: '#060610', borderBottom: '1px solid rgba(0,255,255,0.12)' },
                    footer: { background: '#060610', borderTop: '1px solid rgba(0,255,255,0.12)', padding: 16 },
                }}
                footer={cartItems.length > 0 && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, padding: '0 4px' }}>
                            <span style={{ color: '#aaa', fontSize: 15 }}>Total</span>
                            <span style={{ color: '#00FFFF', fontWeight: 900, fontSize: 22, textShadow: '0 0 8px #00FFFF' }}>
                                ${cartTotal.toFixed(2)}
                            </span>
                        </div>
                        <a href="/checkout">
                            <button className="btn-neon-pink" style={{ width: '100%', fontSize: 15, padding: '12px' }}>
                                Checkout →
                            </button>
                        </a>
                        <a href="/cart">
                            <button style={{ width: '100%', marginTop: 10, padding: '10px', background: 'transparent', color: '#666', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
                                View Full Cart
                            </button>
                        </a>
                    </div>
                )}
            >
                {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', paddingTop: 80 }}>
                        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }}>🛒</div>
                        <Empty description={<span style={{ color: '#444' }}>Your cart is empty</span>} />
                        <a href="/catalog">
                            <button className="btn-neon-cyan" style={{ marginTop: 24, padding: '10px 28px' }}>Browse Signs</button>
                        </a>
                    </div>
                ) : (
                    cartItems.map(item => (
                        <div key={item.id} style={{
                            background: '#0d0d1a',
                            border: '1px solid rgba(0,255,255,0.09)',
                            borderRadius: 10, padding: 14, marginBottom: 12,
                            display: 'flex', gap: 12, alignItems: 'flex-start',
                        }}>
                            <div style={{
                                width: 72, height: 56, borderRadius: 6,
                                background: item.background ?? '#000',
                                border: '1px solid rgba(255,255,255,0.06)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0, overflow: 'hidden',
                            }}>
                                <span style={{
                                    fontFamily: item.font ?? "'Pacifico', cursive",
                                    fontSize: 11, color: item.neon_color ?? '#FF00CC',
                                    textShadow: `0 0 6px ${item.neon_color ?? '#FF00CC'}`,
                                    textAlign: 'center', padding: 4, wordBreak: 'break-all',
                                }}>
                                    {item.custom_text ?? item.product?.name ?? 'Sign'}
                                </span>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ color: '#ccc', fontWeight: 600, fontSize: 13, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {item.product?.name ?? (item.custom_text ? `"${item.custom_text}"` : 'Custom Sign')}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    {item.neon_color && <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.neon_color, boxShadow: `0 0 4px ${item.neon_color}`, flexShrink: 0 }} />}
                                    {item.size && <span style={{ color: '#444', fontSize: 11 }}>{item.size}</span>}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <InputNumber min={1} max={10} value={item.quantity} size="small" style={{ width: 60 }} onChange={v => updateQty(item.id, v)} />
                                    <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => removeItem(item.id)} />
                                </div>
                            </div>
                            <div style={{ color: '#FF00CC', fontWeight: 800, fontSize: 15, textShadow: '0 0 6px rgba(255,0,204,0.4)', flexShrink: 0 }}>
                                ${(item.unit_price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))
                )}
            </Drawer>

            <style>{`
                @media (max-width: 768px) {
                    .desktop-nav { display: none !important; }
                    .mobile-nav { display: flex !important; }
                }
                @media (min-width: 769px) {
                    .mobile-nav { display: none !important; }
                }
            `}</style>
        </div>
    );
}
