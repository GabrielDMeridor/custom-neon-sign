import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY || '');

const AU_STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];

/* ── Shared styles ──────────────────────────────────────── */
const BASE_INPUT = {
    width: '100%', padding: '11px 14px', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, color: '#e0e0e0', fontSize: 14, fontFamily: 'inherit', outline: 'none',
};

/* ── Reusable field components ──────────────────────────── */
function FormField({ label, required, error, hint, children }) {
    return (
        <div style={{ marginBottom: 18 }}>
            {label && (
                <label style={{ display: 'block', marginBottom: 7, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: error ? '#ff6b6b' : '#888' }}>
                    {label}{required && <span style={{ color: '#FF00CC', marginLeft: 3 }}>*</span>}
                </label>
            )}
            {children}
            {hint && !error && <p style={{ margin: '5px 0 0', fontSize: 11.5, color: '#555' }}>{hint}</p>}
            {error && <p style={{ margin: '5px 0 0', fontSize: 12, color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: 4 }}><span>⚠</span>{error}</p>}
        </div>
    );
}

function FInput({ error, ...props }) {
    const [focused, setFocused] = useState(false);
    return (
        <input
            {...props}
            style={{
                ...BASE_INPUT,
                ...(error ? { borderColor: 'rgba(255,80,80,0.5)', background: 'rgba(255,40,40,0.04)' } : {}),
                ...(focused ? { borderColor: '#FF00CC', boxShadow: '0 0 0 3px rgba(255,0,204,0.12)' } : {}),
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        />
    );
}

function FSelect({ error, children, ...props }) {
    const [focused, setFocused] = useState(false);
    return (
        <select
            {...props}
            style={{
                ...BASE_INPUT, cursor: 'pointer', appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath fill='%23888' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 36,
                ...(error ? { borderColor: 'rgba(255,80,80,0.5)' } : {}),
                ...(focused ? { borderColor: '#FF00CC', boxShadow: '0 0 0 3px rgba(255,0,204,0.12)' } : {}),
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        >
            {children}
        </select>
    );
}

function FTextarea({ error, ...props }) {
    const [focused, setFocused] = useState(false);
    return (
        <textarea
            {...props}
            style={{
                ...BASE_INPUT, resize: 'vertical', minHeight: 80,
                ...(error ? { borderColor: 'rgba(255,80,80,0.5)' } : {}),
                ...(focused ? { borderColor: '#FF00CC', boxShadow: '0 0 0 3px rgba(255,0,204,0.12)' } : {}),
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        />
    );
}

function Spinner({ size = 16 }) {
    return <div style={{ width: size, height: size, border: '2px solid rgba(255,255,255,0.25)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />;
}

function GroupLabel({ children }) {
    return <div style={{ color: '#555', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{children}</div>;
}

/* ── Client-side validation ─────────────────────────────── */
function validateForm(f) {
    const e = {};
    if (!f.customer_name.trim())  e.customer_name  = 'Full name is required.';
    else if (f.customer_name.trim().length < 2) e.customer_name = 'Please enter your full name.';
    if (!f.customer_email.trim()) e.customer_email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.customer_email)) e.customer_email = 'Please enter a valid email address.';
    if (f.customer_phone && !/^[\d\s\+\-\(\)]{6,20}$/.test(f.customer_phone)) e.customer_phone = 'Please enter a valid phone number.';
    if (!f.street.trim())   e.street   = 'Street address is required.';
    if (!f.suburb.trim())   e.suburb   = 'Suburb / City is required.';
    if (!f.state)           e.state    = 'Please select a state.';
    if (!f.postcode.trim()) e.postcode = 'Postcode is required.';
    else if (!/^\d{4}$/.test(f.postcode)) e.postcode = 'Australian postcodes are 4 digits.';
    return e;
}

/* ── Step 2: Stripe Payment Form ─────────────────────────── */
function PaymentForm({ orderNumber, total, formData, onBack }) {
    const stripe   = useStripe();
    const elements = useElements();
    const [paying, setPaying] = useState(false);
    const [ready, setReady]   = useState(false);
    const [error, setError]   = useState('');

    const handlePay = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || !ready) return;
        setPaying(true);
        setError('');

        try {
            // Validate payment element fields first
            const { error: submitErr } = await elements.submit();
            if (submitErr) {
                setError(submitErr.message || 'Please complete all payment details.');
                setPaying(false);
                return;
            }

            const { error: stripeErr } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/order-confirmation/${orderNumber}`,
                    payment_method_data: {
                        billing_details: {
                            name:  formData.customer_name,
                            email: formData.customer_email,
                            phone: formData.customer_phone || undefined,
                        },
                    },
                },
                redirect: 'if_required',
            });

            if (stripeErr) {
                if (stripeErr.type === 'card_error') {
                    setError(stripeErr.message || 'Your card was declined. Please try a different card.');
                } else if (stripeErr.type === 'validation_error') {
                    setError('Please check your payment details and try again.');
                } else if (stripeErr.code === 'payment_intent_authentication_failure') {
                    setError('3D Secure authentication failed. Please try again or use a different card.');
                } else {
                    setError(stripeErr.message || 'Payment could not be completed. Please try again.');
                }
                setPaying(false);
            } else {
                // Sync order status with backend immediately (webhook may be delayed on local/staging)
                try { await axios.post(`/api/checkout/sync/${orderNumber}`); } catch { /* non-critical */ }
                router.visit(`/order-confirmation/${orderNumber}`);
            }
        } catch {
            setError('An unexpected error occurred. Please check your connection and try again.');
            setPaying(false);
        }
    };

    const canPay = stripe && ready && !paying;

    return (
        <form onSubmit={handlePay}>
            {/* Mini order recap */}
            <div style={{ marginBottom: 24, padding: '14px 18px', background: 'rgba(255,0,204,0.06)', border: '1px solid rgba(255,0,204,0.18)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div>
                    <div style={{ color: '#888', fontSize: 11.5, marginBottom: 3 }}>Completing order for</div>
                    <div style={{ color: '#e0e0e0', fontWeight: 600, fontSize: 14 }}>{formData.customer_name}</div>
                    <div style={{ color: '#666', fontSize: 12 }}>{formData.customer_email}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#666', fontSize: 11, marginBottom: 3 }}>Total</div>
                    <div style={{ color: '#FF00CC', fontWeight: 800, fontSize: 22, textShadow: '0 0 10px rgba(255,0,204,0.4)' }}>A${total.toFixed(2)}</div>
                </div>
            </div>

            {/* Stripe Payment Element */}
            <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '20px', marginBottom: 20 }}>
                <PaymentElement
                    onReady={() => setReady(true)}
                    options={{
                        layout: 'tabs',
                        paymentMethodOrder: ['card', 'au_becs_debit', 'afterpay_clearpay'],
                        fields: { billingDetails: { name: 'never', email: 'never' } },
                    }}
                />
                {!ready && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#555', fontSize: 13, marginTop: 8 }}>
                        <Spinner size={14} /> Loading payment form…
                    </div>
                )}
            </div>

            {/* Error message */}
            {error && (
                <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(255,50,50,0.08)', border: '1px solid rgba(255,50,50,0.25)', borderRadius: 8, color: '#ff6b6b', fontSize: 13, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <button type="button" onClick={onBack} disabled={paying}
                    style={{ padding: '13px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#888', cursor: paying ? 'not-allowed' : 'pointer', fontSize: 14, flexShrink: 0, transition: 'all 0.15s' }}
                    onMouseEnter={e => { if (!paying) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                >
                    ← Back
                </button>
                <button type="submit" disabled={!canPay}
                    style={{
                        flex: 1, padding: '13px 20px', borderRadius: 8, border: 'none', cursor: canPay ? 'pointer' : 'not-allowed',
                        background: canPay ? 'linear-gradient(135deg, #FF00CC, #d400aa)' : 'rgba(255,0,204,0.25)',
                        color: '#fff', fontSize: 15, fontWeight: 700,
                        boxShadow: canPay ? '0 0 24px rgba(255,0,204,0.4)' : 'none',
                        transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                >
                    {paying ? (<><Spinner /> Processing payment…</>) : !ready ? (<><Spinner size={14} /> Loading…</>) : (<>🔒 Pay A${total.toFixed(2)} securely</>)}
                </button>
            </div>

            <div style={{ textAlign: 'center', color: '#3a3a50', fontSize: 11.5 }}>
                🔒 Secured by <strong style={{ color: '#555' }}>Stripe</strong> · SSL/TLS Encrypted · PCI DSS Compliant
            </div>
        </form>
    );
}

/* ── Main Checkout Page ─────────────────────────────────────── */
export default function Checkout({ cart }) {
    const items    = cart?.items ?? [];
    const subtotal = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
    const shipping = 15.00;
    const total    = subtotal + shipping;

    const [step, setStep]                 = useState(1);
    const [loading, setLoading]           = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [orderNumber, setOrderNumber]   = useState('');
    const [errors, setErrors]             = useState({});
    const [globalError, setGlobalError]   = useState('');
    const [form, setForm]                 = useState({
        customer_name: '', customer_email: '', customer_phone: '',
        street: '', suburb: '', state: '', postcode: '',
        customer_notes: '',
    });

    const setField = (k, v) => {
        setForm(f => ({ ...f, [k]: v }));
        // Clear field error on change
        if (errors[k]) setErrors(e => { const n = { ...e }; delete n[k]; return n; });
    };

    const buildAddress = (f) => [f.street, f.suburb, f.state, `${f.postcode} Australia`].filter(Boolean).join(', ');

    const handleShippingSubmit = async (e) => {
        e.preventDefault();
        setGlobalError('');

        // Client-side validation
        const clientErrors = validateForm(form);
        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            return;
        }
        setErrors({});
        setLoading(true);

        try {
            const payload = {
                customer_name:    form.customer_name.trim(),
                customer_email:   form.customer_email.trim().toLowerCase(),
                customer_phone:   form.customer_phone.trim() || null,
                shipping_address: buildAddress(form),
                customer_notes:   form.customer_notes.trim() || null,
            };
            const res = await axios.post('/api/checkout/intent', payload);
            setClientSecret(res.data.client_secret);
            setOrderNumber(res.data.order_number);
            setStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            const status = err.response?.status;
            if (status === 422 && err.response?.data?.errors) {
                const be = err.response.data.errors;
                setErrors({
                    customer_name:    be.customer_name?.[0],
                    customer_email:   be.customer_email?.[0],
                    customer_phone:   be.customer_phone?.[0],
                    street:           be.shipping_address?.[0],
                });
            } else if (status === 422 && err.response?.data?.error) {
                setGlobalError(err.response.data.error);
            } else if (status === 429) {
                setGlobalError('Too many requests. Please wait a moment and try again.');
            } else if (status === 503 || status === 500) {
                setGlobalError('Our payment system is temporarily unavailable. Please try again in a few moments.');
            } else if (!err.response) {
                setGlobalError('Network error — please check your connection and try again.');
            } else {
                setGlobalError('Something went wrong. Please try again or contact us for assistance.');
            }
        } finally {
            setLoading(false);
        }
    };

    const stripeAppearance = {
        theme: 'night',
        variables: {
            colorPrimary: '#FF00CC', colorBackground: '#0c0c22',
            colorText: '#e0e0e0', colorTextSecondary: '#888',
            colorDanger: '#ff4d4f',
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            borderRadius: '8px',
        },
        rules: {
            '.Input': { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: '#e0e0e0', padding: '11px 14px' },
            '.Input:focus': { borderColor: '#FF00CC', boxShadow: '0 0 0 3px rgba(255,0,204,0.15)' },
            '.Tab': { backgroundColor: '#0a0a1e', borderColor: 'rgba(255,255,255,0.08)', color: '#888' },
            '.Tab--selected': { borderColor: '#FF00CC', backgroundColor: 'rgba(255,0,204,0.08)', color: '#e0e0e0', boxShadow: '0 0 0 1px #FF00CC' },
            '.Label': { color: '#888', fontSize: '11.5px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: '700' },
            '.Error': { color: '#ff6b6b' },
        },
    };

    /* ── Empty cart guard ── */
    if (items.length === 0) {
        return (
            <AppLayout>
                <Head title="Checkout" />
                <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                    <div style={{ fontSize: 52, marginBottom: 16 }}>🛒</div>
                    <h2 style={{ color: '#e0e0e0', fontWeight: 700, marginBottom: 8 }}>Your cart is empty</h2>
                    <p style={{ color: '#666', marginBottom: 28 }}>Add some products before checking out.</p>
                    <Link href="/catalog" style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #FF00CC, #d400aa)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 700, boxShadow: '0 0 16px rgba(255,0,204,0.4)' }}>
                        Shop Now
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Secure Checkout — Custom Neon Signs Australia" />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* ── Page header ── */}
            <div style={{ marginBottom: 32 }}>
                <Link href="/cart"
                    style={{ color: '#555', textDecoration: 'none', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 18 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#aaa'}
                    onMouseLeave={e => e.currentTarget.style.color = '#555'}
                >
                    ← Back to Cart
                </Link>

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 28 }}>
                    <div>
                        <h1 style={{ color: '#e0e0e0', fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                            🔒 Secure Checkout
                        </h1>
                        <p style={{ color: '#555', fontSize: 12.5, marginTop: 4 }}>Powered by Stripe · PCI DSS Level 1 Certified · SSL Encrypted</p>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {[{ i: '🔒', l: 'SSL' }, { i: '🛡', l: 'PCI DSS' }, { i: '⚡', l: 'Stripe' }].map(b => (
                            <div key={b.l} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#555' }}>
                                {b.i} {b.l}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step indicator */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {[{ n: 1, label: 'Shipping', icon: '📦' }, { n: 2, label: 'Payment', icon: '💳' }].map((s, i) => (
                        <React.Fragment key={s.n}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700,
                                    background: step > s.n ? 'linear-gradient(135deg,#39FF14,#00cc00)' : step === s.n ? 'linear-gradient(135deg,#FF00CC,#BF5FFF)' : 'rgba(255,255,255,0.06)',
                                    color: step >= s.n ? '#000' : '#444',
                                    boxShadow: step === s.n ? '0 0 18px rgba(255,0,204,0.5)' : 'none',
                                    transition: 'all 0.3s',
                                }}>
                                    {step > s.n ? '✓' : s.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: step === s.n ? 700 : 400, color: step >= s.n ? '#e0e0e0' : '#444', transition: 'color 0.3s' }}>{s.label}</div>
                                    {step === s.n && <div style={{ fontSize: 10.5, color: '#FF00CC', fontWeight: 600, marginTop: 1 }}>Current step</div>}
                                </div>
                            </div>
                            {i < 1 && <div style={{ flex: '0 0 40px', height: 2, margin: '0 12px', background: step > 1 ? '#39FF14' : 'rgba(255,255,255,0.07)', borderRadius: 2, transition: 'background 0.4s', boxShadow: step > 1 ? '0 0 8px #39FF1466' : 'none' }} />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Global error */}
            {globalError && (
                <div style={{ marginBottom: 24, padding: '14px 18px', background: 'rgba(255,50,50,0.07)', border: '1px solid rgba(255,50,50,0.22)', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 18 }}>⚠️</span>
                    <div>
                        <div style={{ color: '#ff6b6b', fontWeight: 600, marginBottom: 2 }}>Unable to proceed</div>
                        <div style={{ color: '#cc5555', fontSize: 13 }}>{globalError}</div>
                    </div>
                    <button onClick={() => setGlobalError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#cc5555', cursor: 'pointer', fontSize: 18, lineHeight: 1, flexShrink: 0 }}>×</button>
                </div>
            )}

            {/* ── Two-column layout ── */}
            <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>

                {/* Left: Form */}
                <div style={{ flex: '1 1 460px', minWidth: 0 }}>
                    <div style={{ background: '#0c0c22', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>

                        {/* Step 1: Shipping */}
                        {step === 1 && (
                            <>
                                <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#FF00CC,#BF5FFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 0 12px rgba(255,0,204,0.4)', flexShrink: 0 }}>📦</div>
                                    <div>
                                        <div style={{ color: '#e0e0e0', fontWeight: 700, fontSize: 15 }}>Shipping Details</div>
                                        <div style={{ color: '#555', fontSize: 12, marginTop: 2 }}>Australia-wide delivery · AUD</div>
                                    </div>
                                </div>

                                <form onSubmit={handleShippingSubmit} noValidate style={{ padding: 28 }}>
                                    {/* Contact group */}
                                    <div style={{ marginBottom: 28 }}>
                                        <GroupLabel>Contact Information</GroupLabel>
                                        <FormField label="Full Name" required error={errors.customer_name}>
                                            <FInput type="text" autoComplete="name" placeholder="Jane Smith"
                                                error={errors.customer_name}
                                                value={form.customer_name} onChange={e => setField('customer_name', e.target.value)} />
                                        </FormField>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                                            <FormField label="Email Address" required error={errors.customer_email}>
                                                <FInput type="email" autoComplete="email" placeholder="jane@example.com"
                                                    error={errors.customer_email}
                                                    value={form.customer_email} onChange={e => setField('customer_email', e.target.value)} />
                                            </FormField>
                                            <FormField label="Phone" error={errors.customer_phone} hint="Optional — mobile or landline">
                                                <FInput type="tel" autoComplete="tel" placeholder="04XX XXX XXX"
                                                    error={errors.customer_phone}
                                                    value={form.customer_phone} onChange={e => setField('customer_phone', e.target.value)} />
                                            </FormField>
                                        </div>
                                    </div>

                                    {/* Address group */}
                                    <div style={{ marginBottom: 28 }}>
                                        <GroupLabel>Delivery Address 🇦🇺</GroupLabel>
                                        <FormField label="Street Address" required error={errors.street}>
                                            <FInput type="text" autoComplete="street-address" placeholder="123 Neon Street"
                                                error={errors.street}
                                                value={form.street} onChange={e => setField('street', e.target.value)} />
                                        </FormField>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 90px', gap: 14 }}>
                                            <FormField label="Suburb / City" required error={errors.suburb}>
                                                <FInput type="text" autoComplete="address-level2" placeholder="Sydney"
                                                    error={errors.suburb}
                                                    value={form.suburb} onChange={e => setField('suburb', e.target.value)} />
                                            </FormField>
                                            <FormField label="State" required error={errors.state}>
                                                <FSelect error={errors.state} value={form.state} onChange={e => setField('state', e.target.value)}>
                                                    <option value="">—</option>
                                                    {AU_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                                </FSelect>
                                            </FormField>
                                            <FormField label="Postcode" required error={errors.postcode}>
                                                <FInput type="text" inputMode="numeric" autoComplete="postal-code" placeholder="2000" maxLength={4}
                                                    error={errors.postcode}
                                                    value={form.postcode} onChange={e => setField('postcode', e.target.value.replace(/\D/g, ''))} />
                                            </FormField>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <FormField label="Order Notes (optional)" hint="Special requests, installation notes, delivery instructions">
                                        <FTextarea placeholder="e.g. Leave at front door, specific colour preferences, installation notes…"
                                            value={form.customer_notes} onChange={e => setField('customer_notes', e.target.value)} />
                                    </FormField>

                                    <button type="submit" disabled={loading}
                                        style={{
                                            width: '100%', padding: '14px 20px', marginTop: 8,
                                            background: loading ? 'rgba(255,0,204,0.3)' : 'linear-gradient(135deg,#FF00CC,#d400aa)',
                                            border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
                                            color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em',
                                            boxShadow: loading ? 'none' : '0 0 24px rgba(255,0,204,0.4)',
                                            transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                        }}
                                    >
                                        {loading ? (<><Spinner /> Preparing your order…</>) : <>Continue to Payment →</>}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && clientSecret && (
                            <>
                                <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#FF00CC,#BF5FFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 0 12px rgba(255,0,204,0.4)', flexShrink: 0 }}>💳</div>
                                    <div>
                                        <div style={{ color: '#e0e0e0', fontWeight: 700, fontSize: 15 }}>Payment</div>
                                        <div style={{ color: '#555', fontSize: 12, marginTop: 2 }}>Card · Apple Pay · Google Pay · BECS Direct Debit</div>
                                    </div>
                                </div>
                                <div style={{ padding: 28 }}>
                                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
                                        <PaymentForm orderNumber={orderNumber} total={total} formData={form} onBack={() => setStep(1)} />
                                    </Elements>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right: Order Summary */}
                <div style={{ flex: '0 0 320px', minWidth: 260, position: 'sticky', top: 20 }}>
                    <div style={{ background: '#0c0c22', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ color: '#e0e0e0', fontWeight: 700, fontSize: 14 }}>Order Summary</span>
                            <span style={{ color: '#555', fontSize: 12 }}>{items.length} item{items.length !== 1 ? 's' : ''}</span>
                        </div>

                        <div style={{ padding: '16px 20px' }}>
                            {items.map((item, idx) => (
                                <div key={item.id ?? idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 14, marginBottom: idx < items.length - 1 ? 14 : 0, borderBottom: idx < items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                    {/* Color swatch */}
                                    <div style={{ width: 38, height: 38, borderRadius: 8, flexShrink: 0, background: item.neon_color ? `radial-gradient(circle at 40% 40%, ${item.neon_color}bb, ${item.neon_color}33)` : 'rgba(255,0,204,0.1)', border: `1px solid ${item.neon_color ?? 'rgba(255,0,204,0.25)'}`, boxShadow: item.neon_color ? `0 0 8px ${item.neon_color}55` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                                        {!item.neon_color && '✨'}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ color: '#ccc', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>
                                            {item.product?.name ?? item.custom_text ?? 'Custom Neon Sign'}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, color: '#555', fontSize: 11 }}>
                                            {item.size && <span style={{ background: 'rgba(255,255,255,0.04)', padding: '1px 6px', borderRadius: 4 }}>{item.size}</span>}
                                            {item.neon_color && <span style={{ color: item.neon_color, filter: 'brightness(1.3)' }}>⬤ {item.neon_color}</span>}
                                            <span>×{item.quantity}</span>
                                        </div>
                                    </div>
                                    <span style={{ color: '#e0e0e0', fontWeight: 600, fontSize: 13, flexShrink: 0 }}>${(item.unit_price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}

                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 14, marginTop: 4 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ color: '#777', fontSize: 13 }}>Subtotal</span>
                                    <span style={{ color: '#bbb', fontSize: 13 }}>${subtotal.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                                    <span style={{ color: '#777', fontSize: 13 }}>Shipping (Australia)</span>
                                    <span style={{ color: '#bbb', fontSize: 13 }}>${shipping.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                    <span style={{ color: '#e0e0e0', fontWeight: 700, fontSize: 14 }}>Total (AUD)</span>
                                    <span style={{ color: '#FF00CC', fontWeight: 800, fontSize: 19, textShadow: '0 0 10px rgba(255,0,204,0.5)' }}>A${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment methods */}
                        <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.18)' }}>
                            <div style={{ color: '#444', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 9 }}>Accepted Payments</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                                {['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay', 'BECS Debit'].map(m => (
                                    <span key={m} style={{ padding: '3px 8px', borderRadius: 5, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#666', fontSize: 10.5, fontWeight: 600 }}>{m}</span>
                                ))}
                            </div>
                            <div style={{ marginTop: 10, color: '#3a3a50', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
                                <span>🔒</span><span>All transactions are encrypted and secure</span>
                            </div>
                        </div>
                    </div>

                    {/* Policy notes */}
                    <div style={{ marginTop: 14, padding: '14px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                        {[
                            { i: '🎨', t: 'Custom made to order in Australia' },
                            { i: '📦', t: 'Estimated 5–10 business days delivery' },
                            { i: '✉️', t: 'Order confirmation emailed instantly' },
                            { i: '💬', t: 'Support: help@customneonsigns.com.au' },
                        ].map(p => (
                            <div key={p.t} style={{ display: 'flex', gap: 8, marginBottom: 9, color: '#4a4a66', fontSize: 12, alignItems: 'flex-start' }}>
                                <span>{p.i}</span><span>{p.t}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}