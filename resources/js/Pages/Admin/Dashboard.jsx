import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const STATUS_COLORS = {
    pending_payment: '#FF8C00',
    processing:      '#00FFFF',
    on_hold:         '#BF5FFF',
    completed:       '#39FF14',
    cancelled:       '#ff4d4f',
    refunded:        '#FF6EC7',
};

/* Mini bar chart using CSS */
function RevenueChart({ days }) {
    if (!days || days.length === 0) return null;
    const max = Math.max(...days.map(d => d.revenue), 1);
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 80 }}>
                {days.map((d, i) => {
                    const h = Math.max((d.revenue / max) * 80, d.revenue > 0 ? 3 : 0);
                    return (
                        <div key={d.date} title={`${d.date}\nA$${d.revenue.toFixed(2)}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'default' }}>
                            <div style={{
                                width: '100%', height: h, borderRadius: '3px 3px 0 0',
                                background: d.revenue > 0
                                    ? `linear-gradient(to top, #FF00CC, #BF5FFF)`
                                    : 'rgba(255,255,255,0.04)',
                                boxShadow: d.revenue > 0 ? '0 0 4px #FF00CC60' : 'none',
                                transition: 'height 0.3s ease',
                            }} />
                        </div>
                    );
                })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, color: '#333', fontSize: 10 }}>
                <span>{days[0]?.date?.slice(5)}</span>
                <span>{days[Math.floor(days.length / 2)]?.date?.slice(5)}</span>
                <span>{days[days.length - 1]?.date?.slice(5)}</span>
            </div>
        </div>
    );
}

