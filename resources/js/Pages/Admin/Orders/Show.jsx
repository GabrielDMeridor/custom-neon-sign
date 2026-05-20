import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Input, Select, Tag, Tooltip } from 'antd';
import { ArrowLeftOutlined, UserOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, SyncOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';

const STATUS_OPTIONS = [
    { value: 'pending_payment', label: 'Pending Payment', color: '#FF8C00' },
    { value: 'processing',      label: 'Processing',      color: '#00FFFF' },
    { value: 'on_hold',         label: 'On Hold',         color: '#BF5FFF' },
    { value: 'completed',       label: 'Completed',       color: '#39FF14' },
    { value: 'cancelled',       label: 'Cancelled',       color: '#ff4d4f' },
    { value: 'refunded',        label: 'Refunded',        color: '#FF6EC7' },
];

const STATUS_COLORS = Object.fromEntries(STATUS_OPTIONS.map(s => [s.value, s.color]));

// Returns context-aware transitions based on BOTH order status and payment status
function getTransitions(orderStatus, paymentStatus) {
    const isPaid = paymentStatus === 'paid';
    switch (orderStatus) {
        case 'pending_payment':
            // Can only proceed to processing once payment is confirmed
            return isPaid
                ? [
                    { to: 'processing', label: 'Mark Processing', color: '#00FFFF' },
                    { to: 'cancelled',  label: 'Cancel Order',    color: '#ff4d4f', confirm: true },
                  ]
                : [
                    { to: 'cancelled',  label: 'Cancel Order',    color: '#ff4d4f', confirm: true },
                  ];
        case 'processing':
            return [
                { to: 'completed', label: 'Mark Completed',    color: '#39FF14' },
                { to: 'on_hold',   label: 'Put On Hold',       color: '#BF5FFF' },
                { to: 'cancelled', label: 'Cancel Order',      color: '#ff4d4f', confirm: true },
            ];
        case 'on_hold':
            return [
                { to: 'processing', label: 'Resume Processing', color: '#00FFFF' },
                { to: 'cancelled',  label: 'Cancel Order',      color: '#ff4d4f', confirm: true },
            ];
        case 'completed':
            return [{ to: 'refunded', label: 'Issue Refund', color: '#FF6EC7', confirm: true }];
        default:
            return [];
    }
}

function InfoRow({ icon, label, value }) {
    return (
        <div style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
            <span style={{ color: '#555', fontSize: 14, marginTop: 1 }}>{icon}</span>
            <div>
                <div style={{ color: '#555', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em' }}>{label}</div>
                <div style={{ color: '#ccc', fontSize: 13, marginTop: 2 }}>{value || '—'}</div>
            </div>
        </div>
    );
}

function NoteEntry({ note }) {
    const typeColors = { admin: '#FF00CC', system: '#00FFFF', customer: '#BF5FFF' };
    const color      = typeColors[note.type] || '#888';
    return (
        <div style={{ borderLeft: `3px solid ${color}`, paddingLeft: 14, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                    {note.type === 'admin' ? (note.user?.name || 'Admin') : note.type}
                </span>
                <span style={{ color: '#444', fontSize: 11 }}>
                    {new Date(note.created_at).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
            </div>
            <div style={{ color: '#aaa', fontSize: 13, lineHeight: 1.6 }}>{note.content}</div>
            {note.notify_customer && <div style={{ color: '#FF8C00', fontSize: 11, marginTop: 4 }}>📧 Customer notified</div>}
        </div>
    );
}

export default function OrderShow({ order }) {
    const [status, setStatus] = useState(order.status);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const noteForm = useForm({ content: '', notify_customer: false });

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        setUpdatingStatus(true);
        router.patch(`/admin/orders/${order.id}/status`, { status: newStatus }, {
            onFinish: () => setUpdatingStatus(false),
            preserveScroll: true,
        });
    };

    const handleSync = () => {
        setSyncing(true);
        router.post(`/admin/orders/${order.id}/sync`, {}, {
            preserveScroll: true,
            onFinish: () => setSyncing(false),
        });
    };

    const handleQuickAction = (transition) => {
        if (transition.confirm) {
            const label = transition.label.toLowerCase();
            if (!window.confirm(`Are you sure you want to "${label}" this order?\n\nThis action will be recorded in the order timeline.`)) return;
        }
        handleStatusChange(transition.to);
    };

    const transitions = getTransitions(status, order.payment_status);

    const handleAddNote = (e) => {
        e.preventDefault();
        noteForm.post(`/admin/orders/${order.id}/notes`, {
            preserveScroll: true,
            onSuccess: () => noteForm.reset(),
        });
    };

    const handleDelete = () => {
        if (confirm('Delete this order permanently? This cannot be undone.')) {
            router.delete(`/admin/orders/${order.id}`);
        }
    };

    const statusColor = STATUS_COLORS[status] || '#aaa';
    const paid = order.payment_status === 'paid';

    return (
        <AdminLayout title={`Order ${order.order_number}`}>
            <Head title={`Order ${order.order_number}`} />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <Link href="/admin/orders" style={{ color: '#555', textDecoration: 'none', fontSize: 13 }}>
                        <ArrowLeftOutlined /> Back to Orders
                    </Link>
                    <h1 style={{ color: '#e0e0e0', fontSize: 22, fontWeight: 800, margin: '8px 0 4px' }}>{order.order_number}</h1>
                    <div style={{ color: '#555', fontSize: 13 }}>
                        {new Date(order.created_at).toLocaleString('en-AU', { dateStyle: 'full', timeStyle: 'short' })}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {!paid && order.payment_intent_id && (
                        <Tooltip title="Query Stripe and update payment status">
                            <button onClick={handleSync} disabled={syncing}
                                style={{ background: syncing ? 'rgba(0,255,255,0.04)' : 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.25)', borderRadius: 8, color: '#00FFFF', cursor: syncing ? 'not-allowed' : 'pointer', padding: '7px 14px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, opacity: syncing ? 0.6 : 1 }}>
                                <SyncOutlined spin={syncing} /> {syncing ? 'Syncing…' : 'Sync Payment'}
                            </button>
                        </Tooltip>
                    )}
                    <button onClick={handleDelete}
                        style={{ background: 'rgba(255,77,79,0.08)', border: '1px solid rgba(255,77,79,0.3)', borderRadius: 8, color: '#ff4d4f', cursor: 'pointer', padding: '7px 14px', fontSize: 13 }}>
                        Delete
                    </button>
                </div>
            </div>

            {/* ─── Status Workflow Bar ─────────────────────────────────────────── */}
            <div style={{ background: '#0c0c22', borderRadius: 12, border: `1px solid ${statusColor}30`, padding: '20px', marginBottom: 24 }}>

                {/* Payment warning — only shown when payment is not yet confirmed */}
                {!paid && (status === 'pending_payment' || status === 'processing') && (
                    <div style={{ background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, display: 'flex', alignItems: 'flex-start', gap: 10, color: '#FF8C00', fontSize: 13, lineHeight: 1.6 }}>
                        <span style={{ fontSize: 16, flexShrink: 0 }}>⚠</span>
                        <span>
                            <strong>Payment not yet confirmed.</strong>{' '}
                            {order.payment_intent_id
                                ? 'Use the "Sync Payment" button in the header to verify with Stripe.'
                                : 'No Stripe Payment Intent is linked to this order.'}
                            {' '}This order cannot be moved to <em>Processing</em> or <em>Completed</em> until payment is confirmed.
                        </span>
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>

                    {/* Current status pill + payment indicator */}
                    <div style={{ flexShrink: 0 }}>
                        <div style={{ color: '#333', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }}>CURRENT STATUS</div>
                        <span style={{ padding: '7px 18px', borderRadius: 24, background: `${statusColor}18`, border: `1px solid ${statusColor}50`, color: statusColor, fontWeight: 700, fontSize: 13, boxShadow: `0 0 14px ${statusColor}20` }}>
                            ● {STATUS_OPTIONS.find(s => s.value === status)?.label}
                        </span>
                        <div style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color: paid ? '#39FF14' : '#666' }}>
                            {paid ? '✓ Payment confirmed' : '✗ Payment not confirmed'}
                        </div>
                    </div>

                    {transitions.length > 0 && (
                        <span style={{ color: '#2a2a3a', fontSize: 22, flexShrink: 0, paddingTop: 26 }}>→</span>
                    )}

                    {/* Context-aware action buttons */}
                    {transitions.length > 0 ? (
                        <div>
                            <div style={{ color: '#333', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }}>NEXT ACTIONS</div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {transitions.map(t => (
                                    <button key={t.to} onClick={() => handleQuickAction(t)} disabled={updatingStatus}
                                        style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: updatingStatus ? 'not-allowed' : 'pointer', background: `${t.color}12`, border: `1px solid ${t.color}40`, color: t.color, opacity: updatingStatus ? 0.5 : 1, transition: 'background 0.15s', display: 'flex', alignItems: 'center', gap: 6 }}
                                        onMouseEnter={e => { if (!updatingStatus) e.currentTarget.style.background = `${t.color}22`; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = `${t.color}12`; }}>
                                        {t.confirm ? '⚠' : '→'} {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div style={{ paddingTop: 22 }}>
                            <span style={{ color: '#333', fontSize: 13, fontStyle: 'italic' }}>This order is in a final state — no further actions available.</span>
                        </div>
                    )}

                    {/* Admin override dropdown — always available, bypasses flow guidance */}
                    <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
                        <div style={{ color: '#2a2a3a', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4 }}>ADMIN OVERRIDE</div>
                        <div style={{ color: '#333', fontSize: 11, marginBottom: 8 }}>Force any status (bypasses rules)</div>
                        <Select
                            value={status}
                            onChange={handleStatusChange}
                            loading={updatingStatus}
                            style={{ width: 178 }}
                            options={STATUS_OPTIONS.map(s => ({
                                value: s.value,
                                label: <span style={{ color: s.color, fontWeight: 600 }}>{s.label}</span>,
                            }))}
                        />
                    </div>
                </div>
            </div>
            {/* ─────────────────────────────────────────────────────────────────── */}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 20 }}>

                {/* Order Items */}
                <div style={{ gridColumn: '1 / -1', background: '#0c0c22', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', padding: '20px 24px' }}>
                    <div style={{ color: '#888', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>ORDER ITEMS</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 0 }}>
                        <div style={{ color: '#444', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>PRODUCT</div>
                        <div style={{ color: '#444', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'right' }}>UNIT PRICE</div>
                        <div style={{ color: '#444', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>QTY</div>
                        <div style={{ color: '#444', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'right' }}>TOTAL</div>

                        {order.items.map(item => (
                            <React.Fragment key={item.id}>
                                <div style={{ paddingTop: 14, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    <div style={{ color: '#ccc', fontWeight: 600, fontSize: 14 }}>{item.product_name}</div>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                                        {item.neon_color && <span style={{ fontSize: 11, color: '#666', display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: item.neon_color, display: 'inline-block', boxShadow: `0 0 4px ${item.neon_color}` }} />{item.neon_color}</span>}
                                        {item.size && <span style={{ fontSize: 11, color: '#666' }}>📐 {item.size}</span>}
                                        {item.custom_text && <span style={{ fontSize: 11, color: '#BF5FFF' }}>"{item.custom_text}"</span>}
                                    </div>
                                </div>
                                <div style={{ paddingTop: 14, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#aaa', fontSize: 13, textAlign: 'right' }}>
                                    A${parseFloat(item.unit_price).toFixed(2)}
                                </div>
                                <div style={{ paddingTop: 14, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#aaa', fontSize: 13, textAlign: 'center' }}>
                                    {item.quantity}
                                </div>
                                <div style={{ paddingTop: 14, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#e0e0e0', fontWeight: 700, fontSize: 14, textAlign: 'right' }}>
                                    A${(parseFloat(item.unit_price) * item.quantity).toFixed(2)}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>

                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                        {[
                            { label: 'Subtotal', value: `A$${parseFloat(order.subtotal).toFixed(2)}` },
                            { label: 'Shipping', value: `A$${parseFloat(order.shipping).toFixed(2)}` },
                        ].map(r => (
                            <div key={r.label} style={{ display: 'flex', justifyContent: 'flex-end', gap: 32, marginBottom: 6 }}>
                                <span style={{ color: '#666', fontSize: 13 }}>{r.label}</span>
                                <span style={{ color: '#aaa', fontSize: 13, minWidth: 80, textAlign: 'right' }}>{r.value}</span>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 32, marginTop: 8, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                            <span style={{ color: '#e0e0e0', fontWeight: 700 }}>Total</span>
                            <span style={{ color: '#FF00CC', fontWeight: 800, fontSize: 18, minWidth: 80, textAlign: 'right', textShadow: '0 0 10px #FF00CC60' }}>A${parseFloat(order.total).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Customer Details */}
                <div style={{ background: '#0c0c22', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', padding: '20px 24px' }}>
                    <div style={{ color: '#888', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>CUSTOMER</div>
                    <InfoRow icon={<UserOutlined />}        label="NAME"    value={order.customer_name} />
                    <InfoRow icon={<MailOutlined />}        label="EMAIL"   value={order.customer_email} />
                    <InfoRow icon={<PhoneOutlined />}       label="PHONE"   value={order.customer_phone} />
                    <InfoRow icon={<EnvironmentOutlined />} label="SHIPPING ADDRESS" value={order.shipping_address} />
                    {order.customer_notes && <InfoRow icon="📝" label="CUSTOMER NOTES" value={order.customer_notes} />}
                </div>

                {/* Payment Details */}
                <div style={{ background: '#0c0c22', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', padding: '20px 24px' }}>
                    <div style={{ color: '#888', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>PAYMENT</div>
                    <InfoRow icon="💳" label="STATUS" value={
                        <span style={{ color: paid ? '#39FF14' : '#ff4d4f', fontWeight: 700 }}>
                            {paid ? '✓ Paid' : order.payment_status}
                        </span>
                    } />
                    {order.payment_intent_id && <InfoRow icon="🔑" label="STRIPE INTENT" value={<span style={{ fontFamily: 'monospace', fontSize: 11 }}>{order.payment_intent_id}</span>} />}
                    {order.payment_method_type && <InfoRow icon="💰" label="METHOD" value={order.payment_method_type.toUpperCase()} />}
                    <InfoRow icon="🌏" label="CURRENCY" value={order.currency || 'AUD'} />
                    {order.paid_at && <InfoRow icon="🕐" label="PAID AT" value={new Date(order.paid_at).toLocaleString('en-AU')} />}
                    {order.shipped_at && <InfoRow icon="📦" label="SHIPPED AT" value={new Date(order.shipped_at).toLocaleString('en-AU')} />}
                    {order.completed_at && <InfoRow icon="✅" label="COMPLETED AT" value={new Date(order.completed_at).toLocaleString('en-AU')} />}
                </div>

                {/* Order Notes / Timeline */}
                <div style={{ gridColumn: '1 / -1', background: '#0c0c22', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', padding: '20px 24px' }}>
                    <div style={{ color: '#888', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>ORDER NOTES &amp; TIMELINE</div>

                    {/* Existing notes */}
                    <div style={{ marginBottom: 20 }}>
                        {(order.notes || []).length === 0 ? (
                            <div style={{ color: '#333', fontSize: 13 }}>No notes yet.</div>
                        ) : (order.notes || []).map(note => (
                            <NoteEntry key={note.id} note={note} />
                        ))}
                    </div>

                    {/* Add note form */}
                    <form onSubmit={handleAddNote} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
                        <div style={{ color: '#555', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 10 }}>ADD NOTE</div>
                        <Input.TextArea
                            value={noteForm.data.content}
                            onChange={e => noteForm.setData('content', e.target.value)}
                            placeholder="Add an internal note about this order…"
                            rows={3}
                            style={{ background: '#080810', borderColor: 'rgba(255,255,255,0.1)', color: '#e0e0e0', marginBottom: 10 }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#888', fontSize: 13 }}>
                                <input type="checkbox"
                                    checked={noteForm.data.notify_customer}
                                    onChange={e => noteForm.setData('notify_customer', e.target.checked)}
                                    style={{ accentColor: '#FF00CC' }}
                                />
                                Notify customer via email
                            </label>
                            <button type="submit" disabled={noteForm.processing || !noteForm.data.content}
                                style={{
                                    padding: '8px 20px', borderRadius: 8,
                                    background: 'rgba(255,0,204,0.12)', border: '1px solid rgba(255,0,204,0.3)',
                                    color: '#FF00CC', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                                    opacity: noteForm.processing || !noteForm.data.content ? 0.5 : 1,
                                }}>
                                {noteForm.processing ? 'Adding…' : 'Add Note'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </AdminLayout>
    );
}
