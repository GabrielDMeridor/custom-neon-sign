import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Slider, Tooltip, message, Switch } from 'antd';
import { ShoppingCartOutlined, UploadOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import AppLayout from '@/Layouts/AppLayout';
import { useCart } from '@/Contexts/CartContext';
import axios from 'axios';

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
    { hex: '#FFFFFF', name: 'Pure White' },
];

const SIZES = [
    { value: 'Small (30cm)',  label: 'Small',  dim: '30 cm',  extra: 0   },
    { value: 'Medium (60cm)', label: 'Medium', dim: '60 cm',  extra: 50  },
    { value: 'Large (90cm)',  label: 'Large',  dim: '90 cm',  extra: 120 },
    { value: 'XL (120cm)',    label: 'XL',     dim: '120 cm', extra: 200 },
];

const BASE_PRICE = 249; // logo conversion starts higher

function applyNeonEffect(canvas, imageUrl, neonHex, cb) {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
        const MAX = 700;
        let w = img.naturalWidth, h = img.naturalHeight;
        if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
        if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
        canvas.width = w;
        canvas.height = h;

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        const hex = neonHex.replace('#', '');
        const nr = parseInt(hex.substr(0, 2), 16);
        const ng = parseInt(hex.substr(2, 2), 16);
        const nb = parseInt(hex.substr(4, 2), 16);

        const imageData = ctx.getImageData(0, 0, w, h);
        const px = imageData.data;

        for (let i = 0; i < px.length; i += 4) {
            const r = px[i], g = px[i + 1], b = px[i + 2], a = px[i + 3];
            const brightness = r * 0.299 + g * 0.587 + b * 0.114;
            const isTransparent = a < 50;
            const isDark = brightness < 35;

            if (isTransparent || isDark) {
                px[i] = px[i + 1] = px[i + 2] = 0;
                px[i + 3] = 255;
            } else {
                const t = Math.pow(brightness / 255, 0.6);
                px[i]     = Math.min(255, Math.round(nr * t * 1.6));
                px[i + 1] = Math.min(255, Math.round(ng * t * 1.6));
                px[i + 2] = Math.min(255, Math.round(nb * t * 1.6));
                px[i + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        if (cb) cb();
    };
    img.src = imageUrl;
}

export default function LogoUpload() {
    const { addToCart, setDrawerOpen } = useCart();

    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadedUrl, setUploadedUrl]   = useState(null);
    const [color, setColor]               = useState('#FF00CC');
    const [size, setSize]                 = useState('Small (30cm)');
    const [showNeon, setShowNeon]         = useState(true);
    const [dragging, setDragging]         = useState(false);
    const [adding, setAdding]             = useState(false);
    const [uploading, setUploading]       = useState(false);

    const canvasRef  = useRef(null);
    const fileInput  = useRef(null);

    const selectedSize = SIZES.find(s => s.value === size);
    const price = BASE_PRICE + (selectedSize ? selectedSize.extra : 0);

    // Re-apply neon effect whenever color changes
    useEffect(() => {
        if (uploadedUrl && canvasRef.current) {
            applyNeonEffect(canvasRef.current, uploadedUrl, color);
        }
    }, [color, uploadedUrl]);

    const handleFile = useCallback((file) => {
        if (!file) return;
        const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/gif'];
        if (!allowed.includes(file.type)) {
            message.error('Please upload a PNG, JPG, or SVG file.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            message.error('File must be under 10 MB.');
            return;
        }
        setUploadedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setUploadedUrl(e.target.result);
            setShowNeon(true);
        };
        reader.readAsDataURL(file);
    }, []);

    const onInputChange = (e) => handleFile(e.target.files[0]);
    const onDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const handleAddToCart = async () => {
        if (!uploadedFile) { message.warning('Please upload a logo first.'); return; }
        setAdding(true);
        try {
            // Upload file to server
            const formData = new FormData();
            formData.append('logo', uploadedFile);
            const { data } = await axios.post('/api/upload-logo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const logoUrl = data.url;

            await addToCart({
                product_id: null, quantity: 1, unit_price: price,
                neon_color: color, size,
                custom_text: 'Logo: ' + uploadedFile.name,
                font: 'logo',
                design_data: { type: 'logo', logoUrl, color, size, fileName: uploadedFile.name },
            });
            message.success({ content: 'Logo sign added to cart! Our team will trace your artwork.', style: { marginTop: 60 } });
            setDrawerOpen(true);
        } catch (err) {
            message.error('Failed to add to cart. Please try again.');
        } finally {
            setAdding(false);
        }
    };

    const glowFilter = 'drop-shadow(0 0 8px ' + color + ') drop-shadow(0 0 16px ' + color + ') drop-shadow(0 0 30px ' + color + '80)';

    return (
        <AppLayout>
            <Head title="Logo to Neon Sign — Custom Neon Signs Australia" />

            {/* Page header */}
            <div style={{ background: 'linear-gradient(180deg, #0a0820 0%, var(--bg-dark) 100%)', borderBottom: '1px solid rgba(255,0,204,0.12)', padding: '32px 24px 28px', textAlign: 'center' }}>
                <div style={{ color: '#BF5FFF', fontSize: 12, fontWeight: 800, letterSpacing: '0.2em', marginBottom: 8 }}>📤 LOGO TO NEON</div>
                <h1 style={{ color: '#fff', fontSize: 'clamp(24px,4vw,40px)', fontWeight: 900, margin: 0, fontFamily: "'Bebas Neue', cursive", letterSpacing: '0.05em' }}>
                    Turn Your <span style={{ color: '#FF00CC', textShadow: '0 0 20px #FF00CC' }}>Logo</span> Into Neon
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 8, fontSize: 14, maxWidth: 520, margin: '8px auto 0' }}>
                    Upload your artwork. Our team hand-traces every logo into a precision LED neon sign.
                </p>
            </div>

            <div style={{ display: 'flex', height: 'calc(100vh - 180px)', overflow: 'hidden' }}>

                {/* LEFT PANEL */}
                <div style={{ width: 340, minWidth: 340, borderRight: '1px solid rgba(255,255,255,0.07)', background: '#09091a', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px', scrollbarWidth: 'thin', scrollbarColor: '#1a1a2e transparent' }}>

                        {/* Upload area */}
                        <div
                            onClick={() => fileInput.current?.click()}
                            onDrop={onDrop}
                            onDragOver={e => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            style={{
                                border: dragging ? '2px solid #FF00CC' : '2px dashed rgba(255,0,204,0.3)',
                                borderRadius: 12,
                                padding: '32px 20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: dragging ? 'rgba(255,0,204,0.06)' : 'rgba(255,255,255,0.02)',
                                transition: 'all 0.2s',
                                marginBottom: 20,
                            }}
                        >
                            <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/jpg,image/svg+xml" onChange={onInputChange} style={{ display: 'none' }} />
                            {uploadedFile ? (
                                <>
                                    <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                                    <div style={{ color: '#FF00CC', fontWeight: 700, fontSize: 13 }}>{uploadedFile.name}</div>
                                    <div style={{ color: '#444', fontSize: 11, marginTop: 4 }}>Click to replace</div>
                                </>
                            ) : (
                                <>
                                    <div style={{ fontSize: 36, marginBottom: 8 }}>📤</div>
                                    <div style={{ color: '#bbb', fontWeight: 600, fontSize: 14 }}>Drop your logo here</div>
                                    <div style={{ color: '#444', fontSize: 11, marginTop: 6, lineHeight: 1.6 }}>PNG, JPG or SVG · Max 10 MB<br />Best results with transparent PNGs</div>
                                </>
                            )}
                        </div>

                        {/* Neon colour */}
                        <div style={{ fontSize: 10, color: '#555', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 8 }}>NEON COLOUR</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                            {NEON_COLORS.map(c => (
                                <Tooltip key={c.hex} title={c.name}>
                                    <div onClick={() => setColor(c.hex)} style={{
                                        width: 30, height: 30, borderRadius: '50%', background: c.hex, cursor: 'pointer', flexShrink: 0,
                                        boxShadow: color === c.hex ? '0 0 10px ' + c.hex + ', 0 0 20px ' + c.hex : '0 0 4px ' + c.hex + '40',
                                        border: color === c.hex ? '2px solid #fff' : '2px solid transparent',
                                        transition: 'all 0.18s',
                                    }} />
                                </Tooltip>
                            ))}
                        </div>

                        {/* Size */}
                        <div style={{ fontSize: 10, color: '#555', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 8 }}>SIGN SIZE</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                            {SIZES.map(s => (
                                <button key={s.value} onClick={() => setSize(s.value)} style={{
                                    padding: '10px 14px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                                    background: size === s.value ? 'rgba(255,0,204,0.10)' : 'rgba(255,255,255,0.03)',
                                    border: size === s.value ? '1px solid #FF00CC' : '1px solid rgba(255,255,255,0.08)',
                                    transition: 'all 0.18s', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                }}>
                                    <div>
                                        <span style={{ color: size === s.value ? '#FF00CC' : '#ccc', fontWeight: 700, fontSize: 13 }}>{s.label}</span>
                                        <span style={{ color: '#555', fontSize: 11, marginLeft: 8 }}>{s.dim}</span>
                                    </div>
                                    <span style={{ color: size === s.value ? '#FF00CC' : '#555', fontWeight: 700, fontSize: 12 }}>
                                        {s.extra > 0 ? '+$' + s.extra : 'Base'}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Process note */}
                        <div style={{ padding: '12px 14px', background: 'rgba(0,255,255,0.05)', border: '1px solid rgba(0,255,255,0.15)', borderRadius: 10, marginBottom: 8 }}>
                            <div style={{ color: '#00FFFF', fontWeight: 700, fontSize: 12, marginBottom: 6 }}>🎨 How Logo Conversion Works</div>
                            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, lineHeight: 1.7 }}>
                                1. Upload your logo file<br />
                                2. Our designers hand-trace it into neon paths<br />
                                3. We send you a proof within 24 hours<br />
                                4. Approve &amp; we manufacture your sign
                            </div>
                        </div>

                    </div>

                    {/* CTA */}
                    <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(255,0,204,0.15)', background: '#09091a', flexShrink: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                            <span style={{ color: '#555', fontSize: 12 }}>Starting from</span>
                            <span style={{ color: '#FF00CC', fontSize: 26, fontWeight: 900, textShadow: '0 0 12px rgba(255,0,204,0.5)' }}>${price}</span>
                        </div>
                        <button className="btn-hero-pink" style={{ width: '100%', fontSize: 14, padding: '11px', fontWeight: 700 }} onClick={handleAddToCart} disabled={adding || !uploadedFile}>
                            <ShoppingCartOutlined style={{ marginRight: 8 }} />
                            {adding ? 'Adding…' : 'Add to Cart'}
                        </button>
                        <div style={{ color: '#333', fontSize: 10, textAlign: 'center', marginTop: 8 }}>Proof sent within 24 hours · Full refund if unhappy</div>
                    </div>
                </div>

                {/* RIGHT PREVIEW */}
                <div style={{ flex: 1, background: '#060612', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Toolbar */}
                    <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => setShowNeon(false)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: !showNeon ? 'rgba(255,255,255,0.1)' : 'transparent', border: !showNeon ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.08)', color: !showNeon ? '#fff' : '#555', transition: 'all 0.18s' }}>
                                Original
                            </button>
                            <button onClick={() => setShowNeon(true)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: showNeon ? 'rgba(255,0,204,0.15)' : 'transparent', border: showNeon ? '1px solid rgba(255,0,204,0.5)' : '1px solid rgba(255,255,255,0.08)', color: showNeon ? '#FF00CC' : '#555', transition: 'all 0.18s' }}>
                                ✦ Neon Preview
                            </button>
                        </div>
                        <div style={{ color: '#333', fontSize: 11 }}>Approximation — final result traced by our designers</div>
                    </div>

                    {/* Canvas / preview */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, position: 'relative' }}>
                        {!uploadedUrl ? (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 64, opacity: 0.15, marginBottom: 16 }}>📤</div>
                                <div style={{ color: '#333', fontSize: 14 }}>Upload your logo to see the neon preview</div>
                                <Link href="/designer" style={{ color: '#FF00CC', fontSize: 12, marginTop: 8, display: 'block' }}>Or design a text sign instead →</Link>
                            </div>
                        ) : (
                            <div style={{ maxWidth: '100%', maxHeight: '100%', position: 'relative' }}>
                                {/* Original image (hidden when showNeon) */}
                                <img
                                    src={uploadedUrl}
                                    alt="Uploaded logo"
                                    style={{
                                        maxWidth: '100%', maxHeight: 'calc(100vh - 300px)',
                                        objectFit: 'contain', display: showNeon ? 'none' : 'block',
                                        borderRadius: 8,
                                    }}
                                />
                                {/* Neon canvas */}
                                <canvas
                                    ref={canvasRef}
                                    style={{
                                        maxWidth: '100%', maxHeight: 'calc(100vh - 300px)',
                                        display: showNeon ? 'block' : 'none',
                                        filter: showNeon ? glowFilter : 'none',
                                        transition: 'filter 0.3s',
                                        borderRadius: 4,
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Bottom note */}
                    <div style={{ padding: '12px 24px', borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', gap: 32 }}>
                        {[['🎨','Hand-traced by designers'],['⚡','LED neon flex tube'],['📐','Laser-cut acrylic backing'],['🚚','Ships Australia-wide']].map(([icon,text]) => (
                            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontSize: 14 }}>{icon}</span>
                                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
