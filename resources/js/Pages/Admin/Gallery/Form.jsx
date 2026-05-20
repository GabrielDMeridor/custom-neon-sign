import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const NEON_COLORS = ['#FF00CC','#FF6EC7','#00FFFF','#39FF14','#FFFF00','#FF8C00','#BF5FFF','#FF2244','#4488FF','#FFE580','#FFFFFF'];
const CATEGORIES  = ['Business Signs','Wedding & Events','Home & Bedroom','Bar & Hospitality','Custom Text'];
const BADGES      = ['', 'POPULAR', 'TOP SELLER', 'TRENDING', 'NEW', 'FAN FAVE', 'PREMIUM'];

const inputStyle = {
    width: '100%', background: '#0c0c22', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, padding: '9px 12px', color: '#ddd', fontSize: 13, outline: 'none',
    boxSizing: 'border-box',
};

function Field({ label, error, children }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: '#888', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>{label.toUpperCase()}</label>
            {children}
            {error && <div style={{ color: '#ff6666', fontSize: 11, marginTop: 4 }}>{error}</div>}
        </div>
    );
}

export default function GalleryForm({ item }) {
    const isEdit = !!item;

    const { data, setData, post, put, processing, errors } = useForm({
        title:       item?.title       ?? '',
        category:    item?.category    ?? 'Business Signs',
        color:       item?.color       ?? '#FF00CC',
        emoji:       item?.emoji       ?? '',
        description: item?.description ?? '',
        image_url:   item?.image_url   ?? '',
        badge:       item?.badge       ?? '',
        sort_order:  item?.sort_order  ?? 0,
        active:      item?.active      ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) put(`/admin/gallery/${item.id}`);
        else        post('/admin/gallery');
    };

    const glow = `0 0 8px ${data.color}, 0 0 18px ${data.color}80`;

    return (
        <AdminLayout title={isEdit ? 'Edit Gallery Item' : 'New Gallery Item'}>
            <Head title={isEdit ? 'Edit Gallery Item' : 'New Gallery Item'} />

            <div style={{ maxWidth: 680, display: 'grid', gridTemplateColumns: '1fr 220px', gap: 20 }}>
                <div>
                    {/* Breadcrumb */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
                        <Link href="/admin/gallery" style={{ color: '#555', fontSize: 13, textDecoration: 'none' }}>Gallery</Link>
                        <span style={{ color: '#333' }}>›</span>
                        <span style={{ color: '#ccc', fontSize: 13 }}>{isEdit ? item.title : 'New Item'}</span>
                    </div>

                    <form onSubmit={submit}>
                        <div style={{ background: '#0c0c22', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '22px 24px', marginBottom: 14 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                <Field label="Title" error={errors.title}>
                                    <input style={inputStyle} value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. Good Vibes Only" />
                                </Field>
                                <Field label="Category" error={errors.category}>
                                    <select style={inputStyle} value={data.category} onChange={e => setData('category', e.target.value)}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </Field>
                            </div>

                            <Field label="Description" error={errors.description}>
                                <input style={inputStyle} value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Short description…" />
                            </Field>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                <Field label="Emoji Icon" error={errors.emoji}>
                                    <input style={inputStyle} value={data.emoji} onChange={e => setData('emoji', e.target.value)} placeholder="✨" />
                                </Field>
                                <Field label="Badge (optional)" error={errors.badge}>
                                    <select style={inputStyle} value={data.badge} onChange={e => setData('badge', e.target.value)}>
                                        {BADGES.map(b => <option key={b} value={b}>{b || '— None —'}</option>)}
                                    </select>
                                </Field>
                            </div>

                            <Field label="Image URL (optional — overrides emoji preview)" error={errors.image_url}>
                                <input style={inputStyle} value={data.image_url} onChange={e => setData('image_url', e.target.value)} placeholder="https://… or /cns_assets/Mock up-08.png" />
                            </Field>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                <Field label="Sort Order" error={errors.sort_order}>
                                    <input style={inputStyle} type="number" value={data.sort_order} onChange={e => setData('sort_order', Number(e.target.value))} />
                                </Field>
                            </div>

                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 4 }}>
                                <input type="checkbox" checked={data.active} onChange={e => setData('active', e.target.checked)} style={{ accentColor: '#39FF14', width: 16, height: 16 }} />
                                <span style={{ color: '#888', fontSize: 13 }}>Active (visible on gallery)</span>
                            </label>
                        </div>

                        {/* Colour picker */}
                        <div style={{ background: '#0c0c22', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '22px 24px', marginBottom: 20 }}>
                            <div style={{ color: '#555', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 12 }}>NEON COLOUR</div>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                                {NEON_COLORS.map(hex => (
                                    <div key={hex} onClick={() => setData('color', hex)} style={{
                                        width: 30, height: 30, borderRadius: '50%', background: hex, cursor: 'pointer',
                                        border: data.color === hex ? '3px solid #fff' : '3px solid transparent',
                                        boxShadow: data.color === hex ? `0 0 10px ${hex}, 0 0 20px ${hex}80` : `0 0 4px ${hex}60`,
                                        transition: 'all 0.15s',
                                    }} />
                                ))}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ color: '#444', fontSize: 12 }}>Custom:</span>
                                <input type="color" value={data.color} onChange={e => setData('color', e.target.value)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, width: 36, height: 30, cursor: 'pointer', padding: 2 }} />
                                <span style={{ color: data.color, fontSize: 12, fontWeight: 700, textShadow: glow }}>{data.color}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button type="submit" disabled={processing} style={{
                                padding: '10px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer',
                                background: 'linear-gradient(135deg, #00FFFF, #BF5FFF)', color: '#000', border: 'none',
                                opacity: processing ? 0.7 : 1,
                            }}>
                                {processing ? 'Saving…' : isEdit ? 'Save Changes' : 'Add to Gallery'}
                            </button>
                            <Link href="/admin/gallery" style={{ textDecoration: 'none' }}>
                                <button type="button" style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, cursor: 'pointer', background: 'transparent', color: '#555', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Live preview */}
                <div style={{ position: 'sticky', top: 20, height: 'fit-content' }}>
                    <div style={{ color: '#555', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 10 }}>PREVIEW</div>
                    <div style={{ background: '#07071a', border: `1px solid ${data.color}30`, borderRadius: 12, overflow: 'hidden' }}>
                        <div style={{ height: 140, background: 'radial-gradient(ellipse 80% 70% at 50% 60%, #10102a 0%, #05050f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'relative' }}>
                            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 60% 50% at 50% 60%, ${data.color}14 0%, transparent 70%)`, pointerEvents: 'none' }} />
                            {data.badge && <div style={{ position: 'absolute', top: 8, left: 8, padding: '2px 8px', borderRadius: 10, fontSize: 9, fontWeight: 800, background: data.color + '22', border: `1px solid ${data.color}50`, color: data.color }}>{data.badge}</div>}
                            <div style={{ fontSize: 28, marginBottom: 6, zIndex: 1 }}>{data.emoji || '✨'}</div>
                            <div style={{ fontFamily: "'Pacifico',cursive", fontSize: 16, color: data.color, textShadow: glow, zIndex: 1, textAlign: 'center', padding: '0 12px' }}>{data.title || 'Preview'}</div>
                        </div>
                        <div style={{ padding: '10px 12px' }}>
                            <div style={{ color: '#888', fontSize: 11 }}>{data.category}</div>
                            <div style={{ color: '#555', fontSize: 11, marginTop: 2 }}>{data.description || 'No description'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
