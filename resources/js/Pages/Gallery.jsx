import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const CATEGORIES = ['All', 'Business Signs', 'Wedding & Events', 'Home & Bedroom', 'Bar & Hospitality', 'Custom Text'];

const GALLERY_ITEMS = [
    { id: 1, category: 'Business Signs',      color: '#FF00CC', label: 'Salon Neon',       desc: 'Pink fuchsia on frosted acrylic',       emoji: '✂️'  },
    { id: 2, category: 'Wedding & Events',    color: '#FFE580', label: 'Mr & Mrs',          desc: 'Warm white wedding reception sign',     emoji: '💍'  },
    { id: 3, category: 'Bar & Hospitality',   color: '#39FF14', label: 'Open Sign',         desc: 'Neon green tube on black acrylic',      emoji: '🍸'  },
    { id: 4, category: 'Home & Bedroom',      color: '#BF5FFF', label: 'Good Vibes Only',   desc: 'Purple glow, clear acrylic',            emoji: '✨'  },
    { id: 5, category: 'Custom Text',         color: '#00FFFF', label: 'Your Name Here',    desc: 'Custom script lettering in cyan',       emoji: '✏️'  },
    { id: 6, category: 'Business Signs',      color: '#FF8C00', label: 'Coffee Shop',       desc: 'Orange warm tone on white acrylic',    emoji: '☕'  },
    { id: 7, category: 'Wedding & Events',    color: '#FF6EC7', label: 'Just Married',      desc: 'Script font, hot pink glow',            emoji: '💒'  },
    { id: 8, category: 'Bar & Hospitality',   color: '#FF2244', label: 'Bar & Grill',       desc: 'Bold red neon on frosted acrylic',      emoji: '🔥'  },
    { id: 9, category: 'Home & Bedroom',      color: '#FF00CC', label: 'Be Yourself',       desc: 'Fuchsia bedroom wall sign',             emoji: '🌸'  },
    { id: 10, category: 'Custom Text',        color: '#FFFF00', label: 'Dream Big',         desc: 'Yellow neon on black panel',            emoji: '⭐'  },
    { id: 11, category: 'Business Signs',     color: '#4488FF', label: 'Tech Studio',       desc: 'Electric blue on clear acrylic',        emoji: '💻'  },
    { id: 12, category: 'Bar & Hospitality',  color: '#39FF14', label: 'Cheers!',           desc: 'Glowing green bar sign',                emoji: '🥂'  },
];

