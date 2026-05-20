import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const STATS = [
    { value: '5,000+', label: 'Signs Delivered',      color: '#FF00CC' },
    { value: '100%',   label: 'Custom Made',           color: '#00FFFF' },
    { value: '24 hrs', label: 'Proof Turnaround',      color: '#BF5FFF' },
    { value: '5★',     label: 'Average Review',        color: '#39FF14' },
];

const VALUES = [
    { icon: '🇦🇺', title: 'Australian Made',  body: 'Every sign is manufactured locally in our Sydney studio. We use premium LED neon flex and laser-cut acrylic boards sourced from verified suppliers.' },
    { icon: '🎨', title: 'Design First',      body: 'Our in-house designers review every order. You receive a digital proof before we cut a single piece — and revisions are always free.' },
    { icon: '⚡', title: 'Built to Last',     body: 'Our LED neon flex consumes 60% less power than glass neon, runs cool to touch, and is rated for 50,000+ hours of continuous glow.' },
    { icon: '🚚', title: 'Australia-Wide',    body: 'We ship every sign nationwide with tracked express freight, padded custom packaging, and full transit insurance included.' },
    { icon: '💬', title: 'Real Support',      body: "Chat, email, or call — our team responds within 2 hours during business hours. We don't offshore our support." },
    { icon: '🔄', title: 'Happy Guarantee',  body: "Not happy with your proof? We revise it until you love it. Product defective on arrival? We replace it, no questions asked." },
];

