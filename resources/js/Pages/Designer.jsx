import React, { useState, useEffect, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Input, Slider, Tooltip, message, Switch } from 'antd';
import { ShoppingCartOutlined, AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined, FontSizeOutlined, BgColorsOutlined, PictureOutlined, ColumnWidthOutlined, ReloadOutlined } from '@ant-design/icons';
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
    { hex: '#FF2244', name: 'Neon Red' },
    { hex: '#4488FF', name: 'Electric Blue' },
    { hex: '#FFE580', name: 'Warm White' },
    { hex: '#E8F0FF', name: 'Cool White' },
    { hex: '#FFFFFF', name: 'Pure White' },
];

const FONTS = [
    { value: "'Pacifico', cursive",         label: 'Pacifico',       preview: 'Script'  },
    { value: "'Lobster', cursive",          label: 'Lobster',        preview: 'Retro'   },
    { value: "'Dancing Script', cursive",   label: 'Dancing Script', preview: 'Elegant' },
    { value: "'Oswald', sans-serif",        label: 'Oswald',         preview: 'Bold'    },
    { value: "'Bebas Neue', cursive",       label: 'Bebas Neue',     preview: 'Display' },
    { value: "'Rajdhani', sans-serif",      label: 'Rajdhani',       preview: 'Modern'  },
];

const SOLID_BACKGROUNDS = [
    { value: '#000000',     label: 'Black',         preview: '#000'    },
    { value: '#080810',     label: 'Dark Navy',     preview: '#080810' },
    { value: '#1a0a2e',     label: 'Deep Purple',   preview: '#1a0a2e' },
    { value: '#0a1628',     label: 'Midnight Blue', preview: '#0a1628' },
    { value: '#1a0000',     label: 'Dark Red',      preview: '#1a0000' },
    { value: '#FFFFFF',     label: 'White',         preview: '#fff'    },
    { value: 'brick',       label: 'Brick Wall',    preview: '#8B4513' },
    { value: 'wood',        label: 'Dark Wood',     preview: '#3d2008' },
    { value: 'transparent', label: 'Transparent',   preview: 'transparent' },
];

const SCENE_BACKGROUNDS = [
    { value: '/cns_assets/cns-bg/1d27593d1b8d99e14d1da2c96b2d13d1.jpg', label: 'Scene 1' },
    { value: '/cns_assets/cns-bg/3670e1ff1e217d44c6268944f6849c12.jpg', label: 'Scene 2' },
    { value: '/cns_assets/cns-bg/6e40aca5f25fa2f876fc901021993e3b.jpg', label: 'Scene 3' },
    { value: '/cns_assets/cns-bg/71f737576b125e4485031f3feb0fe311.jpg', label: 'Scene 4' },
    { value: '/cns_assets/cns-bg/88c1a2ccbcedf4f48e338f577bc173d7.jpg', label: 'Scene 5' },
    { value: '/cns_assets/cns-bg/b5aaf81f70f00d272cfb2f66d8fbdc1f.jpg', label: 'Scene 6' },
    { value: '/cns_assets/cns-bg/b7373f686ac1f579e4923be99a51cd09.jpg', label: 'Scene 7' },
];

const SIZES = [
    { value: 'Small (30cm)',  label: 'Small',  dim: '30 cm',  extra: 0   },
    { value: 'Medium (60cm)', label: 'Medium', dim: '60 cm',  extra: 50  },
    { value: 'Large (90cm)',  label: 'Large',  dim: '90 cm',  extra: 120 },
    { value: 'XL (120cm)',    label: 'XL',     dim: '120 cm', extra: 200 },
];

const ACRYLIC = [
    { value: 'clear',   label: 'Clear',   color: 'rgba(255,255,255,0.04)' },
    { value: 'white',   label: 'White',   color: 'rgba(255,255,255,0.22)' },
    { value: 'black',   label: 'Black',   color: 'rgba(0,0,0,0.55)'       },
    { value: 'frosted', label: 'Frosted', color: 'rgba(200,220,255,0.08)' },
];

const RGB_CYCLE = ['#FF00CC','#FF8C00','#FFFF00','#39FF14','#00FFFF','#4488FF','#BF5FFF'];
const BASE_PRICE = 169;