function GalleryCard({ item, real }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                borderRadius: 14,
                overflow: 'hidden',
                position: 'relative',
                background: '#0a0820',
                border: hovered ? '1px solid ' + item.color + '60' : '1px solid rgba(255,255,255,0.06)',
                boxShadow: hovered ? '0 8px 40px ' + item.color + '30' : '0 4px 20px rgba(0,0,0,0.4)',
                transition: 'all 0.3s ease',
                transform: hovered ? 'translateY(-4px)' : 'none',
                cursor: 'pointer',
            }}
        >
            {/* Image area */}
            {real ? (
                <img src={real} alt={item.label} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
            ) : (
                <div style={{
                    aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, #07071a 0%, #0f0f2a 100%)',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{
                        textAlign: 'center',
                        filter: 'drop-shadow(0 0 12px ' + item.color + ') drop-shadow(0 0 28px ' + item.color + '80)',
                    }}>
                        <div style={{ fontSize: 42, marginBottom: 8 }}>{item.emoji}</div>
                        <div style={{
                            fontFamily: "'Pacifico', cursive", fontSize: 22, color: item.color,
                            textShadow: '0 0 15px ' + item.color + ', 0 0 30px ' + item.color + '80',
                        }}>{item.label}</div>
                    </div>
                    {/* subtle glow orb */}
                    <div style={{
                        position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, ' + item.color + '0a 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />
                </div>
            )}

            {/* Info */}
            <div style={{ padding: '12px 14px' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#eee', marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: '#555', marginBottom: 6 }}>{item.desc}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, boxShadow: '0 0 6px ' + item.color }} />
                    <span style={{ fontSize: 10, color: '#444' }}>{item.category}</span>
                </div>
            </div>

            {/* Hover CTA */}
            {hovered && (
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 100%)',
                    padding: '24px 14px 14px', display: 'flex', gap: 8,
                    animation: 'fadeInDown 0.15s ease',
                }}>
                    <Link href="/designer" style={{ textDecoration: 'none', flex: 1 }}>
                        <button style={{
                            width: '100%', padding: '8px', borderRadius: 8, fontWeight: 700, fontSize: 12,
                            background: 'linear-gradient(135deg, #FF00CC, #FF6EC7)', border: 'none', color: '#000', cursor: 'pointer',
                        }}>Make Mine</button>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function Gallery({ items = [] }) {
    const { seo, seoContent: sc } = usePage().props;
    // Fall back to static data when DB is empty (dev convenience)
    const galleryData = items.length > 0 ? items : GALLERY_ITEMS;
    const [activeCategory, setActiveCategory] = useState('All');

    const filtered = activeCategory === 'All'
        ? galleryData
        : galleryData.filter(i => i.category === activeCategory);

    const realImages = [
        '/cns_assets/Mock up-08.png',
        '/cns_assets/Mock up-09.png',
    ];

    return (
        <AppLayout>
            <Head title={sc?.gallery_title || 'Custom Neon Sign Gallery & Ideas | Custom Neon Signs Australia'}>
                <meta name="description" content={sc?.gallery_description || 'Browse real custom neon sign photos for inspiration. Neon signs for weddings, bedrooms, bars, businesses, and events \u2014 all handcrafted in Australia. Get inspired and design yours today.'} />
                <link rel="canonical" href={seo.appUrl + '/gallery'} />
                <meta property="og:title" content={sc?.gallery_title || 'Custom Neon Sign Gallery & Ideas | Custom Neon Signs Australia'} />
                <meta property="og:description" content={sc?.gallery_description || 'Real custom neon sign photos for bars, weddings, homes, and events.'} />
                <meta property="og:image" content={seo.ogImage} />
                <meta property="og:url" content={seo.appUrl + '/gallery'} />
            </Head>

            {/* Hero */}
            <div style={{
                background: 'linear-gradient(180deg, #0a0820 0%, #07071a 100%)',
                borderBottom: '1px solid rgba(255,0,204,0.1)',
                padding: 'clamp(40px,6vw,80px) 24px 40px',
                textAlign: 'center',
            }}>
                <div style={{ color: '#00FFFF', fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', marginBottom: 12 }}>OUR WORK</div>
                <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(40px,7vw,80px)', letterSpacing: '0.06em', color: '#fff', margin: 0, lineHeight: 1 }}>
                    Neon Sign <span style={{ color: '#FF00CC', textShadow: '0 0 30px #FF00CC, 0 0 60px #FF00CC60' }}>Gallery</span>
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 14, fontSize: 15, maxWidth: 480, margin: '14px auto 0' }}>
                    Real signs. Real glow. Every piece custom-made in Australia.
                </p>
            </div>

            {/* Filter strip */}
            <div style={{ background: '#09091a', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '14px 24px', overflowX: 'auto' }}>
                <div style={{ display: 'flex', gap: 8, maxWidth: 1200, margin: '0 auto', width: 'max-content' }}>
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                            padding: '7px 18px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                            background: activeCategory === cat ? 'rgba(255,0,204,0.15)' : 'transparent',
                            border: activeCategory === cat ? '1px solid rgba(255,0,204,0.5)' : '1px solid rgba(255,255,255,0.08)',
                            color: activeCategory === cat ? '#FF00CC' : '#555',
                            transition: 'all 0.18s',
                        }}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div style={{ maxWidth: 1240, margin: '0 auto', padding: '40px 24px 80px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                    {filtered.map((item, i) => (
                        <GalleryCard key={item.id} item={item} real={i < 2 ? realImages[i] : null} />
                    ))}
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'center', marginTop: 64, padding: '40px 24px', background: 'rgba(255,0,204,0.04)', borderRadius: 20, border: '1px solid rgba(255,0,204,0.12)' }}>
                    <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 32, color: '#fff', letterSpacing: '0.05em', marginBottom: 8 }}>
                        Ready to Make <span style={{ color: '#FF00CC' }}>Yours?</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 20, fontSize: 14 }}>Custom text signs from $169 · Logo signs from $249</p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/designer" style={{ textDecoration: 'none' }}>
                            <button className="btn-hero-pink" style={{ padding: '12px 28px', fontSize: 14, fontWeight: 700 }}>✦ Design Your Sign</button>
                        </Link>
                        <Link href="/logo-upload" style={{ textDecoration: 'none' }}>
                            <button className="btn-hero-outline" style={{ padding: '12px 28px', fontSize: 14, fontWeight: 700 }}>📤 Upload Logo</button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
