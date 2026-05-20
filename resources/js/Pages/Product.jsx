import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Tooltip, message } from 'antd';
import AppLayout from '@/Layouts/AppLayout';
import { useCart } from '@/Contexts/CartContext';
import useBreakpoint from '@/hooks/useBreakpoint';

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

function getFontForProduct(product) {
    if (product.font) return product.font;
    if (product.is_customizable) return "'Rajdhani', sans-serif";
    return PREVIEW_FONTS[(product.id ?? 0) % (PREVIEW_FONTS.length - 1)];
}

function getFontLabel(fontValue) {
    if (!fontValue) return null;
    const match = fontValue.match(/'([^']+)'/);
    return match ? match[1] : fontValue.split(',')[0];
}

export default function ProductDetail({ product }) {
    const { addToCart, setDrawerOpen } = useCart();
    const { isMd } = useBreakpoint();
    const [selectedColor, setSelectedColor] = useState(
        product.colors?.[0] ?? '#FF00CC'
    );
    const [selectedSize, setSelectedSize] = useState(
        product.sizes?.[0] ?? { label: 'Standard', price: 0 }
    );
    const [adding, setAdding] = useState(false);
    const [customText, setCustomText] = useState('');
    const [imgBroken, setImgBroken] = useState(false);

    const font = getFontForProduct(product);
    const fontLabel = getFontLabel(product.font);
    const price = parseFloat(product.base_price ?? 0) + parseFloat(selectedSize?.price ?? 0);
    const glow = `0 0 12px ${selectedColor}, 0 0 30px ${selectedColor}90, 0 0 60px ${selectedColor}40`;
    const showImage = !product.is_customizable && product.image && !imgBroken;
    const previewText = product.is_customizable
        ? (customText.trim() || 'Your Text Here')
        : product.name;

    const handleAddToCart = () => {
        setAdding(true);
        addToCart({
            id: product.id,
            name: product.name,
            price,
            color: selectedColor,
            size: selectedSize?.label,
            customText: product.is_customizable ? customText : undefined,
            image: product.image,
        });
        setTimeout(() => {
            setAdding(false);
            setDrawerOpen(true);
        }, 600);
        message.success(`${product.name} added to cart!`);
    };

    // Colours available for this product (from saved colours or all)
    const availableColors = (product.colors?.length ? product.colors : NEON_COLORS.map(c => c.hex))
        .map(hex => NEON_COLORS.find(c => c.hex === hex) ?? { hex, name: hex });

    const { seo, seoContent: sc } = usePage().props;
    const siteUrl = seo.appUrl;
    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || `Custom LED neon sign — ${product.name}. Handcrafted in Australia with premium LED neon flex. Available in 12 colours with clear acrylic backing.`,
        image: product.image ? [product.image] : [`${siteUrl}/cns_assets/Mock up-08.png`],
        brand: { '@type': 'Brand', name: 'Custom Neon Signs Australia' },
        sku: `CNS-${product.id}`,
        offers: {
            '@type': 'Offer',
            url: `${siteUrl}/catalog/${product.id}`,
            priceCurrency: 'AUD',
            price: product.base_price ?? 169,
            priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            availability: 'https://schema.org/InStock',
            seller: { '@type': 'Organization', name: 'Custom Neon Signs Australia' },
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '8400',
            bestRating: '5',
        },
    };

    return (
        <AppLayout>
            <Head title={`${product.name} | Custom LED Neon Sign — Custom Neon Signs Australia`}>
                <meta name="description" content={`Buy the ${product.name} LED neon sign from Custom Neon Signs Australia. Handcrafted premium LED neon, ${product.base_price ? `from $${product.base_price}` : 'from $169'}. 2-year warranty, ships Australia-wide in 5–7 days.`} />
                <link rel="canonical" href={`${siteUrl}/catalog/${product.id}`} />
                <meta property="og:title" content={`${product.name} | Custom LED Neon Sign`} />
                <meta property="og:description" content={`${product.name} — premium LED neon sign handcrafted in Australia. ${product.base_price ? `From $${product.base_price}.` : 'From $169.'} 2-year warranty, ships nationwide.`} />
                <meta property="og:image" content={product.image || `${siteUrl}/cns_assets/Mock up-08.png`} />
                <meta property="og:url" content={`${siteUrl}/catalog/${product.id}`} />
                <meta property="og:type" content="product" />
                <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
            </Head>

            {/* Back breadcrumb */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMd ? '20px 16px 0' : '28px 24px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
                    <Link href="/catalog" style={{ color: '#555', fontSize: 13, textDecoration: 'none' }}>← Back to Catalog</Link>
                    <span style={{ color: '#333' }}>›</span>
                    <span style={{ color: '#888', fontSize: 13 }}>{product.name}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMd ? '1fr' : '1fr 1fr', gap: isMd ? 32 : 48, alignItems: 'start' }}>

                    {/* ── Left: Large preview ── */}
                    <div>
                        <div style={{
                            background: 'radial-gradient(ellipse 90% 70% at 50% 65%, #10102a 0%, #060612 100%)',
                            borderRadius: 20,
                            border: '1px solid rgba(255,255,255,0.07)',
                            minHeight: 380,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '40px 32px',
                            position: 'relative', overflow: 'hidden',
                        }}>
                            {/* Ambient glow */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: `radial-gradient(ellipse 65% 55% at 50% 62%, ${selectedColor}14 0%, transparent 68%)`,
                                transition: 'background 0.3s', pointerEvents: 'none',
                            }} />
                            {/* Floor reflection */}
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
                                background: `linear-gradient(0deg, ${selectedColor}08 0%, transparent 100%)`,
                                pointerEvents: 'none',
                            }} />

                            {showImage ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    onError={() => setImgBroken(true)}
                                    style={{
                                        width: '100%', height: '100%', objectFit: 'contain',
                                        position: 'absolute', inset: 0, padding: 32,
                                        filter: `brightness(1.05) drop-shadow(0 0 16px ${selectedColor}60)`,
                                        transition: 'filter 0.3s',
                                    }}
                                />
                            ) : (
                                <div style={{
                                    fontFamily: font,
                                    fontSize: 'clamp(28px, 5vw, 56px)',
                                    color: selectedColor,
                                    textShadow: glow,
                                    textAlign: 'center', lineHeight: 1.2,
                                    transition: 'color 0.28s, text-shadow 0.28s',
                                    zIndex: 1, maxWidth: '100%', wordBreak: 'break-word',
                                }}>
                                    {previewText}
                                </div>
                            )}
                        </div>

                        {/* Font info */}
                        {!showImage && (
                            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 10, color: '#3a3a50', letterSpacing: '0.13em', fontWeight: 700 }}>FONT STYLE</span>
                                <span style={{ fontFamily: font, fontSize: 18, color: selectedColor, textShadow: `0 0 6px ${selectedColor}80`, transition: 'color 0.28s' }}>
                                    {fontLabel || PREVIEW_FONTS[(product.id ?? 0) % (PREVIEW_FONTS.length - 1)].split("'")[1]}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* ── Right: Info + options ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                        {/* Name + category */}
                        <div>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                                <span style={{
                                    padding: '3px 12px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                                    background: product.category === 'custom' ? 'rgba(191,95,255,0.14)' : 'rgba(0,255,255,0.09)',
                                    border: product.category === 'custom' ? '1px solid rgba(191,95,255,0.3)' : '1px solid rgba(0,255,255,0.22)',
                                    color: product.category === 'custom' ? '#BF5FFF' : '#00FFFF',
                                }}>
                                    {product.category === 'custom' ? 'Custom' : 'Pre-built'}
                                </span>
                                {product.is_customizable && (
                                    <span style={{
                                        padding: '3px 12px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                                        background: 'rgba(255,0,204,0.1)', border: '1px solid rgba(255,0,204,0.3)', color: '#FF00CC',
                                    }}>Personalised</span>
                                )}
                            </div>
                            <h1 style={{ color: '#f0f0f0', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, margin: '0 0 10px', lineHeight: 1.2 }}>
                                {product.name}
                            </h1>
                            <p style={{ color: '#6a6a80', fontSize: 15, lineHeight: 1.7, margin: 0 }}>{product.description}</p>
                        </div>

                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                            <span style={{ color: '#FF00CC', fontSize: 40, fontWeight: 900, textShadow: '0 0 16px rgba(255,0,204,0.4)', lineHeight: 1 }}>
                                ${price.toFixed(2)}
                            </span>
                            {selectedSize?.price > 0 && (
                                <span style={{ color: '#444', fontSize: 13 }}>incl. size add-on +${selectedSize.price}</span>
                            )}
                        </div>

                        {/* Custom text input */}
                        {product.is_customizable && (
                            <div>
                                <div style={{ fontSize: 11, color: '#3a3a50', letterSpacing: '0.13em', fontWeight: 700, marginBottom: 8 }}>YOUR TEXT</div>
                                <input
                                    value={customText}
                                    onChange={e => setCustomText(e.target.value)}
                                    placeholder="Type your neon sign text…"
                                    maxLength={60}
                                    style={{
                                        width: '100%', background: '#0c0c22', border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 10, padding: '10px 14px', color: '#ddd', fontSize: 14, outline: 'none',
                                        boxSizing: 'border-box',
                                        fontFamily: font,
                                    }}
                                />
                                <div style={{ color: '#2a2a40', fontSize: 11, marginTop: 4, textAlign: 'right' }}>{customText.length}/60</div>
                            </div>
                        )}

                        {/* Colour picker */}
                        <div>
                            <div style={{ fontSize: 11, color: '#3a3a50', letterSpacing: '0.13em', fontWeight: 700, marginBottom: 8 }}>
                                COLOUR — <span style={{ color: selectedColor, textShadow: `0 0 8px ${selectedColor}` }}>
                                    {availableColors.find(c => c.hex === selectedColor)?.name ?? ''}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {availableColors.map(c => (
                                    <Tooltip key={c.hex} title={c.name}>
                                        <div onClick={() => setSelectedColor(c.hex)} style={{
                                            width: 28, height: 28, borderRadius: '50%', background: c.hex, cursor: 'pointer',
                                            boxShadow: selectedColor === c.hex ? `0 0 10px ${c.hex}, 0 0 20px ${c.hex}` : `0 0 5px ${c.hex}50`,
                                            border: selectedColor === c.hex ? '2px solid #fff' : '2px solid transparent',
                                            transition: 'all 0.18s', flexShrink: 0,
                                        }} />
                                    </Tooltip>
                                ))}
                            </div>
                        </div>

                        {/* Size picker */}
                        {product.sizes?.length > 0 && (
                            <div>
                                <div style={{ fontSize: 11, color: '#3a3a50', letterSpacing: '0.13em', fontWeight: 700, marginBottom: 8 }}>SIZE</div>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {product.sizes.map(s => (
                                        <button
                                            key={s.label}
                                            onClick={() => setSelectedSize(s)}
                                            style={{
                                                padding: '8px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600,
                                                background: selectedSize?.label === s.label ? 'rgba(255,0,204,0.12)' : '#0c0c22',
                                                border: selectedSize?.label === s.label ? '1px solid rgba(255,0,204,0.5)' : '1px solid rgba(255,255,255,0.09)',
                                                color: selectedSize?.label === s.label ? '#FF00CC' : '#666',
                                                transition: 'all 0.15s',
                                            }}
                                        >
                                            {s.label}{s.price > 0 ? ` +$${s.price}` : ''}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
                            {product.is_customizable ? (
                                <Link
                                    href={product.slug === 'custom-logo-sign' ? '/logo-upload' : '/designer'}
                                    style={{ textDecoration: 'none', flex: 1, minWidth: 160 }}
                                >
                                    <button style={{
                                        width: '100%', padding: '13px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer',
                                        background: 'rgba(191,95,255,0.1)', color: '#BF5FFF',
                                        border: '1px solid rgba(191,95,255,0.45)',
                                        boxShadow: '0 0 16px rgba(191,95,255,0.2)',
                                        transition: 'all 0.2s',
                                    }}>
                                        ✦ {product.slug === 'custom-logo-sign' ? 'Upload Logo' : 'Open Design Studio'}
                                    </button>
                                </Link>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    disabled={adding}
                                    style={{
                                        flex: 1, minWidth: 160, padding: '13px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer',
                                        background: adding ? 'rgba(57,255,20,0.12)' : 'linear-gradient(135deg, #FF00CC, #FF6EC7)',
                                        color: adding ? '#39FF14' : '#000',
                                        border: adding ? '1px solid rgba(57,255,20,0.4)' : 'none',
                                        boxShadow: adding ? '0 0 16px rgba(57,255,20,0.3)' : '0 4px 24px rgba(255,0,204,0.35)',
                                        transition: 'all 0.25s',
                                    }}
                                >
                                    {adding ? '✓ Added!' : '🛒 Add to Cart'}
                                </button>
                            )}
                        </div>

                        {/* Delivery blurb */}
                        <div style={{
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            paddingTop: 16,
                            display: 'flex', flexDirection: 'column', gap: 6,
                        }}>
                            {[
                                { icon: '✦', text: 'Handcrafted in Australia' },
                                { icon: '⚡', text: 'Ships within 5–7 business days' },
                                { icon: '🔌', text: 'Includes AU power adapter & remote' },
                            ].map(({ icon, text }) => (
                                <div key={text} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <span style={{ color: '#FF00CC', fontSize: 12 }}>{icon}</span>
                                    <span style={{ color: '#444', fontSize: 12 }}>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom spacer */}
            <div style={{ height: 80 }} />
        </AppLayout>
    );
}
