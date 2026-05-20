import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const SECTION_LABELS = {
    hero:         'Hero Section',
    stats:        'Statistics Bar',
    how_it_works: 'How It Works',
    global:       'Global / Footer',
    about:        'About Page',
};

const inputStyle = {
    width: '100%', background: '#0c0c22', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, padding: '9px 12px', color: '#ddd', fontSize: 13, outline: 'none',
    boxSizing: 'border-box',
};

function Field({ field, value, onChange, error }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: '#888', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>
                {field.label.toUpperCase()}
            </label>
            {field.type === 'textarea' ? (
                <textarea
                    style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
                    value={value ?? ''}
                    onChange={e => onChange(field.key, e.target.value)}
                    placeholder={field.placeholder ?? ''}
                />
            ) : (
                <input
                    style={inputStyle}
                    value={value ?? ''}
                    onChange={e => onChange(field.key, e.target.value)}
                    placeholder={field.placeholder ?? ''}
                />
            )}
            {field.hint && <div style={{ color: '#333', fontSize: 11, marginTop: 4 }}>{field.hint}</div>}
            {error && <div style={{ color: '#ff6666', fontSize: 11, marginTop: 4 }}>{error}</div>}
        </div>
    );
}

export default function ContentEdit({ section, schema, values = {} }) {
    const initialData = {};
    (schema?.fields ?? []).forEach(f => { initialData[f.key] = values[f.key] ?? ''; });

    const { data, setData, put, processing, errors, recentlySuccessful } = useForm(initialData);

    const handleChange = (key, val) => setData(key, val);

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/content/${section}`);
    };

    // Group fields into pairs for rendering side-by-side where sensible
    const fields = schema?.fields ?? [];
    const groups = [];
    let i = 0;
    while (i < fields.length) {
        const f = fields[i];
        // Pair stat fields (e.g. stat1_value + stat1_label)
        if (f.type === 'text' && i + 1 < fields.length && fields[i+1].type === 'text' && !fields[i+1].key.includes('_label') === false) {
            groups.push([f, fields[i + 1]]);
            i += 2;
        } else {
            groups.push([f]);
            i++;
        }
    }

    return (
        <AdminLayout title={`Edit: ${SECTION_LABELS[section] ?? section}`}>
            <Head title={`Admin — ${SECTION_LABELS[section] ?? section}`} />

            <div style={{ maxWidth: 680 }}>
                {/* Breadcrumb */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 22, alignItems: 'center' }}>
                    <Link href="/admin/content" style={{ color: '#555', fontSize: 13, textDecoration: 'none' }}>Content</Link>
                    <span style={{ color: '#333' }}>›</span>
                    <span style={{ color: '#ccc', fontSize: 13 }}>{SECTION_LABELS[section] ?? section}</span>
                </div>

                {recentlySuccessful && (
                    <div style={{ background: 'rgba(57,255,20,0.1)', border: '1px solid rgba(57,255,20,0.3)', borderRadius: 8, padding: '10px 16px', color: '#39FF14', fontSize: 13, marginBottom: 20 }}>
                        Content saved successfully!
                    </div>
                )}

                <form onSubmit={submit}>
                    {groups.length === 0 && (
                        <div style={{ color: '#333', fontSize: 14, padding: '40px 0' }}>No editable fields for this section.</div>
                    )}

                    {/* Render fields — pair 2 text fields side by side */}
                    {groups.map((group, gi) => (
                        <div key={gi} style={{
                            background: '#0c0c22', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12,
                            padding: '20px 24px', marginBottom: 14,
                        }}>
                            {group.length === 2 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    {group.map(f => (
                                        <Field key={f.key} field={f} value={data[f.key]} onChange={handleChange} error={errors[f.key]} />
                                    ))}
                                </div>
                            ) : (
                                group.map(f => (
                                    <Field key={f.key} field={f} value={data[f.key]} onChange={handleChange} error={errors[f.key]} />
                                ))
                            )}
                        </div>
                    ))}

                    <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                        <button type="submit" disabled={processing} style={{
                            padding: '10px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer',
                            background: 'linear-gradient(135deg, #FF00CC, #FF6EC7)', color: '#000', border: 'none',
                            opacity: processing ? 0.7 : 1,
                        }}>
                            {processing ? 'Saving…' : 'Save Content'}
                        </button>
                        <Link href="/admin/content" style={{ textDecoration: 'none' }}>
                            <button type="button" style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, cursor: 'pointer', background: 'transparent', color: '#555', border: '1px solid rgba(255,255,255,0.08)' }}>
                                ← Back
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
