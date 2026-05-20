import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import useBreakpoint from '@/hooks/useBreakpoint';

/* ─── Floating neon particles ───────────────────────────── */
function FloatingParticles({ count = 18, colors = ['#FF00CC','#00FFFF','#BF5FFF','#39FF14','#FF6EC7'] }) {
    const particles = useMemo(() =>
        Array.from({ length: count }, (_, i) => ({
            id: i,
            left: `${(i / count) * 100 + Math.sin(i * 1.7) * 6}%`,
            top: `${20 + ((i * 37) % 65)}%`,
            size: 2 + (i % 3) * 1.5,
            color: colors[i % colors.length],
            duration: 7 + (i % 5) * 1.4,
            delay: -(i * 0.6),
        })), [count]
    );
    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
            {particles.map(p => (
                <div key={p.id} style={{
                    position: 'absolute', left: p.left, top: p.top,
                    width: p.size, height: p.size, borderRadius: '50%',
                    background: p.color,
                    boxShadow: `0 0 ${p.size * 3}px ${p.color}, 0 0 ${p.size * 6}px ${p.color}50`,
                    animation: `particle-float ${p.duration}s ${p.delay}s infinite ease-in-out`,
                }} />
            ))}
        </div>
    );
}

/* ─── Aceternity-style Sparkles ─────────────────────────── */
function Sparkles({ count = 18, colors = ['#FF00CC', '#BF5FFF', '#00FFFF', '#FFFF00', '#39FF14'] }) {
    const items = useMemo(() =>
        Array.from({ length: count }, (_, i) => ({
            id: i,
            left: (i / count) * 100 + Math.sin(i * 2.4) * 8,
            top: 5 + ((i * 53) % 90),
            size: 6 + (i % 4) * 5,
            color: colors[i % colors.length],
            duration: 2 + (i % 5) * 0.6,
            delay: -(i * 0.35),
        })), [count]
    );
    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
            {items.map(s => (
                <svg key={s.id} viewBox="0 0 24 24"
                    style={{
                        position: 'absolute',
                        left: s.left + '%',
                        top: s.top + '%',
                        width: s.size,
                        height: s.size,
                        fill: s.color,
                        filter: `drop-shadow(0 0 ${Math.round(s.size / 3)}px ${s.color})`,
                        animation: `sparkle-twinkle ${s.duration}s ${s.delay}s infinite ease-in-out`,
                        opacity: 0,
                    }}
                >
                    <path d="M12 0 L13.8 9.5 L24 12 L13.8 14.5 L12 24 L10.2 14.5 L0 12 L10.2 9.5 Z" />
                </svg>
            ))}
        </div>
    );
}

/* ─── Aceternity-style Meteor Shower ────────────────────── */
function MeteorShower({ count = 10, color = '#FF00CC' }) {
    const meteors = useMemo(() =>
        Array.from({ length: count }, (_, i) => ({
            id: i,
            left: 5 + (i / count) * 90,
            delay: i * 0.55,
            duration: 2.2 + (i % 4) * 0.5,
            trailLen: 60 + (i % 3) * 50,
            width: 1 + (i % 2),
        })), [count]
    );
    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
            {meteors.map(m => (
                <span key={m.id} style={{
                    position: 'absolute',
                    left: m.left + '%',
                    top: '-5%',
                    width: m.width,
                    height: m.trailLen,
                    background: `linear-gradient(180deg, ${color}cc, ${color}40, transparent)`,
                    borderRadius: 2,
                    boxShadow: `0 0 4px ${color}80`,
                    transform: 'rotate(215deg)',
                    transformOrigin: 'top center',
                    animation: `meteor-shoot ${m.duration}s linear ${m.delay}s infinite`,
                    opacity: 0,
                }} />
            ))}
        </div>
    );
}

/* ─── Neon SVG sign ──────────────────────────────────────── */
function NeonSVGSign({ text, color, size = 56, flicker = false }) {
    return (
        <svg viewBox="0 0 500 110" style={{ width: '100%', maxWidth: 500, overflow: 'visible', display: 'block' }}>
            <defs>
                <filter id={`glow-${text}`} x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="6" result="b1" />
                    <feGaussianBlur stdDeviation="14" result="b2" />
                    <feMerge><feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            <text
                x="50%" y="80" textAnchor="middle"
                fontFamily="'Pacifico', cursive" fontSize={size}
                fill={color} filter={`url(#glow-${text})`}
                style={{ animation: flicker ? 'neon-flicker 4s infinite' : 'none' }}
            >
                {text}
            </text>
        </svg>
    );
}

/* ─── Neon tube decoration ───────────────────────────────── */
function NeonTube({ color, length = 100, vertical = false, opacity = 0.6 }) {
    return (
        <div style={{
            width: vertical ? 4 : length,
            height: vertical ? length : 4,
            background: color,
            borderRadius: 4,
            boxShadow: `0 0 6px ${color}, 0 0 14px ${color}, 0 0 28px ${color}`,
            opacity,
            display: 'inline-block',
        }} />
    );
}

