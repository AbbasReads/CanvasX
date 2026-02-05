import React from 'react';
import { CanvasElement, useBuilder, ThemePalette } from '@/contexts/BuilderContext';

// Base props for all renderers
export interface RendererProps {
    element: CanvasElement;
    isEditing?: boolean;
}

// Create design tokens from theme
function createDesignTokens(theme: ThemePalette) {
    return {
        colors: {
            background: theme.background,
            surface: theme.secondary,
            surfaceHover: theme.secondary,
            border: 'rgba(255, 255, 255, 0.08)',
            borderSubtle: 'rgba(255, 255, 255, 0.05)',
            text: {
                primary: theme.foreground,
                secondary: `${theme.foreground}aa`,
                muted: `${theme.foreground}77`,
            },
            accent: theme.primary,
            accentSecondary: theme.accent,
        },
        radius: { sm: '6px', md: '8px', lg: '12px', xl: '16px', '2xl': '24px' },
        spacing: { xs: '8px', sm: '12px', md: '20px', lg: '32px', xl: '48px' },
    };
}

// Button Renderer with variant styles
export function ButtonRenderer({ element }: RendererProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = element.props?.style as string || 'primary';

    const variants: Record<string, React.CSSProperties> = {
        primary: { backgroundColor: tokens.colors.accent, color: 'white', border: 'none' },
        secondary: { backgroundColor: 'transparent', color: tokens.colors.accent, border: `2px solid ${tokens.colors.accent}` },
        ghost: { backgroundColor: 'rgba(255,255,255,0.05)', color: tokens.colors.text.primary, border: '1px solid rgba(255,255,255,0.1)' },
        gradient: { background: `linear-gradient(135deg, ${tokens.colors.accent} 0%, ${tokens.colors.accentSecondary} 100%)`, color: 'white', border: 'none' },
    };

    return (
        <button className="w-full h-full flex items-center justify-center transition-all" style={{ ...variants[variantStyle], fontSize: '14px', fontWeight: 500, borderRadius: tokens.radius.md }}>
            {element.props?.text as string || element.label || 'Button'}
        </button>
    );
}

// Text Renderer
export function TextRenderer({ element }: RendererProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = element.props?.style as string || 'paragraph';

    const variants: Record<string, React.CSSProperties> = {
        heading: { fontSize: '32px', fontWeight: 700, letterSpacing: '-0.03em' },
        paragraph: { fontSize: '16px', fontWeight: 400, lineHeight: 1.7 },
        caption: { fontSize: '13px', fontWeight: 500, color: tokens.colors.text.muted, textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
    };

    return (
        <div className="w-full h-full flex items-center" style={{ color: tokens.colors.text.primary, padding: tokens.spacing.sm, ...variants[variantStyle] }}>
            {element.props?.text as string || element.label || 'Text content'}
        </div>
    );
}

// Navbar Renderer
export function NavbarRenderer({ element }: RendererProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = element.props?.style as string || 'minimal';

    const variants: Record<string, React.CSSProperties> = {
        minimal: { backgroundColor: tokens.colors.surface, borderBottom: `1px solid ${tokens.colors.border}` },
        centered: { backgroundColor: tokens.colors.surface, borderBottom: `1px solid ${tokens.colors.border}` },
        dark: { backgroundColor: tokens.colors.background, borderBottom: `1px solid rgba(255,255,255,0.05)` },
        transparent: { backgroundColor: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(16px)', border: `1px solid rgba(255,255,255,0.06)`, borderRadius: tokens.radius.xl, margin: '12px' },
    };

    const isCentered = variantStyle === 'centered';

    return (
        <nav className="w-full h-full flex items-center" style={{ ...variants[variantStyle], padding: '0 40px' }}>
            {isCentered ? (
                <>
                    <div className="flex items-center gap-8 flex-1">
                        {['Products', 'Solutions'].map((item) => <span key={item} style={{ fontSize: '14px', color: tokens.colors.text.secondary, fontWeight: 500 }}>{item}</span>)}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: tokens.colors.accent }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        </div>
                        <span style={{ fontWeight: 700, color: tokens.colors.text.primary, fontSize: '16px' }}>Acme</span>
                    </div>
                    <div className="flex items-center gap-8 flex-1 justify-end">
                        {['Pricing', 'Company'].map((item) => <span key={item} style={{ fontSize: '14px', color: tokens.colors.text.secondary, fontWeight: 500 }}>{item}</span>)}
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: tokens.colors.accent }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        </div>
                        <span style={{ fontWeight: 700, color: tokens.colors.text.primary, fontSize: '16px' }}>Acme</span>
                    </div>
                    <div className="flex items-center gap-8 ml-12">
                        {['Products', 'Solutions', 'Pricing', 'Company'].map((item) => <span key={item} style={{ fontSize: '14px', color: tokens.colors.text.secondary, fontWeight: 500 }}>{item}</span>)}
                    </div>
                    <div className="flex items-center gap-3 ml-auto">
                        <span style={{ fontSize: '14px', color: tokens.colors.text.secondary, fontWeight: 500 }}>Sign in</span>
                        <button style={{ padding: '8px 16px', backgroundColor: tokens.colors.accent, color: 'white', fontSize: '14px', fontWeight: 500, borderRadius: tokens.radius.md, border: 'none' }}>Get Started</button>
                    </div>
                </>
            )}
        </nav>
    );
}

