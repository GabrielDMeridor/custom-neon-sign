import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const FAQ_DATA = [
    {
        category: 'Ordering',
        color: '#FF00CC',
        items: [
            { q: 'How do I place an order?',          a: "You can design a custom text sign in our Design Studio, upload your logo via the Logo to Neon page, or browse our catalogue of pre-built signs. Add to cart and checkout — we'll contact you to confirm your design before production starts." },
            { q: 'Can I see a proof before it\'s made?', a: 'Yes — every order includes a free digital proof. Our designers will produce it within 24 hours of your order and email it to you for approval. We won\'t start manufacturing until you say the word.' },
            { q: 'How many revisions can I request?', a: 'As many as you need. Revisions are always free. We want you to love your sign before it\'s made.' },
            { q: 'Can I order a custom size?',        a: 'Yes. Contact us with your requirements and we can quote for any custom size outside our standard range.' },
            { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and Afterpay. All transactions are secured via SSL.' },
        ],
    },
    {
        category: 'Design & Artwork',
        color: '#00FFFF',
        items: [
            { q: 'What file formats can I upload for a logo sign?', a: 'We accept PNG, JPG, and SVG. For best results, upload a high-resolution PNG with a transparent background. If you have an AI or EPS file, send it to us via email and our designers will use it directly.' },
            { q: 'Can I use any font?',                a: 'Our Design Studio includes 6 popular neon-friendly fonts. If you have a specific font in mind, mention it in the order notes and we\'ll do our best to match it.' },
            { q: 'Can my logo be made into a neon sign?', a: 'Yes! Our Logo to Neon service lets you upload any artwork. Our team hand-traces it into LED neon flex paths. Simple, clean logos with solid outlines work best. We\'ll let you know if any element can\'t be reproduced in neon.' },
            { q: 'What is acrylic backing?',          a: 'Every sign is mounted on a laser-cut acrylic panel. We offer clear, frosted, white, and black options. The backing gives the sign its shape and provides a surface for mounting.' },
        ],
    },
    {
        category: 'Product & Quality',
        color: '#BF5FFF',
        items: [
            { q: 'Is it real glass neon?',            a: 'No — we use premium LED neon flex tube, which is safer, more durable, and consumes 60% less energy than traditional glass neon. It produces the same warm glow without the fragility or high running costs.' },
            { q: 'How long will my sign last?',       a: 'Our LED neon flex is rated for 50,000+ hours of continuous use — that\'s over 17 years if you ran it 8 hours a day. The acrylic backing is UV-resistant and will not yellow.' },
            { q: 'Are the signs safe to touch?',      a: 'Yes. LED neon flex runs cool to the touch — unlike glass neon which generates heat. Our signs are safe around children and pets.' },
            { q: 'Can I use my sign outdoors?',       a: 'Our standard signs are designed for indoor use. We offer an optional outdoor-rated power supply and waterproofing kit (+$30). Select "Outdoor Use" in the designer or mention it in your order.' },
            { q: 'Does it flicker?',                  a: 'No — unless you turn on our "Flicker Effect" option in the designer, which adds a realistic vintage flicker for aesthetic purposes. By default, all signs output a steady, stable glow.' },
        ],
    },
    {
        category: 'Shipping & Delivery',
        color: '#39FF14',
        items: [
            { q: 'How long does delivery take?',     a: 'After proof approval, manufacturing takes 5–7 business days. Express delivery is 1–3 business days nationally. Standard is 3–7 business days. Total turnaround is typically 10–14 days from order to door.' },
            { q: 'Do you ship internationally?',     a: 'We currently ship within Australia only. International orders may be available on request — contact us and we\'ll check freight options for your location.' },
            { q: 'Is shipping free?',                a: 'Yes! We offer free standard shipping on all orders over $200. For orders under $200, flat-rate shipping is $15 nationally.' },
            { q: 'How is the sign packaged?',        a: 'Every sign ships in a custom-cut foam-lined box with corner protectors and a "Fragile — This Side Up" label. We include full transit insurance for your peace of mind.' },
            { q: 'My sign arrived damaged — what do I do?', a: 'Take photos of the packaging and the sign, then email us at support@customneonsigns.com.au within 48 hours of delivery. We\'ll arrange a free replacement or refund immediately.' },
        ],
    },
];

function AccordionItem({ item, color }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            overflow: 'hidden',
        }}>
            <button
                onClick={() => setOpen(v => !v)}
                style={{
                    width: '100%', padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, textAlign: 'left',
                }}
            >
                <span style={{ color: open ? color : '#ccc', fontWeight: 700, fontSize: 14, transition: 'color 0.2s' }}>{item.q}</span>
                <span style={{ fontSize: 18, color: open ? color : '#444', transition: 'all 0.25s', transform: open ? 'rotate(45deg)' : 'rotate(0)', display: 'inline-block', flexShrink: 0 }}>+</span>
            </button>
            <div style={{
                maxHeight: open ? 300 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.3s ease',
            }}>
                <div style={{ padding: '0 20px 18px', color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.8 }}>
                    {item.a}
                </div>
            </div>
        </div>
    );
}

