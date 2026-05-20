import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const CATEGORIES = ['All', 'Business Signs', 'Wedding & Events', 'Home & Bedroom', 'Bar & Hospitality', 'Custom Text'];

function ActiveDot({ active }) {
    return <div style={{ width: 8, height: 8, borderRadius: '50%', background: active ? '#39FF14' : '#333', boxShadow: active ? '0 0 6px #39FF14' : 'none', display: 'inline-block' }} />;
}

export default function GalleryIndex({ items = [] }) {
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('All');

    const filtered = items
        .filter(i => catFilter === 'All' || i.category === catFilter)
        .filter(i => !search || i.title.toLowerCase().includes(search.toLowerCase()));

    const handleDelete = (id) => {
        if (!confirm('Delete this gallery item?')) return;
        router.delete(`/admin/gallery/${id}`);
    };

    const handleToggle = (id) => {
        router.post(`/admin/gallery/${id}/toggle`);
    };

    return (
        <AdminLayout title="Gallery">
            <Head title="Admin — Gallery" />

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search gallery…"
                    style={{ flex: '1 1 180px', background: '#0c0c22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', color: '#ccc', fontSize: 13, outline: 'none' }}
                />
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setCatFilter(c)} style={{
                            padding: '6px 12px', borderRadius: 16, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                            background: catFilter === c ? 'rgba(0,255,255,0.12)' : 'transparent',
                            border: catFilter === c ? '1px solid rgba(0,255,255,0.4)' : '1px solid rgba(255,255,255,0.07)',
                            color: catFilter === c ? '#00FFFF' : '#444', transition: 'all 0.15s', whiteSpace: 'nowrap',
                        }}>{c}</button>
                    ))}
                </div>
                <Link href="/admin/gallery/create" style={{ textDecoration: 'none', marginLeft: 'auto' }}>
                    <button style={{ padding: '8px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', background: 'linear-gradient(135deg, #00FFFF, #BF5FFF)', color: '#000', border: 'none' }}>
                        + Add Item
                    </button>
                </Link>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#333', padding: '60px 0', fontSize: 14 }}>No items found.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                    {filtered.map(item => (
                        <div key={item.id} style={{
                            background: '#0c0c22',
                            border: `1px solid ${item.color}25`,
                            borderRadius: 12, overflow: 'hidden',
                        }}>
                            {/* Mini preview */}
                            <div style={{
                                height: 110, background: '#07071a',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                position: 'relative',
                            }}>
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: 28, marginBottom: 4 }}>{item.emoji || '✨'}</div>
                                        <div style={{ fontFamily: "'Pacifico',cursive", fontSize: 14, color: item.color, textShadow: `0 0 8px ${item.color}` }}>{item.title}</div>
                                    </div>
                                )}
                                {item.badge && (
                                    <div style={{ position: 'absolute', top: 8, left: 8, padding: '2px 8px', borderRadius: 10, fontSize: 9, fontWeight: 800, background: item.color + '25', border: `1px solid ${item.color}50`, color: item.color }}>{item.badge}</div>
                                )}
                                <button onClick={() => handleToggle(item.id)} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '3px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <ActiveDot active={item.active} />
                                </button>
                            </div>

                            <div style={{ padding: '10px 12px' }}>
                                <div style={{ color: '#ddd', fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{item.title}</div>
                                <div style={{ color: '#444', fontSize: 11, marginBottom: 8 }}>{item.category}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: item.color, boxShadow: `0 0 5px ${item.color}`, flexShrink: 0 }} />
                                    <div style={{ color: '#333', fontSize: 11 }}>{item.color}</div>
                                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                                        <Link href={`/admin/gallery/${item.id}/edit`} style={{ textDecoration: 'none' }}>
                                            <button style={{ padding: '4px 10px', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer', background: 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.2)', color: '#00FFFF' }}>Edit</button>
                                        </Link>
                                        <button onClick={() => handleDelete(item.id)} style={{ padding: '4px 10px', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer', background: 'rgba(255,50,50,0.08)', border: '1px solid rgba(255,50,50,0.2)', color: '#ff6666' }}>Del</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div style={{ color: '#333', fontSize: 12, marginTop: 12 }}>{filtered.length} of {items.length} items</div>
        </AdminLayout>
    );
}
