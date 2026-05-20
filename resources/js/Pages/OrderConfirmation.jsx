import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { CheckCircleFilled } from '@ant-design/icons';
import AppLayout from '@/Layouts/AppLayout';

export default function OrderConfirmation({ order }) {
    return (
        <AppLayout>
            <Head title="Order Confirmed" />

            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                {/* Animated checkmark */}
                <div style={{
                    fontSize: 80, color: '#39FF14',
                    textShadow: '0 0 20px #39FF14, 0 0 40px #39FF14',
                    marginBottom: 24,
                    animation: 'neon-flicker 3s infinite',
                }}>
                    <CheckCircleFilled />
                </div>

                <h1 style={{
                    color: '#39FF14', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    fontFamily: "'Pacifico', cursive",
                    textShadow: '0 0 16px #39FF14',
                    marginBottom: 12,
                }}>
                    Order Confirmed!
                </h1>

                {order && (
                    <p style={{ color: '#aaa', fontSize: 16, marginBottom: 8 }}>
                        Order #{order.order_number}
                    </p>
                )}
                <p style={{ color: '#777', fontSize: 15, maxWidth: 480, margin: '0 auto 40px' }}>
                    Thanks {order?.customer_name}! Your neon sign is now in production.
                    We'll email you at <strong style={{ color: '#ccc' }}>{order?.customer_email}</strong> with tracking info.
                </p>

                {/* Order items */}
                {order?.items && order.items.length > 0 && (
                    <div style={{
                        background: '#0f0f1a',
                        border: '1px solid rgba(0,255,255,0.15)',
                        borderRadius: 12,
                        padding: 24,
                        maxWidth: 500,
                        margin: '0 auto 40px',
                        textAlign: 'left',
                    }}>
                        <h3 style={{ color: '#e0e0e0', marginBottom: 16, fontWeight: 700 }}>Items Ordered</h3>
                        {order.items.map((item, idx) => (
                            <div key={idx} style={{
                                display: 'flex', justifyContent: 'space-between',
                                marginBottom: 12, color: '#ccc', fontSize: 14,
                            }}>
                                <span>
                                    {item.product_name} × {item.quantity}
                                    {item.neon_color && (
                                        <span style={{
                                            display: 'inline-block', width: 10, height: 10,
                                            borderRadius: '50%', background: item.neon_color,
                                            boxShadow: `0 0 4px ${item.neon_color}`,
                                            marginLeft: 8,
                                        }} />
                                    )}
                                </span>
                                <span>${(item.unit_price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div style={{
                            borderTop: '1px solid rgba(0,255,255,0.1)',
                            paddingTop: 12, marginTop: 8,
                            display: 'flex', justifyContent: 'space-between',
                        }}>
                            <strong style={{ color: '#e0e0e0' }}>Total</strong>
                            <strong style={{ color: '#FF00CC', textShadow: '0 0 8px rgba(255,0,204,0.5)' }}>
                                ${order.total}
                            </strong>
                        </div>
                    </div>
                )}

                {/* Timeline */}
                <div style={{
                    maxWidth: 500, margin: '0 auto 40px',
                    display: 'flex', justifyContent: 'space-between',
                    position: 'relative',
                }}>
                    <div style={{
                        position: 'absolute', top: 16,
                        left: '10%', right: '10%', height: 2,
                        background: 'linear-gradient(90deg, #39FF14, #00FFFF, #BF5FFF)',
                    }} />
                    {['Order Placed', 'In Production', 'Shipped', 'Delivered'].map((step, i) => (
                        <div key={step} style={{ textAlign: 'center', zIndex: 1 }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: i === 0 ? '#39FF14' : '#1a1a2e',
                                border: `2px solid ${i === 0 ? '#39FF14' : 'rgba(255,255,255,0.1)'}`,
                                boxShadow: i === 0 ? '0 0 12px #39FF14' : 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 8px',
                                fontSize: 12,
                                color: i === 0 ? '#000' : '#555',
                                fontWeight: 700,
                            }}>
                                {i + 1}
                            </div>
                            <div style={{ color: i === 0 ? '#ccc' : '#555', fontSize: 11, maxWidth: 70 }}>
                                {step}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/">
                        <button className="btn-neon-cyan" style={{ fontSize: 15, padding: '12px 28px' }}>
                            Back to Home
                        </button>
                    </Link>
                    <Link href="/catalog">
                        <button className="btn-neon-pink" style={{ fontSize: 15, padding: '12px 28px' }}>
                            Shop More Signs
                        </button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
