import React, { useState, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const NEON_COLORS = ['#FF00CC','#FF6EC7','#00FFFF','#39FF14','#FFFF00','#FF8C00','#BF5FFF','#FF2244','#4488FF','#FFE580','#FFFFFF'];

const FONT_OPTIONS = [
    { value: "'Pacifico', cursive",       label: 'Pacifico'       },
    { value: "'Lobster', cursive",         label: 'Lobster'        },
    { value: "'Dancing Script', cursive",  label: 'Dancing Script' },
    { value: "'Bebas Neue', cursive",      label: 'Bebas Neue'     },
    { value: "'Oswald', sans-serif",       label: 'Oswald'         },
    { value: "'Rajdhani', sans-serif",     label: 'Rajdhani'       },
];
const DEFAULT_SIZES = [
    { label: 'Small (30cm)',  price: 0   },
    { label: 'Medium (60cm)', price: 50  },
    { label: 'Large (90cm)',  price: 120 },
    { label: 'XL (120cm)',    price: 200 },
];

function Field({ label, error, children }) {
    return (
        <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', color: '#888', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>{label.toUpperCase()}</label>
            {children}
            {error && <div style={{ color: '#ff6666', fontSize: 11, marginTop: 4 }}>{error}</div>}
        </div>
    );
}

const inputStyle = {
    width: '100%', background: '#0c0c22', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, padding: '9px 12px', color: '#ddd', fontSize: 13, outline: 'none',
    boxSizing: 'border-box',
};

export default function ProductForm({ product }) {
    const isEdit = !!product;
    const fileRef = useRef();
    const [previewUrl, setPreviewUrl] = useState(product?.image ?? null);

    const { data, setData, post, put, processing, errors } = useForm({
        name:            product?.name            ?? '',
        description:     product?.description     ?? '',
        category:        product?.category        ?? 'prebuilt',
        base_price:      product?.base_price      ?? '',
        image:           product?.image           ?? '',
        font:            product?.font            ?? '',
        image_file:      null,
        is_customizable: product?.is_customizable ?? false,
        active:          product?.active          ?? true,
        colors:          product?.colors          ?? NEON_COLORS,
        sizes:           product?.sizes           ?? DEFAULT_SIZES,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('image_file', file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        const options = { forceFormData: true };
        if (isEdit) {
            post(`/admin/products/${product.id}?_method=PUT`, options);
        } else {
            post('/admin/products', options);
        }
    };

    const toggleColor = (hex) => {
        const next = data.colors.includes(hex)
            ? data.colors.filter(c => c !== hex)
            : [...data.colors, hex];
        setData('colors', next);
    };

    const updateSize = (i, field, val) => {
        const next = data.sizes.map((s, idx) => idx === i ? { ...s, [field]: val } : s);
        setData('sizes', next);
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Product' : 'New Product'}>
            <Head title={isEdit ? 'Edit Product' : 'New Product'} />

            <div style={{ maxWidth: 720 }}>
                {/* Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                    <Link href="/admin/products" style={{ color: '#555', fontSize: 13, textDecoration: 'none' }}>Products</Link>
                    <span style={{ color: '#333' }}>›</span>
                    <span style={{ color: '#ccc', fontSize: 13 }}>{isEdit ? product.name : 'New Product'}</span>
                </div>

                <form onSubmit={submit}>
                    <div style={{ background: '#0c0c22', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '24px 28px', marginBottom: 16 }}>
                        <div style={{ color: '#555', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 18 }}>BASIC INFO</div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Field label="Product Name" error={errors.name}>
                                <input style={inputStyle} value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g. Open Sign" />
                            </Field>
                            <Field label="Category" error={errors.category}>
                                <select style={inputStyle} value={data.category} onChange={e => setData('category', e.target.value)}>
                                    <option value="prebuilt">Pre-built</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </Field>
                        </div>

                        <Field label="Description" error={errors.description}>
                            <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Short product description…" />
                        </Field>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Field label="Base Price ($)" error={errors.base_price}>
                                <input style={inputStyle} type="number" step="0.01" value={data.base_price} onChange={e => setData('base_price', e.target.value)} placeholder="169" />
                            </Field>
                        </div>

                        {/* Image upload */}
                        <Field label="Product Image" error={errors.image_file ?? errors.image}>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                {/* Thumbnail */}
                                <div style={{
                                    width: 90, height: 64, borderRadius: 8, flexShrink: 0, overflow: 'hidden',
                                    background: '#07071a', border: '1px solid rgba(255,255,255,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {previewUrl
                                        ? <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <span style={{ color: '#333', fontSize: 22 }}>🖼</span>
                                    }
                                </div>
                                <div style={{ flex: 1 }}>
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                    <button type="button" onClick={() => fileRef.current.click()} style={{
                                        display: 'block', width: '100%', padding: '8px 12px', marginBottom: 8,
                                        background: 'rgba(255,0,204,0.08)', border: '1px dashed rgba(255,0,204,0.3)',
                                        borderRadius: 8, color: '#FF00CC', fontSize: 12, cursor: 'pointer', textAlign: 'left',
                                    }}>
                                        {data.image_file ? `✓ ${data.image_file.name}` : '↑ Upload image (JPG, PNG, WebP)'}
                                    </button>
                                    <input
                                        style={{ ...inputStyle, fontSize: 11 }}
                                        value={data.image}
                                        onChange={e => { setData('image', e.target.value); setPreviewUrl(e.target.value || null); }}
                                        placeholder="Or paste image URL: /storage/... or https://…"
                                    />
                                </div>
                            </div>
                        </Field>

                        {/* Font picker + live preview */}
                        <Field label="Neon Font Style" error={errors.font}>
                            {/* Live preview */}
                            <div style={{
                                background: 'radial-gradient(ellipse 90% 70% at 50% 60%, #10102a 0%, #060612 100%)',
                                borderRadius: 10, marginBottom: 12,
                                minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid rgba(255,255,255,0.06)', padding: '16px 20px',
                                position: 'relative', overflow: 'hidden',
                            }}>
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(255,0,204,0.08) 0%, transparent 70%)',
                                    pointerEvents: 'none',
                                }} />
                                <div style={{
                                    fontFamily: data.font || "'Rajdhani', sans-serif",
                                    fontSize: 32,
                                    color: '#FF00CC',
                                    textShadow: '0 0 10px #FF00CC, 0 0 28px rgba(255,0,204,0.6), 0 0 55px rgba(255,0,204,0.3)',
                                    textAlign: 'center',
                                    zIndex: 1,
                                    transition: 'font-family 0.2s',
                                    wordBreak: 'break-word', maxWidth: '100%',
                                }}>
                                    {data.name || (data.is_customizable ? 'Your Text Here' : 'Sign Preview')}
                                </div>
                            </div>
                            {/* Font tiles */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                                {FONT_OPTIONS.map(f => (
                                    <div
                                        key={f.value}
                                        onClick={() => setData('font', data.font === f.value ? '' : f.value)}
                                        style={{
                                            padding: '10px 12px',
                                            borderRadius: 8,
                                            cursor: 'pointer',
                                            border: data.font === f.value
                                                ? '1px solid rgba(255,0,204,0.6)'
                                                : '1px solid rgba(255,255,255,0.07)',
                                            background: data.font === f.value
                                                ? 'rgba(255,0,204,0.08)'
                                                : '#07071a',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        <div style={{
                                            fontFamily: f.value,
                                            fontSize: 18,
                                            color: data.font === f.value ? '#FF00CC' : '#888',
                                            textShadow: data.font === f.value ? '0 0 8px rgba(255,0,204,0.6)' : 'none',
                                            marginBottom: 2,
                                            transition: 'all 0.15s',
                                        }}>Neon</div>
                                        <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.08em' }}>{f.label}</div>
                                    </div>
                                ))}
                            </div>
                            {!data.font && <div style={{ color: '#444', fontSize: 11, marginTop: 6 }}>No font selected — one will be auto-assigned based on product ID</div>}
                        </Field>

                        <div style={{ display: 'flex', gap: 24 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <input type="checkbox" checked={data.is_customizable} onChange={e => setData('is_customizable', e.target.checked)} style={{ accentColor: '#BF5FFF', width: 16, height: 16 }} />
                                <span style={{ color: '#888', fontSize: 13 }}>Customisable (links to Design Studio)</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <input type="checkbox" checked={data.active} onChange={e => setData('active', e.target.checked)} style={{ accentColor: '#39FF14', width: 16, height: 16 }} />
                                <span style={{ color: '#888', fontSize: 13 }}>Active (visible on site)</span>
                            </label>
                        </div>
                    </div>

                    {/* Colours */}
                    <div style={{ background: '#0c0c22', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '24px 28px', marginBottom: 16 }}>
                        <div style={{ color: '#555', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 14 }}>AVAILABLE COLOURS</div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            {NEON_COLORS.map(hex => (
                                <div key={hex} onClick={() => toggleColor(hex)} style={{
                                    width: 32, height: 32, borderRadius: '50%', background: hex, cursor: 'pointer',
                                    border: data.colors.includes(hex) ? '3px solid #fff' : '3px solid transparent',
                                    boxShadow: data.colors.includes(hex) ? `0 0 10px ${hex}, 0 0 18px ${hex}80` : `0 0 5px ${hex}60`,
                                    transition: 'all 0.15s', opacity: data.colors.includes(hex) ? 1 : 0.35,
                                }} />
                            ))}
                        </div>
                        <div style={{ color: '#333', fontSize: 11, marginTop: 8 }}>{data.colors.length} colours selected</div>
                    </div>

                    {/* Sizes */}
                    <div style={{ background: '#0c0c22', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '24px 28px', marginBottom: 24 }}>
                        <div style={{ color: '#555', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 14 }}>SIZE OPTIONS</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {data.sizes.map((s, i) => (
                                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <input style={{ ...inputStyle, flex: 2 }} value={s.label} onChange={e => updateSize(i, 'label', e.target.value)} placeholder="Size label" />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                                        <span style={{ color: '#444', fontSize: 12 }}>+$</span>
                                        <input style={{ ...inputStyle, flex: 1 }} type="number" value={s.price} onChange={e => updateSize(i, 'price', Number(e.target.value))} placeholder="0" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button type="submit" disabled={processing} style={{
                            padding: '10px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer',
                            background: 'linear-gradient(135deg, #FF00CC, #FF6EC7)', color: '#000', border: 'none',
                            opacity: processing ? 0.7 : 1,
                        }}>
                            {processing ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
                        </button>
                        <Link href="/admin/products" style={{ textDecoration: 'none' }}>
                            <button type="button" style={{ padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', background: 'transparent', color: '#555', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