function ValueCard({ v }) {
    return (
        <div style={{
            padding: '24px 22px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14,
            transition: 'all 0.2s',
        }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,0,204,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,0,204,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
        >
            <div style={{ fontSize: 32, marginBottom: 12 }}>{v.icon}</div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#eee', marginBottom: 8 }}>{v.title}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.7 }}>{v.body}</div>
        </div>
    );
}

export default function About({ content = {} }) {
    const { seo, seoContent: sc } = usePage().props;
    const headline = content.headline ?? 'We Make Things Glow';
    const mission  = content.mission  ?? 'Premium neon at an accessible price, with zero compromises on quality.';
    const body     = content.body     ?? 'Custom Neon Signs Australia was founded by a team of designers and makers who believed every space deserves a statement. We craft bespoke LED neon signs for homes, businesses, and events — all from our Sydney studio.';

    return (
        <AppLayout>
            <Head title={sc?.about_title || 'About Custom Neon Signs Australia | Handcrafted LED Neon'}>
                <meta name="description" content={sc?.about_description || "Learn about Custom Neon Signs Australia \u2014 the team behind Australia's premium LED neon signs. Handcrafted in Sydney, 8,400+ signs delivered, 4.9-star rated, 2-year warranty."} />
                <link rel="canonical" href={seo.appUrl + '/about'} />
                <meta property="og:title" content={sc?.about_title || 'About Custom Neon Signs Australia | Handcrafted LED Neon'} />
                <meta property="og:description" content={sc?.about_description || "The team behind Australia's premium LED neon signs. 8,400+ signs delivered, 4.9-star rated."} />
                <meta property="og:url" content={seo.appUrl + '/about'} />
            </Head>

            {/* Hero */}
            <div style={{
                background: 'linear-gradient(135deg, #0a0820 0%, #07071a 60%, #0a0a1a 100%)',
                borderBottom: '1px solid rgba(255,0,204,0.1)',
                padding: 'clamp(50px,8vw,100px) 24px 60px',
                textAlign: 'center',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,0,204,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ color: '#FF00CC', fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', marginBottom: 12 }}>OUR STORY</div>
                <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(40px,7vw,88px)', letterSpacing: '0.04em', color: '#fff', margin: '0 0 16px', lineHeight: 1 }}>
                    {headline}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, maxWidth: 580, margin: '0 auto', lineHeight: 1.8 }}>
                    {body}
                </p>
            </div>

            {/* Stats */}
            <div style={{ background: '#09091a', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ maxWidth: 960, margin: '0 auto', padding: '36px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 0 }}>
                    {STATS.map((s, i) => (
                        <div key={s.label} style={{ textAlign: 'center', padding: '20px 12px', borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 42, color: s.color, textShadow: '0 0 20px ' + s.color + '80', letterSpacing: '0.04em', lineHeight: 1 }}>{s.value}</div>
                            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 6, fontWeight: 600, letterSpacing: '0.08em' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mission */}
            <div style={{ maxWidth: 960, margin: '0 auto', padding: '60px 24px 0' }}>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(255,0,204,0.06), rgba(0,255,255,0.04))',
                    border: '1px solid rgba(255,0,204,0.15)',
                    borderRadius: 20, padding: '36px 40px',
                    display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap',
                }}>
                    <div style={{ flex: '1 1 300px' }}>
                        <div style={{ color: '#FF00CC', fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', marginBottom: 10 }}>OUR MISSION</div>
                        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, color: '#fff', lineHeight: 1.2, marginBottom: 14, letterSpacing: '0.04em' }}>
                            {mission}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.8 }}>
                            We saw too many businesses importing low-quality signs from overseas with long lead times and poor support. So we built something better — a local team that cares about your sign as much as you do.
                        </div>
                    </div>
                    <div style={{ flex: '0 0 auto' }}>
                        <img src="/CNS aus.png" alt="CNS Australia" style={{ height: 80, filter: 'drop-shadow(0 0 20px rgba(255,0,204,0.6))', opacity: 0.9 }} />
                    </div>
                </div>
            </div>

            {/* Values */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 36, color: '#fff', letterSpacing: '0.06em' }}>
                        Why Choose <span style={{ color: '#00FFFF', textShadow: '0 0 20px #00FFFF80' }}>CNS?</span>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                    {VALUES.map(v => <ValueCard key={v.title} v={v} />)}
                </div>
            </div>

            {/* Process section */}
            <div style={{ background: '#09091a', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '60px 24px' }}>
                <div style={{ maxWidth: 860, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 36, color: '#fff', letterSpacing: '0.06em' }}>
                            Our <span style={{ color: '#BF5FFF', textShadow: '0 0 20px #BF5FFF80' }}>Process</span>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
                        {[
                            { step: '01', title: 'You Design',       body: 'Use our text designer, upload a logo, or browse our catalogue.',           color: '#FF00CC' },
                            { step: '02', title: 'We Proof',          body: 'Our designers produce a digital proof within 24 hours.',                  color: '#00FFFF' },
                            { step: '03', title: 'You Approve',       body: 'Review and request any changes — all revisions are free.',                color: '#BF5FFF' },
                            { step: '04', title: 'We Manufacture',    body: 'Cut, bent, and tested in our Sydney workshop.',                           color: '#39FF14' },
                            { step: '05', title: 'We Deliver',        body: 'Packed and shipped with care, tracked to your door.',                    color: '#FF8C00' },
                        ].map(p => (
                            <div key={p.step} style={{ textAlign: 'center', padding: '20px 10px' }}>
                                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 44, color: p.color, textShadow: '0 0 15px ' + p.color + '60', opacity: 0.7, lineHeight: 1, marginBottom: 8 }}>{p.step}</div>
                                <div style={{ fontWeight: 800, fontSize: 14, color: '#eee', marginBottom: 6 }}>{p.title}</div>
                                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, lineHeight: 1.6 }}>{p.body}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 32, color: '#fff', letterSpacing: '0.04em', marginBottom: 8 }}>
                    Let's Make <span style={{ color: '#FF00CC', textShadow: '0 0 20px #FF00CC' }}>Something Shine</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Start designing today — proofs in 24 hours.</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/designer" style={{ textDecoration: 'none' }}>
                        <button className="btn-hero-pink" style={{ padding: '13px 32px', fontSize: 15, fontWeight: 700 }}>✦ Design Yours Now</button>
                    </Link>
                    <Link href="/faq" style={{ textDecoration: 'none' }}>
                        <button className="btn-hero-outline" style={{ padding: '13px 32px', fontSize: 15, fontWeight: 700 }}>Read the FAQ</button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
