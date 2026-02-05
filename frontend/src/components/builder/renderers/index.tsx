import React from 'react';
import { CanvasElement } from '@/contexts/BuilderContext';

// Base props for all renderers
export interface RendererProps {
    element: CanvasElement;
    isEditing?: boolean;
}

// Unified design tokens
const designTokens = {
    colors: {
        background: '#0f0f16',
        surface: '#161621',
        surfaceHover: '#1c1c2a',
        border: 'rgba(255, 255, 255, 0.08)',
        borderSubtle: 'rgba(255, 255, 255, 0.05)',
        text: {
            primary: '#f5f5f7',
            secondary: '#a1a1aa',
            muted: '#71717a',
        },
        accent: '#3b82f6',
        accentHover: '#2563eb',
    },
    radius: {
        sm: '4px',
        md: '6px',
        lg: '10px',
        xl: '14px',
    },
    spacing: {
        xs: '6px',
        sm: '10px',
        md: '16px',
        lg: '24px',
    },
};

// Button Renderer
export function ButtonRenderer({ element }: RendererProps) {
    const styles = element.props?.styles as Record<string, string> || {};

    return (
        <button
            className="w-full h-full flex items-center justify-center transition-all"
            style={{
                backgroundColor: styles.backgroundColor || designTokens.colors.accent,
                color: styles.color || designTokens.colors.text.primary,
                fontSize: styles.fontSize || '13px',
                fontWeight: 500,
                borderRadius: styles.borderRadius || designTokens.radius.md,
                border: 'none',
                letterSpacing: '-0.01em',
                ...styles,
            }}
        >
            {element.props?.text as string || element.label || 'Button'}
        </button>
    );
}

// Text Renderer
export function TextRenderer({ element }: RendererProps) {
    const styles = element.props?.styles as Record<string, string> || {};

    return (
        <div
            className="w-full h-full flex items-center"
            style={{
                color: styles.color || designTokens.colors.text.primary,
                fontSize: styles.fontSize || '15px',
                fontWeight: styles.fontWeight || '400',
                lineHeight: '1.5',
                textAlign: (styles.textAlign as React.CSSProperties['textAlign']) || 'left',
                padding: styles.padding || designTokens.spacing.sm,
                letterSpacing: '-0.01em',
                ...styles,
            }}
        >
            {element.props?.text as string || element.label || 'Text content'}
        </div>
    );
}

