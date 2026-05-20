import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Input, Select, Tag, Tooltip } from 'antd';
import { SearchOutlined, EyeOutlined, FilterOutlined, SyncOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';

const STATUS_COLORS = {
    pending_payment: { bg: '#FF8C0020', border: '#FF8C0060', text: '#FF8C00', label: 'Pending Payment' },
    processing:      { bg: '#00FFFF20', border: '#00FFFF60', text: '#00FFFF', label: 'Processing'      },
    on_hold:         { bg: '#BF5FFF20', border: '#BF5FFF60', text: '#BF5FFF', label: 'On Hold'         },
    completed:       { bg: '#39FF1420', border: '#39FF1460', text: '#39FF14', label: 'Completed'       },
    cancelled:       { bg: '#ff4d4f20', border: '#ff4d4f60', text: '#ff4d4f', label: 'Cancelled'       },
    refunded:        { bg: '#FF6EC720', border: '#FF6EC760', text: '#FF6EC7', label: 'Refunded'        },
};

const PAYMENT_COLORS = {
    unpaid:  { text: '#ff4d4f', label: 'Unpaid'  },
    paid:    { text: '#39FF14', label: 'Paid'    },
    failed:  { text: '#FF8C00', label: 'Failed'  },
    refunded:{ text: '#BF5FFF', label: 'Refunded'},
};

function StatusBadge({ status }) {
    const c = STATUS_COLORS[status] || { bg: '#ffffff10', border: '#ffffff30', text: '#aaa', label: status };
    return (
        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: c.bg, border: `1px solid ${c.border}`, color: c.text, whiteSpace: 'nowrap' }}>
            {c.label}
        </span>
    );
}

// Returns the single most logical next action for a row-level quick button
function getPrimaryAction(order) {
    const { status, payment_status } = order;
    if (status === 'pending_payment' && payment_status === 'paid')
        return { label: '\u2192 Process',  to: 'processing', color: '#00FFFF' };
    if (status === 'processing')
        return { label: '\u2713 Complete', to: 'completed',  color: '#39FF14' };
    if (status === 'on_hold')
        return { label: '\u25b6 Resume',  to: 'processing', color: '#00FFFF' };
    return null;
}

