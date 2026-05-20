import React, { useState, useMemo } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Tooltip, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import AppLayout from '@/Layouts/AppLayout';
import { useCart } from '@/Contexts/CartContext';

const NEON_COLORS = [
    { hex: '#FF00CC', name: 'Neon Fuchsia' },
    { hex: '#FF6EC7', name: 'Hot Pink' },
    { hex: '#00FFFF', name: 'Neon Cyan' },
    { hex: '#39FF14', name: 'Neon Green' },
    { hex: '#FFFF00', name: 'Neon Yellow' },
    { hex: '#FF8C00', name: 'Neon Orange' },
    { hex: '#BF5FFF', name: 'Neon Purple' },
    { hex: '#FFFFFF', name: 'Cool White' },
];

const PREVIEW_FONTS = [
    "'Pacifico', cursive",
    "'Lobster', cursive",
    "'Dancing Script', cursive",
    "'Bebas Neue', cursive",
    "'Oswald', sans-serif",
    "'Rajdhani', sans-serif",
];

const getFontForProduct = (product) => {
    if (product.font) return product.font;
    if (product.is_customizable) return "'Rajdhani', sans-serif";
    return PREVIEW_FONTS[(product.id ?? 0) % (PREVIEW_FONTS.length - 1)];
};

const BADGES = {
    'good-vibes-only':   { label: 'POPULAR',    color: '#FF00CC' },
    'love-heart':        { label: 'TOP SELLER',  color: '#FF6EC7' },
    'custom-text-sign':  { label: 'BESTSELLER',  color: '#BF5FFF' },
    'custom-logo-sign':  { label: 'PREMIUM',     color: '#FF8C00' },
    'birthday-bash':     { label: 'TRENDING',    color: '#39FF14' },
    'neon-bar-sign':     { label: 'FAN FAVE',    color: '#00FFFF' },
};

