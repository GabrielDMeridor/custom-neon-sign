import React, { useEffect, useRef } from 'react';

/**
 * NeonSign — renders a realistic glowing neon tube sign.
 * Props:
 *   text       — string to display
 *   color      — hex glow colour (default #FF00CC)
 *   font       — CSS font-family string
 *   size       — 'sm' | 'md' | 'lg' | 'xl'  (default 'md')
 *   flicker    — bool (default false)
 *   background — CSS background value for the sign board
 *   className  — extra class names
 */
const SIZE_MAP = {
    sm: { fontSize: '1.4rem',  padding: '14px 24px', borderRadius: 10, border: 3 },
    md: { fontSize: '2.2rem',  padding: '22px 40px', borderRadius: 14, border: 4 },
    lg: { fontSize: '3.2rem',  padding: '32px 56px', borderRadius: 18, border: 5 },
    xl: { fontSize: '4.4rem',  padding: '40px 72px', borderRadius: 22, border: 6 },
};

export default function NeonSign({
    text = 'OPEN',
    color = '#FF00CC',
    font = "'Pacifico', cursive",
    size = 'md',
    flicker = false,
    background = '#000',
    style = {},
    className = '',
}) {
    const dim = SIZE_MAP[size] ?? SIZE_MAP.md;

    const glow = (opacity = 1) =>
        `0 0 2px rgba(255,255,255,${opacity}), ` +
        `0 0 4px rgba(255,255,255,${opacity * 0.6}), ` +
        `0 0 8px ${color}, ` +
        `0 0 16px ${color}, ` +
        `0 0 32px ${color}, ` +
        `0 0 64px ${color}cc, ` +
        `0 0 96px ${color}66`;

    const boardGlow =
        `0 0 12px ${color}55, ` +
        `0 0 24px ${color}33, ` +
        `inset 0 0 24px rgba(0,0,0,0.8)`;

    return (
        <div
            className={`neon-sign-board ${flicker ? 'neon-flicker' : ''} ${className}`}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background,
                padding: dim.padding,
                borderRadius: dim.borderRadius,
                border: `${dim.border}px solid ${color}44`,
                boxShadow: boardGlow,
                position: 'relative',
                ...style,
            }}
        >
            {/* Mounting screws */}
            {['top-left','top-right','bottom-left','bottom-right'].map(pos => {
                const [v, h] = pos.split('-');
                return (
                    <div key={pos} style={{
                        position: 'absolute',
                        [v]: 8, [h]: 12,
                        width: 8, height: 8,
                        borderRadius: '50%',
                        background: '#333',
                        border: '1px solid #555',
                        boxShadow: `0 0 4px ${color}44`,
                    }} />
                );
            })}

            {/* Tube backing line */}
            <div style={{
                position: 'absolute',
                top: '50%', left: '10%', right: '10%',
                height: 2,
                transform: 'translateY(-50%)',
                background: `${color}11`,
            }} />

            {/* The neon text */}
            <span style={{
                fontFamily: font,
                fontSize: dim.fontSize,
                color: '#fff',
                textShadow: glow(),
                letterSpacing: '0.04em',
                lineHeight: 1.2,
                position: 'relative',
                zIndex: 1,
                userSelect: 'none',
                whiteSpace: 'pre-line',
                textAlign: 'center',
            }}>
                {text}
            </span>
        </div>
    );
}

/**
 * NeonSignScene — neon sign placed in a realistic room scene.
 * scene: 'brick' | 'dark' | 'bar' | 'bedroom' | 'wood' | 'concrete'
 */
const SCENES = {
    brick: {
        background: `
            radial-gradient(ellipse at center bottom, rgba(60,20,0,0.6) 0%, transparent 70%),
            repeating-linear-gradient(
                180deg, rgba(100,50,20,0.15) 0px, rgba(100,50,20,0.15) 22px,
                rgba(0,0,0,0.3) 22px, rgba(0,0,0,0.3) 24px
            ),
            repeating-linear-gradient(
                90deg, transparent 0px, transparent 40px,
                rgba(0,0,0,0.2) 40px, rgba(0,0,0,0.2) 42px
            )`,
        backgroundColor: '#2a1005',
        label: 'Brick Wall',
    },
    dark: {
        background: 'radial-gradient(ellipse at 50% 30%, #1a0a2e 0%, #080810 70%)',
        backgroundColor: '#080810',
        label: 'Dark Room',
    },
    bar: {
        background: `
            linear-gradient(180deg, #0a0008 0%, #1a0510 60%, #0d0008 100%),
            radial-gradient(ellipse at 30% 70%, rgba(80,0,20,0.3) 0%, transparent 60%)`,
        backgroundColor: '#0d0008',
        label: 'Bar/Club',
    },
    bedroom: {
        background: `
            linear-gradient(160deg, #0a0a1a 0%, #080814 100%)`,
        backgroundColor: '#080814',
        label: 'Bedroom',
    },
    wood: {
        background: `
            repeating-linear-gradient(
                90deg, rgba(255,255,255,0.02) 0px, rgba(0,0,0,0.06) 3px,
                transparent 3px, transparent 22px
            )`,
        backgroundColor: '#1e0e04',
        label: 'Dark Wood',
    },
    concrete: {
        background: `
            radial-gradient(ellipse at center, rgba(40,40,50,0.8) 0%, rgba(20,20,25,0.95) 100%)`,
        backgroundColor: '#18181e',
        label: 'Concrete',
    },
};

export function NeonSignScene({ text, color, font, size = 'md', scene = 'dark', children, style = {} }) {
    const s = SCENES[scene] ?? SCENES.dark;

    return (
        <div style={{
            position: 'relative',
            borderRadius: 16,
            overflow: 'hidden',
            background: s.background,
            backgroundColor: s.backgroundColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 24px',
            minHeight: 200,
            ...style,
        }}>
            {/* Ambient glow on wall */}
            {color && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(ellipse at center, ${color}18 0%, transparent 65%)`,
                    pointerEvents: 'none',
                }} />
            )}
            {/* Floor reflection */}
            {color && (
                <div style={{
                    position: 'absolute',
                    bottom: 0, left: '15%', right: '15%',
                    height: '30%',
                    background: `linear-gradient(180deg, transparent, ${color}08)`,
                    filter: 'blur(8px)',
                    pointerEvents: 'none',
                }} />
            )}
            {children ?? <NeonSign text={text} color={color} font={font} size={size} />}
        </div>
    );
}