export default function Faq() {
    const [activeCategory, setActiveCategory] = useState(FAQ_DATA[0].category);
    const section = FAQ_DATA.find(s => s.category === activeCategory);

    return (
        <AppLayout>
            <Head title="FAQ — Custom Neon Signs Australia" />

            {/* Hero */}
            <div style={{
                background: 'linear-gradient(180deg, #0a0820 0%, #07071a 100%)',
                borderBottom: '1px solid rgba(255,0,204,0.1)',
                padding: 'clamp(40px,6vw,80px) 24px 40px',
                textAlign: 'center',
            }}>
                <div style={{ color: '#BF5FFF', fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', marginBottom: 12 }}>SUPPORT</div>
                <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(40px,7vw,80px)', letterSpacing: '0.06em', color: '#fff', margin: 0, lineHeight: 1 }}>
                    Frequently Asked <span style={{ color: '#BF5FFF', textShadow: '0 0 30px #BF5FFF, 0 0 60px #BF5FFF60' }}>Questions</span>
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 14, fontSize: 15, maxWidth: 480, margin: '14px auto 0' }}>
                    Everything you need to know about our neon signs.
                </p>
            </div>

            <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>

                {/* Category tabs */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
                    {FAQ_DATA.map(s => (
                        <button key={s.category} onClick={() => setActiveCategory(s.category)} style={{
                            padding: '8px 20px', borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                            background: activeCategory === s.category ? 'rgba(255,0,204,0.12)' : 'rgba(255,255,255,0.03)',
                            border: activeCategory === s.category ? '1px solid rgba(255,0,204,0.45)' : '1px solid rgba(255,255,255,0.08)',
                            color: activeCategory === s.category ? '#FF00CC' : '#666',
                            transition: 'all 0.18s',
                        }}>
                            {s.category}
                        </button>
                    ))}
                </div>

                {/* Accordion */}
                {section && (
                    <div style={{ background: '#09091a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
                        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: section.color, boxShadow: '0 0 8px ' + section.color }} />
                            <span style={{ color: section.color, fontWeight: 700, fontSize: 12, letterSpacing: '0.1em' }}>{section.category.toUpperCase()}</span>
                        </div>
                        {section.items.map((item, i) => (
                            <AccordionItem key={i} item={item} color={section.color} />
                        ))}
                    </div>
                )}

                {/* Contact CTA */}
                <div style={{
                    marginTop: 48, padding: '28px 32px',
                    background: 'linear-gradient(135deg, rgba(255,0,204,0.06), rgba(0,255,255,0.04))',
                    border: '1px solid rgba(255,0,204,0.15)', borderRadius: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
                }}>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: 16, color: '#eee', marginBottom: 4 }}>Still have questions?</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Our team replies within 2 hours on business days.</div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <a href="mailto:hello@customneonsigns.com.au" style={{ textDecoration: 'none' }}>
                            <button className="btn-hero-outline" style={{ padding: '10px 22px', fontSize: 13, fontWeight: 700 }}>Email Us</button>
                        </a>
                        <Link href="/designer" style={{ textDecoration: 'none' }}>
                            <button className="btn-hero-pink" style={{ padding: '10px 22px', fontSize: 13, fontWeight: 700 }}>Design Yours</button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
