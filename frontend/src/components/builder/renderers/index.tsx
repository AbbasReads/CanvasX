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

// Helper to extract custom style props from element
function getStyleProps(element: CanvasElement, tokens: ReturnType<typeof createDesignTokens>) {
    const customStyles = (element.props?.styles as React.CSSProperties) || {};
    return {
        customStyles,
        fontSize: (customStyles.fontSize as string) || ((element.props?.fontSize as number) ? `${element.props.fontSize}px` : undefined),
        textColor: (customStyles.color as string) || (element.props?.textColor as string) || (element.props?.color as string) || undefined,
        backgroundColor: (customStyles.backgroundColor as string) || (element.props?.backgroundColor as string) || undefined,
        accentColor: (element.props?.accentColor as string) || undefined,
        borderRadius: (customStyles.borderRadius as string) || ((element.props?.borderRadius as number) ? `${element.props.borderRadius}px` : undefined),
        padding: (customStyles.padding as string) || ((element.props?.padding as number) ? `${element.props.padding}px` : undefined),
        fontWeight: (customStyles.fontWeight as string | number) || (element.props?.fontWeight as string | number) || undefined,
        fontFamily: (customStyles.fontFamily as string) || (element.props?.fontFamily as string) || undefined,
    };
}

// Button Renderer with variant styles
export function ButtonRenderer({ element }: RendererProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = element.props?.style as string || 'primary';
    const styleProps = getStyleProps(element, tokens);

    const variants: Record<string, React.CSSProperties> = {
        primary: { backgroundColor: styleProps.accentColor || tokens.colors.accent, color: 'white', border: 'none' },
        secondary: { backgroundColor: 'transparent', color: styleProps.accentColor || tokens.colors.accent, border: `2px solid ${styleProps.accentColor || tokens.colors.accent}` },
        ghost: { backgroundColor: styleProps.backgroundColor || 'rgba(255,255,255,0.05)', color: styleProps.textColor || tokens.colors.text.primary, border: '1px solid rgba(255,255,255,0.1)' },
        gradient: { background: `linear-gradient(135deg, ${styleProps.accentColor || tokens.colors.accent} 0%, ${tokens.colors.accentSecondary} 100%)`, color: 'white', border: 'none' },
    };

    return (
        <button className="w-full h-full flex items-center justify-center transition-all" style={{ ...variants[variantStyle], fontSize: styleProps.fontSize || '14px', fontWeight: styleProps.fontWeight || 500, borderRadius: styleProps.borderRadius || tokens.radius.md, fontFamily: styleProps.fontFamily, ...styleProps.customStyles }}>
            {element.props?.text as string || element.label || 'Button'}
        </button>
    );
}