export default function Dashboard({ stats = {}, recentProducts = [], orderStats = {}, chartDays = [], topProducts = [], recentOrders = [] }) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            {/* Revenue cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 20 }}>
                {[
                    { label: 'Today',       value: stats.revenue_today,  color: '#FF00CC', prefix: 'A$' },
                    { label: 'This Week',   value: stats.revenue_week,   color: '#00FFFF', prefix: 'A$' },
                    { label: 'This Month',  value: stats.revenue_month,  color: '#BF5FFF', prefix: 'A$' },
                    { label: 'All Time',    value: stats.revenue_total,  color: '#39FF14', prefix: 'A$' },
                ].map(card => (
                    <div key={card.label} style={{ background: '#0c0c22', border: `1px solid ${card.color}20`, borderRadius: 12, padding: '18px 20px' }}>
                        <div style={{ color: '#444', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 6 }}>REVENUE — {card.label.toUpperCase()}</div>
                        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 30, color: card.color, textShadow: `0 0 14px ${card.color}70`, lineHeight: 1 }}>
                            {card.prefix}{(card.value ?? 0).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Order count cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 24 }}>
                {[
                    { key: 'products',       label: 'Products',  color: '#FF00CC', icon: '💡', href: '/admin/products' },
                    { key: 'orders',         label: 'Orders',    color: '#BF5FFF', icon: '📦', href: '/admin/orders'   },
                    { key: 'gallery_items',  label: 'Gallery',   color: '#00FFFF', icon: '🖼',  href: '/admin/gallery'  },
                    { key: 'active_products',label: 'Active',    color: '#39FF14', icon: '✅',  href: '/admin/products' },
                ].map(card => (
                    <Link key={card.key} href={card.href} style={{ textDecoration: 'none' }}>
                        <div style={{ background: '#0c0c22', border: `1px solid ${card.color}18`, borderRadius: 10, padding: '16px 18px', cursor: 'pointer' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = `${card.color}40`}
                            onMouseLeave={e => e.currentTarget.style.borderColor = `${card.color}18`}
                        >
                            <div style={{ fontSize: 20 }}>{card.icon}</div>
                            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 36, color: card.color, textShadow: `0 0 14px ${card.color}60`, lineHeight: 1, marginTop: 4 }}>
                                {stats[card.key] ?? 0}
                            </div>
                            <div style={{ color: '#444', fontSize: 11, fontWeight: 600, marginTop: 2 }}>{card.label}</div>
                        </div>
                    </Link>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

                {/* Revenue chart */}
                <div style={{ background: '#0c0c22', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '20px 22px' }}>
                    <div style={{ color: '#888', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 14 }}>REVENUE — LAST 30 DAYS</div>
                    <RevenueChart days={chartDays} />
                    {chartDays.every(d => d.revenue === 0) && (
                        <div style={{ color: '#333', fontSize: 12, textAlign: 'center', marginTop: 8 }}>No paid orders yet</div>
                    )}
                </div>

                {/* Orders by status */}
                <div style={{ background: '#0c0c22', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '20px 22px' }}>
                    <div style={{ color: '#888', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 14 }}>ORDERS BY STATUS</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {Object.entries(STATUS_COLORS).map(([key, color]) => {
                            const count = orderStats[key] ?? 0;
                            const total = stats.orders || 1;
                            const pct   = Math.round((count / total) * 100);
                            return (
                                <div key={key}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ color, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                                        <span style={{ color: '#555', fontSize: 12 }}>{count}</span>
                                    </div>
                                    <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}`, borderRadius: 2, transition: 'width 0.5s ease' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

                {/* Top products */}
                <div style={{ background: '#0c0c22', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '20px 22px' }}>
                    <div style={{ color: '#888', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 14 }}>TOP PRODUCTS BY REVENUE</div>
                    {topProducts.length === 0 ? (
                        <div style={{ color: '#333', fontSize: 13 }}>No paid orders yet.</div>
                    ) : topProducts.map((p, i) => (
                        <div key={p.product_name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ color: i === 0 ? '#FF8C00' : '#444', fontWeight: 700, fontSize: 13, minWidth: 18 }}>#{i + 1}</span>
                                <div>
                                    <div style={{ color: '#ccc', fontSize: 13, fontWeight: 600 }}>{p.product_name}</div>
                                    <div style={{ color: '#444', fontSize: 11 }}>{p.units} units</div>
                                </div>
                            </div>
                            <span style={{ color: '#FF00CC', fontWeight: 700, fontSize: 14 }}>A${parseFloat(p.revenue).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                {/* Quick links */}
                <div style={{ background: '#0c0c22', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '20px 22px' }}>
                    <div style={{ color: '#888', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 14 }}>QUICK ACTIONS</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[
                            { href: '/admin/products/create', label: '+ Add Product',       color: '#FF00CC' },
                            { href: '/admin/orders',          label: '📦 View All Orders',  color: '#00FFFF' },
                            { href: '/admin/gallery/create',  label: '+ Add Gallery Item',  color: '#BF5FFF' },
                            { href: '/admin/content',         label: 'Edit Site Content',   color: '#FF8C00' },
                            { href: '/catalog',               label: '↗ View Shop',         color: '#39FF14' },
                        ].map(link => (
                            <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                                <div style={{ padding: '10px 14px', borderRadius: 8, cursor: 'pointer', background: `${link.color}08`, border: `1px solid ${link.color}25`, color: link.color, fontWeight: 600, fontSize: 13 }}
                                    onMouseEnter={e => e.currentTarget.style.background = `${link.color}14`}
                                    onMouseLeave={e => e.currentTarget.style.background = `${link.color}08`}
                                >
                                    {link.label}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div style={{ background: '#0c0c22', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '20px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ color: '#888', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em' }}>RECENT ORDERS</div>
                    <Link href="/admin/orders" style={{ color: '#00FFFF', fontSize: 12, textDecoration: 'none' }}>View all →</Link>
                </div>
                {recentOrders.length === 0 ? (
                    <div style={{ color: '#333', fontSize: 13 }}>No orders yet.</div>
                ) : (
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr', padding: '0 0 8px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#333', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>
                            <span>ORDER</span><span>CUSTOMER</span><span>DATE</span><span>TOTAL</span><span>STATUS</span>
                        </div>
                        {recentOrders.map(o => {
                            const sc = STATUS_COLORS[o.status] || '#aaa';
                            return (
                                <Link key={o.id} href={`/admin/orders/${o.id}`} style={{ textDecoration: 'none' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', alignItems: 'center' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <span style={{ color: '#FF00CC', fontWeight: 700, fontSize: 12 }}>{o.order_number}</span>
                                        <span style={{ color: '#ccc', fontSize: 12 }}>{o.customer_name}</span>
                                        <span style={{ color: '#555', fontSize: 11 }}>{new Date(o.created_at).toLocaleDateString('en-AU', { day: '2-digit', month: 'short' })}</span>
                                        <span style={{ color: '#e0e0e0', fontWeight: 700 }}>A${parseFloat(o.total).toFixed(2)}</span>
                                        <span style={{ color: sc, fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>{o.status.replace(/_/g, ' ')}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

const QUICK_LINKS = [
    { href: '/admin/products/create', label: '+ Add Product',      color: '#FF00CC' },
    { href: '/admin/gallery/create',  label: '+ Add Gallery Item', color: '#00FFFF' },
    { href: '/admin/content',         label: 'Edit Site Content',  color: '#BF5FFF' },
    { href: '/catalog',               label: '↗ View Shop',        color: '#39FF14', external: true },
];
