import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const SECTION_META = {
    hero:          { label: 'Hero Section',      desc: 'Homepage hero headline, subheadline, and CTA button text.', color: '#FF00CC', icon: '🎬' },
    stats:         { label: 'Statistics Bar',    desc: '4 stat blocks shown below the hero (value + label pairs).', color: '#00FFFF', icon: '📊' },
    how_it_works:  { label: 'How It Works',      desc: '3-step process section — title, step headings & descriptions.', color: '#BF5FFF', icon: '⚙️' },
    global:        { label: 'Global / Footer',   desc: 'Company name, tagline, email, phone, social handles.', color: '#39FF14', icon: '🌐' },
    about:         { label: 'About Page',        desc: 'About page hero headline, intro paragraph, and story text.', color: '#FF8C00', icon: '🏢' },
};

export default function ContentIndex({ sections = [] }) {
    return (
        <AdminLayout title="Site Content">
            <Head title="Admin — Content" />

            <p style={{ color: '#555', fontSize: 13, marginBottom: 28, lineHeight: 1.6, maxWidth: 560 }}>
                Manage the editable text content across your site. Click <strong style={{ color: '#ccc' }}>Edit</strong> on any section to update its copy.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {sections.map(section => {
                    const meta = SECTION_META[section.key] ?? { label: section.key, desc: '', color: '#888', icon: '📄' };
                    return (
                        <div key={section.key} style={{
                            background: '#0c0c22',
                            border: `1px solid ${meta.color}18`,
                            borderRadius: 12, padding: '18px 22px',
                            display: 'flex', alignItems: 'center', gap: 16,
                            transition: 'border-color 0.15s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = meta.color + '40'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = meta.color + '18'}
                        >
                            <div style={{ fontSize: 26, flexShrink: 0 }}>{meta.icon}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ color: meta.color, fontWeight: 700, fontSize: 15, marginBottom: 3, textShadow: `0 0 10px ${meta.color}60` }}>{meta.label}</div>
                                <div style={{ color: '#444', fontSize: 12, lineHeight: 1.5 }}>{meta.desc}</div>
                                {section.field_count > 0 && (
                                    <div style={{ color: '#333', fontSize: 11, marginTop: 4 }}>{section.field_count} fields</div>
                                )}
                            </div>
                            <Link href={`/admin/content/${section.key}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                                <button style={{
                                    padding: '8px 20px', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer',
                                    background: `${meta.color}12`,
                                    border: `1px solid ${meta.color}35`,
                                    color: meta.color, transition: 'all 0.15s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = meta.color + '22'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = meta.color + '12'; }}
                                >
                                    Edit
                                </button>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </AdminLayout>
    );
}