// Navbar Renderer
export function NavbarRenderer({ element }: RendererProps) {
    const styles = element.props?.styles as Record<string, string> || {};

    return (
        <nav
            className="w-full h-full flex items-center justify-between"
            style={{
                backgroundColor: styles.backgroundColor || designTokens.colors.surface,
                borderBottom: `1px solid ${designTokens.colors.border}`,
                padding: `0 ${designTokens.spacing.lg}`,
                ...styles,
            }}
        >
            <div className="flex items-center gap-3">
                <div 
                    className="w-7 h-7 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: designTokens.colors.accent }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                </div>
                <span style={{ 
                    fontWeight: 600, 
                    color: designTokens.colors.text.primary,
                    fontSize: '14px',
                    letterSpacing: '-0.02em'
                }}>
                    Brand
                </span>
            </div>
            <div className="flex items-center gap-6">
                {['Home', 'Features', 'Pricing', 'About'].map((item) => (
                    <span 
                        key={item}
                        style={{ 
                            fontSize: '13px', 
                            color: designTokens.colors.text.secondary,
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}
                    >
                        {item}
                    </span>
                ))}
            </div>
            <button 
                style={{
                    padding: '8px 16px',
                    backgroundColor: designTokens.colors.accent,
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: 500,
                    borderRadius: designTokens.radius.md,
                    border: 'none',
                }}
            >
                Get Started
            </button>
        </nav>
    );
}

// Hero Section Renderer
export function HeroRenderer({ element }: RendererProps) {
    const styles = element.props?.styles as Record<string, string> || {};

    return (
        <section
            className="w-full h-full flex flex-col items-center justify-center text-center relative overflow-hidden"
            style={{
                background: styles.background || `linear-gradient(180deg, ${designTokens.colors.surface} 0%, ${designTokens.colors.background} 100%)`,
                padding: designTokens.spacing.lg,
                ...styles,
            }}
        >
            <div className="relative z-10" style={{ maxWidth: '600px' }}>
                <h1 
                    style={{
                        fontSize: '36px',
                        fontWeight: 700,
                        color: designTokens.colors.text.primary,
                        marginBottom: '16px',
                        lineHeight: 1.15,
                        letterSpacing: '-0.03em',
                    }}
                >
                    {element.props?.heading as string || 'Build Something Amazing'}
                </h1>
                <p 
                    style={{
                        fontSize: '16px',
                        color: designTokens.colors.text.secondary,
                        marginBottom: '28px',
                        lineHeight: 1.6,
                    }}
                >
                    {element.props?.subheading as string || 'Create stunning websites with our intuitive drag-and-drop builder.'}
                </p>
                <div className="flex items-center justify-center gap-3">
                    <button 
                        style={{
                            padding: '12px 24px',
                            backgroundColor: designTokens.colors.accent,
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 500,
                            borderRadius: designTokens.radius.md,
                            border: 'none',
                        }}
                    >
                        Get Started
                    </button>
                    <button 
                        style={{
                            padding: '12px 24px',
                            backgroundColor: 'transparent',
                            color: designTokens.colors.text.secondary,
                            fontSize: '14px',
                            fontWeight: 500,
                            borderRadius: designTokens.radius.md,
                            border: `1px solid ${designTokens.colors.border}`,
                        }}
                    >
                        Learn More
                    </button>
                </div>
            </div>
        </section>
    );
}

// Section Renderer
export function SectionRenderer({ element }: RendererProps) {
    const styles = element.props?.styles as Record<string, string> || {};

    return (
        <section
            className="w-full h-full flex items-center justify-center"
            style={{
                backgroundColor: styles.backgroundColor || designTokens.colors.surface,
                padding: styles.padding || designTokens.spacing.lg,
                borderRadius: styles.borderRadius || designTokens.radius.lg,
                border: `1px solid ${designTokens.colors.border}`,
                ...styles,
            }}
        >
            <div className="text-center">
                <h2 
                    style={{
                        fontSize: '22px',
                        fontWeight: 600,
                        color: designTokens.colors.text.primary,
                        marginBottom: '8px',
                        letterSpacing: '-0.02em',
                    }}
                >
                    {element.props?.title as string || 'Section Title'}
                </h2>
                <p style={{ color: designTokens.colors.text.muted, fontSize: '14px' }}>
                    {element.props?.description as string || 'Add your content here'}
                </p>
            </div>
        </section>
    );
}

// Image Renderer
export function ImageRenderer({ element }: RendererProps) {
    const styles = element.props?.styles as Record<string, string> || {};
    const src = element.props?.src as string;

    return (
        <div
            className="w-full h-full flex items-center justify-center overflow-hidden"
            style={{
                borderRadius: styles.borderRadius || designTokens.radius.lg,
                backgroundColor: designTokens.colors.surface,
                border: `1px solid ${designTokens.colors.borderSubtle}`,
                ...styles,
            }}
        >
            {src ? (
                <img
                    src={src}
                    alt={element.props?.alt as string || 'Image'}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="flex flex-col items-center gap-2">
                    <svg 
                        className="w-10 h-10" 
                        fill="none" 
                        stroke={designTokens.colors.text.muted} 
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <span style={{ fontSize: '12px', color: designTokens.colors.text.muted }}>
                        Image
                    </span>
                </div>
            )}
        </div>
    );
}

// Card Renderer
export function CardRenderer({ element }: RendererProps) {
    const styles = element.props?.styles as Record<string, string> || {};

    return (
        <div
            className="w-full h-full flex flex-col overflow-hidden"
            style={{
                backgroundColor: styles.backgroundColor || designTokens.colors.surface,
                borderRadius: styles.borderRadius || designTokens.radius.lg,
                border: `1px solid ${designTokens.colors.border}`,
                ...styles,
            }}
        >
            {/* Card image area */}
            <div 
                className="flex-shrink-0 flex items-center justify-center"
                style={{ 
                    height: '45%', 
                    backgroundColor: designTokens.colors.background,
                    borderBottom: `1px solid ${designTokens.colors.borderSubtle}`,
                }}
            >
                <svg 
                    className="w-8 h-8" 
                    fill="none" 
                    stroke={designTokens.colors.text.muted} 
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
            </div>
            {/* Card content */}
            <div className="flex-1 flex flex-col" style={{ padding: designTokens.spacing.md }}>
                <h3 
                    style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: designTokens.colors.text.primary,
                        marginBottom: '6px',
                        letterSpacing: '-0.01em',
                    }}
                >
                    {element.props?.title as string || 'Card Title'}
                </h3>
                <p 
                    style={{
                        fontSize: '13px',
                        color: designTokens.colors.text.muted,
                        lineHeight: 1.5,
                        flex: 1,
                    }}
                >
                    {element.props?.description as string || 'Card description goes here.'}
                </p>
                <span 
                    style={{
                        fontSize: '13px',
                        color: designTokens.colors.accent,
                        fontWeight: 500,
                        marginTop: '12px',
                        cursor: 'pointer',
                    }}
                >
                    Learn more →
                </span>
            </div>
        </div>
    );
}

// Element Renderer - Main entry point
export function ElementRenderer({ element, isEditing = false }: RendererProps) {
    const rendererMap: Record<string, React.FC<RendererProps>> = {
        button: ButtonRenderer,
        text: TextRenderer,
        navbar: NavbarRenderer,
        hero: HeroRenderer,
        section: SectionRenderer,
        image: ImageRenderer,
        card: CardRenderer,
    };

    const Renderer = rendererMap[element.type];

    if (!Renderer) {
        return (
            <div 
                className="w-full h-full flex items-center justify-center rounded-lg"
                style={{
                    backgroundColor: designTokens.colors.surface,
                    border: `1px dashed ${designTokens.colors.border}`,
                }}
            >
                <span style={{ color: designTokens.colors.text.muted, fontSize: '13px' }}>
                    Unknown: {element.type}
                </span>
            </div>
        );
    }

    return <Renderer element={element} isEditing={isEditing} />;
}