const SIZE_DISPLAY = {
    'Small (30cm)':  { maxW: 300, widthLabel: '30 cm' },
    'Medium (60cm)': { maxW: 460, widthLabel: '60 cm' },
    'Large (90cm)':  { maxW: 620, widthLabel: '90 cm' },
    'XL (120cm)':    { maxW: 780, widthLabel: '120 cm' },
};

const TABS = [
    { key: 'text',       label: 'TEXT'  },
    { key: 'style',      label: 'STYLE' },
    { key: 'background', label: 'BG'   },
    { key: 'size',       label: 'SIZE'  },
];

function SectionLabel({ children }) {
    return (
        <div style={{ fontSize: 10, color: '#555', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 8, marginTop: 2 }}>
            {children}
        </div>
    );
}

function buildBgStyle(bg) {
    if (bg.startsWith('/cns_assets/')) {
        return { backgroundImage: 'url(' + bg + ')', backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    if (bg === 'brick') {
        return {
            backgroundImage: 'repeating-linear-gradient(90deg,transparent,transparent 38px,rgba(60,30,10,.85) 38px,rgba(60,30,10,.85) 40px),repeating-linear-gradient(180deg,transparent,transparent 20px,rgba(60,30,10,.85) 20px,rgba(60,30,10,.85) 22px)',
            backgroundColor: '#7a3b18',
        };
    }
    if (bg === 'wood') {
        return {
            backgroundImage: 'repeating-linear-gradient(90deg,rgba(255,255,255,.025) 0px,rgba(0,0,0,.08) 2px,transparent 2px,transparent 20px)',
            backgroundColor: '#3d2008',
        };
    }
    if (bg === 'transparent') {
        return { background: 'repeating-conic-gradient(#1a1a2e 0% 25%, #111122 0% 50%) 0 0/32px 32px' };
    }
    return { backgroundColor: bg };
}

export default function Designer() {
    const { seo, seoContent: sc } = usePage().props;
    const { addToCart, setDrawerOpen } = useCart();

    const [text, setText]                   = useState('Your Text Here');
    const [color, setColor]                 = useState(() => {
        const p = new URLSearchParams(window.location.search).get('color');
        if (!p || p === 'rgb') return '#FF00CC';
        return p.startsWith('#') ? p : '#' + p;
    });
    const [font, setFont]                   = useState("'Pacifico', cursive");
    const [background, setBackground]       = useState('#000000');
    const [size, setSize]                   = useState('Small (30cm)');
    const [fontSize, setFontSize]           = useState(56);
    const [textAlign, setTextAlign]         = useState('center');
    const [letterSpacing, setLetterSpacing] = useState(2);
    const [textCase, setTextCase]           = useState('normal');
    const [flicker, setFlicker]             = useState(false);
    const [rgbMode, setRgbMode]             = useState(() => new URLSearchParams(window.location.search).get('color') === 'rgb');
    const [acrylicType, setAcrylicType]     = useState('clear');
    const [outdoor, setOutdoor]             = useState(false);
    const [activeTab, setActiveTab]         = useState('text');
    const [adding, setAdding]               = useState(false);
    const [rgbColor, setRgbColor]           = useState(RGB_CYCLE[0]);
    const signRef                           = useRef(null);
    const [signHeight, setSignHeight]       = useState(0);

    useEffect(() => {
        if (!rgbMode) return;
        let i = 0;
        const id = setInterval(() => {
            i = (i + 1) % RGB_CYCLE.length;
            setRgbColor(RGB_CYCLE[i]);
        }, 700);
        return () => clearInterval(id);
    }, [rgbMode]);

    useEffect(() => {
        if (signRef.current) setSignHeight(signRef.current.offsetHeight);
    });

    const activeColor  = rgbMode ? rgbColor : color;
    const glowShadow   = '0 0 20px ' + activeColor + ', 0 0 40px ' + activeColor + ', 0 0 80px ' + activeColor + '80';
    const selectedSize = SIZES.find(s => s.value === size);
    const price        = BASE_PRICE + (selectedSize ? selectedSize.extra : 0) + (outdoor ? 30 : 0);
    const acrylicBg    = (ACRYLIC.find(a => a.value === acrylicType) || {}).color || 'transparent';
    const displayText  = textCase === 'upper' ? text.toUpperCase() : textCase === 'lower' ? text.toLowerCase() : text;

    const handleAddToCart = async () => {
        if (!text.trim()) { message.warning('Please enter some text.'); return; }
        setAdding(true);
        try {
            await addToCart({
                product_id: null, quantity: 1, unit_price: price,
                neon_color: color, size, background, custom_text: text, font,
                design_data: { text, color, font, background, fontSize, textAlign, letterSpacing, textCase, acrylicType, outdoor },
            });
            message.success({ content: 'Custom sign added to cart!', style: { marginTop: 60 } });
            setDrawerOpen(true);
        } catch (e) {
            message.error('Failed to add to cart.');
        } finally {
            setAdding(false);
        }
    };

    // ── Tab: TEXT ──────────────────────────────────────────────────────
    const tabText = (
        <div>
            <SectionLabel>YOUR TEXT</SectionLabel>
            <Input.TextArea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Enter your sign text…"
                maxLength={80}
                rows={3}
                style={{ fontSize: 15, resize: 'none', marginBottom: 4 }}
            />
            <div style={{ color: '#444', fontSize: 11, textAlign: 'right', marginBottom: 16 }}>{text.length}/80</div>

            <SectionLabel>ALIGNMENT</SectionLabel>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {[
                    { val: 'left',   Icon: AlignLeftOutlined   },
                    { val: 'center', Icon: AlignCenterOutlined },
                    { val: 'right',  Icon: AlignRightOutlined  },
                ].map(({ val, Icon }) => (
                    <button key={val} onClick={() => setTextAlign(val)} style={{
                        flex: 1, padding: '8px', borderRadius: 7, cursor: 'pointer',
                        background: textAlign === val ? 'rgba(0,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                        border: textAlign === val ? '1px solid #00FFFF' : '1px solid rgba(255,255,255,0.1)',
                        color: textAlign === val ? '#00FFFF' : '#555',
                        transition: 'all 0.2s',
                    }}>
                        <Icon />
                    </button>
                ))}
            </div>

            <SectionLabel>TEXT CASE</SectionLabel>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {[['normal','Aa'],['upper','AA'],['lower','aa']].map(([val, lbl]) => (
                    <button key={val} onClick={() => setTextCase(val)} style={{
                        flex: 1, padding: '7px 4px', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                        background: textCase === val ? 'rgba(255,0,204,0.12)' : 'rgba(255,255,255,0.04)',
                        border: textCase === val ? '1px solid #FF00CC' : '1px solid rgba(255,255,255,0.1)',
                        color: textCase === val ? '#FF00CC' : '#555',
                        transition: 'all 0.2s',
                    }}>{lbl}</button>
                ))}
            </div>

            <SectionLabel>LETTER SPACING — {letterSpacing}px</SectionLabel>
            <Slider min={0} max={20} value={letterSpacing} onChange={setLetterSpacing}
                trackStyle={{ background: '#BF5FFF' }}
                handleStyle={{ borderColor: '#BF5FFF', boxShadow: '0 0 6px #BF5FFF' }}
                style={{ marginBottom: 16 }}
            />
        </div>
    );

    // ── Tab: STYLE ─────────────────────────────────────────────────────
    const tabStyle = (
        <div>
            <SectionLabel>NEON COLOUR</SectionLabel>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {NEON_COLORS.map(c => (
                    <Tooltip key={c.hex} title={c.name}>
                        <div onClick={() => { setColor(c.hex); setRgbMode(false); }} style={{
                            width: 30, height: 30, borderRadius: '50%', background: c.hex, cursor: 'pointer', flexShrink: 0,
                            boxShadow: (!rgbMode && color === c.hex) ? '0 0 10px ' + c.hex + ', 0 0 20px ' + c.hex : '0 0 4px ' + c.hex + '40',
                            border: (!rgbMode && color === c.hex) ? '2px solid #fff' : '2px solid transparent',
                            transition: 'all 0.18s',
                        }} />
                    </Tooltip>
                ))}
                <Tooltip title="RGB colour cycling">
                    <div onClick={() => setRgbMode(v => !v)} style={{
                        width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', flexShrink: 0,
                        background: 'conic-gradient(#FF0000,#FF8C00,#FFFF00,#39FF14,#00FFFF,#4488FF,#BF5FFF,#FF00CC,#FF0000)',
                        border: rgbMode ? '2px solid #fff' : '2px solid transparent',
                        boxShadow: rgbMode ? '0 0 14px rgba(255,0,204,.7)' : 'none',
                        transition: 'all 0.18s',
                    }} />
                </Tooltip>
            </div>

            <SectionLabel>FONT</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                {FONTS.map(f => (
                    <button key={f.value} onClick={() => setFont(f.value)} style={{
                        padding: '9px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                        background: font === f.value ? activeColor + '14' : 'rgba(255,255,255,0.03)',
                        border: font === f.value ? '1px solid ' + activeColor + '60' : '1px solid rgba(255,255,255,0.07)',
                        transition: 'all 0.18s', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <span style={{ fontFamily: f.value, color: font === f.value ? activeColor : '#bbb', fontSize: 17 }}>{f.label}</span>
                        <span style={{ color: '#444', fontSize: 10 }}>{f.preview}</span>
                    </button>
                ))}
            </div>

            <SectionLabel>FONT SIZE — {fontSize}px</SectionLabel>
            <Slider min={24} max={100} value={fontSize} onChange={setFontSize}
                trackStyle={{ background: '#00FFFF' }}
                handleStyle={{ borderColor: '#00FFFF', boxShadow: '0 0 6px #00FFFF' }}
                style={{ marginBottom: 16 }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, marginBottom: 8 }}>
                <div>
                    <div style={{ color: '#bbb', fontSize: 13, fontWeight: 600 }}>Flicker Effect</div>
                    <div style={{ color: '#444', fontSize: 11 }}>Realistic neon flicker</div>
                </div>
                <Switch checked={flicker} onChange={setFlicker} style={{ background: flicker ? activeColor : undefined }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }}>
                <div>
                    <div style={{ color: '#bbb', fontSize: 13, fontWeight: 600 }}>RGB Mode</div>
                    <div style={{ color: '#444', fontSize: 11 }}>Colour-cycling LED animation</div>
                </div>
                <Switch checked={rgbMode} onChange={setRgbMode} style={{ background: rgbMode ? '#FF00CC' : undefined }} />
            </div>
        </div>
    );

    // ── Tab: BACKGROUND ────────────────────────────────────────────────
    const tabBackground = (
        <div>
            <SectionLabel>SOLID COLOURS</SectionLabel>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {SOLID_BACKGROUNDS.map(bg => (
                    <Tooltip key={bg.value} title={bg.label}>
                        <div onClick={() => setBackground(bg.value)} style={{
                            width: 34, height: 34, borderRadius: 7, cursor: 'pointer', flexShrink: 0,
                            background: bg.preview,
                            border: background === bg.value ? '2px solid #00FFFF' : '2px solid rgba(255,255,255,0.12)',
                            boxShadow: background === bg.value ? '0 0 8px #00FFFF' : 'none',
                            transition: 'all 0.18s',
                        }} />
                    </Tooltip>
                ))}
            </div>

            <SectionLabel>SCENE BACKGROUNDS</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 14 }}>
                {SCENE_BACKGROUNDS.map(bg => (
                    <div key={bg.value} onClick={() => setBackground(bg.value)} style={{
                        borderRadius: 8, overflow: 'hidden', aspectRatio: '4/3', cursor: 'pointer',
                        border: background === bg.value ? '2px solid #00FFFF' : '2px solid rgba(255,255,255,0.08)',
                        boxShadow: background === bg.value ? '0 0 10px #00FFFF' : 'none',
                        transition: 'all 0.18s',
                    }}>
                        <img src={bg.value} alt={bg.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                    </div>
                ))}
            </div>

            <SectionLabel>ACRYLIC BACKING</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
                {ACRYLIC.map(a => (
                    <button key={a.value} onClick={() => setAcrylicType(a.value)} style={{
                        padding: '8px 4px', borderRadius: 7, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                        background: acrylicType === a.value ? 'rgba(191,95,255,0.14)' : 'rgba(255,255,255,0.03)',
                        border: acrylicType === a.value ? '1px solid #BF5FFF' : '1px solid rgba(255,255,255,0.08)',
                        color: acrylicType === a.value ? '#BF5FFF' : '#555',
                        transition: 'all 0.18s',
                    }}>{a.label}</button>
                ))}
            </div>
        </div>
    );

    // ── Tab: SIZE ──────────────────────────────────────────────────────
    const tabSize = (
        <div>
            <SectionLabel>SIGN SIZE</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {SIZES.map(s => (
                    <button key={s.value} onClick={() => setSize(s.value)} style={{
                        padding: '12px 16px', borderRadius: 9, cursor: 'pointer', textAlign: 'left',
                        background: size === s.value ? 'rgba(255,0,204,0.10)' : 'rgba(255,255,255,0.03)',
                        border: size === s.value ? '1px solid #FF00CC' : '1px solid rgba(255,255,255,0.08)',
                        transition: 'all 0.18s', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <div>
                            <span style={{ color: size === s.value ? '#FF00CC' : '#ccc', fontWeight: 700, fontSize: 14 }}>{s.label}</span>
                            <span style={{ color: '#555', fontSize: 12, marginLeft: 8 }}>{s.dim}</span>
                        </div>
                        <span style={{ color: size === s.value ? '#FF00CC' : '#555', fontWeight: 700 }}>
                            {s.extra > 0 ? '+$' + s.extra : 'Base'}
                        </span>
                    </button>
                ))}
            </div>

            <div style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 9, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div>
                        <div style={{ color: '#bbb', fontWeight: 600, fontSize: 13 }}>Outdoor Rated</div>
                        <div style={{ color: '#444', fontSize: 11 }}>IP65 waterproof — +$30</div>
                    </div>
                    <Switch checked={outdoor} onChange={setOutdoor} />
                </div>
            </div>

            <SectionLabel>PRODUCT SPECS</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                    ['Material',  'Premium LED Neon Flex'],
                    ['Backing',   'Laser-cut Acrylic'],
                    ['Lifespan',  '50,000+ hours'],
                    ['Lead Time', '5–7 Business Days'],
                    ['Warranty',  '2 Years'],
                    ['Plug',      'AU Standard (included)'],
                    ['Shipping',  'Australia-wide'],
                ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ color: '#444', fontSize: 12 }}>{k}</span>
                        <span style={{ color: '#888', fontSize: 12, fontWeight: 600 }}>{v}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const tabContent = { text: tabText, style: tabStyle, background: tabBackground, size: tabSize };

    const previewJustify = textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center';
    const bgStyle = buildBgStyle(background);
    const sd = SIZE_DISPLAY[size] || SIZE_DISPLAY['Small (30cm)'];

    return (
        <AppLayout>
            <Head title={sc?.designer_title || 'Free Custom Neon Sign Designer | Design Your LED Neon Sign Online'}>
                <meta name="description" content={sc?.designer_description || 'Design your own custom neon sign online for free. Choose your text, font, colour and size. Live glowing preview before you buy. Ships Australia-wide from $169 with 2-year warranty.'} />
                <link rel="canonical" href={seo.appUrl + '/designer'} />
                <meta property="og:title" content={sc?.designer_title || 'Free Custom Neon Sign Designer | Design Your LED Neon Sign Online'} />
                <meta property="og:description" content={sc?.designer_description || 'Design your personalised neon sign for free. Live preview, 12 colours, 6 fonts. Ships Australia-wide from $169.'} />
                <meta property="og:url" content={seo.appUrl + '/designer'} />
            </Head>
            <div style={{ display: 'flex', height: 'calc(100vh - 101px)', overflow: 'hidden', background: 'var(--bg-dark)' }}>

                {/* ── LEFT SIDEBAR ── */}
                <div style={{
                    width: 340, minWidth: 340, display: 'flex', flexDirection: 'column',
                    borderRight: '1px solid rgba(255,255,255,0.07)', background: '#09091a', overflow: 'hidden',
                }}>
                    {/* Header */}
                    <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                        <div style={{ color: '#BF5FFF', fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', textShadow: '0 0 10px #BF5FFF' }}>✦ DESIGN STUDIO</div>
                        <div style={{ color: '#444', fontSize: 11, marginTop: 2 }}>Real-time neon sign editor</div>
                    </div>

                    {/* Tab bar */}
                    <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                        {TABS.map(t => (
                            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                                flex: 1, padding: '11px 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: activeTab === t.key ? '#FF00CC' : '#444',
                                borderBottom: activeTab === t.key ? '2px solid #FF00CC' : '2px solid transparent',
                                transition: 'all 0.18s',
                            }}>{t.label}</button>
                        ))}
                    </div>

                    {/* Scrollable content */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', scrollbarWidth: 'thin', scrollbarColor: '#1a1a2e transparent' }}>
                        {tabContent[activeTab]}
                    </div>

                    {/* Sticky CTA */}
                    <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(255,0,204,0.15)', background: '#09091a', flexShrink: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                            <span style={{ color: '#555', fontSize: 12 }}>Total estimate</span>
                            <span style={{ color: '#FF00CC', fontSize: 26, fontWeight: 900, textShadow: '0 0 12px rgba(255,0,204,0.5)' }}>
                                ${price}
                            </span>
                        </div>
                        <button
                            className="btn-hero-pink"
                            style={{ width: '100%', fontSize: 14, padding: '11px', fontWeight: 700 }}
                            onClick={handleAddToCart}
                            disabled={adding}
                        >
                            <ShoppingCartOutlined style={{ marginRight: 8 }} />
                            {adding ? 'Adding…' : 'Add to Cart'}
                        </button>
                    </div>
                </div>

                {/* ── RIGHT PREVIEW ── */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', overflow: 'hidden' }}>

                    {/* Canvas — full remaining area */}
                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

                        {/* Scene background fills canvas */}
                        <div style={Object.assign({}, bgStyle, { position: 'absolute', inset: 0 })} />

                        {/* Subtle dark overlay so sign pops on bright scenes */}
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)', pointerEvents: 'none' }} />

                        {/* Price — top right overlay */}
                        <div style={{ position: 'absolute', top: 20, right: 24, zIndex: 10, textAlign: 'right' }}>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: '0.1em', marginBottom: 2 }}>ESTIMATED PRICE</div>
                            <div style={{ color: '#fff', fontSize: 32, fontWeight: 900, textShadow: '0 2px 16px rgba(0,0,0,0.7)' }}>${price}</div>
                        </div>

                        {/* LIVE PREVIEW badge — top left */}
                        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', padding: '5px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#39FF14', boxShadow: '0 0 6px #39FF14', display: 'inline-block' }} />
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, letterSpacing: '0.1em' }}>LIVE PREVIEW</span>
                        </div>

                        {/* Centered sign object */}
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
                            <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>

                                {/* Sign frame (acrylic backing) */}
                                <div ref={signRef} style={{
                                    maxWidth: sd.maxW,
                                    minWidth: 160,
                                    width: 'max-content',
                                    background: acrylicBg,
                                    backdropFilter: acrylicType === 'frosted' ? 'blur(3px)' : 'none',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderRadius: 8,
                                    padding: '28px 40px',
                                    position: 'relative',
                                    boxShadow: '0 0 40px ' + activeColor + '30, 0 8px 32px rgba(0,0,0,0.6)',
                                    transition: 'box-shadow 0.4s ease',
                                }}>
                                    {/* Corner screws */}
                                    {[['6px','6px'],['6px','calc(100% - 14px)'],['calc(100% - 14px)','6px'],['calc(100% - 14px)','calc(100% - 14px)']].map(([t, l], i) => (
                                        <div key={i} style={{ position: 'absolute', top: t, left: l, width: 7, height: 7, borderRadius: '50%', background: 'rgba(200,200,200,0.4)', border: '1px solid rgba(255,255,255,0.25)', zIndex: 2 }} />
                                    ))}

                                    {/* Neon text */}
                                    <span style={{
                                        fontFamily: font,
                                        fontSize: fontSize + 'px',
                                        color: activeColor,
                                        textShadow: glowShadow,
                                        textAlign: textAlign,
                                        letterSpacing: letterSpacing + 'px',
                                        lineHeight: 1.25,
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        display: 'block',
                                        width: '100%',
                                        animation: flicker ? 'neon-flicker 3s infinite' : 'none',
                                        transition: 'color 0.3s, text-shadow 0.3s, font-family 0.2s, letter-spacing 0.2s, font-size 0.2s',
                                        userSelect: 'none',
                                    }}>
                                        {displayText || 'Your Text Here'}
                                    </span>

                                    {/* Height dimension label — right side */}
                                    {signHeight > 0 && (
                                        <div style={{ position: 'absolute', right: -52, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                                            <div style={{ width: 1, flex: 1, minHeight: 20, background: 'rgba(255,255,255,0.3)', alignSelf: 'center' }} />
                                            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 9, letterSpacing: '0.05em', writingMode: 'vertical-rl', whiteSpace: 'nowrap' }}>HEIGHT</span>
                                            <div style={{ width: 1, flex: 1, minHeight: 20, background: 'rgba(255,255,255,0.3)', alignSelf: 'center' }} />
                                        </div>
                                    )}
                                </div>

                                {/* Width dimension label — below sign */}
                                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.3)', minWidth: 30 }} />
                                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, letterSpacing: '0.1em', fontWeight: 600, background: 'rgba(0,0,0,0.4)', padding: '2px 7px', borderRadius: 4 }}>{sd.widthLabel}</span>
                                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.3)', minWidth: 30 }} />
                                </div>

                            </div>
                        </div>

                        {/* Bottom quick toolbar */}
                        <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(10,10,20,0.75)', backdropFilter: 'blur(10px)', padding: '8px 12px', borderRadius: 40, border: '1px solid rgba(255,255,255,0.1)' }}>
                            {[
                                { key: 'text',       Icon: FontSizeOutlined,    label: 'Text'  },
                                { key: 'style',      Icon: BgColorsOutlined,    label: 'Style' },
                                { key: 'background', Icon: PictureOutlined,     label: 'BG'    },
                                { key: 'size',       Icon: ColumnWidthOutlined, label: 'Size'  },
                            ].map(({ key, Icon, label }) => (
                                <button key={key} onClick={() => setActiveTab(key)} style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                                    padding: '6px 14px', borderRadius: 30, cursor: 'pointer', border: 'none',
                                    background: activeTab === key ? 'rgba(255,0,204,0.2)' : 'transparent',
                                    outline: activeTab === key ? '1px solid rgba(255,0,204,0.5)' : 'none',
                                    transition: 'all 0.18s',
                                }}>
                                    <Icon style={{ fontSize: 16, color: activeTab === key ? '#FF00CC' : 'rgba(255,255,255,0.5)' }} />
                                    <span style={{ fontSize: 9, color: activeTab === key ? '#FF00CC' : 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>{label}</span>
                                </button>
                            ))}
                            <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
                            <button onClick={() => setFlicker(v => !v)} style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                                padding: '6px 14px', borderRadius: 30, cursor: 'pointer', border: 'none',
                                background: flicker ? 'rgba(255,140,0,0.2)' : 'transparent',
                                outline: flicker ? '1px solid rgba(255,140,0,0.5)' : 'none',
                                transition: 'all 0.18s',
                            }}>
                                <span style={{ fontSize: 15, lineHeight: 1 }}>⚡</span>
                                <span style={{ fontSize: 9, color: flicker ? '#FF8C00' : 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>Flicker</span>
                            </button>
                            <button onClick={() => setRgbMode(v => !v)} style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                                padding: '6px 14px', borderRadius: 30, cursor: 'pointer', border: 'none',
                                background: rgbMode ? 'rgba(191,95,255,0.2)' : 'transparent',
                                outline: rgbMode ? '1px solid rgba(191,95,255,0.5)' : 'none',
                                transition: 'all 0.18s',
                            }}>
                                <span style={{ fontSize: 15, lineHeight: 1 }}>🌈</span>
                                <span style={{ fontSize: 9, color: rgbMode ? '#BF5FFF' : 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>RGB</span>
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
