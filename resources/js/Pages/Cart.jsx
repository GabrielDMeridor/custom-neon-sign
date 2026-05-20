import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Row, Col, InputNumber, Button, Divider, Empty, message } from 'antd';
import { DeleteOutlined, ShoppingOutlined, ArrowRightOutlined } from '@ant-design/icons';
import AppLayout from '@/Layouts/AppLayout';
import { useCart } from '@/Contexts/CartContext';

export default function Cart({ cart }) {
    const { removeItem, updateQty } = useCart();

    const items = cart?.items ?? [];
    const subtotal = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
    const shipping = subtotal > 0 ? 15 : 0;
    const total = subtotal + shipping;

    return (
        <AppLayout>
            <Head title="Your Cart" />

            <h1 style={{
                color: '#00FFFF',
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                fontWeight: 800,
                textShadow: '0 0 16px #00FFFF',
                marginBottom: 32,
            }}>
                Your Cart
            </h1>

            {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <Empty
                        description={<span style={{ color: '#555' }}>Your cart is empty</span>}
                    />
                    <div style={{ marginTop: 32 }}>
                        <Link href="/catalog">
                            <button className="btn-neon-cyan" style={{ fontSize: 15, padding: '12px 32px' }}>
                                <ShoppingOutlined /> Browse Signs
                            </button>
                        </Link>
                    </div>
                </div>
            ) : (
                <Row gutter={[32, 32]}>
                    {/* Cart Items */}
                    <Col xs={24} lg={16}>
                        {items.map(item => (
                            <div key={item.id} className="neon-card" style={{
                                padding: 20, marginBottom: 16,
                                display: 'flex', gap: 20, alignItems: 'flex-start',
                            }}>
                                {/* Sign mini-preview */}
                                <div style={{
                                    width: 100, height: 80,
                                    background: item.background ?? '#000',
                                    borderRadius: 8,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                    border: '1px solid rgba(0,255,255,0.15)',
                                    overflow: 'hidden',
                                }}>
                                    <span style={{
                                        fontFamily: item.font ?? "'Pacifico', cursive",
                                        fontSize: 14,
                                        color: item.neon_color ?? '#FF00CC',
                                        textShadow: `0 0 8px ${item.neon_color ?? '#FF00CC'}`,
                                        textAlign: 'center',
                                        padding: 4,
                                        wordBreak: 'break-all',
                                    }}>
                                        {item.custom_text ?? item.product?.name ?? 'Sign'}
                                    </span>
                                </div>

                                {/* Details */}
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ color: '#e0e0e0', margin: '0 0 6px', fontWeight: 700 }}>
                                        {item.product?.name ?? (item.custom_text ? `"${item.custom_text}"` : 'Custom Sign')}
                                    </h4>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', marginBottom: 12 }}>
                                        {item.neon_color && (
                                            <span style={{ color: '#777', fontSize: 13 }}>
                                                <span style={{
                                                    display: 'inline-block', width: 10, height: 10,
                                                    borderRadius: '50%', background: item.neon_color,
                                                    boxShadow: `0 0 4px ${item.neon_color}`,
                                                    marginRight: 4,
                                                }} />
                                                Colour
                                            </span>
                                        )}
                                        {item.size && (
                                            <span style={{ color: '#777', fontSize: 13 }}>
                                                📐 {item.size}
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <InputNumber
                                            min={1} max={10}
                                            value={item.quantity}
                                            size="small"
                                            style={{ width: 70 }}
                                            onChange={v => updateQty(item.id, v)}
                                        />
                                        <Button
                                            type="text" danger size="small"
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeItem(item.id)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>

                                {/* Price */}
                                <div style={{
                                    textAlign: 'right', flexShrink: 0,
                                    color: '#FF00CC', fontWeight: 800, fontSize: 18,
                                    textShadow: '0 0 8px rgba(255,0,204,0.4)',
                                }}>
                                    ${(item.unit_price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </Col>

                    {/* Order Summary */}
                    <Col xs={24} lg={8}>
                        <div className="neon-card" style={{ padding: 24, position: 'sticky', top: 80 }}>
                            <h3 style={{ color: '#e0e0e0', fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                <span style={{ color: '#aaa' }}>Subtotal</span>
                                <span style={{ color: '#e0e0e0' }}>${subtotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                <span style={{ color: '#aaa' }}>Shipping</span>
                                <span style={{ color: '#e0e0e0' }}>${shipping.toFixed(2)}</span>
                            </div>
                            {subtotal >= 300 && (
                                <div style={{ color: '#39FF14', fontSize: 13, textAlign: 'right', marginBottom: 8 }}>
                                    🎉 Free shipping on orders over $300!
                                </div>
                            )}

                            <Divider style={{ borderColor: 'rgba(0,255,255,0.15)' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                                <span style={{ color: '#e0e0e0', fontWeight: 700, fontSize: 16 }}>Total</span>
                                <span style={{
                                    color: '#FF00CC', fontWeight: 900, fontSize: 24,
                                    textShadow: '0 0 10px rgba(255,0,204,0.5)',
                                }}>
                                    ${total.toFixed(2)}
                                </span>
                            </div>

                            <Link href="/checkout">
                                <button className="btn-neon-pink" style={{
                                    width: '100%', fontSize: 16, padding: '14px',
                                    fontWeight: 700,
                                }}>
                                    Checkout <ArrowRightOutlined />
                                </button>
                            </Link>

                            <Link href="/catalog">
                                <button style={{
                                    width: '100%', marginTop: 12, fontSize: 14, padding: '10px',
                                    background: 'transparent', color: '#aaa',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 6, cursor: 'pointer',
                                }}>
                                    Continue Shopping
                                </button>
                            </Link>
                        </div>
                    </Col>
                </Row>
            )}
        </AppLayout>
    );
}