// Hero Section Renderer
export function HeroRenderer({ element }: RendererProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = element.props?.style as string || 'centered';

    const variants: Record<string, React.CSSProperties> = {
        centered: { background: `radial-gradient(ellipse at top, ${tokens.colors.accent}33 0%, ${tokens.colors.background} 60%)` },
        split: { background: tokens.colors.background },
        gradient: { background: `linear-gradient(135deg, ${tokens.colors.accent} 0%, ${tokens.colors.accentSecondary} 100%)` },
        minimal: { background: tokens.colors.background },
    };

    const isSplit = variantStyle === 'split';
    const isMinimal = variantStyle === 'minimal';
    const isGradient = variantStyle === 'gradient';

    return (
        <section className={`w-full h-full flex ${isSplit ? 'flex-row' : 'flex-col'} items-center justify-center relative overflow-hidden`} style={{ ...variants[variantStyle], padding: '48px' }}>
            {!isGradient && <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }} />}
            <div className={`relative z-10 ${isSplit ? 'flex-1 pr-8' : 'max-w-2xl text-center'}`}>
                {!isMinimal && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ backgroundColor: `${tokens.colors.accent}26`, border: `1px solid ${tokens.colors.accent}4d` }}>
                        <span style={{ fontSize: '12px', color: tokens.colors.accent, fontWeight: 500 }}>✨ Announcing v2.0</span>
                    </div>
                )}
                <h1 style={{ fontSize: isSplit ? '48px' : '56px', fontWeight: 700, color: tokens.colors.text.primary, marginBottom: '20px', lineHeight: 1.1, letterSpacing: '-0.04em' }}>
                    {element.props?.heading as string || 'Build products faster than ever'}
                </h1>
                <p style={{ fontSize: '18px', color: tokens.colors.text.secondary, marginBottom: isMinimal ? '0' : '32px', lineHeight: 1.6, maxWidth: '520px', margin: isSplit ? '' : '0 auto 32px' }}>
                    {element.props?.subheading as string || 'The modern platform for building beautiful, responsive websites.'}
                </p>
                {!isMinimal && (
                    <div className={`flex items-center gap-4 ${isSplit ? '' : 'justify-center'}`}>
                        <button style={{ padding: '14px 28px', backgroundColor: isGradient ? 'rgba(255,255,255,0.2)' : 'white', color: isGradient ? 'white' : tokens.colors.background, fontSize: '15px', fontWeight: 600, borderRadius: tokens.radius.lg, border: isGradient ? '1px solid rgba(255,255,255,0.3)' : 'none' }}>Start for free</button>
                        <button style={{ padding: '14px 28px', backgroundColor: 'transparent', color: tokens.colors.text.primary, fontSize: '15px', fontWeight: 500, borderRadius: tokens.radius.lg, border: `1px solid ${tokens.colors.border}` }}>View demo →</button>
                    </div>
                )}
            </div>
            {isSplit && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-md aspect-square rounded-2xl flex items-center justify-center" style={{ backgroundColor: tokens.colors.surface, border: `1px solid ${tokens.colors.border}` }}>
                        <svg className="w-20 h-20" fill="none" stroke={tokens.colors.text.muted} strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    </div>
                </div>
            )}
        </section>
    );
}

