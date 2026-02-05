import React from 'react';
import { CanvasElement } from '@/contexts/BuilderContext';

// Base props for all renderers
export interface RendererProps {
    element: CanvasElement;
    isEditing?: boolean;
}

// Button Renderer
export function ButtonRenderer({ element, isEditing }: RendererProps) {
    const styles = element.props?.styles as Record<string, string> || {};

    return (
        <button
            className="w-full h-full flex items-center justify-center font-medium text-white rounded-lg transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
                backgroundColor: styles.backgroundColor || '#3b82f6',
                color: styles.color || '#ffffff',
                fontSize: styles.fontSize || '14px',
                borderRadius: styles.borderRadius || '8px',
                ...styles,
            }}
        >
            {element.props?.text as string || element.label || 'Button'}
        </button>
    );
}

// Text Renderer
export function TextRenderer({ element, isEditing }: RendererProps) {
    const styles = element.props?.styles as Record<string, string> || {};

    return (
        <div
            className="w-full h-full flex items-center"
            style={{
                color: styles.color || '#f8fafc',
                fontSize: styles.fontSize || '16px',
                fontWeight: styles.fontWeight || '400',
                textAlign: (styles.textAlign as React.CSSProperties['textAlign']) || 'left',
                padding: styles.padding || '8px',
                ...styles,
            }}
        >
            {element.props?.text as string || element.label || 'Text content'}
        </div>
    );
}

// Navbar Renderer
export function NavbarRenderer({ element, isEditing }: RendererProps) {
    const styles = element.props?.styles as Record<string, string> || {};

    return (
        <nav
            className="w-full h-full flex items-center justify-between px-6"
            style={{
                backgroundColor: styles.backgroundColor || '#0f172a',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                ...styles,
            }}
        >
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
                <span className="font-semibold text-white">Brand</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-300">
                <span className="hover:text-white cursor-pointer transition-colors">Home</span>
                <span className="hover:text-white cursor-pointer transition-colors">About</span>
                <span className="hover:text-white cursor-pointer transition-colors">Services</span>
                <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500 transition-colors">
                Get Started
            </button>
        </nav>
    );
}

// Hero Section Renderer
export function HeroRenderer({ element, isEditing }: RendererProps) {
    const styles = element.props?.styles as Record<string, string> || {};

    return (
        <section
            className="w-full h-full flex flex-col items-center justify-center text-center px-8 relative overflow-hidden"
            style={{
                background: styles.background || 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
                ...styles,
            }}
        >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.15)_0%,_transparent_70%)]" />

            <div className="relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    {element.props?.heading as string || 'Build Something Amazing'}
                </h1>
                <p className="text-lg text-gray-300 mb-8 max-w-xl">
                    {element.props?.subheading as string || 'Create stunning websites with our intuitive drag-and-drop builder. No coding required.'}
                </p>
                <div className="flex items-center justify-center gap-4">
                    <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition-all hover:scale-105">
                        Get Started
                    </button>
                    <button className="px-6 py-3 bg-white/10 text-white font-medium rounded-lg border border-white/20 hover:bg-white/20 transition-all">
                        Learn More
                    </button>
                </div>
            </div>
        </section>
    );
}

// Section Renderer
export function SectionRenderer({ element, isEditing }: RendererProps) {
    const styles = element.props?.styles as Record<string, string> || {};

    return (
        <section
            className="w-full h-full flex items-center justify-center"
            style={{
                backgroundColor: styles.backgroundColor || '#0f172a',
                padding: styles.padding || '24px',
                borderRadius: styles.borderRadius || '12px',
                border: '1px solid rgba(255,255,255,0.08)',
                ...styles,
            }}
        >
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-white mb-2">
                    {element.props?.title as string || 'Section Title'}
                </h2>
                <p className="text-gray-400">
                    {element.props?.description as string || 'Add your content here'}
                </p>
            </div>
        </section>
    );
}

// Image Renderer
export function ImageRenderer({ element, isEditing }: RendererProps) {
    const styles = element.props?.styles as Record<string, string> || {};
    const src = element.props?.src as string;

    return (
        <div
            className="w-full h-full flex items-center justify-center overflow-hidden"
            style={{
                borderRadius: styles.borderRadius || '8px',
                backgroundColor: '#1e293b',
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
                <div className="flex flex-col items-center gap-2 text-gray-500">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">Image Placeholder</span>
                </div>
            )}
        </div>
    );
}

// Card Renderer
export function CardRenderer({ element, isEditing }: RendererProps) {
    const styles = element.props?.styles as Record<string, string> || {};

    return (
        <div
            className="w-full h-full flex flex-col overflow-hidden"
            style={{
                backgroundColor: styles.backgroundColor || '#1e293b',
                borderRadius: styles.borderRadius || '12px',
                border: '1px solid rgba(255,255,255,0.08)',
                ...styles,
            }}
        >
            {/* Card image area */}
            <div className="h-1/2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            {/* Card content */}
            <div className="flex-1 p-4 flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-1">
                    {element.props?.title as string || 'Card Title'}
                </h3>
                <p className="text-sm text-gray-400 flex-1">
                    {element.props?.description as string || 'Card description goes here.'}
                </p>
                <button className="mt-3 text-sm text-blue-400 hover:text-blue-300 font-medium self-start">
                    Learn more →
                </button>
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
            <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg border border-dashed border-gray-600">
                <span className="text-gray-400 text-sm">Unknown: {element.type}</span>
            </div>
        );
    }

    return <Renderer element={element} isEditing={isEditing} />;
}