// Text Renderer
export function TextRenderer({ element }: RendererProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = element.props?.style as string || 'paragraph';
    const styleProps = getStyleProps(element, tokens);

    const variants: Record<string, React.CSSProperties> = {
        heading: { fontSize: styleProps.fontSize || '32px', fontWeight: styleProps.fontWeight || 700, letterSpacing: '-0.03em' },
        paragraph: { fontSize: styleProps.fontSize || '16px', fontWeight: styleProps.fontWeight || 400, lineHeight: 1.7 },
        caption: { fontSize: styleProps.fontSize || '13px', fontWeight: styleProps.fontWeight || 500, color: styleProps.textColor || tokens.colors.text.muted, textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
    };

    return (
        <div className="w-full h-full flex items-center" style={{ color: styleProps.textColor || tokens.colors.text.primary, padding: styleProps.padding || tokens.spacing.sm, backgroundColor: styleProps.backgroundColor, fontFamily: styleProps.fontFamily, ...variants[variantStyle], ...styleProps.customStyles }}>
            {element.props?.text as string || element.label || 'Text content'}
        </div>
    );
}

// Navbar Renderer
export function NavbarRenderer({ element }: RendererProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = element.props?.style as string || 'minimal';
    const styleProps = getStyleProps(element, tokens);

    // Get configurable props with defaults
    const brandName = (element.props?.brandName as string) || 'Acme';
    const navLinks = (element.props?.navLinks as string[]) || ['Products', 'Solutions', 'Pricing', 'Company'];
    const ctaText = (element.props?.ctaText as string) || (element.props?.text as string) || 'Get Started';
    const signInText = (element.props?.signInText as string) || 'Sign in';

    const variants: Record<string, React.CSSProperties> = {
        minimal: { backgroundColor: styleProps.backgroundColor || tokens.colors.surface, borderBottom: `1px solid ${tokens.colors.border}` },
        centered: { backgroundColor: styleProps.backgroundColor || tokens.colors.surface, borderBottom: `1px solid ${tokens.colors.border}` },
        dark: { backgroundColor: styleProps.backgroundColor || tokens.colors.background, borderBottom: `1px solid rgba(255,255,255,0.05)` },
        transparent: { backgroundColor: styleProps.backgroundColor || 'rgba(255,255,255,0.02)', backdropFilter: 'blur(16px)', border: `1px solid rgba(255,255,255,0.06)`, borderRadius: styleProps.borderRadius || tokens.radius.xl, margin: '12px' },
    };

    const isCentered = variantStyle === 'centered';
    const accentColor = styleProps.accentColor || tokens.colors.accent;
    const textColor = styleProps.textColor || tokens.colors.text.primary;
    const fontSize = styleProps.fontSize || '14px';
    const fontFamily = styleProps.fontFamily;
    const padding = styleProps.padding || '0 40px';

    return (
        <nav className="w-full h-full flex items-center" style={{ ...variants[variantStyle], padding, ...styleProps.customStyles }}>
            {isCentered ? (
                <>
                    <div className="flex items-center gap-8 flex-1">
                        {navLinks.slice(0, 2).map((item) => <span key={item} style={{ fontSize, color: textColor, fontWeight: styleProps.fontWeight || 500, fontFamily }}>{item}</span>)}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentColor, borderRadius: styleProps.borderRadius }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                        </div>
                        <span style={{ fontWeight: styleProps.fontWeight || 700, color: textColor, fontSize: fontSize === '14px' ? '16px' : fontSize, fontFamily }}>{brandName}</span>
                    </div>
                    <div className="flex items-center gap-8 flex-1 justify-end">
                        {navLinks.slice(2, 4).map((item) => <span key={item} style={{ fontSize, color: textColor, fontWeight: styleProps.fontWeight || 500, fontFamily }}>{item}</span>)}
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentColor, borderRadius: styleProps.borderRadius }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                        </div>
                        <span style={{ fontWeight: styleProps.fontWeight || 700, color: textColor, fontSize: fontSize === '14px' ? '16px' : fontSize, fontFamily }}>{brandName}</span>
                    </div>
                    <div className="flex items-center gap-8 ml-12">
                        {navLinks.map((item) => <span key={item} style={{ fontSize, color: textColor, fontWeight: styleProps.fontWeight || 500, fontFamily }}>{item}</span>)}
                    </div>
                    <div className="flex items-center gap-3 ml-auto">
                        <span style={{ fontSize, color: textColor, fontWeight: styleProps.fontWeight || 500, fontFamily }}>{signInText}</span>
                        <button style={{ padding: '8px 16px', backgroundColor: accentColor, color: 'white', fontSize, fontWeight: styleProps.fontWeight || 500, borderRadius: styleProps.borderRadius || tokens.radius.md, border: 'none', fontFamily }}>{ctaText}</button>
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
    const styleProps = getStyleProps(element, tokens);

    const heading = element.props?.heading as string || 'Build products faster than ever';
    const subheading = element.props?.subheading as string || 'The modern platform for building beautiful, responsive websites.';
    const textColor = styleProps.textColor || tokens.colors.text.primary;
    const fontSize = styleProps.fontSize || '18px';
    const fontFamily = styleProps.fontFamily;
    const accentColor = styleProps.accentColor || tokens.colors.accent;

    const variants: Record<string, React.CSSProperties> = {
        centered: { background: styleProps.backgroundColor || `radial-gradient(ellipse at top, ${accentColor}33 0%, ${tokens.colors.background} 60%)` },
        split: { background: styleProps.backgroundColor || tokens.colors.background },
        gradient: { background: styleProps.backgroundColor || `linear-gradient(135deg, ${accentColor} 0%, ${tokens.colors.accentSecondary} 100%)` },
        minimal: { background: styleProps.backgroundColor || tokens.colors.background },
    };

    const isSplit = variantStyle === 'split';
    const isMinimal = variantStyle === 'minimal';
    const isGradient = variantStyle === 'gradient';

    return (
        <section className={`w-full h-full flex ${isSplit ? 'flex-row' : 'flex-col'} items-center justify-center relative overflow-hidden`} style={{ ...variants[variantStyle], padding: styleProps.padding || '48px', ...styleProps.customStyles }}>
            {!isGradient && <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }} />}
            <div className={`relative z-10 ${isSplit ? 'flex-1 pr-8' : 'max-w-2xl text-center'}`}>
                {!isMinimal && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ backgroundColor: `${accentColor}26`, border: `1px solid ${accentColor}4d` }}>
                        <span style={{ fontSize: '12px', color: accentColor, fontWeight: 500, fontFamily }}>✨ Announcing v2.0</span>
                    </div>
                )}
                <h1 style={{ fontSize: isSplit ? '48px' : '56px', fontWeight: styleProps.fontWeight || 700, color: textColor, marginBottom: '20px', lineHeight: 1.1, letterSpacing: '-0.04em', fontFamily }}>
                    {heading}
                </h1>
                <p style={{ fontSize, color: textColor, marginBottom: isMinimal ? '0' : '32px', lineHeight: 1.6, maxWidth: '520px', margin: isSplit ? '' : '0 auto 32px', fontFamily }}>
                    {subheading}
                </p>
                {!isMinimal && (
                    <div className={`flex items-center gap-4 ${isSplit ? '' : 'justify-center'}`}>
                        <button style={{ padding: '14px 28px', backgroundColor: isGradient ? 'rgba(255,255,255,0.2)' : 'white', color: isGradient ? 'white' : tokens.colors.background, fontSize: '15px', fontWeight: 600, borderRadius: styleProps.borderRadius || tokens.radius.lg, border: isGradient ? '1px solid rgba(255,255,255,0.3)' : 'none', fontFamily }}>Start for free</button>
                        <button style={{ padding: '14px 28px', backgroundColor: 'transparent', color: textColor, fontSize: '15px', fontWeight: 500, borderRadius: styleProps.borderRadius || tokens.radius.lg, border: `1px solid ${tokens.colors.border}`, fontFamily }}>View demo →</button>
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
    const styleProps = getStyleProps(element, tokens);
    const logos = ['Vercel', 'Stripe', 'Notion', 'Linear', 'Figma', 'Framer'];

    const textColor = styleProps.textColor || tokens.colors.text.muted;
    const fontSize = styleProps.fontSize || '16px';
    const fontFamily = styleProps.fontFamily;
    const accentColor = styleProps.accentColor || tokens.colors.accent;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden" style={{ backgroundColor: styleProps.backgroundColor || tokens.colors.background, padding: styleProps.padding || '32px', ...styleProps.customStyles }}>
            <p style={{ fontSize: '13px', color: textColor, marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily }}>Trusted by leading companies</p>
            <div className="flex items-center gap-12">
                {logos.map((logo) => (
                    <div key={logo} className="flex items-center gap-2" style={{ opacity: 0.6 }}>
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: accentColor + '33', borderRadius: styleProps.borderRadius }} />
                        <span style={{ fontSize, fontWeight: styleProps.fontWeight || 600, color: textColor, fontFamily }}>{logo}</span>
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
    const styleProps = getStyleProps(element, tokens);
    const features = [
        { icon: '⚡', title: 'Lightning Fast', desc: 'Built for speed from the ground up' },
        { icon: '🔒', title: 'Secure by Default', desc: 'Enterprise-grade security included' },
        { icon: '📱', title: 'Fully Responsive', desc: 'Looks great on any device' },
        { icon: '🎨', title: 'Customizable', desc: 'Make it truly yours' },
    ];
    const variantStyle = element.props?.style as string || 'grid';
    const isBento = variantStyle === 'bento';
    const isList = variantStyle === 'list';

    const textColor = styleProps.textColor || tokens.colors.text.primary;
    const fontSize = styleProps.fontSize || '14px';
    const fontFamily = styleProps.fontFamily;
    const accentColor = styleProps.accentColor || tokens.colors.accent;

    return (
        <section className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: styleProps.backgroundColor || tokens.colors.background, padding: styleProps.padding || '48px', ...styleProps.customStyles }}>
            <h2 style={{ fontSize: '36px', fontWeight: styleProps.fontWeight || 700, color: textColor, marginBottom: '12px', letterSpacing: '-0.03em', fontFamily }}>Everything you need</h2>
            <p style={{ fontSize: '16px', color: textColor, marginBottom: '40px', maxWidth: '400px', textAlign: 'center', fontFamily }}>Packed with features to help you build faster</p>
            <div className={`grid gap-4 w-full max-w-3xl ${isList ? 'grid-cols-1' : isBento ? 'grid-cols-2' : 'grid-cols-4'}`}>
                {features.map((f, i) => (
                    <div key={i} className={`rounded-xl p-6 ${isBento && i === 0 ? 'col-span-2' : ''}`} style={{ backgroundColor: tokens.colors.surface, border: `1px solid ${tokens.colors.border}`, borderRadius: styleProps.borderRadius }}>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${accentColor}26` }}><span style={{ fontSize: '20px' }}>{f.icon}</span></div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: textColor, marginBottom: '8px', fontFamily }}>{f.title}</h3>
                        <p style={{ fontSize, color: textColor, fontFamily }}>{f.desc}</p>
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
    const styleProps = getStyleProps(element, tokens);
    const testimonials = [
        { name: 'Sarah Chen', role: 'CEO at TechCorp', text: 'This product has completely transformed how we build.' },
        { name: 'Marcus Johnson', role: 'Designer at Studio', text: 'The best tool I have ever used. Highly recommended.' },
        { name: 'Emily Davis', role: 'Developer', text: 'Incredible speed and flexibility. Love it!' },
    ];
    const isSingle = (element.props?.style as string) === 'single';

    const textColor = styleProps.textColor || tokens.colors.text.primary;
    const fontSize = styleProps.fontSize || '15px';
    const fontFamily = styleProps.fontFamily;
    const accentColor = styleProps.accentColor || tokens.colors.accent;

    return (
        <section className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: styleProps.backgroundColor || tokens.colors.background, padding: styleProps.padding || '48px', ...styleProps.customStyles }}>
            <h2 style={{ fontSize: '32px', fontWeight: styleProps.fontWeight || 700, color: textColor, marginBottom: '40px', fontFamily }}>Loved by thousands</h2>
            <div className={`${isSingle ? 'max-w-xl' : 'grid grid-cols-3 gap-4 max-w-4xl'}`}>
                {(isSingle ? [testimonials[0]] : testimonials).map((t, i) => (
                    <div key={i} className="rounded-xl p-6" style={{ backgroundColor: tokens.colors.surface, border: `1px solid ${tokens.colors.border}`, borderRadius: styleProps.borderRadius }}>
                        <p style={{ fontSize, color: textColor, marginBottom: '16px', lineHeight: 1.6, fontFamily }}>"{t.text}"</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full" style={{ backgroundColor: accentColor }} />
                            <div>
                                <p style={{ fontSize: '14px', fontWeight: 600, color: textColor, fontFamily }}>{t.name}</p>
                                <p style={{ fontSize: '13px', color: textColor, fontFamily }}>{t.role}</p>
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
    const styleProps = getStyleProps(element, tokens);
    const plans = [
        { name: 'Starter', price: '$9', features: ['5 projects', 'Basic analytics', 'Email support'] },
        { name: 'Pro', price: '$29', features: ['Unlimited projects', 'Advanced analytics', 'Priority support'], popular: true },
        { name: 'Enterprise', price: 'Custom', features: ['Custom solutions', 'Dedicated support', 'SLA guarantee'] },
    ];

    const textColor = styleProps.textColor || tokens.colors.text.primary;
    const fontSize = styleProps.fontSize || '14px';
    const fontFamily = styleProps.fontFamily;
    const accentColor = styleProps.accentColor || tokens.colors.accent;

    return (
        <section className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: styleProps.backgroundColor || tokens.colors.background, padding: styleProps.padding || '48px', ...styleProps.customStyles }}>
            <h2 style={{ fontSize: '36px', fontWeight: styleProps.fontWeight || 700, color: textColor, marginBottom: '12px', fontFamily }}>Simple pricing</h2>
            <p style={{ fontSize: '16px', color: textColor, marginBottom: '40px', fontFamily }}>Choose the plan that's right for you</p>
            <div className="grid grid-cols-3 gap-4 max-w-4xl">
                {plans.map((plan, i) => (
                    <div key={i} className="rounded-xl p-6 relative" style={{ backgroundColor: plan.popular ? `${accentColor}1a` : tokens.colors.surface, border: `1px solid ${plan.popular ? accentColor : tokens.colors.border}`, borderRadius: styleProps.borderRadius }}>
                        {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: accentColor, color: 'white', fontFamily }}>Popular</span>}
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: textColor, marginBottom: '8px', fontFamily }}>{plan.name}</h3>
                        <p style={{ fontSize: '32px', fontWeight: 700, color: textColor, marginBottom: '16px', fontFamily }}>{plan.price}<span style={{ fontSize: '14px', fontWeight: 400, color: textColor, fontFamily }}>/mo</span></p>
                        <ul className="space-y-2 mb-6">{plan.features.map((f, j) => <li key={j} style={{ fontSize, color: textColor, fontFamily }}>✓ {f}</li>)}</ul>
                        <button className="w-full py-2.5 rounded-lg font-medium text-sm" style={{ backgroundColor: plan.popular ? accentColor : 'transparent', color: plan.popular ? 'white' : textColor, border: plan.popular ? 'none' : `1px solid ${tokens.colors.border}`, borderRadius: styleProps.borderRadius, fontFamily }}>Get started</button>
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
    const styleProps = getStyleProps(element, tokens);
    const faqs = [
        { q: 'How does the free trial work?', a: 'You get 14 days of full access with no credit card required.' },
        { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time.' },
        { q: 'Do you offer refunds?', a: 'We offer a 30-day money back guarantee.' },
    ];

    const textColor = styleProps.textColor || tokens.colors.text.primary;
    const fontSize = styleProps.fontSize || '14px';
    const fontFamily = styleProps.fontFamily;

    return (
        <section className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: styleProps.backgroundColor || tokens.colors.background, padding: styleProps.padding || '48px', ...styleProps.customStyles }}>
            <h2 style={{ fontSize: '32px', fontWeight: styleProps.fontWeight || 700, color: textColor, marginBottom: '12px', fontFamily }}>Frequently asked questions</h2>
            <p style={{ fontSize: '16px', color: textColor, marginBottom: '40px', fontFamily }}>Everything you need to know</p>
            <div className="w-full max-w-2xl space-y-3">
                {faqs.map((faq, i) => (
                    <div key={i} className="rounded-xl p-5" style={{ backgroundColor: tokens.colors.surface, border: `1px solid ${tokens.colors.border}`, borderRadius: styleProps.borderRadius }}>
                        <div className="flex items-center justify-between">
                            <h3 style={{ fontSize: '15px', fontWeight: 600, color: textColor, fontFamily }}>{faq.q}</h3>
                            <span style={{ color: textColor }}>+</span>
                        </div>
                        <p style={{ fontSize, color: textColor, marginTop: '12px', fontFamily }}>{faq.a}</p>
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

    // Get configurable props with defaults
    const brandName = (element.props?.brandName as string) || (element.props?.text as string) || 'Acme';
    const copyrightYear = (element.props?.copyrightYear as string) || '2024';
    const copyrightText = (element.props?.copyrightText as string) || `© ${copyrightYear} ${brandName} Inc. All rights reserved.`;
    const tagline = (element.props?.tagline as string) || (element.props?.description as string) || 'Build better, faster.';
    const socialLinks = (element.props?.socialLinks as string[]) || ['Twitter', 'GitHub', 'Discord'];

    // Get custom style props
    const customStyles = (element.props?.styles as React.CSSProperties) || {};
    const fontSize = (customStyles.fontSize as string) || ((element.props?.fontSize as number) ? `${element.props.fontSize}px` : '13px');
    const textColor = (customStyles.color as string) || (element.props?.textColor as string) || (element.props?.color as string) || tokens.colors.text.primary;
    const backgroundColor = (customStyles.backgroundColor as string) || (element.props?.backgroundColor as string) || tokens.colors.surface;
    const accentColor = (element.props?.accentColor as string) || tokens.colors.accent;
    const borderRadius = (customStyles.borderRadius as string) || ((element.props?.borderRadius as number) ? `${element.props.borderRadius}px` : undefined);
    const padding = (customStyles.padding as string) || ((element.props?.padding as number) ? `${element.props.padding}px` : '32px 48px');
    const fontWeight = (customStyles.fontWeight as string | number) || (element.props?.fontWeight as string | number) || 600;
    const fontFamily = (customStyles.fontFamily as string) || (element.props?.fontFamily as string) || undefined;

    return (
        <footer className="w-full h-full flex items-center" style={{ backgroundColor, borderTop: `1px solid ${tokens.colors.border}`, padding, ...customStyles }}>
            {isSimple ? (
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: accentColor, borderRadius: borderRadius }} />
                        <span style={{ fontWeight, color: textColor, fontSize, fontFamily }}>{brandName}</span>
                    </div>
                    <p style={{ fontSize, color: textColor, fontFamily }}>{copyrightText}</p>
                    <div className="flex gap-4">{socialLinks.map((s) => <span key={s} style={{ fontSize, color: textColor, fontFamily }}>{s}</span>)}</div>
                </div>
            ) : (
                <div className="w-full grid grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded" style={{ backgroundColor: accentColor, borderRadius: borderRadius }} />
                            <span style={{ fontWeight, color: textColor, fontSize, fontFamily }}>{brandName}</span>
                        </div>
                        <p style={{ fontSize, color: textColor, fontFamily }}>{tagline}</p>
                    </div>
                    {Object.entries(links).map(([cat, items]) => (
                        <div key={cat}>
                            <h4 style={{ fontSize, fontWeight, color: textColor, fontFamily, marginBottom: '12px' }}>{cat}</h4>
                            <ul className="space-y-2">{items.map((item) => <li key={item} style={{ fontSize, color: textColor, fontFamily }}>{item}</li>)}</ul>
                        </div>
                    ))}
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
    const styleProps = getStyleProps(element, tokens);
    const isFeatures = variantStyle === 'features';
    const isCta = variantStyle === 'cta';

    const textColor = styleProps.textColor || tokens.colors.text.primary;
    const fontSize = styleProps.fontSize || '16px';
    const fontFamily = styleProps.fontFamily;
    const accentColor = styleProps.accentColor || tokens.colors.accent;

    return (
        <section className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: styleProps.backgroundColor || tokens.colors.surface, padding: styleProps.padding || '48px', borderRadius: styleProps.borderRadius || tokens.radius.xl, border: `1px solid ${tokens.colors.border}`, ...styleProps.customStyles }}>
            <h2 style={{ fontSize: '28px', fontWeight: styleProps.fontWeight || 700, color: textColor, marginBottom: '12px', fontFamily }}>{element.props?.title as string || 'Section Title'}</h2>
            <p style={{ fontSize, color: textColor, textAlign: 'center', marginBottom: '24px', maxWidth: '400px', fontFamily }}>{element.props?.description as string || 'Add your content here'}</p>
            {isFeatures && <div className="flex gap-4 mt-2">{[1, 2, 3].map((i) => <div key={i} className="p-4 rounded-lg" style={{ backgroundColor: tokens.colors.background, border: `1px solid ${tokens.colors.border}`, width: '100px', textAlign: 'center' }}><div className="w-8 h-8 rounded-lg mx-auto mb-2" style={{ backgroundColor: `${accentColor}33` }} /><span style={{ fontSize: '12px', color: textColor, fontFamily }}>Feature {i}</span></div>)}</div>}
            {isCta && <button className="mt-4 px-6 py-3 rounded-lg font-medium" style={{ backgroundColor: accentColor, color: 'white', fontFamily }}>Take Action</button>}
        </section>
    );
}

// Image Renderer
export function ImageRenderer({ element }: RendererProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = element.props?.style as string || 'basic';
    const styleProps = getStyleProps(element, tokens);
    const src = element.props?.src as string;
    const radiusMap: Record<string, string> = { basic: styleProps.borderRadius || tokens.radius.lg, rounded: styleProps.borderRadius || tokens.radius['2xl'], avatar: '50%' };

    return (
        <div className="w-full h-full flex items-center justify-center overflow-hidden" style={{ borderRadius: radiusMap[variantStyle], backgroundColor: styleProps.backgroundColor || tokens.colors.surface, border: `1px solid ${tokens.colors.borderSubtle}`, ...styleProps.customStyles }}>
            {src ? <img src={src} alt={element.props?.alt as string || 'Image'} className="w-full h-full object-cover" style={{ borderRadius: radiusMap[variantStyle] }} /> : (
                <div className="flex flex-col items-center gap-2">
                    <svg className="w-10 h-10" fill="none" stroke={tokens.colors.text.muted} strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    <span style={{ fontSize: styleProps.fontSize || '12px', color: styleProps.textColor || tokens.colors.text.muted, fontFamily: styleProps.fontFamily }}>{variantStyle === 'avatar' ? 'Avatar' : 'Image'}</span>
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
    const styleProps = getStyleProps(element, tokens);
    const isHorizontal = variantStyle === 'horizontal';
    const isOverlay = variantStyle === 'overlay';
    const isMinimal = variantStyle === 'minimal';

    const textColor = styleProps.textColor || tokens.colors.text.primary;
    const fontSize = styleProps.fontSize || '14px';
    const fontFamily = styleProps.fontFamily;
    const accentColor = styleProps.accentColor || tokens.colors.accent;

    return (
        <div className={`w-full h-full flex ${isHorizontal ? 'flex-row' : 'flex-col'} overflow-hidden`} style={{ backgroundColor: styleProps.backgroundColor || tokens.colors.surface, borderRadius: styleProps.borderRadius || tokens.radius.xl, border: `1px solid ${tokens.colors.border}`, ...styleProps.customStyles }}>
            {!isMinimal && (
                <div className={`flex-shrink-0 flex items-center justify-center relative ${isHorizontal ? 'w-2/5' : ''}`} style={{ height: isHorizontal ? '100%' : '45%', backgroundColor: tokens.colors.background, borderRight: isHorizontal ? `1px solid ${tokens.colors.borderSubtle}` : 'none', borderBottom: isHorizontal ? 'none' : `1px solid ${tokens.colors.borderSubtle}` }}>
                    <svg className="w-8 h-8" fill="none" stroke={tokens.colors.text.muted} strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    {isOverlay && <div className="absolute inset-0 flex items-end" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)', padding: '20px' }}><div><h3 style={{ fontSize: '16px', fontWeight: styleProps.fontWeight || 600, color: 'white', marginBottom: '4px', fontFamily }}>{element.props?.title as string || 'Card Title'}</h3><p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontFamily }}>{element.props?.description as string || 'Description'}</p></div></div>}
                </div>
            )}
            {!isOverlay && (
                <div className={`flex-1 flex flex-col ${isMinimal ? 'justify-center' : ''}`} style={{ padding: styleProps.padding || '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: styleProps.fontWeight || 600, color: textColor, marginBottom: '8px', fontFamily }}>{element.props?.title as string || 'Card Title'}</h3>
                    <p style={{ fontSize, color: textColor, lineHeight: 1.5, flex: 1, fontFamily }}>{element.props?.description as string || 'Card description goes here.'}</p>
                    <span style={{ fontSize, color: accentColor, fontWeight: 500, marginTop: '12px', fontFamily }}>Learn more →</span>
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