const SORT_OPTIONS = [
    { value: 'featured',   label: 'Featured' },
    { value: 'price_asc',  label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc',   label: 'Name: A–Z' },
];

function ProductCard({ product }) {
    const { addToCart, setDrawerOpen } = useCart();
    const [selectedColor, setSelectedColor] = useState('#FF00CC');
    const [selectedSize,  setSelectedSize]  = useState(product.sizes?.[0] ?? { label: 'Small (30cm)', price: 0 });
    const [hovered,  setHovered]  = useState(false);
    const [adding,   setAdding]   = useState(false);
    const [imgBroken, setImgBroken] = useState(false);

    const font  = getFontForProduct(product);
    const price = parseFloat(product.base_price ?? 0) + parseFloat(selectedSize?.price ?? 0);
    const badge = BADGES[product.slug];
    const glow  = `0 0 10px ${selectedColor}, 0 0 24px ${selectedColor}90, 0 0 50px ${selectedColor}40`;

    // Show image only for non-customizable products that have a real image
    const showImage = !product.is_customizable && product.image && !imgBroken;

    const handleAddToCart = async () => {
        setAdding(true);
        try {
            await addToCart({
                product_id: product.id,
                quantity: 1,
                unit_price: price,
                neon_color: selectedColor,
                size: selectedSize?.label ?? 'Small (30cm)',
            });
            message.success({ content: `${product.name} added to cart!`, style: { marginTop: 60 } });
            setDrawerOpen(true);
        } catch {
            message.error('Failed to add to cart.');
        } finally {
            setAdding(false);
        }
    };

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'flex', flexDirection: 'column', height: '100%',
                background: '#09091a',
                border: hovered ? `1px solid ${selectedColor}55` : '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, overflow: 'hidden',
                boxShadow: hovered
                    ? `0 16px 56px ${selectedColor}18, 0 4px 20px rgba(0,0,0,0.6)`
                    : '0 4px 24px rgba(0,0,0,0.4)',
                transform: hovered ? 'translateY(-5px)' : 'none',
                transition: 'all 0.28s ease',
            }}
        >
            {/* ── Sign preview ── */}
            <div style={{
                background: 'radial-gradient(ellipse 90% 70% at 50% 65%, #10102a 0%, #060612 100%)',
                minHeight: 210,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '28px 20px',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* ambient glow orb */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: `radial-gradient(ellipse 65% 55% at 50% 62%, ${selectedColor}12 0%, transparent 68%)`,
                    transition: 'background 0.3s', pointerEvents: 'none',
                }} />

                {/* Floor reflection */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 40,
                    background: `linear-gradient(0deg, ${selectedColor}08 0%, transparent 100%)`,
                    pointerEvents: 'none',
                }} />

                {/* Badge */}
                {badge && (
                    <div style={{
                        position: 'absolute', top: 10, left: 10,
                        padding: '3px 10px', borderRadius: 20, fontSize: 9, fontWeight: 800, letterSpacing: '0.14em',
                        background: badge.color + '20', border: `1px solid ${badge.color}55`, color: badge.color,
                        zIndex: 2,
                    }}>{badge.label}</div>
                )}

                {/* Category chip */}
                <div style={{
                    position: 'absolute', top: 10, right: 10,
                    padding: '3px 10px', borderRadius: 20, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                    background: product.category === 'custom' ? 'rgba(191,95,255,0.14)' : 'rgba(0,255,255,0.09)',
                    border: product.category === 'custom' ? '1px solid rgba(191,95,255,0.3)' : '1px solid rgba(0,255,255,0.22)',
                    color: product.category === 'custom' ? '#BF5FFF' : '#00FFFF',
                    zIndex: 2,
                }}>
                    {product.category === 'custom' ? 'Custom' : 'Pre-built'}
                </div>

                {/* Image or neon text preview */}
                {showImage ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        onError={() => setImgBroken(true)}
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            position: 'absolute', inset: 0,
                            filter: hovered ? `brightness(1.05) drop-shadow(0 0 12px ${selectedColor}60)` : 'none',
                            transition: 'filter 0.28s',
                        }}
                    />
                ) : (
                    /* Neon text — always shown for custom/text products, fallback for prebuilt */
                    <div style={{
                        fontFamily: font,
                        fontSize: product.is_customizable ? 28 : 'clamp(18px, 2.6vw, 32px)',
                        color: selectedColor,
                        textShadow: glow,
                        textAlign: 'center', lineHeight: 1.3,
                        transition: 'color 0.28s, text-shadow 0.28s',
                        zIndex: 1, maxWidth: '100%', wordBreak: 'break-word',
                    }}>
                        {product.is_customizable ? 'Your Text Here' : product.name}
                    </div>
                )}
            </div>

            {/* ── Card body ── */}
            <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>

                <div>
                    <h3 style={{ color: '#eee', fontWeight: 800, fontSize: 15, margin: '0 0 3px' }}>{product.name}</h3>
                    <p style={{ color: '#505060', fontSize: 12, lineHeight: 1.6, margin: '0 0 6px' }}>{product.description}</p>
                    {/* Font style tag */}
                    {!showImage && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 9, color: '#3a3a50', letterSpacing: '0.13em', fontWeight: 700 }}>FONT STYLE</span>
                            <span style={{
                                fontFamily: font,
                                fontSize: 13,
                                color: selectedColor,
                                textShadow: `0 0 6px ${selectedColor}80`,
                                transition: 'color 0.28s, text-shadow 0.28s',
                            }}>
                                {font.split("'")[1] || font.split(',')[0].replace(/'/g, '')}
                            </span>
                        </div>
                    )}
                </div>

                {/* Colour picker */}
                <div>
                    <div style={{ fontSize: 10, color: '#3a3a50', letterSpacing: '0.13em', fontWeight: 700, marginBottom: 6 }}>
                        COLOUR — <span style={{ color: selectedColor, textShadow: `0 0 8px ${selectedColor}` }}>{NEON_COLORS.find(c => c.hex === selectedColor)?.name ?? ''}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                        {NEON_COLORS.map(c => (
                            <Tooltip key={c.hex} title={c.name}>
                                <div onClick={() => setSelectedColor(c.hex)} style={{
                                    width: 22, height: 22, borderRadius: '50%', background: c.hex, cursor: 'pointer', flexShrink: 0,
                                    boxShadow: selectedColor === c.hex ? `0 0 8px ${c.hex}, 0 0 16px ${c.hex}` : `0 0 4px ${c.hex}50`,
                                    border: selectedColor === c.hex ? '2px solid #fff' : '2px solid transparent',
                                    transition: 'all 0.18s',
                                }} />
                            </Tooltip>
                        ))}
                    </div>
                </div>

                {/* Size + price */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <select
                        value={selectedSize?.label}
                        onChange={e => setSelectedSize(product.sizes?.find(s => s.label === e.target.value) ?? product.sizes?.[0])}
                        style={{
                            flex: 1, background: '#0c0c1e', color: '#888',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 8, padding: '6px 8px', fontSize: 12, cursor: 'pointer',
                        }}
                    >
                        {(product.sizes ?? [{ label: 'Standard', price: 0 }]).map(s => (
                            <option key={s.label} value={s.label}>{s.label}{s.price > 0 ? ` (+$${s.price})` : ''}</option>
                        ))}
                    </select>
                    <div style={{
                        color: '#FF00CC', fontSize: 24, fontWeight: 900,
                        textShadow: '0 0 12px rgba(255,0,204,0.5)',
                        lineHeight: 1, whiteSpace: 'nowrap',
                    }}>
                        ${price}
                    </div>
                </div>

                {/* CTA buttons */}
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    {product.is_customizable ? (
                        <Link
                            href={product.slug === 'custom-logo-sign' ? '/logo-upload' : '/designer'}
                            style={{ flex: 1, textDecoration: 'none' }}
                        >
                            <button style={{
                                width: '100%', padding: '10px 12px', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: 'pointer',
                                background: hovered ? 'rgba(191,95,255,0.12)' : 'rgba(191,95,255,0.06)',
                                color: '#BF5FFF',
                                border: '1px solid rgba(191,95,255,0.45)',
                                boxShadow: hovered ? '0 0 14px rgba(191,95,255,0.25)' : 'none',
                                transition: 'all 0.2s',
                            }}>
                                ✦ {product.slug === 'custom-logo-sign' ? 'Upload Logo' : 'Open Studio'}
                            </button>
                        </Link>
                    ) : (
                        <>
                            <Link href={`/catalog/${product.slug}`} style={{ textDecoration: 'none' }}>
                                <button style={{
                                    padding: '10px 14px', borderRadius: 9, fontWeight: 600, fontSize: 12, cursor: 'pointer',
                                    background: 'rgba(255,255,255,0.03)', color: '#555',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    transition: 'all 0.18s',
                                }}>Details</button>
                            </Link>
                            <button
                                onClick={handleAddToCart}
                                disabled={adding}
                                style={{
                                    flex: 1, padding: '10px 12px', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: 'pointer',
                                    background: 'linear-gradient(135deg, #FF00CC, #FF6EC7)',
                                    color: '#000', border: 'none',
                                    boxShadow: hovered ? '0 0 18px rgba(255,0,204,0.55)' : '0 0 8px rgba(255,0,204,0.2)',
                                    transition: 'all 0.2s', opacity: adding ? 0.7 : 1,
                                }}
                            >
                                <ShoppingCartOutlined style={{ marginRight: 5 }} />
                                {adding ? 'Adding…' : 'Add to Cart'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Catalog({ products = [], category = 'all' }) {
    const { seo, seoContent: sc } = usePage().props;
    const [filter, setFilter] = useState(category);
    const [sort,   setSort]   = useState('featured');

    const handleFilter = (val) => {
        setFilter(val);
        router.get('/catalog', { category: val }, { preserveState: true, replace: true });
    };

    const sorted = useMemo(() => {
        const arr = [...products];
        if (sort === 'price_asc')  return arr.sort((a, b) => a.base_price - b.base_price);
        if (sort === 'price_desc') return arr.sort((a, b) => b.base_price - a.base_price);
        if (sort === 'name_asc')   return arr.sort((a, b) => a.name.localeCompare(b.name));
        return arr;
    }, [products, sort]);

    const counts = {
        all:      products.length,
        prebuilt: products.filter(p => p.category === 'prebuilt').length,
        custom:   products.filter(p => p.category === 'custom').length,
    };

    return (
        <AppLayout>
            <Head title={sc?.catalog_title || 'Buy Custom Neon Signs Australia | LED Neon Signs Shop'}>
                <meta name="description" content={sc?.catalog_description || 'Shop premium custom LED neon signs in Australia. Choose from pre-built designs or use our free tool to create a personalised neon sign. From $169 with 2-year warranty and Australia-wide delivery.'} />
                {sc?.home_keywords && <meta name="keywords" content={sc.home_keywords} />}
                <link rel="canonical" href={seo.appUrl + '/catalog'} />
                <meta property="og:title" content={sc?.catalog_title || 'Buy Custom Neon Signs Australia | LED Neon Signs Shop'} />
                <meta property="og:description" content={sc?.catalog_description || 'Shop premium custom LED neon signs from $169. Ships Australia-wide.'} />
                <meta property="og:image" content={seo.ogImage} />
                <meta property="og:url" content={seo.appUrl + '/catalog'} />
                <meta name="twitter:title" content={sc?.catalog_title || 'Buy Custom Neon Signs Australia | LED Neon Signs Shop'} />
                <meta name="twitter:description" content={sc?.catalog_description || 'Shop premium custom LED neon signs from $169. Ships Australia-wide.'} />
                <meta name="twitter:image" content={seo.ogImage} />
            </Head>

            {/* ── Hero ── */}
            <div style={{
                background: 'linear-gradient(180deg, #0a0820 0%, #07071a 100%)',
                borderBottom: '1px solid rgba(255,0,204,0.1)',
                padding: 'clamp(36px,5vw,64px) 24px 36px',
                textAlign: 'center', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 80% at 50% 100%, rgba(255,0,204,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ color: '#FF00CC', fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', marginBottom: 10 }}>SHOP</div>
                <h1 style={{
                    fontFamily: "'Bebas Neue', cursive",
                    fontSize: 'clamp(44px,7vw,88px)', letterSpacing: '0.06em',
                    color: '#fff', margin: '0 0 12px', lineHeight: 1,
                }}>
                    Neon <span style={{ color: '#FF00CC', textShadow: '0 0 30px #FF00CC, 0 0 60px #FF00CC60' }}>Signs</span>
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, maxWidth: 460, margin: '0 auto' }}>
                    Hand-crafted LED neon for every occasion. Pick your style, choose your colour — we'll make it glow.
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
                    <Link href="/designer" style={{ textDecoration: 'none' }}>
                        <button className="btn-hero-pink" style={{ padding: '9px 22px', fontSize: 13, fontWeight: 700 }}>✦ Design Custom Text</button>
                    </Link>
                    <Link href="/logo-upload" style={{ textDecoration: 'none' }}>
                        <button className="btn-hero-outline" style={{ padding: '9px 22px', fontSize: 13, fontWeight: 700 }}>📤 Upload Logo</button>
                    </Link>
                </div>
            </div>

            {/* ── Sticky filter / sort bar ── */}
            <div style={{
                background: '#09091a',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                padding: '12px 24px',
                position: 'sticky', top: 56, zIndex: 99,
            }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {[
                            { value: 'all',      label: 'All Signs' },
                            { value: 'prebuilt', label: 'Pre-built' },
                            { value: 'custom',   label: 'Custom' },
                        ].map(f => (
                            <button key={f.value} onClick={() => handleFilter(f.value)} style={{
                                padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                                background: filter === f.value ? 'rgba(255,0,204,0.14)' : 'transparent',
                                border: filter === f.value ? '1px solid rgba(255,0,204,0.5)' : '1px solid rgba(255,255,255,0.08)',
                                color: filter === f.value ? '#FF00CC' : '#555',
                                transition: 'all 0.18s',
                            }}>
                                {f.label}
                                <span style={{ marginLeft: 5, color: filter === f.value ? 'rgba(255,0,204,0.55)' : '#333', fontWeight: 500 }}>
                                    ({counts[f.value]})
                                </span>
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ color: '#2a2a3a', fontSize: 12 }}>{sorted.length} sign{sorted.length !== 1 ? 's' : ''}</span>
                        <select
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                            style={{
                                background: '#0d0d1e', color: '#888',
                                border: '1px solid rgba(255,255,255,0.09)',
                                borderRadius: 8, padding: '6px 10px', fontSize: 12, cursor: 'pointer',
                            }}
                        >
                            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* ── Product grid ── */}
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 80px' }}>
                {sorted.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#444', padding: '100px 0', fontSize: 14 }}>
                        No signs in this category yet.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(268px, 100%), 1fr))', gap: 22 }}>
                        {sorted.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {/* Bottom CTA */}
                <div style={{
                    marginTop: 60, textAlign: 'center', padding: '40px 28px',
                    background: 'rgba(255,0,204,0.04)', border: '1px solid rgba(255,0,204,0.1)', borderRadius: 20,
                }}>
                    <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 30, color: '#fff', letterSpacing: '0.05em', marginBottom: 6 }}>
                        Can't find what you're <span style={{ color: '#FF00CC', textShadow: '0 0 16px #FF00CC80' }}>looking for?</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 18 }}>
                        Design your own in minutes — any text, any colour, any size.
                    </p>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/designer" style={{ textDecoration: 'none' }}>
                            <button className="btn-hero-pink" style={{ padding: '11px 28px', fontSize: 14, fontWeight: 700 }}>✦ Open Design Studio</button>
                        </Link>
                        <Link href="/logo-upload" style={{ textDecoration: 'none' }}>
                            <button className="btn-hero-outline" style={{ padding: '11px 28px', fontSize: 14, fontWeight: 700 }}>📤 Logo to Neon</button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