// Marquee Renderer
export function MarqueeRenderer({ element }: RendererProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const logos = ['Vercel', 'Stripe', 'Notion', 'Linear', 'Figma', 'Framer'];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden" style={{ backgroundColor: tokens.colors.background, padding: '32px' }}>
            <p style={{ fontSize: '13px', color: tokens.colors.text.muted, marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Trusted by leading companies</p>
            <div className="flex items-center gap-12">
                {logos.map((logo) => (
                    <div key={logo} className="flex items-center gap-2" style={{ opacity: 0.6 }}>
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: tokens.colors.accent + '33' }} />
                        <span style={{ fontSize: '16px', fontWeight: 600, color: tokens.colors.text.secondary }}>{logo}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Features Renderer
export function FeaturesRenderer({ element }: RendererProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const features = [
        { icon: '⚡', title: 'Lightning Fast', desc: 'Built for speed from the ground up' },
        { icon: '🔒', title: 'Secure by Default', desc: 'Enterprise-grade security included' },
        { icon: '📱', title: 'Fully Responsive', desc: 'Looks great on any device' },
        { icon: '🎨', title: 'Customizable', desc: 'Make it truly yours' },
    ];
    const variantStyle = element.props?.style as string || 'grid';
    const isBento = variantStyle === 'bento';
    const isList = variantStyle === 'list';

    return (
        <section className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: tokens.colors.background, padding: '48px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, color: tokens.colors.text.primary, marginBottom: '12px', letterSpacing: '-0.03em' }}>Everything you need</h2>
            <p style={{ fontSize: '16px', color: tokens.colors.text.secondary, marginBottom: '40px', maxWidth: '400px', textAlign: 'center' }}>Packed with features to help you build faster</p>
            <div className={`grid gap-4 w-full max-w-3xl ${isList ? 'grid-cols-1' : isBento ? 'grid-cols-2' : 'grid-cols-4'}`}>
                {features.map((f, i) => (
                    <div key={i} className={`rounded-xl p-6 ${isBento && i === 0 ? 'col-span-2' : ''}`} style={{ backgroundColor: tokens.colors.surface, border: `1px solid ${tokens.colors.border}` }}>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${tokens.colors.accent}26` }}><span style={{ fontSize: '20px' }}>{f.icon}</span></div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: tokens.colors.text.primary, marginBottom: '8px' }}>{f.title}</h3>
                        <p style={{ fontSize: '14px', color: tokens.colors.text.muted }}>{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

// Testimonials Renderer
export function TestimonialsRenderer({ element }: RendererProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const testimonials = [
        { name: 'Sarah Chen', role: 'CEO at TechCorp', text: 'This product has completely transformed how we build.' },
        { name: 'Marcus Johnson', role: 'Designer at Studio', text: 'The best tool I have ever used. Highly recommended.' },
        { name: 'Emily Davis', role: 'Developer', text: 'Incredible speed and flexibility. Love it!' },
    ];
    const isSingle = (element.props?.style as string) === 'single';

    return (
        <section className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: tokens.colors.background, padding: '48px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: tokens.colors.text.primary, marginBottom: '40px' }}>Loved by thousands</h2>
            <div className={`${isSingle ? 'max-w-xl' : 'grid grid-cols-3 gap-4 max-w-4xl'}`}>
                {(isSingle ? [testimonials[0]] : testimonials).map((t, i) => (
                    <div key={i} className="rounded-xl p-6" style={{ backgroundColor: tokens.colors.surface, border: `1px solid ${tokens.colors.border}` }}>
                        <p style={{ fontSize: '15px', color: tokens.colors.text.primary, marginBottom: '16px', lineHeight: 1.6 }}>"{t.text}"</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full" style={{ backgroundColor: tokens.colors.accent }} />
                            <div>
                                <p style={{ fontSize: '14px', fontWeight: 600, color: tokens.colors.text.primary }}>{t.name}</p>
                                <p style={{ fontSize: '13px', color: tokens.colors.text.muted }}>{t.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

// Pricing Renderer
export function PricingRenderer({ element }: RendererProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const plans = [
        { name: 'Starter', price: '$9', features: ['5 projects', 'Basic analytics', 'Email support'] },
        { name: 'Pro', price: '$29', features: ['Unlimited projects', 'Advanced analytics', 'Priority support'], popular: true },
        { name: 'Enterprise', price: 'Custom', features: ['Custom solutions', 'Dedicated support', 'SLA guarantee'] },
    ];

    return (
        <section className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: tokens.colors.background, padding: '48px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, color: tokens.colors.text.primary, marginBottom: '12px' }}>Simple pricing</h2>
            <p style={{ fontSize: '16px', color: tokens.colors.text.secondary, marginBottom: '40px' }}>Choose the plan that's right for you</p>
            <div className="grid grid-cols-3 gap-4 max-w-4xl">
                {plans.map((plan, i) => (
                    <div key={i} className="rounded-xl p-6 relative" style={{ backgroundColor: plan.popular ? `${tokens.colors.accent}1a` : tokens.colors.surface, border: `1px solid ${plan.popular ? tokens.colors.accent : tokens.colors.border}` }}>
                        {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: tokens.colors.accent, color: 'white' }}>Popular</span>}
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: tokens.colors.text.primary, marginBottom: '8px' }}>{plan.name}</h3>
                        <p style={{ fontSize: '32px', fontWeight: 700, color: tokens.colors.text.primary, marginBottom: '16px' }}>{plan.price}<span style={{ fontSize: '14px', fontWeight: 400, color: tokens.colors.text.muted }}>/mo</span></p>
                        <ul className="space-y-2 mb-6">{plan.features.map((f, j) => <li key={j} style={{ fontSize: '14px', color: tokens.colors.text.secondary }}>✓ {f}</li>)}</ul>
                        <button className="w-full py-2.5 rounded-lg font-medium text-sm" style={{ backgroundColor: plan.popular ? tokens.colors.accent : 'transparent', color: plan.popular ? 'white' : tokens.colors.text.primary, border: plan.popular ? 'none' : `1px solid ${tokens.colors.border}` }}>Get started</button>
                    </div>
                ))}
            </div>
        </section>
    );
}

// FAQ Renderer
export function FaqRenderer({ element }: RendererProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const faqs = [
        { q: 'How does the free trial work?', a: 'You get 14 days of full access with no credit card required.' },
        { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time.' },
        { q: 'Do you offer refunds?', a: 'We offer a 30-day money back guarantee.' },
    ];

    return (
        <section className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: tokens.colors.background, padding: '48px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: tokens.colors.text.primary, marginBottom: '12px' }}>Frequently asked questions</h2>
            <p style={{ fontSize: '16px', color: tokens.colors.text.secondary, marginBottom: '40px' }}>Everything you need to know</p>
            <div className="w-full max-w-2xl space-y-3">
                {faqs.map((faq, i) => (
                    <div key={i} className="rounded-xl p-5" style={{ backgroundColor: tokens.colors.surface, border: `1px solid ${tokens.colors.border}` }}>
                        <div className="flex items-center justify-between">
                            <h3 style={{ fontSize: '15px', fontWeight: 600, color: tokens.colors.text.primary }}>{faq.q}</h3>
                            <span style={{ color: tokens.colors.text.muted }}>+</span>
                        </div>
                        <p style={{ fontSize: '14px', color: tokens.colors.text.secondary, marginTop: '12px' }}>{faq.a}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

// Footer Renderer
export function FooterRenderer({ element }: RendererProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const links = { Product: ['Features', 'Pricing', 'Changelog'], Company: ['About', 'Blog', 'Careers'], Legal: ['Privacy', 'Terms'] };
    const isSimple = (element.props?.style as string) === 'simple';

    return (
        <footer className="w-full h-full flex items-center" style={{ backgroundColor: tokens.colors.surface, borderTop: `1px solid ${tokens.colors.border}`, padding: '32px 48px' }}>
            {isSimple ? (
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className="w-6 h-6 rounded" style={{ backgroundColor: tokens.colors.accent }} /><span style={{ fontWeight: 600, color: tokens.colors.text.primary }}>Acme</span></div>
                    <p style={{ fontSize: '13px', color: tokens.colors.text.muted }}>© 2024 Acme Inc. All rights reserved.</p>
                    <div className="flex gap-4">{['Twitter', 'GitHub', 'Discord'].map((s) => <span key={s} style={{ fontSize: '13px', color: tokens.colors.text.secondary }}>{s}</span>)}</div>
                </div>
            ) : (
                <div className="w-full grid grid-cols-4 gap-8">
                    <div><div className="flex items-center gap-2 mb-4"><div className="w-6 h-6 rounded" style={{ backgroundColor: tokens.colors.accent }} /><span style={{ fontWeight: 600, color: tokens.colors.text.primary }}>Acme</span></div><p style={{ fontSize: '13px', color: tokens.colors.text.muted }}>Build better, faster.</p></div>
                    {Object.entries(links).map(([cat, items]) => (<div key={cat}><h4 style={{ fontSize: '13px', fontWeight: 600, color: tokens.colors.text.primary, marginBottom: '12px' }}>{cat}</h4><ul className="space-y-2">{items.map((item) => <li key={item} style={{ fontSize: '13px', color: tokens.colors.text.secondary }}>{item}</li>)}</ul></div>))}
                </div>
            )}
        </footer>
    );
}

// Section Renderer
export function SectionRenderer({ element }: RendererProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = element.props?.style as string || 'basic';
    const isFeatures = variantStyle === 'features';
    const isCta = variantStyle === 'cta';

    return (
        <section className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: tokens.colors.surface, padding: '48px', borderRadius: tokens.radius.xl, border: `1px solid ${tokens.colors.border}` }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: tokens.colors.text.primary, marginBottom: '12px' }}>{element.props?.title as string || 'Section Title'}</h2>
            <p style={{ fontSize: '16px', color: tokens.colors.text.secondary, textAlign: 'center', marginBottom: '24px', maxWidth: '400px' }}>{element.props?.description as string || 'Add your content here'}</p>
            {isFeatures && <div className="flex gap-4 mt-2">{[1, 2, 3].map((i) => <div key={i} className="p-4 rounded-lg" style={{ backgroundColor: tokens.colors.background, border: `1px solid ${tokens.colors.border}`, width: '100px', textAlign: 'center' }}><div className="w-8 h-8 rounded-lg mx-auto mb-2" style={{ backgroundColor: `${tokens.colors.accent}33` }} /><span style={{ fontSize: '12px', color: tokens.colors.text.secondary }}>Feature {i}</span></div>)}</div>}
            {isCta && <button className="mt-4 px-6 py-3 rounded-lg font-medium" style={{ backgroundColor: tokens.colors.accent, color: 'white' }}>Take Action</button>}
        </section>
    );
}

// Image Renderer
export function ImageRenderer({ element }: RendererProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = element.props?.style as string || 'basic';
    const src = element.props?.src as string;
    const radiusMap: Record<string, string> = { basic: tokens.radius.lg, rounded: tokens.radius['2xl'], avatar: '50%' };

    return (
        <div className="w-full h-full flex items-center justify-center overflow-hidden" style={{ borderRadius: radiusMap[variantStyle], backgroundColor: tokens.colors.surface, border: `1px solid ${tokens.colors.borderSubtle}` }}>
            {src ? <img src={src} alt={element.props?.alt as string || 'Image'} className="w-full h-full object-cover" style={{ borderRadius: radiusMap[variantStyle] }} /> : (
                <div className="flex flex-col items-center gap-2">
                    <svg className="w-10 h-10" fill="none" stroke={tokens.colors.text.muted} strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    <span style={{ fontSize: '12px', color: tokens.colors.text.muted }}>{variantStyle === 'avatar' ? 'Avatar' : 'Image'}</span>
                </div>
            )}
        </div>
    );
}

// Card Renderer
export function CardRenderer({ element }: RendererProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = element.props?.style as string || 'basic';
    const isHorizontal = variantStyle === 'horizontal';
    const isOverlay = variantStyle === 'overlay';
    const isMinimal = variantStyle === 'minimal';

    return (
        <div className={`w-full h-full flex ${isHorizontal ? 'flex-row' : 'flex-col'} overflow-hidden`} style={{ backgroundColor: tokens.colors.surface, borderRadius: tokens.radius.xl, border: `1px solid ${tokens.colors.border}` }}>
            {!isMinimal && (
                <div className={`flex-shrink-0 flex items-center justify-center relative ${isHorizontal ? 'w-2/5' : ''}`} style={{ height: isHorizontal ? '100%' : '45%', backgroundColor: tokens.colors.background, borderRight: isHorizontal ? `1px solid ${tokens.colors.borderSubtle}` : 'none', borderBottom: isHorizontal ? 'none' : `1px solid ${tokens.colors.borderSubtle}` }}>
                    <svg className="w-8 h-8" fill="none" stroke={tokens.colors.text.muted} strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    {isOverlay && <div className="absolute inset-0 flex items-end" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)', padding: '20px' }}><div><h3 style={{ fontSize: '16px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>{element.props?.title as string || 'Card Title'}</h3><p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{element.props?.description as string || 'Description'}</p></div></div>}
                </div>
            )}
            {!isOverlay && (
                <div className={`flex-1 flex flex-col ${isMinimal ? 'justify-center' : ''}`} style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: tokens.colors.text.primary, marginBottom: '8px' }}>{element.props?.title as string || 'Card Title'}</h3>
                    <p style={{ fontSize: '14px', color: tokens.colors.text.muted, lineHeight: 1.5, flex: 1 }}>{element.props?.description as string || 'Card description goes here.'}</p>
                    <span style={{ fontSize: '14px', color: tokens.colors.accent, fontWeight: 500, marginTop: '12px' }}>Learn more →</span>
                </div>
            )}
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
        marquee: MarqueeRenderer,
        features: FeaturesRenderer,
        testimonials: TestimonialsRenderer,
        pricing: PricingRenderer,
        faq: FaqRenderer,
        footer: FooterRenderer,
    };

    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const Renderer = rendererMap[element.type];

    if (!Renderer) {
        return (
            <div className="w-full h-full flex items-center justify-center rounded-lg" style={{ backgroundColor: tokens.colors.surface, border: `1px dashed ${tokens.colors.border}` }}>
                <span style={{ color: tokens.colors.text.muted, fontSize: '13px' }}>Unknown: {element.type}</span>
            </div>
        );
    }

    return <Renderer element={element} isEditing={isEditing} />;
}