/* ─── Gallery card ───────────────────────────────────────── */
function GalleryCard({ sign }) {
    const [hovered, setHovered] = useState(false);
    const bgStyle = () => {
        if (sign.texture === 'brick') return {
            backgroundColor: '#5c2e0a',
            backgroundImage: `repeating-linear-gradient(90deg,transparent 0,transparent 36px,rgba(40,20,5,0.9) 36px,rgba(40,20,5,0.9) 38px),
                repeating-linear-gradient(0deg,transparent 0,transparent 16px,rgba(40,20,5,0.9) 16px,rgba(40,20,5,0.9) 18px)`,
        };
        if (sign.texture === 'wood') return {
            backgroundColor: '#2d1505',
            backgroundImage: 'repeating-linear-gradient(94deg,rgba(255,255,255,0.03) 0,rgba(0,0,0,0.1) 2px,transparent 2px,transparent 16px)',
        };
        return { backgroundColor: sign.bg };
    };
    if (sign.photo) {
        return (
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    borderRadius: 14, overflow: 'hidden',
                    height: '100%', cursor: 'pointer',
                    border: `1px solid ${hovered ? sign.color + '60' : 'rgba(255,255,255,0.05)'}`,
                    transform: hovered ? 'scale(1.03)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                    boxShadow: hovered ? `0 0 30px ${sign.color}30` : 'none',
                    position: 'relative',
                }}
            >
                <img src={sign.photo} alt={sign.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                {hovered && <div style={{ position: 'absolute', inset: 0, background: `${sign.color}14`, transition: 'all 0.3s' }} />}
            </div>
        );
    }

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                ...bgStyle(),
                borderRadius: 14, overflow: 'hidden',
                border: `1px solid ${hovered ? sign.color + '60' : 'rgba(255,255,255,0.05)'}`,
                aspectRatio: sign.wide ? '2/1' : '1/1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', cursor: 'pointer', height: '100%',
                transform: hovered ? 'scale(1.03)' : 'scale(1)',
                transition: 'all 0.3s ease',
                boxShadow: hovered ? `0 0 30px ${sign.color}30` : 'none',
            }}
        >
            {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
                <div key={v + h} style={{
                    position: 'absolute', [v]: 10, [h]: 10,
                    width: 9, height: 9, borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #ddd, #777)',
                    boxShadow: 'inset 0 0 3px rgba(0,0,0,0.8)',
                    zIndex: 3,
                }} />
            ))}
            <div style={{
                position: 'absolute', inset: '15%',
                background: `radial-gradient(ellipse, ${sign.color}22, transparent 70%)`,
                filter: 'blur(16px)',
            }} />
            <div style={{
                position: 'relative', zIndex: 2,
                fontFamily: sign.font ? `'${sign.font}', cursive` : "'Pacifico', cursive",
                fontSize: sign.wide ? 'clamp(1.6rem,5vw,3rem)' : 'clamp(1.2rem,4vw,2.2rem)',
                color: sign.color,
                textShadow: `0 0 8px ${sign.color}, 0 0 20px ${sign.color}, 0 0 45px ${sign.color}`,
                padding: 20, textAlign: 'center', lineHeight: 1.2,
                animation: sign.flicker ? 'neon-flicker 5s infinite' : 'none',
            }}>
                {sign.text}
            </div>
        </div>
    );
}

/* ─── FAQ accordion item ─────────────────────────────────── */
function FaqItem({ question, answer, color }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            style={{
                borderBottom: `1px solid rgba(255,255,255,0.06)`,
                padding: '0',
                marginBottom: 0,
            }}
        >
            <button
                onClick={() => setOpen(v => !v)}
                style={{
                    width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '22px 0', textAlign: 'left', gap: 16,
                }}
                aria-expanded={open}
            >
                <span style={{ color: '#e0e0e0', fontWeight: 700, fontSize: 15, lineHeight: 1.45, flex: 1 }}>
                    {question}
                </span>
                <span style={{
                    color: color, fontSize: 20, lineHeight: 1, flexShrink: 0,
                    transition: 'transform 0.2s', display: 'inline-block',
                    transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
                    textShadow: `0 0 8px ${color}`,
                }}>+</span>
            </button>
            {open && (
                <p style={{
                    color: '#888', fontSize: 14, lineHeight: 1.85,
                    margin: '0 0 22px', paddingRight: 32,
                }}>
                    {answer}
                </p>
            )}
        </div>
    );
}

