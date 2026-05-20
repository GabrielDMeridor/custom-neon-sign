import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const FONTS = ["'Pacifico',cursive","'Lobster',cursive","'Dancing Script',cursive","'Bebas Neue',cursive","'Oswald',sans-serif","'Rajdhani',sans-serif"];
const getFont = (p) => p.is_customizable ? FONTS[4] : FONTS[(p.id ?? 0) % (FONTS.length - 1)];

function ActiveDot({ active }) {
    return <div style={{ width: 8, height: 8, borderRadius: '50%', background: active ? '#39FF14' : '#333', boxShadow: active ? '0 0 6px #39FF14' : 'none', display: 'inline-block' }} />;
}

export default function ProductsIndex({ products = [] }) {
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('all');

    const filtered = products
        .filter(p => catFilter === 'all' || p.category === catFilter)
        .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

    const handleDelete = (id) => {
        if (!confirm('Delete this product?')) return;
        router.delete(`/admin/products/${id}`);
    };

    const handleToggle = (id) => {
        router.post(`/admin/products/${id}/toggle`);
    };

    return (
        <AdminLayout title="Products">
            <Head title="Admin — Products" />

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search products…"
                    style={{ flex: '1 1 200px', background: '#0c0c22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', color: '#ccc', fontSize: 13, outline: 'none' }}
                />
                {['all', 'prebuilt', 'custom'].map(c => (
                    <button key={c} onClick={() => setCatFilter(c)} style={{
                        padding: '7px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        background: catFilter === c ? 'rgba(255,0,204,0.14)' : 'transparent',
                        border: catFilter === c ? '1px solid rgba(255,0,204,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        color: catFilter === c ? '#FF00CC' : '#555', transition: 'all 0.15s',
                    }}>{c === 'all' ? 'All' : c === 'prebuilt' ? 'Pre-built' : 'Custom'}</button>
                ))}
                <Link href="/admin/products/create" style={{ textDecoration: 'none', marginLeft: 'auto' }}>
                    <button style={{ padding: '8px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', background: 'linear-gradient(135deg, #FF00CC, #FF6EC7)', color: '#000', border: 'none' }}>
                        + Add Product
                    </button>
                </Link>
            </div>

            {/* Table */}
            <div style={{ background: '#0c0c22', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 100px 80px 70px 80px 120px', padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#090918' }}>
                    {['Product', 'Category', 'Price', 'Custom', 'Active', 'Actions'].map(h => (
                        <div key={h} style={{ color: '#333', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em' }}>{h.toUpperCase()}</div>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#333', fontSize: 13 }}>No products found.</div>
                ) : filtered.map((p, i) => (
                    <div key={p.id} style={{
                        display: 'grid', gridTemplateColumns: '2fr 100px 80px 70px 80px 120px',
                        padding: '12px 18px', alignItems: 'center',
                        borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        transition: 'background 0.15s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        {/* Name + preview */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                                width: 60, height: 38, borderRadius: 6, flexShrink: 0,
                                background: '#07071a', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid rgba(255,0,204,0.15)', overflow: 'hidden',
                            }}>
                                {p.image
                                    ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : <span style={{ fontFamily: getFont(p), fontSize: 11, color: '#FF00CC', textShadow: '0 0 6px #FF00CC', lineHeight: 1 }}>{p.name.split(' ')[0]}</span>
                                }
                            </div>
                            <div>
                                <div style={{ color: '#ddd', fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                                <div style={{ color: '#333', fontSize: 11, marginTop: 1 }}>{p.slug}</div>
                            </div>
                        </div>

                        <div style={{ color: p.category === 'custom' ? '#BF5FFF' : '#00FFFF', fontSize: 11, fontWeight: 600 }}>
                            {p.category === 'custom' ? 'Custom' : 'Pre-built'}
                        </div>
                        <div style={{ color: '#FF00CC', fontWeight: 700, fontSize: 14 }}>${p.base_price}</div>
                        <div style={{ color: p.is_customizable ? '#39FF14' : '#333', fontSize: 12 }}>{p.is_customizable ? 'Yes' : 'No'}</div>
                        <button onClick={() => handleToggle(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <ActiveDot active={p.active} />
                            <span style={{ color: p.active ? '#39FF14' : '#444', fontSize: 11 }}>{p.active ? 'Live' : 'Hidden'}</span>
                        </button>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 6 }}>
                            <Link href={`/admin/products/${p.id}/edit`} style={{ textDecoration: 'none' }}>
                                <button style={{ padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', background: 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.2)', color: '#00FFFF' }}>Edit</button>
                            </Link>
                            <button onClick={() => handleDelete(p.id)} style={{ padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', background: 'rgba(255,50,50,0.08)', border: '1px solid rgba(255,50,50,0.2)', color: '#ff6666' }}>Del</button>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ color: '#333', fontSize: 12, marginTop: 10 }}>{filtered.length} of {products.length} products</div>
        </AdminLayout>
    );
}