export default function OrdersIndex({ orders, stats, filters }) {
    const [search, setSearch]         = useState(filters?.search || '');
    const [status, setStatus]         = useState(filters?.status || '');
    const [payment, setPayment]       = useState(filters?.payment_status || '');
    const [syncingId, setSyncingId]   = useState(null);
    const [syncingAll, setSyncingAll] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const applyFilters = (overrides = {}) => {
        const params = { search, status, payment_status: payment, ...overrides };
        Object.keys(params).forEach(k => !params[k] && delete params[k]);
        router.get('/admin/orders', params, { preserveState: true, replace: true });
    };

    const handleSync = (orderId) => {
        setSyncingId(orderId);
        router.post(`/admin/orders/${orderId}/sync`, {}, {
            preserveScroll: true,
            onFinish: () => setSyncingId(null),
        });
    };

    const handleSyncAll = () => {
        setSyncingAll(true);
        router.post('/admin/orders/sync-all', {}, {
            onFinish: () => setSyncingAll(false),
        });
    };

    const handleInlineStatus = (orderId, newStatus) => {
        if (newStatus === 'completed' && !window.confirm('Mark this order as Completed?')) return;
        setUpdatingId(orderId);
        router.patch(`/admin/orders/${orderId}/status`, { status: newStatus }, {
            preserveScroll: true,
            onFinish: () => setUpdatingId(null),
        });
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') applyFilters({ search: e.target.value });
    };

    const unpaidSyncable = orders.data.filter(o => o.payment_status !== 'paid' && o.payment_intent_id).length;

    return (
        <AdminLayout title="Orders">
            <Head title="Orders" />

            {/* Status quick-filter cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginBottom: 24 }}>
                {Object.entries(STATUS_COLORS).map(([key, c]) => (
                    <button key={key} onClick={() => { const s = status === key ? '' : key; setStatus(s); applyFilters({ status: s }); }}
                        style={{
                            background: status === key ? c.bg : '#0c0c22',
                            border: `1px solid ${status === key ? c.border : 'rgba(255,255,255,0.06)'}`,
                            borderRadius: 10, padding: '12px 14px', cursor: 'pointer', textAlign: 'left',
                            transition: 'all 0.15s',
                        }}>
                        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, color: c.text, lineHeight: 1, textShadow: `0 0 10px ${c.text}60` }}>
                            {stats?.[key] ?? 0}
                        </div>
                        <div style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', marginTop: 4 }}>{c.label.toUpperCase()}</div>
                    </button>
                ))}
                <button onClick={() => { setStatus(''); setPayment(''); setSearch(''); applyFilters({ status: '', payment_status: '', search: '' }); }}
                    style={{ background: '#0c0c22', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 14px', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, color: '#aaa', lineHeight: 1 }}>{stats?.total ?? 0}</div>
                    <div style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', marginTop: 4 }}>ALL ORDERS</div>
                </button>
            </div>

            {/* Filters bar */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                <Input
                    prefix={<SearchOutlined style={{ color: '#555' }} />}
                    placeholder="Search order #, name, email…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={handleSearch}
                    onBlur={() => applyFilters({ search })}
                    style={{ background: '#0c0c22', borderColor: 'rgba(255,255,255,0.1)', color: '#e0e0e0', width: 280 }}
                    allowClear
                />
                <Select
                    placeholder="Payment status"
                    value={payment || undefined}
                    onChange={v => { setPayment(v || ''); applyFilters({ payment_status: v || '' }); }}
                    allowClear
                    style={{ width: 160 }}
                    options={[
                        { value: 'unpaid',   label: '🔴 Unpaid'   },
                        { value: 'paid',     label: '🟢 Paid'     },
                        { value: 'failed',   label: '🟠 Failed'   },
                        { value: 'refunded', label: '🟣 Refunded' },
                    ]}
                />
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
                    {unpaidSyncable > 0 && (
                        <span style={{ color: '#BF5FFF', fontSize: 12, fontWeight: 700, background: 'rgba(191,95,255,0.1)', border: '1px solid rgba(191,95,255,0.25)', borderRadius: 20, padding: '3px 10px' }}>
                            {unpaidSyncable} unpaid
                        </span>
                    )}
                    <Tooltip title="Check Stripe for all unpaid orders and update their status in one go">
                        <button
                            onClick={handleSyncAll}
                            disabled={syncingAll}
                            style={{
                                background: syncingAll ? 'rgba(191,95,255,0.04)' : 'rgba(191,95,255,0.1)',
                                border: '1px solid rgba(191,95,255,0.3)',
                                borderRadius: 8, color: '#BF5FFF',
                                cursor: syncingAll ? 'not-allowed' : 'pointer',
                                padding: '7px 16px', fontSize: 13,
                                display: 'flex', alignItems: 'center', gap: 6,
                                opacity: syncingAll ? 0.5 : 1, transition: 'opacity 0.15s',
                            }}>
                            <SyncOutlined spin={syncingAll} />
                            {syncingAll ? 'Syncing All…' : 'Sync All Unpaid'}
                        </button>
                    </Tooltip>
                </div>
            </div>

            {/* Orders table */}
            <div style={{ background: '#0c0c22', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.5fr 0.9fr 0.9fr 1.3fr 90px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#444', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>
                    <span>ORDER</span><span>CUSTOMER</span><span>DATE</span><span>TOTAL</span><span>STATUS</span><span>VIEW</span>
                </div>

                {orders.data.length === 0 ? (
                    <div style={{ padding: '48px 20px', textAlign: 'center', color: '#333', fontSize: 14 }}>No orders found.</div>
                ) : orders.data.map(order => {
                    const py          = PAYMENT_COLORS[order.payment_status] || PAYMENT_COLORS.unpaid;
                    const isSyncing   = syncingId === order.id;
                    const isUpdating  = updatingId === order.id;
                    const canSync     = order.payment_status !== 'paid' && order.payment_intent_id;
                    const primaryAction = getPrimaryAction(order);
                    return (
                        <div key={order.id} style={{
                            display: 'grid', gridTemplateColumns: '1.1fr 1.5fr 0.9fr 0.9fr 1.3fr 90px',
                            padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)',
                            alignItems: 'center', transition: 'background 0.1s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <div>
                                <div style={{ color: '#FF00CC', fontWeight: 700, fontSize: 13 }}>{order.order_number}</div>
                                <div style={{ color: py.text, fontSize: 11, marginTop: 2 }}>{py.label}</div>
                            </div>
                            <div>
                                <div style={{ color: '#ccc', fontSize: 13, fontWeight: 600 }}>{order.customer_name}</div>
                                <div style={{ color: '#555', fontSize: 11 }}>{order.customer_email}</div>
                            </div>
                            <div style={{ color: '#666', fontSize: 12 }}>
                                {new Date(order.created_at).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                            <div style={{ color: '#e0e0e0', fontWeight: 700, fontSize: 14 }}>
                                A${parseFloat(order.total).toFixed(2)}
                            </div>

                            {/* Status badge + logical next-action button */}
                            <div>
                                <StatusBadge status={order.status} />
                                {primaryAction ? (
                                    <button
                                        onClick={() => handleInlineStatus(order.id, primaryAction.to)}
                                        disabled={isUpdating}
                                        style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: `${primaryAction.color}12`, border: `1px solid ${primaryAction.color}30`, color: primaryAction.color, cursor: isUpdating ? 'not-allowed' : 'pointer', opacity: isUpdating ? 0.5 : 1 }}>
                                        {isUpdating ? <SyncOutlined spin style={{ fontSize: 10 }} /> : primaryAction.label}
                                    </button>
                                ) : order.status === 'pending_payment' && order.payment_status !== 'paid' ? (
                                    <div style={{ marginTop: 5, fontSize: 10, color: '#FF8C00', fontWeight: 600 }}>⏳ Awaiting payment</div>
                                ) : null}
                            </div>

                            {/* View + per-row sync */}
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                <Link href={`/admin/orders/${order.id}`}>
                                    <Tooltip title="View full order details">
                                        <button style={{ background: 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.2)', borderRadius: 7, color: '#00FFFF', cursor: 'pointer', padding: '6px 10px', fontSize: 12 }}>
                                            <EyeOutlined />
                                        </button>
                                    </Tooltip>
                                </Link>
                                {canSync && (
                                    <Tooltip title="Sync payment with Stripe">
                                        <button
                                            onClick={() => handleSync(order.id)}
                                            disabled={isSyncing}
                                            style={{ background: 'rgba(191,95,255,0.08)', border: '1px solid rgba(191,95,255,0.25)', borderRadius: 7, color: '#BF5FFF', cursor: isSyncing ? 'not-allowed' : 'pointer', padding: '6px 10px', fontSize: 12, opacity: isSyncing ? 0.5 : 1 }}>
                                            <SyncOutlined spin={isSyncing} />
                                        </button>
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {orders.last_page > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
                    {orders.links.map((link, i) => (
                        <button key={i}
                            onClick={() => link.url && router.visit(link.url)}
                            disabled={!link.url}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            style={{
                                padding: '6px 12px', borderRadius: 7, fontSize: 13,
                                background: link.active ? 'rgba(255,0,204,0.15)' : '#0c0c22',
                                border: `1px solid ${link.active ? '#FF00CC50' : 'rgba(255,255,255,0.08)'}`,
                                color: link.active ? '#FF00CC' : link.url ? '#888' : '#333',
                                cursor: link.url ? 'pointer' : 'default',
                            }}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