/* ─── Step card ──────────────────────────────────────────── */
function StepCard({ step, title, desc, color, icon }) {
    return (
        <div style={{ textAlign: 'center', padding: '0 12px' }}>
            <div style={{
                width: 64, height: 64, borderRadius: '50%',
                border: `2px solid ${color}`,
                boxShadow: `0 0 18px ${color}50`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 18px', fontSize: 26,
                background: `${color}10`,
            }}>{icon}</div>
            <div style={{ color, fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', marginBottom: 8 }}>STEP {step}</div>
            <h4 style={{ color: '#e8e8e8', fontWeight: 700, marginBottom: 8, fontSize: 15 }}>{title}</h4>
            <p style={{ color: '#666', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{desc}</p>
        </div>
    );
}

/* ─── Review card ────────────────────────────────────────── */
function ReviewCard({ name, location, text, stars, color }) {
    return (
        <div style={{
            background: '#0d0d1a',
            border: `1px solid ${color}28`,
            borderRadius: 14, padding: 26,
            boxShadow: `0 4px 24px ${color}0a`,
        }}>
            <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                {Array.from({ length: stars }).map((_, i) => (
                    <span key={i} style={{ color: '#FFFF00', textShadow: '0 0 8px #FFFF00', fontSize: 15 }}>★</span>
                ))}
            </div>
            <p style={{ color: '#bbb', lineHeight: 1.75, marginBottom: 18, fontSize: 13 }}>"{text}"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${color}, ${color}80)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#000', fontWeight: 800, fontSize: 13, flexShrink: 0,
                }}>{name[0]}</div>
                <div>
                    <div style={{ color: '#e0e0e0', fontWeight: 700, fontSize: 13 }}>{name}</div>
                    <div style={{ color: '#555', fontSize: 11 }}>{location}</div>
                </div>
            </div>
        </div>
    );
}

/* ─── Data ───────────────────────────────────────────────── */
const galleryItems = [
    { photo: '/cns_assets/Mock up-08.png', wide: true, alt: 'Neon sign mockup', color: '#FF00CC' },
    { text: 'Good Vibes Only', color: '#00FFFF', bg: '#030312', texture: null, wide: false, flicker: false, font: 'Pacifico' },
    { text: '♡', color: '#FF6EC7', bg: '#0a000d', texture: null, wide: false, flicker: false, font: 'Pacifico' },
    { photo: '/cns_assets/Mock up-09.png', wide: false, alt: 'Custom neon sign', color: '#BF5FFF' },
    { text: 'Bar', color: '#FFFF00', bg: '#000', texture: 'brick', wide: false, flicker: true, font: 'Pacifico' },
    { text: 'Dream Big', color: '#39FF14', bg: '#000a00', texture: null, wide: false, flicker: false, font: 'Dancing Script' },
    { text: "Let's Party", color: '#BF5FFF', bg: '#060010', texture: 'wood', wide: true, flicker: false, font: 'Lobster' },
    { text: '24/7', color: '#FF8C00', bg: '#0a0500', texture: 'brick', wide: false, flicker: false, font: 'Oswald' },
];

const reviews = [
    { name: 'Sarah K.', location: 'Sydney, NSW', stars: 5, color: '#FF6EC7', text: 'Absolutely love my custom sign! The glow is even better than the preview. Arrived perfectly packaged and ahead of schedule.' },
    { name: 'James T.', location: 'Melbourne, VIC', stars: 5, color: '#00FFFF', text: "Got the 'Bar' sign for my man cave. Looks incredible on the brick wall. Everyone who visits asks where I got it." },
    { name: 'Priya M.', location: 'Brisbane, QLD', stars: 5, color: '#39FF14', text: 'Used the designer tool — so easy and the live preview is spot on. Our wedding sign was the centrepiece of the whole night.' },
    { name: 'Luke R.', location: 'Perth, WA', stars: 4, color: '#BF5FFF', text: 'Great quality and fast delivery. Customer service was super helpful when I needed to tweak the font last minute.' },
];

/* ─── Main Page ──────────────────────────────────────────── */
export default function Home({ hero = {}, stats = {}, howItWorks = {}, global: globalContent = {} }) {
    // Defaults (used when DB is empty / not seeded yet)
    const h = {
        headline:    hero.headline    ?? 'Custom Neon Signs Australia',
        subheadline: hero.subheadline ?? 'Design your dream neon sign or choose from our collection. Premium LED neon that glows 50,000+ hours, ships Australia-wide.',
        cta1_text:   hero.cta1_text   ?? '✦ Design Yours — Free',
        cta2_text:   hero.cta2_text   ?? 'Browse Signs →',
    };
    const st = [
        { value: stats.stat1_value ?? '8,400+',  label: stats.stat1_label ?? 'Signs Delivered', color: '#FF00CC' },
        { value: stats.stat2_value ?? '4.9 ★',   label: stats.stat2_label ?? 'Average Rating',  color: '#FFFF00' },
        { value: stats.stat3_value ?? '50,000h',  label: stats.stat3_label ?? 'LED Lifespan',    color: '#00FFFF' },
        { value: stats.stat4_value ?? '2 Years',  label: stats.stat4_label ?? 'Warranty',        color: '#39FF14' },
    ];
    const hiw = [
        { num: 1, color: '#FF00CC', icon: howItWorks.step1_icon ?? '🎨', title: howItWorks.step1_title ?? 'DESIGN',  body: howItWorks.step1_body ?? "Tell us your idea, we'll bring it to life" },
        { num: 2, color: '#BF5FFF', icon: howItWorks.step2_icon ?? '✅', title: howItWorks.step2_title ?? 'CREATE',  body: howItWorks.step2_body ?? 'We handcraft it with premium LED materials' },
        { num: 3, color: '#00FFFF', icon: howItWorks.step3_icon ?? '⚡', title: howItWorks.step3_title ?? 'DELIVER', body: howItWorks.step3_body ?? 'Shipped Australia-wide in 5–7 days' },
        { num: 4, color: '#39FF14', icon: howItWorks.step4_icon ?? '🚚', title: howItWorks.step4_title ?? 'INSTALL', body: howItWorks.step4_body ?? 'Plug in and enjoy the glow' },
    ];

    const heroColors = ['#FF00CC', '#00FFFF', '#BF5FFF', '#39FF14', '#FF6EC7', '#FF8C00'];
    const [heroColor, setHeroColor] = useState('#FF00CC');
    const [activeNeonColor, setActiveNeonColor] = useState({ name: 'Hot Pink', hex: '#FF00CC', glow: '#FF00CC' });
    const { isMobile, isMd, isTablet } = useBreakpoint();

    useEffect(() => {
        let i = 0;
        const t = setInterval(() => { i = (i + 1) % heroColors.length; setHeroColor(heroColors[i]); }, 2800);
        return () => clearInterval(t);
    }, []);

    const { seo, seoContent: sc, faqContent: faqRaw } = usePage().props;
    const siteUrl = seo.appUrl;
    const ogImage = seo.ogImage;

    // Build FAQ items from DB; fall back to defaults if not yet seeded
    const FAQ_DEFAULTS = [
        { q: 'How much do custom neon signs cost in Australia?', a: 'Custom neon signs start from $169 for a small 30cm sign. Medium (60cm) from $219, Large (90cm) from $289, and XL (120cm) from $369. All orders include a 2-year warranty and Australian plug.' },
        { q: 'How long do LED neon signs last?', a: 'Our premium LED neon flex is rated to 50,000+ hours — over 15 years of 8-hour daily use. Unlike traditional glass neon, LED neon never needs re-gassing or specialist maintenance.' },
        { q: "Are LED neon signs safe for bedrooms and kids' rooms?", a: 'Yes. Our signs run on a safe 12V DC low-voltage driver and are cool to the touch. No mercury, no toxic gas. All signs include a certified Australian-standard (Type I) plug.' },
        { q: 'How long does delivery take across Australia?', a: 'Production takes 5–7 business days. Most customers in Sydney, Melbourne, Brisbane, and Perth receive their order within 7–10 business days. We deliver to every state and territory.' },
        { q: 'Can I design my own neon sign for free?', a: 'Absolutely. Our free Design Studio lets you type any text, choose from 6 fonts, pick from 12 LED colours, and see a live glowing preview before you order. No account required.' },
        { q: 'What is the difference between LED neon and traditional glass neon?', a: 'LED neon uses flexible silicone tubing with LED strips — same warm glow, but shatterproof, no toxic gas, 80% less energy, and far safer for indoor use.' },
        { q: 'Do you make custom neon signs for weddings?', a: 'Yes — wedding neon signs are one of our most popular products. Ceremony backdrops, reception walls, photo booths. Popular choices: couple names, "Mr & Mrs", "Better Together".' },
        { q: 'Can I get my business logo made into a neon sign?', a: 'Yes. Upload your logo and our team will recreate it as a custom LED neon sign. Ideal for shopfronts, offices, restaurants, and bars. Contact us for a custom quote.' },
    ];
    const faqItems = Array.from({ length: 8 }, (_, i) => {
        const q = faqRaw?.[`faq${i + 1}_q`];
        const a = faqRaw?.[`faq${i + 1}_a`];
        return (q && a) ? { q, a } : FAQ_DEFAULTS[i] ?? null;
    }).filter(Boolean);

    // FAQ colour rotation
    const FAQ_COLORS = ['#FF00CC','#00FFFF','#39FF14','#FF8C00','#BF5FFF','#FF6EC7','#FFFF00','#4488FF'];

    const homeSchema = [
        /* ── LocalBusiness ─────────────────────────── */
        {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': `${siteUrl}/#business`,
            name: 'Custom Neon Signs Australia',
            url: siteUrl,
            logo: `${siteUrl}/CNS aus.png`,
            image: ogImage,
            description: "Australia's leading custom LED neon sign maker. Design your personalised neon sign online with our free tool. Premium quality, 2-year warranty, ships nationwide.",
            telephone: '+61-400-000-000',
            email: 'hello@customneonsigns.com.au',
            address: { '@type': 'PostalAddress', addressCountry: 'AU', addressRegion: 'NSW', addressLocality: 'Sydney' },
            geo: { '@type': 'GeoCoordinates', latitude: -33.8688, longitude: 151.2093 },
            priceRange: '$$',
            currenciesAccepted: 'AUD',
            paymentAccepted: 'Credit Card, Visa, Mastercard, AMEX',
            areaServed: { '@type': 'Country', name: 'Australia' },
            aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '8400', bestRating: '5', worstRating: '1' },
        },
        /* ── WebSite with SearchAction ──────────────── */
        {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${siteUrl}/#website`,
            url: siteUrl,
            name: 'Custom Neon Signs Australia',
            publisher: { '@id': `${siteUrl}/#business` },
            potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/catalog?q={search_term_string}` },
                'query-input': 'required name=search_term_string',
            },
        },
        /* ── FAQPage — driven by DB content ─────────── */
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
        },
    ];

    return (
        <AppLayout>
            <Head title={sc?.home_title || 'Custom Neon Signs Australia | Buy LED Neon Signs Online'}>
                <meta name="description" content={sc?.home_description || "Australia's #1 custom LED neon sign shop. Design your own personalised neon sign from $169. 12 colours, free design tool, 2-year warranty, ships nationwide in 5–7 days."} />
                {sc?.home_keywords && <meta name="keywords" content={sc.home_keywords} />}
                <link rel="canonical" href={siteUrl + '/'} />
                <meta property="og:title" content={sc?.home_title || 'Custom Neon Signs Australia | Buy LED Neon Signs Online'} />
                <meta property="og:description" content={sc?.home_description || "Design your own personalised LED neon sign from $169. 12 colours, free design tool, 2-year warranty. Ships Australia-wide in 5–7 days."} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:image:alt" content="Custom neon sign glowing on wall — Custom Neon Signs Australia" />
                <meta property="og:url" content={siteUrl + '/'} />
                <meta name="twitter:title" content={sc?.home_title || 'Custom Neon Signs Australia | Buy LED Neon Signs Online'} />
                <meta name="twitter:description" content={sc?.home_description || "Design your own personalised LED neon sign from $169. 12 colours, free design tool, 2-year warranty."} />
                <meta name="twitter:image" content={ogImage} />
                {homeSchema.map((schema, i) => (
                    <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
                ))}
            </Head>

            {/* ══ HERO ════════════════════════════════════════ */}
            <section style={{
                minHeight: '94vh', display: 'flex', alignItems: 'center',
                position: 'relative', overflow: 'hidden',
                padding: isMobile ? '80px 16px 60px' : '100px 24px 80px',
            }}>
                {/* hero.png background */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 0,
                    backgroundImage: 'url(/cns_assets/hero.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }} />
                {/* Dark overlay to keep text readable */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 0,
                    background: 'linear-gradient(90deg, rgba(8,8,16,0.88) 0%, rgba(8,8,16,0.60) 50%, rgba(8,8,16,0.30) 100%)',
                }} />
                {/* Animated color tint on top */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 0,
                    background: `radial-gradient(ellipse 70% 80% at 20% 50%, ${heroColor}10 0%, transparent 60%)`,
                    transition: 'background 1.4s ease',
                }} />
                {/* Decorative tubes — left side */}
                <div style={{ position: 'absolute', top: '8%', left: '2%', zIndex: 0 }}><NeonTube color="#FF00CC" length={90} opacity={0.35} /></div>
                <div style={{ position: 'absolute', top: '14%', left: '3%', zIndex: 0 }}><NeonTube color="#FF00CC" length={55} opacity={0.2} /></div>
                <div style={{ position: 'absolute', bottom: '22%', left: '2%', zIndex: 0 }}><NeonTube color="#39FF14" length={80} vertical opacity={0.25} /></div>

                {/* Hero content — left-aligned */}
                <div style={{
                    maxWidth: 1200, margin: '0 auto', width: '100%',
                    zIndex: 1, position: 'relative',
                }}>
                    <div style={{ maxWidth: 700 }}>
                        {/* Badge pill */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: 24, padding: '6px 20px',
                            color: 'rgba(255,255,255,0.6)', fontSize: 12, letterSpacing: '0.12em',
                            marginBottom: 28, background: 'rgba(255,255,255,0.04)',
                        }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#39FF14', boxShadow: '0 0 8px #39FF14', display: 'inline-block' }} />
                            HANDCRAFTED IN AUSTRALIA · FREE DESIGN TOOL
                        </div>

                        {/* Headline — Bebas Neue, left-aligned */}
                        <h1 style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: 'clamp(64px, 9vw, 120px)',
                            lineHeight: 0.95,
                            margin: '0 0 8px',
                            letterSpacing: '0.03em',
                            color: '#fff',
                            textShadow: `0 0 30px ${heroColor}80, 0 0 60px ${heroColor}30`,
                            transition: 'text-shadow 1.4s ease',
                        }}>
                            {h.headline}
                        </h1>

                        <p style={{
                            color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(15px,1.4vw,18px)',
                            margin: '0 0 44px', lineHeight: 1.8, maxWidth: 480,
                            fontFamily: "'Inter', sans-serif",
                        }}>
                            {h.subheadline}
                        </p>

                        {/* Buttons — solid filled, high visibility */}
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 64 }}>
                            <Link href="/designer">
                                <button className="btn-hero-pink">{h.cta1_text}</button>
                            </Link>
                            <Link href="/catalog">
                                <button className="btn-hero-outline">{h.cta2_text}</button>
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div style={{ display: 'flex', gap: 'clamp(16px,3.5vw,44px)', flexWrap: 'wrap' }}>
                            {[
                                { icon: '/cns_assets/icons/CNS aus-06.png', label: '5–7 Day Production' },
                                { icon: '/cns_assets/icons/CNS aus-07.png', label: '2-Year Warranty' },
                                { icon: '/cns_assets/icons/CNS aus-08.png', label: 'Ships AU-Wide' },
                                { icon: '/cns_assets/icons/CNS aus-09.png', label: 'LED Neon Flex' },
                                { icon: '/cns_assets/icons/CNS aus-10.png', label: 'Safe & Certified' },
                            ].map(b => (
                                <div key={b.label} style={{ textAlign: 'center' }}>
                                    <img src={b.icon} alt={b.label} style={{ height: 40, width: 40, objectFit: 'contain', marginBottom: 5, filter: 'drop-shadow(0 0 6px rgba(255,0,204,0.5))' }} />
                                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: '0.07em', fontFamily: "'Inter', sans-serif" }}>{b.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Rainbow divider */}
            <div style={{
                height: 3,
                background: 'linear-gradient(90deg, transparent, #FF00CC 10%, #FF6EC7, #BF5FFF, #00FFFF, #39FF14, #FFFF00, #FF8C00 90%, transparent)',
                boxShadow: '0 0 14px rgba(0,255,255,0.4)',
            }} />

            {/* ══ STATS ════════════════════════════════════════ */}
            <section style={{ background: 'var(--bg-navy-1)', borderTop: '1px solid rgba(255,0,204,0.1)', borderBottom: '1px solid rgba(0,255,255,0.08)', padding: '44px 24px', position: 'relative', overflow: 'hidden' }}>
                <Sparkles count={16} colors={['#FF00CC','#BF5FFF','#00FFFF','#FFFF00']} />
                <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 32, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    {st.map(s => (
                        <div key={s.label}>
                            <div style={{ fontSize: 'clamp(1.3rem,2.5vw,2rem)', fontWeight: 900, color: s.color, textShadow: `0 0 14px ${s.color}`, marginBottom: 5 }}>{s.value}</div>
                            <div style={{ color: '#555', fontSize: 11, letterSpacing: '0.08em' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══ COLOUR PICKER STRIP ══════════════════════════ */}
            {(() => {
                const NEON_COLORS = [
                    { name: 'Warm White', hex: '#FFE580', glow: '#FFE580' },
                    { name: 'Cool White', hex: '#E8F0FF', glow: '#C8D8FF' },
                    { name: 'Pink',       hex: '#FF6EC7', glow: '#FF6EC7' },
                    { name: 'Hot Pink',   hex: '#FF00CC', glow: '#FF00CC' },
                    { name: 'Blue',       hex: '#4488FF', glow: '#4488FF' },
                    { name: 'Ice Blue',   hex: '#A8E4FF', glow: '#00FFFF' },
                    { name: 'Red',        hex: '#FF2244', glow: '#FF2244' },
                    { name: 'Orange',     hex: '#FF8C00', glow: '#FF8C00' },
                    { name: 'Yellow',     hex: '#FFFF00', glow: '#FFFF00' },
                    { name: 'Green',      hex: '#39FF14', glow: '#39FF14' },
                    { name: 'Purple',     hex: '#BF5FFF', glow: '#BF5FFF' },
                    { name: 'RGB',        hex: 'rgb',     glow: '#FF00CC' },
                ];
                const ac = activeNeonColor;
                const isRgb = ac.hex === 'rgb';
                const c = isRgb ? '#FF00CC' : (ac.hex || '#FF00CC');
                const g = ac.glow;
                return (
                    <section style={{ padding: '44px 24px 48px', background: 'var(--bg-navy-2)', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'box-shadow 0.5s ease', boxShadow: `inset 0 0 80px ${g}0a` }}>
                        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
                            {/* Left: label + swatches */}
                            <div style={{ flex: 1, minWidth: 280 }}>
                                <div style={{ color: '#FF00CC', fontWeight: 800, fontSize: 12, letterSpacing: '0.12em', textShadow: '0 0 8px #FF00CC', marginBottom: 6 }}>12 LED NEON COLOURS</div>
                                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '0 0 14px', lineHeight: 1.5 }}>Pick a colour — your sign will be hand-built in it. All shades include a 2-year warranty.</p>
                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                    {NEON_COLORS.map(col => {
                                        const isActive = ac.name === col.name;
                                        return (
                                            <div key={col.name}
                                                onClick={() => setActiveNeonColor(col)}
                                                style={{ textAlign: 'center', cursor: 'pointer', flexShrink: 0, position: 'relative', zIndex: isActive ? 2 : 1, width: 42 }}
                                            >
                                                <div style={{
                                                    width: 30, height: 30, borderRadius: '50%',
                                                    background: (col.hex && col.hex !== 'rgb') ? col.hex : 'conic-gradient(#FF0000,#FF8C00,#FFFF00,#39FF14,#00FFFF,#4488FF,#BF5FFF,#FF00CC,#FF0000)',
                                                    boxShadow: isActive ? `0 0 0 2px #07071a, 0 0 0 4px ${col.glow}, 0 0 14px ${col.glow}` : `0 0 6px ${col.glow}50`,
                                                    transform: isActive ? 'scale(1.25)' : 'scale(1)',
                                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                    margin: '0 auto 7px',
                                                }} />
                                                <div style={{
                                                    fontSize: 9,
                                                    color: isActive ? (col.hex && col.hex !== 'rgb' ? col.hex : '#FF00CC') : 'rgba(255,255,255,0.4)',
                                                    fontWeight: isActive ? 700 : 400,
                                                    textShadow: isActive ? `0 0 6px ${col.glow}` : 'none',
                                                    letterSpacing: '0.03em',
                                                    whiteSpace: 'nowrap',
                                                    transition: 'color 0.2s',
                                                }}>{col.name}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Right: reactive neon word + CTA */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexShrink: 0 }}>
                                <div style={isRgb ? {
                                    fontFamily: "'Pacifico', cursive",
                                    fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                                    background: 'linear-gradient(90deg,#FF0000,#FF8C00,#FFFF00,#39FF14,#00FFFF,#4488FF,#BF5FFF,#FF00CC)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    filter: 'drop-shadow(0 0 8px #FF00CC) drop-shadow(0 0 16px #BF5FFF)',
                                    userSelect: 'none',
                                    lineHeight: 1,
                                } : {
                                    fontFamily: "'Pacifico', cursive",
                                    fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                                    color: c,
                                    textShadow: `0 0 6px #fff8, 0 0 14px ${g}, 0 0 30px ${g}, 0 0 50px ${g}60`,
                                    transition: 'color 0.35s ease, text-shadow 0.35s ease',
                                    userSelect: 'none',
                                    lineHeight: 1,
                                }}>
                                    NEON
                                </div>
                                <Link href={isRgb ? '/designer?color=rgb' : `/designer?color=${encodeURIComponent(c)}`}>
                                    <button style={{
                                        background: 'transparent',
                                        border: `1.5px solid ${g}`,
                                        color: c,
                                        padding: '8px 20px',
                                        borderRadius: 50,
                                        fontSize: 12,
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        letterSpacing: '0.06em',
                                        boxShadow: `0 0 12px ${g}40`,
                                        textShadow: `0 0 8px ${g}`,
                                        transition: 'all 0.3s ease',
                                        whiteSpace: 'nowrap',
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = `${g}22`; e.currentTarget.style.boxShadow = `0 0 20px ${g}80`; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = `0 0 12px ${g}40`; }}
                                    >
                                        Design in {ac.name} →
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </section>
                );
            })()}

            {/* ══ GALLERY ══════════════════════════════════════ */}
            <section style={{ padding: '100px 24px', background: 'var(--bg-dark)', position: 'relative' }}>
                <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,0,204,0.06) 1px,transparent 1px)', backgroundSize:'36px 36px', pointerEvents:'none' }} />
                <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <div style={{ fontSize: 11, color: '#FF6EC7', letterSpacing: '0.15em', marginBottom: 10 }}>INSPIRATION GALLERY</div>
                        <h2 style={{ fontSize: 'clamp(1.6rem,4vw,2.6rem)', fontWeight: 800, color: '#e8e8e8', margin: '0 0 14px' }}>
                            Signs That <span style={{ color: '#FF6EC7', textShadow: '0 0 14px #FF6EC7' }}>Glow</span>
                        </h2>
                        <p style={{ color: '#666', fontSize: 14, margin: 0 }}>Real designs from real customers — bars, weddings, homes, and events.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gridAutoRows: isMobile ? '140px' : '185px', gap: 12 }}>
                        {galleryItems.map((sign, i) => (
                            <div key={i} style={{ gridColumn: sign.wide ? 'span 2' : 'span 1' }}>
                                <GalleryCard sign={sign} />
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 44 }}>
                        <Link href="/catalog"><button className="btn-neon-cyan" style={{ padding: '12px 36px', fontSize: 15 }}>View All Signs →</button></Link>
                    </div>
                </div>
            </section>

            {/* ══ BROWSE BY CATEGORY ═══════════════════════════ */}
            <section style={{ padding: '90px 24px', background: 'var(--bg-dark)', borderTop: '1px solid rgba(191,95,255,0.1)' }}>
                <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: isMd ? '1fr' : '1fr 1.35fr', gap: isMd ? 40 : 60, alignItems: 'center' }}>
                    {/* Left — heading */}
                    <div>
                        <div style={{ fontSize: 11, color: '#FF00CC', fontWeight: 800, letterSpacing: '0.15em', marginBottom: 14, textShadow: '0 0 8px #FF00CC' }}>BROWSE BY CATEGORY</div>
                        <h2 style={{ fontSize: 'clamp(1.8rem,3.8vw,2.8rem)', fontWeight: 900, color: '#fff', margin: '0 0 20px', lineHeight: 1.15, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                            What Do You Need<br />a Sign For?
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.8, maxWidth: 380 }}>
                            From wedding backdrops to kids’ rooms, business logos to bar signs — we create personalised LED neon for every space and occasion.
                        </p>
                        <Link href="/catalog" style={{ textDecoration: 'none', display: 'inline-block', marginTop: 32 }}>
                            <button className="btn-hero-outline" style={{ fontSize: 13, padding: '10px 24px' }}>Browse All Signs →</button>
                        </Link>
                    </div>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>
                        {[
                            { label: 'WEDDINGS & EVENTS', href: '/catalog?category=wedding',  img: '/cns_assets/Mock up-08.png',  overlay: 'rgba(255,0,204,0.2)' },
                            { label: 'BUSINESS SIGNAGE',  href: '/catalog?category=business', img: null, overlay: 'rgba(0,255,255,0.14)', fallbackText: 'THE RUMBLE BAR', fallbackColor: '#00FFFF', fallbackFont: 'Pacifico' },
                            { label: 'HOME & BEDROOM',    href: '/catalog?category=home',     img: '/cns_assets/Mock up-09.png',  overlay: 'rgba(191,95,255,0.16)' },
                            { label: 'SPORTS & PERSONAL', href: '/catalog?category=sports',   img: null, overlay: 'rgba(57,255,20,0.12)', fallbackText: 'GO TEAM', fallbackColor: '#39FF14', fallbackFont: "'Bebas Neue'" },
                        ].map(cat => (
                            <Link key={cat.label} href={cat.href} style={{ textDecoration: 'none' }}>
                                <div
                                    style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3', cursor: 'pointer', background: '#0d0d22', transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.025)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.6)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    {cat.img
                                        ? <img src={cat.img} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                        : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0d0d22, #12001a)' }}>
                                                <span style={{ fontFamily: cat.fallbackFont + ', sans-serif', fontSize: 'clamp(1.2rem,3vw,2rem)', color: cat.fallbackColor, textShadow: '0 0 14px ' + cat.fallbackColor + ', 0 0 30px ' + cat.fallbackColor + '60', letterSpacing: '0.05em' }}>{cat.fallbackText}</span>
                                            </div>
                                        )
                                    }
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, ' + cat.overlay + ' 0%, transparent 40%, rgba(0,0,0,0.72) 100%)' }} />
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 12px', textAlign: 'center', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                                        <span style={{ color: '#fff', fontWeight: 800, fontSize: 11, letterSpacing: '0.14em' }}>{cat.label}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ HOW IT WORKS ═════════════════════════════════ */}
            <section style={{ padding: '90px 24px', background: 'var(--bg-navy-3)', borderTop: '1px solid rgba(0,255,255,0.08)' }}>
                <div style={{ maxWidth: 1120, margin: '0 auto' }}>
                    <div style={{ marginBottom: 52 }}>
                        <div style={{ fontSize: 11, color: '#FF00CC', fontWeight: 800, letterSpacing: '0.15em', marginBottom: 14, textShadow: '0 0 8px #FF00CC' }}>SIMPLE PROCESS</div>
                        <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>How It Works</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: 0 }}>From idea to glowing reality in four simple steps.</p>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 27, left: 'calc(12.5% - 4px)', right: 'calc(12.5% - 4px)', height: 1, background: 'linear-gradient(90deg, #FF00CC80, #BF5FFF80, #00FFFF80, #39FF1480)', pointerEvents: 'none' }} />
                        <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr 1fr' : 'repeat(4,1fr)', gap: 16 }}>
                            {hiw.map(step => (
                                <div key={step.num}
                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '32px 22px 28px', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = step.color + '50'; e.currentTarget.style.boxShadow = '0 0 24px ' + step.color + '14'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    <div style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid ' + step.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.color, fontWeight: 900, fontSize: 20, marginBottom: 22, background: 'var(--bg-navy-3)', boxShadow: '0 0 14px ' + step.color + '40', position: 'relative', zIndex: 1 }}>{step.icon || step.num}</div>
                                    <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: '0.12em', color: '#fff', marginBottom: 16 }}>{step.title}</div>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                        <span style={{ color: step.color, fontWeight: 700, flexShrink: 0, lineHeight: 1.55 }}>→</span>
                                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.55 }}>{step.body}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ PRODUCT SPOTLIGHT ════════════════════════════ */}
            <section style={{ padding: '100px 24px', background: 'var(--bg-navy-4)', borderTop: '1px solid rgba(255,0,204,0.08)', position: 'relative', overflow: 'hidden' }}>
                <MeteorShower count={10} color="#FF00CC" />
                <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: isMd ? '1fr' : '1fr 1fr', gap: isMd ? 40 : 56, alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            borderRadius: 20, overflow: 'hidden',
                            boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 40px rgba(255,0,204,0.15)',
                            border: '1px solid rgba(255,0,204,0.2)',
                        }}>
                            <img
                                src="/cns_assets/Mock up-08.png"
                                alt="Custom neon sign on wall"
                                style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                            />
                        </div>
                        {/* Glow reflection */}
                        <div style={{ height: 40, marginTop: 2, borderRadius: '0 0 20px 20px', background: 'linear-gradient(180deg, rgba(255,0,204,0.14), transparent)', filter: 'blur(6px)' }} />
                    </div>
                    <div>
                        <span style={{ display: 'inline-block', padding: '3px 12px', border: '1px solid #FF00CC', borderRadius: 20, color: '#FF00CC', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', boxShadow: '0 0 8px #FF00CC', marginBottom: 20 }}>BEST SELLER</span>
                        <h2 style={{ fontSize: 'clamp(1.5rem,3.5vw,2.3rem)', fontWeight: 800, color: '#e8e8e8', margin: '0 0 16px', lineHeight: 1.25 }}>
                            Made with <span style={{ color: '#FF00CC', textShadow: '0 0 10px #FF00CC' }}>real LED</span> neon flex
                        </h2>
                        <p style={{ color: '#777', lineHeight: 1.85, marginBottom: 24, fontSize: 14 }}>
                            We use premium flexible LED neon — not cheap EL wire — for that authentic warm glow. Hand-bent on crystal-clear acrylic backing.
                        </p>
                        {[['✓', 'Flexible LED neon flex — safe & cool to touch', '#39FF14'], ['✓', 'Clear or coloured acrylic backing plate', '#00FFFF'], ['✓', 'Indoor & outdoor variants available', '#BF5FFF'], ['✓', 'AU plug included — plug in and glow', '#FF6EC7']].map(([tick, t, col]) => (
                            <div key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                                <span style={{ color: col, textShadow: `0 0 6px ${col}`, fontWeight: 800, flexShrink: 0, lineHeight: 1.6 }}>{tick}</span>
                                <span style={{ color: '#999', fontSize: 14, lineHeight: 1.6 }}>{t}</span>
                            </div>
                        ))}
                        <Link href="/catalog" style={{ display: 'inline-block', marginTop: 24 }}>
                            <button className="btn-neon-pink" style={{ fontSize: 15, padding: '12px 28px' }}>Shop Now →</button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══ REVIEWS ══════════════════════════════════════ */}
            <section style={{ padding: '100px 24px', background: 'var(--bg-dark)', borderTop: '1px solid rgba(255,255,0,0.07)', position: 'relative' }}>
                <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(135deg,rgba(255,255,255,0.015) 0,rgba(255,255,255,0.015) 1px,transparent 0,transparent 50%)', backgroundSize:'28px 28px', pointerEvents:'none' }} />
                <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <div style={{ fontSize: 11, color: '#FFFF00', letterSpacing: '0.15em', marginBottom: 10 }}>CUSTOMER REVIEWS</div>
                        <h2 style={{ color: '#e8e8e8', fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 800, margin: '0 0 12px' }}>
                            Over <span style={{ color: '#FFFF00', textShadow: '0 0 10px #FFFF00' }}>8,000</span> Happy Customers
                        </h2>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                            {Array.from({ length: 5 }).map((_, i) => <span key={i} style={{ color: '#FFFF00', textShadow: '0 0 8px #FFFF00', fontSize: 20 }}>★</span>)}
                            <span style={{ color: '#666', fontSize: 13, marginLeft: 8, alignSelf: 'center' }}>4.9 / 5.0</span>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
                        {reviews.map(r => <ReviewCard key={r.name} {...r} />)}
                    </div>
                </div>
            </section>

            {/* ══ FAQ ══════════════════════════════════════════════════════════════ */}
            <section style={{ padding: isMobile ? '60px 16px' : '100px 24px', background: 'var(--bg-navy-3)', borderTop: '1px solid rgba(191,95,255,0.1)', position: 'relative' }}>
                <div style={{ maxWidth: 860, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <div style={{ fontSize: 11, color: '#BF5FFF', letterSpacing: '0.15em', marginBottom: 10, fontWeight: 800 }}>FREQUENTLY ASKED QUESTIONS</div>
                        <h2 style={{ color: '#e8e8e8', fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 800, margin: '0 0 12px' }}>
                            Everything You Need to Know About <span style={{ color: '#BF5FFF', textShadow: '0 0 10px #BF5FFF' }}>Custom Neon Signs</span>
                        </h2>
                        <p style={{ color: '#666', fontSize: 14, margin: 0 }}>Answers to the most common questions about LED neon signs in Australia.</p>
                    </div>
                    {faqItems.map((item, i) => (
                        <FaqItem key={i} question={item.q} answer={item.a} color={FAQ_COLORS[i % FAQ_COLORS.length]} />
                    ))}
                </div>
            </section>

            {/* ══ CONTACT US ════════════════════════════════════════════════════════ */}
            <section style={{ padding: isMobile ? '60px 16px' : '100px 24px', background: 'var(--bg-navy-5)', borderTop: '1px solid rgba(0,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                <FloatingParticles count={12} colors={['#00FFFF','#FF00CC','#BF5FFF']} />
                <div style={{ maxWidth: 1060, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <div style={{ fontSize: 11, color: '#00FFFF', letterSpacing: '0.15em', marginBottom: 10 }}>GET IN TOUCH</div>
                        <h2 style={{ color: '#e8e8e8', fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 800, margin: '0 0 12px' }}>
                            Have a question? <span style={{ color: '#00FFFF', textShadow: '0 0 10px #00FFFF' }}>We're here.</span>
                        </h2>
                        <p style={{ color: '#666', fontSize: 14, margin: 0 }}>We respond within 24 hours. Let's bring your vision to life.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: isMd ? '1fr' : '1fr 1.5fr', gap: isMd ? 40 : 56, alignItems: 'start' }}>
                        {/* Left info */}
                        <div>
                            {[
                                { icon: '📍', label: 'Location', value: 'Australia-Wide Delivery', color: '#FF00CC' },
                                { icon: '⏰', label: 'Business Hours', value: 'Mon–Fri: 9am – 5pm AEST', color: '#00FFFF' },
                                { icon: '📧', label: 'Email', value: 'hello@customneonsigns.com.au', color: '#BF5FFF' },
                                { icon: '📞', label: 'Phone', value: '+61 400 000 000', color: '#39FF14' },
                            ].map(info => (
                                <div key={info.label} style={{ display: 'flex', gap: 16, marginBottom: 28, alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: 46, height: 46, borderRadius: 10, flexShrink: 0,
                                        background: `${info.color}14`, border: `1px solid ${info.color}30`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 18, boxShadow: `0 0 12px ${info.color}18`,
                                    }}>{info.icon}</div>
                                    <div>
                                        <div style={{ color: info.color, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 3, textShadow: `0 0 6px ${info.color}` }}>{info.label.toUpperCase()}</div>
                                        <div style={{ color: '#ccc', fontSize: 14 }}>{info.value}</div>
                                    </div>
                                </div>
                            ))}
                            <div style={{ marginTop: 8, display: 'flex', gap: 12 }}>
                                <NeonTube color="#FF00CC" length={60} opacity={0.4} />
                                <NeonTube color="#00FFFF" length={40} opacity={0.3} />
                                <NeonTube color="#BF5FFF" length={80} opacity={0.35} />
                            </div>
                        </div>

                        {/* Right: form */}
                        <div style={{
                            background: 'rgba(255,255,255,0.03)', borderRadius: 16,
                            border: '1px solid rgba(0,255,255,0.12)',
                            padding: isMobile ? '24px 16px' : '36px 32px',
                            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14, marginBottom: 14 }}>
                                {['Your Name', 'Email Address'].map(ph => (
                                    <input key={ph} type="text" placeholder={ph} style={{
                                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,255,255,0.15)',
                                        borderRadius: 8, padding: '12px 16px', color: '#e0e0e0',
                                        fontSize: 14, outline: 'none', fontFamily: "'Inter', sans-serif",
                                        transition: 'border-color 0.2s',
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'rgba(0,255,255,0.5)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(0,255,255,0.15)'}
                                    />
                                ))}
                            </div>
                            <input type="text" placeholder="Phone (optional)" style={{
                                width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,255,255,0.15)',
                                borderRadius: 8, padding: '12px 16px', color: '#e0e0e0',
                                fontSize: 14, outline: 'none', marginBottom: 14, fontFamily: "'Inter', sans-serif",
                                boxSizing: 'border-box', transition: 'border-color 0.2s',
                            }}
                            onFocus={e => e.target.style.borderColor = 'rgba(0,255,255,0.5)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(0,255,255,0.15)'}
                            />
                            <select style={{
                                width: '100%', background: '#0a0d1e', border: '1px solid rgba(0,255,255,0.15)',
                                borderRadius: 8, padding: '12px 16px', color: '#888',
                                fontSize: 14, outline: 'none', marginBottom: 14, fontFamily: "'Inter', sans-serif",
                                boxSizing: 'border-box',
                            }}>
                                <option value="">What can we help you with?</option>
                                <option>Custom sign enquiry</option>
                                <option>Order status</option>
                                <option>Design help</option>
                                <option>Other</option>
                            </select>
                            <textarea rows={4} placeholder="Tell us about your project or question..." style={{
                                width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,255,255,0.15)',
                                borderRadius: 8, padding: '12px 16px', color: '#e0e0e0',
                                fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: "'Inter', sans-serif",
                                boxSizing: 'border-box', marginBottom: 20, transition: 'border-color 0.2s',
                            }}
                            onFocus={e => e.target.style.borderColor = 'rgba(0,255,255,0.5)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(0,255,255,0.15)'}
                            />
                            <button className="btn-hero-pink" style={{ width: '100%', fontSize: 15 }}>
                                Send Message →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ FINAL CTA ════════════════════════════════════ */}
            <section style={{ padding: '80px 24px 110px' }}>
                <div style={{
                    maxWidth: 820, margin: '0 auto', textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(255,0,204,0.07), rgba(0,255,255,0.04), rgba(191,95,255,0.05))',
                    border: '1px solid rgba(255,0,204,0.18)',
                    borderRadius: 24, padding: 'clamp(48px,8vw,88px) 40px',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <Sparkles count={20} colors={['#FF00CC','#BF5FFF','#00FFFF','#FF6EC7','#FFFF00']} />
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #FF00CC, #BF5FFF, #00FFFF)', boxShadow: '0 0 12px rgba(0,255,255,0.4)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #00FFFF, #BF5FFF, #FF00CC)', boxShadow: '0 0 12px rgba(255,0,204,0.4)' }} />
                    <div style={{ marginBottom: 4 }}>
                        <NeonSVGSign text="Ready to Glow?" color="#FF00CC" size={54} flicker />
                    </div>
                    <p style={{ color: '#777', fontSize: 16, margin: '4px auto 40px', maxWidth: 460, lineHeight: 1.75 }}>
                        Use our free design tool to create your sign in minutes. No commitment — just pure neon magic.
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/designer">
                            <button className="btn-neon-pink" style={{ fontSize: 16, padding: '14px 40px', fontWeight: 700 }}>✦ Start Designing — It's Free</button>
                        </Link>
                        <Link href="/catalog">
                            <button className="btn-neon-cyan" style={{ fontSize: 16, padding: '14px 32px' }}>Shop Pre-built Signs</button>
                        </Link>
                    </div>
                </div>
            </section>

        </AppLayout>
    );
}
