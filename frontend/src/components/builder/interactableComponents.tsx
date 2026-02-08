import { withInteractable } from '@tambo-ai/react';
import { z } from 'zod';
import React, { useState, useRef, useEffect } from 'react';
import { CanvasElement, useBuilder, ThemePalette } from '@/contexts/BuilderContext';

// ============================================================================
// DESIGN TOKENS HELPER
// ============================================================================

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

// ============================================================================
// ZOD SCHEMAS FOR ALL COMPONENTS
// ============================================================================

// Common style properties shared across components
const commonStyleSchema = z.object({
    backgroundColor: z.string().optional().describe('Background color (hex or CSS color)'),
    textColor: z.string().optional().describe('Text color (hex or CSS color)'),
    borderColor: z.string().optional().describe('Border color (hex or CSS color)'),
    borderWidth: z.number().optional().describe('Border width in pixels'),
    borderRadius: z.number().optional().describe('Border radius in pixels'),
    padding: z.number().optional().describe('Padding in pixels'),
}).partial();

// ---- NAVBAR ----
export const navbarPropsSchema = z.object({
    // Text content
    brandName: z.string().describe('Brand/company name displayed in the navbar'),
    navLinks: z.array(z.string()).describe('Navigation link labels (e.g., ["Home", "About", "Contact"])'),
    ctaText: z.string().describe('Call-to-action button text'),
    signInText: z.string().describe('Sign-in link text'),
    // Colors
    accentColor: z.string().optional().describe('Accent color for logo background and CTA button (hex like #3b82f6)'),
    backgroundColor: z.string().optional().describe('Navbar background color (hex like #1e293b)'),
    textColor: z.string().optional().describe('Text color for brand name (hex like #ffffff)'),
    linkColor: z.string().optional().describe('Color for navigation links (hex like #94a3b8)'),
    ctaBackgroundColor: z.string().optional().describe('CTA button background color'),
    ctaTextColor: z.string().optional().describe('CTA button text color'),
    // Borders
    borderColor: z.string().optional().describe('Border color (hex like #ffffff1a)'),
    borderWidth: z.number().optional().describe('Border width in pixels'),
    borderRadius: z.number().optional().describe('Border radius for navbar in pixels'),
    // Spacing
    padding: z.number().optional().describe('Horizontal padding in pixels'),
    gap: z.number().optional().describe('Gap between navigation links in pixels'),
    // Typography
    brandFontSize: z.number().optional().describe('Brand name font size in pixels'),
    linkFontSize: z.number().optional().describe('Navigation link font size in pixels'),
    // Style
    style: z.enum(['minimal', 'centered', 'dark', 'transparent']).optional().describe('Navbar style variant'),
});

// ---- HERO ----
export const heroPropsSchema = z.object({
    heading: z.string().describe('Main headline text'),
    subheading: z.string().describe('Subtitle or description text'),
    badgeText: z.string().optional().describe('Badge/announcement text'),
    primaryButtonText: z.string().optional().describe('Primary CTA button text'),
    secondaryButtonText: z.string().optional().describe('Secondary button text'),
    backgroundColor: z.string().optional().describe('Background color'),
    textColor: z.string().optional().describe('Heading text color'),
    subtitleColor: z.string().optional().describe('Subtitle text color'),
    accentColor: z.string().optional().describe('Accent color for buttons and badges'),
    style: z.enum(['centered', 'split', 'gradient', 'minimal']).optional().describe('Hero style variant'),
});

// ---- BUTTON ----
export const buttonPropsSchema = z.object({
    text: z.string().describe('Button text'),
    backgroundColor: z.string().optional().describe('Button background color'),
    textColor: z.string().optional().describe('Button text color'),
    borderRadius: z.number().optional().describe('Border radius in pixels'),
    fontSize: z.number().optional().describe('Font size in pixels'),
    padding: z.number().optional().describe('Padding in pixels'),
    style: z.enum(['primary', 'secondary', 'ghost', 'gradient']).optional().describe('Button style variant'),
});

// ---- TEXT ----
export const textPropsSchema = z.object({
    text: z.string().describe('Text content'),
    fontSize: z.number().optional().describe('Font size in pixels'),
    fontWeight: z.number().optional().describe('Font weight (100-900)'),
    textColor: z.string().optional().describe('Text color'),
    lineHeight: z.number().optional().describe('Line height multiplier'),
    style: z.enum(['heading', 'paragraph', 'caption']).optional().describe('Text style variant'),
});

// ---- CARD ----
export const cardPropsSchema = z.object({
    title: z.string().describe('Card title'),
    description: z.string().describe('Card description'),
    imageUrl: z.string().optional().describe('Card image URL'),
    ctaText: z.string().optional().describe('Call-to-action link text'),
    backgroundColor: z.string().optional().describe('Card background color'),
    borderColor: z.string().optional().describe('Card border color'),
    borderRadius: z.number().optional().describe('Border radius in pixels'),
    style: z.enum(['basic', 'horizontal', 'overlay', 'minimal']).optional().describe('Card style variant'),
});

// ---- SECTION ----
export const sectionPropsSchema = z.object({
    title: z.string().describe('Section title'),
    description: z.string().describe('Section description'),
    backgroundColor: z.string().optional().describe('Section background color'),
    textColor: z.string().optional().describe('Text color'),
    borderColor: z.string().optional().describe('Border color'),
    style: z.enum(['basic', 'features', 'cta']).optional().describe('Section style variant'),
});

// ---- FOOTER ----
export const footerPropsSchema = z.object({
    // Text content
    brandName: z.string().describe('Brand name displayed in footer'),
    tagline: z.string().optional().describe('Brand tagline/slogan'),
    copyrightText: z.string().optional().describe('Copyright text (e.g., "© 2024 Company Inc.")'),
    socialLinks: z.array(z.string()).optional().describe('Social media link labels (e.g., ["Twitter", "GitHub", "Discord"])'),
    // Link sections
    productLinks: z.array(z.string()).optional().describe('Product section links (e.g., ["Features", "Pricing"])'),
    companyLinks: z.array(z.string()).optional().describe('Company section links (e.g., ["About", "Blog"])'),
    legalLinks: z.array(z.string()).optional().describe('Legal section links (e.g., ["Privacy", "Terms"])'),
    // Colors
    backgroundColor: z.string().optional().describe('Footer background color (hex like #1e293b)'),
    textColor: z.string().optional().describe('Brand and heading text color (hex like #ffffff)'),
    linkColor: z.string().optional().describe('Link text color (hex like #94a3b8)'),
    accentColor: z.string().optional().describe('Accent color for logo (hex like #3b82f6)'),
    mutedTextColor: z.string().optional().describe('Muted text color for tagline/copyright'),
    // Borders
    borderColor: z.string().optional().describe('Top border color'),
    borderWidth: z.number().optional().describe('Top border width in pixels'),
    // Spacing
    padding: z.number().optional().describe('Padding in pixels'),
    // Typography
    brandFontSize: z.number().optional().describe('Brand name font size in pixels'),
    linkFontSize: z.number().optional().describe('Link font size in pixels'),
    // Style
    style: z.enum(['full', 'simple']).optional().describe('Footer style variant'),
});

// ---- FEATURES ----
export const featuresPropsSchema = z.object({
    title: z.string().describe('Section title'),
    subtitle: z.string().describe('Section subtitle'),
    features: z.array(z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string(),
    })).optional().describe('Feature items'),
    backgroundColor: z.string().optional().describe('Background color'),
    accentColor: z.string().optional().describe('Accent color for icons'),
    style: z.enum(['grid', 'bento', 'list']).optional().describe('Layout style'),
});

// ---- TESTIMONIALS ----
export const testimonialsPropsSchema = z.object({
    title: z.string().describe('Section title'),
    testimonials: z.array(z.object({
        name: z.string(),
        role: z.string(),
        text: z.string(),
    })).optional().describe('Testimonial items'),
    backgroundColor: z.string().optional().describe('Background color'),
    style: z.enum(['grid', 'single']).optional().describe('Layout style'),
});

// ---- PRICING ----
export const pricingPropsSchema = z.object({
    title: z.string().describe('Section title'),
    subtitle: z.string().describe('Section subtitle'),
    plans: z.array(z.object({
        name: z.string(),
        price: z.string(),
        features: z.array(z.string()),
        popular: z.boolean().optional(),
    })).optional().describe('Pricing plans'),
    backgroundColor: z.string().optional().describe('Background color'),
    accentColor: z.string().optional().describe('Accent color'),
});

// ---- FAQ ----
export const faqPropsSchema = z.object({
    title: z.string().describe('Section title'),
    subtitle: z.string().describe('Section subtitle'),
    faqs: z.array(z.object({
        question: z.string(),
        answer: z.string(),
    })).optional().describe('FAQ items'),
    backgroundColor: z.string().optional().describe('Background color'),
});

// ---- MARQUEE ----
export const marqueePropsSchema = z.object({
    title: z.string().describe('Section title text'),
    logos: z.array(z.string()).optional().describe('Logo names to display'),
    backgroundColor: z.string().optional().describe('Background color'),
});

// ---- IMAGE ----
export const imagePropsSchema = z.object({
    src: z.string().optional().describe('Image source URL'),
    alt: z.string().optional().describe('Image alt text'),
    borderRadius: z.number().optional().describe('Border radius in pixels'),
    style: z.enum(['basic', 'rounded', 'avatar']).optional().describe('Image style variant'),
});

// ============================================================================
// BASE COMPONENT PROPS INTERFACE
// ============================================================================

interface InteractableComponentProps {
    element: CanvasElement;
    onPropsUpdate?: (newProps: Record<string, unknown>) => void;
}

// ============================================================================
// NAVBAR COMPONENT
// ============================================================================

type NavbarProps = z.infer<typeof navbarPropsSchema> & InteractableComponentProps;

function NavbarComponent({
    element,
    brandName,
    navLinks,
    ctaText,
    signInText,
    accentColor,
    backgroundColor,
    textColor,
    linkColor,
    ctaBackgroundColor,
    ctaTextColor,
    borderColor,
    borderWidth,
    borderRadius,
    padding,
    gap,
    brandFontSize,
    linkFontSize,
    style,
    onPropsUpdate
}: NavbarProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = style || (element.props?.style as string) || 'minimal';

    // Get values from props or element.props with defaults
    const finalBrandName = brandName || (element.props?.brandName as string) || 'Acme';
    const finalNavLinks = navLinks || (element.props?.navLinks as string[]) || ['Products', 'Solutions', 'Pricing', 'Company'];
    const finalCtaText = ctaText || (element.props?.ctaText as string) || 'Get Started';
    const finalSignInText = signInText || (element.props?.signInText as string) || 'Sign in';
    const finalAccentColor = accentColor || (element.props?.accentColor as string) || tokens.colors.accent;
    const finalBgColor = backgroundColor || (element.props?.backgroundColor as string);
    const finalTextColor = textColor || (element.props?.textColor as string) || tokens.colors.text.primary;
    const finalLinkColor = linkColor || (element.props?.linkColor as string) || tokens.colors.text.secondary;
    const finalCtaBgColor = ctaBackgroundColor || (element.props?.ctaBackgroundColor as string) || finalAccentColor;
    const finalCtaTextColor = ctaTextColor || (element.props?.ctaTextColor as string) || 'white';
    const finalBorderColor = borderColor || (element.props?.borderColor as string) || tokens.colors.border;
    const finalBorderWidth = borderWidth ?? (element.props?.borderWidth as number) ?? 1;
    const finalBorderRadius = borderRadius ?? (element.props?.borderRadius as number);
    const finalPadding = padding ?? (element.props?.padding as number) ?? 40;
    const finalGap = gap ?? (element.props?.gap as number) ?? 32;
    const finalBrandFontSize = brandFontSize ?? (element.props?.brandFontSize as number) ?? 16;
    const finalLinkFontSize = linkFontSize ?? (element.props?.linkFontSize as number) ?? 14;

    const variants: Record<string, React.CSSProperties> = {
        minimal: { backgroundColor: finalBgColor || tokens.colors.surface, borderBottom: `${finalBorderWidth}px solid ${finalBorderColor}` },
        centered: { backgroundColor: finalBgColor || tokens.colors.surface, borderBottom: `${finalBorderWidth}px solid ${finalBorderColor}` },
        dark: { backgroundColor: finalBgColor || tokens.colors.background, borderBottom: `${finalBorderWidth}px solid rgba(255,255,255,0.05)` },
        transparent: { backgroundColor: finalBgColor || 'rgba(255,255,255,0.02)', backdropFilter: 'blur(16px)', border: `${finalBorderWidth}px solid rgba(255,255,255,0.06)`, borderRadius: finalBorderRadius ? `${finalBorderRadius}px` : tokens.radius.xl, margin: '12px' },
    };

    const isCentered = variantStyle === 'centered';

    return (
        <nav className="w-full h-full flex items-center" style={{ ...variants[variantStyle], padding: `0 ${finalPadding}px`, borderRadius: finalBorderRadius ? `${finalBorderRadius}px` : undefined }}>
            {isCentered ? (
                <>
                    <div className="flex items-center flex-1" style={{ gap: `${finalGap}px` }}>
                        {finalNavLinks.slice(0, 2).map((item) => <span key={item} style={{ fontSize: `${finalLinkFontSize}px`, color: finalLinkColor, fontWeight: 500 }}>{item}</span>)}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: finalAccentColor }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                        </div>
                        <span style={{ fontWeight: 700, color: finalTextColor, fontSize: `${finalBrandFontSize}px` }}>{finalBrandName}</span>
                    </div>
                    <div className="flex items-center flex-1 justify-end" style={{ gap: `${finalGap}px` }}>
                        {finalNavLinks.slice(2, 4).map((item) => <span key={item} style={{ fontSize: `${finalLinkFontSize}px`, color: finalLinkColor, fontWeight: 500 }}>{item}</span>)}
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: finalAccentColor }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                        </div>
                        <span style={{ fontWeight: 700, color: finalTextColor, fontSize: `${finalBrandFontSize}px` }}>{finalBrandName}</span>
                    </div>
                    <div className="flex items-center ml-12" style={{ gap: `${finalGap}px` }}>
                        {finalNavLinks.map((item) => <span key={item} style={{ fontSize: `${finalLinkFontSize}px`, color: finalLinkColor, fontWeight: 500 }}>{item}</span>)}
                    </div>
                    <div className="flex items-center gap-3 ml-auto">
                        <span style={{ fontSize: `${finalLinkFontSize}px`, color: finalLinkColor, fontWeight: 500 }}>{finalSignInText}</span>
                        <button style={{ padding: '8px 16px', backgroundColor: finalCtaBgColor, color: finalCtaTextColor, fontSize: `${finalLinkFontSize}px`, fontWeight: 500, borderRadius: tokens.radius.md, border: 'none' }}>{finalCtaText}</button>
                    </div>
                </>
            )}
        </nav>
    );
}

export const InteractableNavbar = withInteractable(NavbarComponent, {
    componentName: 'Navbar',
    description: 'Navigation bar with logo, brand name, navigation links, sign-in link, and call-to-action button. Customizable colors, text, and layout style.',
    propsSchema: navbarPropsSchema,
});

// ============================================================================
// HERO COMPONENT
// ============================================================================

type HeroProps = z.infer<typeof heroPropsSchema> & InteractableComponentProps;

function HeroComponent({ element, heading, subheading, badgeText, primaryButtonText, secondaryButtonText, backgroundColor, textColor, subtitleColor, accentColor, style }: HeroProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = style || (element.props?.style as string) || 'centered';

    // Read from element.props first (these are the persisted values after updates), then fall back to prop values
    const finalHeading = (element.props?.heading as string) || heading || 'Build products faster than ever';
    const finalSubheading = (element.props?.subheading as string) || subheading || 'The modern platform for building beautiful, responsive websites.';
    const finalBadgeText = (element.props?.badgeText as string) || badgeText || '✨ Announcing v2.0';
    const finalPrimaryBtn = (element.props?.primaryButtonText as string) || primaryButtonText || 'Start for free';
    const finalSecondaryBtn = (element.props?.secondaryButtonText as string) || secondaryButtonText || 'View demo →';
    const finalAccentColor = (element.props?.accentColor as string) || accentColor || tokens.colors.accent;
    const finalTextColor = (element.props?.textColor as string) || textColor || tokens.colors.text.primary;
    const finalSubtitleColor = (element.props?.subtitleColor as string) || subtitleColor || tokens.colors.text.secondary;
    const finalBgColor = (element.props?.backgroundColor as string) || backgroundColor;

    const variants: Record<string, React.CSSProperties> = {
        centered: { background: finalBgColor || `radial-gradient(ellipse at top, ${finalAccentColor}33 0%, ${tokens.colors.background} 60%)` },
        split: { background: finalBgColor || tokens.colors.background },
        gradient: { background: finalBgColor || `linear-gradient(135deg, ${finalAccentColor} 0%, ${tokens.colors.accentSecondary} 100%)` },
        minimal: { background: finalBgColor || tokens.colors.background },
    };

    const isSplit = variantStyle === 'split';
    const isMinimal = variantStyle === 'minimal';
    const isGradient = variantStyle === 'gradient';

    return (
        <section className={`w-full h-full flex ${isSplit ? 'flex-row' : 'flex-col'} items-center justify-center relative overflow-hidden`} style={{ ...variants[variantStyle], padding: '48px' }}>
            {!isGradient && <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }} />}
            <div className={`relative z-10 ${isSplit ? 'flex-1 pr-8' : 'max-w-2xl text-center'}`}>
                {!isMinimal && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ backgroundColor: `${finalAccentColor}26`, border: `1px solid ${finalAccentColor}4d` }}>
                        <span style={{ fontSize: '12px', color: finalAccentColor, fontWeight: 500 }}>{finalBadgeText}</span>
                    </div>
                )}
                <h1 style={{ fontSize: isSplit ? '48px' : '56px', fontWeight: 700, color: finalTextColor, marginBottom: '20px', lineHeight: 1.1, letterSpacing: '-0.04em' }}>
                    {finalHeading}
                </h1>
                <p style={{ fontSize: '18px', color: finalSubtitleColor, marginBottom: isMinimal ? '0' : '32px', lineHeight: 1.6, maxWidth: '520px', margin: isSplit ? '' : '0 auto 32px' }}>
                    {finalSubheading}
                </p>
                {!isMinimal && (
                    <div className={`flex items-center gap-4 ${isSplit ? '' : 'justify-center'}`}>
                        <button style={{ padding: '14px 28px', backgroundColor: isGradient ? 'rgba(255,255,255,0.2)' : 'white', color: isGradient ? 'white' : tokens.colors.background, fontSize: '15px', fontWeight: 600, borderRadius: tokens.radius.lg, border: isGradient ? '1px solid rgba(255,255,255,0.3)' : 'none' }}>{finalPrimaryBtn}</button>
                        <button style={{ padding: '14px 28px', backgroundColor: 'transparent', color: finalTextColor, fontSize: '15px', fontWeight: 500, borderRadius: tokens.radius.lg, border: `1px solid ${tokens.colors.border}` }}>{finalSecondaryBtn}</button>
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

export const InteractableHero = withInteractable(HeroComponent, {
    componentName: 'Hero',
    description: 'Hero section with heading, subheading, badge, and call-to-action buttons. Supports centered, split, gradient, and minimal layouts.',
    propsSchema: heroPropsSchema,
});

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

type ButtonProps = z.infer<typeof buttonPropsSchema> & InteractableComponentProps;

function ButtonComponent({ element, text, backgroundColor, textColor, borderRadius, fontSize, padding, style, onPropsUpdate }: ButtonProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = style || (element.props?.style as string) || 'primary';
    const [isEditMode, setIsEditMode] = useState(false);
    const [editText, setEditText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const savingRef = useRef(false);

    const finalText = text || (element.props?.text as string) || element.label || 'Button';

    const variants: Record<string, React.CSSProperties> = {
        primary: { backgroundColor: backgroundColor || tokens.colors.accent, color: textColor || 'white', border: 'none' },
        secondary: { backgroundColor: backgroundColor || 'transparent', color: textColor || tokens.colors.accent, border: `2px solid ${tokens.colors.accent}` },
        ghost: { backgroundColor: backgroundColor || 'rgba(255,255,255,0.05)', color: textColor || tokens.colors.text.primary, border: '1px solid rgba(255,255,255,0.1)' },
        gradient: { background: backgroundColor || `linear-gradient(135deg, ${tokens.colors.accent} 0%, ${tokens.colors.accentSecondary} 100%)`, color: textColor || 'white', border: 'none' },
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditText(finalText);
        setIsEditMode(true);
        savingRef.current = false;
    };

    const handleSave = () => {
        if (savingRef.current) return;
        savingRef.current = true;
        
        if (editText.trim() && onPropsUpdate) {
            onPropsUpdate({ text: editText });
        }
        setIsEditMode(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            handleSave();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            savingRef.current = true;
            setIsEditMode(false);
        }
    };

    useEffect(() => {
        if (isEditMode && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditMode]);

    if (isEditMode) {
        return (
            <div className="w-full h-full flex items-center justify-center" style={{ ...variants[variantStyle], borderRadius: borderRadius ? `${borderRadius}px` : tokens.radius.md }}>
                <input
                    ref={inputRef}
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent border-none outline-none text-center"
                    style={{ 
                        fontSize: fontSize ? `${fontSize}px` : '14px', 
                        fontWeight: 500,
                        color: 'inherit',
                        padding: padding ? `${padding}px` : undefined,
                    }}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        );
    }

    return (
        <button
            className="w-full h-full flex items-center justify-center transition-all"
            style={{
                ...variants[variantStyle],
                fontSize: fontSize ? `${fontSize}px` : '14px',
                fontWeight: 500,
                borderRadius: borderRadius ? `${borderRadius}px` : tokens.radius.md,
                padding: padding ? `${padding}px` : undefined,
                cursor: 'text',
            }}
            onDoubleClick={handleDoubleClick}
        >
            {finalText}
        </button>
    );
}

export const InteractableButton = withInteractable(ButtonComponent, {
    componentName: 'Button',
    description: 'Clickable button with customizable text, colors, and style variants (primary, secondary, ghost, gradient).',
    propsSchema: buttonPropsSchema,
});

// ============================================================================
// TEXT COMPONENT
// ============================================================================

type TextProps = z.infer<typeof textPropsSchema> & InteractableComponentProps;

function TextComponent({ element, text, fontSize, fontWeight, textColor, lineHeight, style, onPropsUpdate }: TextProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = style || (element.props?.style as string) || 'paragraph';
    const [isEditMode, setIsEditMode] = useState(false);
    const [editText, setEditText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const savingRef = useRef(false);

    const finalText = text || (element.props?.text as string) || element.label || 'Text content';

    const variants: Record<string, React.CSSProperties> = {
        heading: { fontSize: fontSize ? `${fontSize}px` : '32px', fontWeight: fontWeight || 700, letterSpacing: '-0.03em' },
        paragraph: { fontSize: fontSize ? `${fontSize}px` : '16px', fontWeight: fontWeight || 400, lineHeight: lineHeight || 1.7 },
        caption: { fontSize: fontSize ? `${fontSize}px` : '13px', fontWeight: fontWeight || 500, color: textColor || tokens.colors.text.muted, textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditText(finalText);
        setIsEditMode(true);
        savingRef.current = false;
    };

    const handleSave = () => {
        if (savingRef.current) return;
        savingRef.current = true;
        
        if (editText.trim() && onPropsUpdate) {
            onPropsUpdate({ text: editText });
        }
        setIsEditMode(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            handleSave();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            savingRef.current = true;
            setIsEditMode(false);
        }
    };

    useEffect(() => {
        if (isEditMode && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditMode]);

    if (isEditMode) {
        return (
            <div className="w-full h-full flex items-center" style={{ padding: tokens.spacing.sm }}>
                <input
                    ref={inputRef}
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="w-full h-full bg-transparent border-none outline-none"
                    style={{
                        color: textColor || tokens.colors.text.primary,
                        ...variants[variantStyle],
                    }}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        );
    }

    return (
        <div 
            className="w-full h-full flex items-center" 
            style={{ 
                color: textColor || tokens.colors.text.primary, 
                padding: tokens.spacing.sm, 
                ...variants[variantStyle],
                cursor: 'text',
            }}
            onDoubleClick={handleDoubleClick}
        >
            {finalText}
        </div>
    );
}

export const InteractableText = withInteractable(TextComponent, {
    componentName: 'Text',
    description: 'Text block with customizable content, font size, weight, color, and style (heading, paragraph, caption).',
    propsSchema: textPropsSchema,
});

// ============================================================================
// CARD COMPONENT
// ============================================================================

type CardProps = z.infer<typeof cardPropsSchema> & InteractableComponentProps;

function CardComponent({ element, title, description, imageUrl, ctaText, backgroundColor, borderColor, borderRadius, style }: CardProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = style || (element.props?.style as string) || 'basic';

    const finalTitle = title || (element.props?.title as string) || 'Card Title';
    const finalDescription = description || (element.props?.description as string) || 'Card description goes here.';
    const finalCtaText = ctaText || (element.props?.ctaText as string) || 'Learn more →';
    const finalBgColor = backgroundColor || (element.props?.backgroundColor as string) || tokens.colors.surface;
    const finalBorderColor = borderColor || (element.props?.borderColor as string) || tokens.colors.border;
    const finalBorderRadius = borderRadius || (element.props?.borderRadius as number) || 16;

    const isHorizontal = variantStyle === 'horizontal';
    const isOverlay = variantStyle === 'overlay';
    const isMinimal = variantStyle === 'minimal';

    return (
        <div className={`w-full h-full flex ${isHorizontal ? 'flex-row' : 'flex-col'} overflow-hidden`} style={{ backgroundColor: finalBgColor, borderRadius: `${finalBorderRadius}px`, border: `1px solid ${finalBorderColor}` }}>
            {!isMinimal && (
                <div className={`flex-shrink-0 flex items-center justify-center relative ${isHorizontal ? 'w-2/5' : ''}`} style={{ height: isHorizontal ? '100%' : '45%', backgroundColor: tokens.colors.background, borderRight: isHorizontal ? `1px solid ${tokens.colors.borderSubtle}` : 'none', borderBottom: isHorizontal ? 'none' : `1px solid ${tokens.colors.borderSubtle}` }}>
                    {imageUrl ? <img src={imageUrl} alt={finalTitle} className="w-full h-full object-cover" /> : (
                        <svg className="w-8 h-8" fill="none" stroke={tokens.colors.text.muted} strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    )}
                    {isOverlay && <div className="absolute inset-0 flex items-end" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)', padding: '20px' }}><div><h3 style={{ fontSize: '16px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>{finalTitle}</h3><p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{finalDescription}</p></div></div>}
                </div>
            )}
            {!isOverlay && (
                <div className={`flex-1 flex flex-col ${isMinimal ? 'justify-center' : ''}`} style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: tokens.colors.text.primary, marginBottom: '8px' }}>{finalTitle}</h3>
                    <p style={{ fontSize: '14px', color: tokens.colors.text.muted, lineHeight: 1.5, flex: 1 }}>{finalDescription}</p>
                    <span style={{ fontSize: '14px', color: tokens.colors.accent, fontWeight: 500, marginTop: '12px' }}>{finalCtaText}</span>
                </div>
            )}
        </div>
    );
}

export const InteractableCard = withInteractable(CardComponent, {
    componentName: 'Card',
    description: 'Content card with title, description, optional image, and CTA link. Supports basic, horizontal, overlay, and minimal layouts.',
    propsSchema: cardPropsSchema,
});

// ============================================================================
// SECTION COMPONENT
// ============================================================================

type SectionProps = z.infer<typeof sectionPropsSchema> & InteractableComponentProps;

function SectionComponent({ element, title, description, backgroundColor, textColor, borderColor, style }: SectionProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = style || (element.props?.style as string) || 'basic';

    const finalTitle = title || (element.props?.title as string) || 'Section Title';
    const finalDescription = description || (element.props?.description as string) || 'Add your content here';
    const finalBgColor = backgroundColor || (element.props?.backgroundColor as string) || tokens.colors.surface;
    const finalTextColor = textColor || (element.props?.textColor as string) || tokens.colors.text.primary;
    const finalBorderColor = borderColor || (element.props?.borderColor as string) || tokens.colors.border;

    const isFeatures = variantStyle === 'features';
    const isCta = variantStyle === 'cta';

    return (
        <section className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: finalBgColor, padding: '48px', borderRadius: tokens.radius.xl, border: `1px solid ${finalBorderColor}` }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: finalTextColor, marginBottom: '12px' }}>{finalTitle}</h2>
            <p style={{ fontSize: '16px', color: tokens.colors.text.secondary, textAlign: 'center', marginBottom: '24px', maxWidth: '400px' }}>{finalDescription}</p>
            {isFeatures && <div className="flex gap-4 mt-2">{[1, 2, 3].map((i) => <div key={i} className="p-4 rounded-lg" style={{ backgroundColor: tokens.colors.background, border: `1px solid ${finalBorderColor}`, width: '100px', textAlign: 'center' }}><div className="w-8 h-8 rounded-lg mx-auto mb-2" style={{ backgroundColor: `${tokens.colors.accent}33` }} /><span style={{ fontSize: '12px', color: tokens.colors.text.secondary }}>Feature {i}</span></div>)}</div>}
            {isCta && <button className="mt-4 px-6 py-3 rounded-lg font-medium" style={{ backgroundColor: tokens.colors.accent, color: 'white' }}>Take Action</button>}
        </section>
    );
}

export const InteractableSection = withInteractable(SectionComponent, {
    componentName: 'Section',
    description: 'Generic section with title, description, and optional features or CTA button.',
    propsSchema: sectionPropsSchema,
});

// ============================================================================
// FOOTER COMPONENT
// ============================================================================

type FooterProps = z.infer<typeof footerPropsSchema> & InteractableComponentProps;

function FooterComponent({
    element,
    brandName,
    tagline,
    copyrightText,
    socialLinks,
    productLinks,
    companyLinks,
    legalLinks,
    backgroundColor,
    textColor,
    linkColor,
    accentColor,
    mutedTextColor,
    borderColor,
    borderWidth,
    padding,
    brandFontSize,
    linkFontSize,
    style
}: FooterProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = style || (element.props?.style as string) || 'full';

    // Text content
    const finalBrandName = brandName || (element.props?.brandName as string) || 'Acme';
    const finalTagline = tagline || (element.props?.tagline as string) || 'Build better, faster.';
    const finalCopyright = copyrightText || (element.props?.copyrightText as string) || '© 2024 Acme Inc. All rights reserved.';
    const finalSocialLinks = socialLinks || (element.props?.socialLinks as string[]) || ['Twitter', 'GitHub', 'Discord'];

    // Link sections
    const finalProductLinks = productLinks || (element.props?.productLinks as string[]) || ['Features', 'Pricing', 'Changelog'];
    const finalCompanyLinks = companyLinks || (element.props?.companyLinks as string[]) || ['About', 'Blog', 'Careers'];
    const finalLegalLinks = legalLinks || (element.props?.legalLinks as string[]) || ['Privacy', 'Terms'];

    // Colors
    const finalBgColor = backgroundColor || (element.props?.backgroundColor as string) || tokens.colors.surface;
    const finalTextColor = textColor || (element.props?.textColor as string) || tokens.colors.text.primary;
    const finalLinkColor = linkColor || (element.props?.linkColor as string) || tokens.colors.text.secondary;
    const finalAccentColor = accentColor || (element.props?.accentColor as string) || tokens.colors.accent;
    const finalMutedColor = mutedTextColor || (element.props?.mutedTextColor as string) || tokens.colors.text.muted;

    // Borders and spacing
    const finalBorderColor = borderColor || (element.props?.borderColor as string) || tokens.colors.border;
    const finalBorderWidth = borderWidth ?? (element.props?.borderWidth as number) ?? 1;
    const finalPadding = padding ?? (element.props?.padding as number) ?? 48;
    const finalBrandFontSize = brandFontSize ?? (element.props?.brandFontSize as number) ?? 14;
    const finalLinkFontSize = linkFontSize ?? (element.props?.linkFontSize as number) ?? 13;

    const links = {
        Product: finalProductLinks,
        Company: finalCompanyLinks,
        Legal: finalLegalLinks
    };
    const isSimple = variantStyle === 'simple';

    return (
        <footer className="w-full h-full flex items-center" style={{ backgroundColor: finalBgColor, borderTop: `${finalBorderWidth}px solid ${finalBorderColor}`, padding: `32px ${finalPadding}px` }}>
            {isSimple ? (
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: finalAccentColor }} />
                        <span style={{ fontWeight: 600, color: finalTextColor, fontSize: `${finalBrandFontSize}px` }}>{finalBrandName}</span>
                    </div>
                    <p style={{ fontSize: `${finalLinkFontSize}px`, color: finalMutedColor }}>{finalCopyright}</p>
                    <div className="flex gap-4">
                        {finalSocialLinks.map((s) => <span key={s} style={{ fontSize: `${finalLinkFontSize}px`, color: finalLinkColor }}>{s}</span>)}
                    </div>
                </div>
            ) : (
                <div className="w-full grid grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded" style={{ backgroundColor: finalAccentColor }} />
                            <span style={{ fontWeight: 600, color: finalTextColor, fontSize: `${finalBrandFontSize}px` }}>{finalBrandName}</span>
                        </div>
                        <p style={{ fontSize: `${finalLinkFontSize}px`, color: finalMutedColor }}>{finalTagline}</p>
                    </div>
                    {Object.entries(links).map(([cat, items]) => (
                        <div key={cat}>
                            <h4 style={{ fontSize: `${finalLinkFontSize}px`, fontWeight: 600, color: finalTextColor, marginBottom: '12px' }}>{cat}</h4>
                            <ul className="space-y-2">
                                {items.map((item) => <li key={item} style={{ fontSize: `${finalLinkFontSize}px`, color: finalLinkColor }}>{item}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </footer>
    );
}

export const InteractableFooter = withInteractable(FooterComponent, {
    componentName: 'Footer',
    description: 'Page footer with brand name, tagline, navigation links, and copyright. Supports full and simple layouts.',
    propsSchema: footerPropsSchema,
});

// ============================================================================
// FEATURES COMPONENT
// ============================================================================

type FeaturesProps = z.infer<typeof featuresPropsSchema> & InteractableComponentProps;

function FeaturesComponent({ element, title, subtitle, features, backgroundColor, accentColor, style }: FeaturesProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = style || (element.props?.style as string) || 'grid';

    const finalTitle = title || (element.props?.title as string) || 'Everything you need';
    const finalSubtitle = subtitle || (element.props?.subtitle as string) || 'Packed with features to help you build faster';
    const finalBgColor = backgroundColor || (element.props?.backgroundColor as string) || tokens.colors.background;
    const finalAccentColor = accentColor || (element.props?.accentColor as string) || tokens.colors.accent;

    const defaultFeatures = [
        { icon: '⚡', title: 'Lightning Fast', description: 'Built for speed from the ground up' },
        { icon: '🔒', title: 'Secure by Default', description: 'Enterprise-grade security included' },
        { icon: '📱', title: 'Fully Responsive', description: 'Looks great on any device' },
        { icon: '🎨', title: 'Customizable', description: 'Make it truly yours' },
    ];
    const finalFeatures = features || (element.props?.features as typeof defaultFeatures) || defaultFeatures;

    const isBento = variantStyle === 'bento';
    const isList = variantStyle === 'list';

    return (
        <section className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: finalBgColor, padding: '48px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, color: tokens.colors.text.primary, marginBottom: '12px', letterSpacing: '-0.03em' }}>{finalTitle}</h2>
            <p style={{ fontSize: '16px', color: tokens.colors.text.secondary, marginBottom: '40px', maxWidth: '400px', textAlign: 'center' }}>{finalSubtitle}</p>
            <div className={`grid gap-4 w-full max-w-3xl ${isList ? 'grid-cols-1' : isBento ? 'grid-cols-2' : 'grid-cols-4'}`}>
                {finalFeatures.map((f, i) => (
                    <div key={i} className={`rounded-xl p-6 ${isBento && i === 0 ? 'col-span-2' : ''}`} style={{ backgroundColor: tokens.colors.surface, border: `1px solid ${tokens.colors.border}` }}>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${finalAccentColor}26` }}><span style={{ fontSize: '20px' }}>{f.icon}</span></div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: tokens.colors.text.primary, marginBottom: '8px' }}>{f.title}</h3>
                        <p style={{ fontSize: '14px', color: tokens.colors.text.muted }}>{f.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export const InteractableFeatures = withInteractable(FeaturesComponent, {
    componentName: 'Features',
    description: 'Features section with title, subtitle, and feature cards. Supports grid, bento, and list layouts.',
    propsSchema: featuresPropsSchema,
});

// ============================================================================
// TESTIMONIALS COMPONENT
// ============================================================================

type TestimonialsProps = z.infer<typeof testimonialsPropsSchema> & InteractableComponentProps;

function TestimonialsComponent({ element, title, testimonials, backgroundColor, style }: TestimonialsProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = style || (element.props?.style as string) || 'grid';

    const finalTitle = title || (element.props?.title as string) || 'Loved by thousands';
    const finalBgColor = backgroundColor || (element.props?.backgroundColor as string) || tokens.colors.background;

    const defaultTestimonials = [
        { name: 'Sarah Chen', role: 'CEO at TechCorp', text: 'This product has completely transformed how we build.' },
        { name: 'Marcus Johnson', role: 'Designer at Studio', text: 'The best tool I have ever used. Highly recommended.' },
        { name: 'Emily Davis', role: 'Developer', text: 'Incredible speed and flexibility. Love it!' },
    ];
    const finalTestimonials = testimonials || (element.props?.testimonials as typeof defaultTestimonials) || defaultTestimonials;

    const isSingle = variantStyle === 'single';

    return (
        <section className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: finalBgColor, padding: '48px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: tokens.colors.text.primary, marginBottom: '40px' }}>{finalTitle}</h2>
            <div className={`${isSingle ? 'max-w-xl' : 'grid grid-cols-3 gap-4 max-w-4xl'}`}>
                {(isSingle ? [finalTestimonials[0]] : finalTestimonials).map((t, i) => (
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

export const InteractableTestimonials = withInteractable(TestimonialsComponent, {
    componentName: 'Testimonials',
    description: 'Testimonials section with quotes, names, and roles. Supports grid and single layouts.',
    propsSchema: testimonialsPropsSchema,
});

// ============================================================================
// PRICING COMPONENT
// ============================================================================

type PricingProps = z.infer<typeof pricingPropsSchema> & InteractableComponentProps;

function PricingComponent({ element, title, subtitle, plans, backgroundColor, accentColor }: PricingProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);

    const finalTitle = title || (element.props?.title as string) || 'Simple pricing';
    const finalSubtitle = subtitle || (element.props?.subtitle as string) || 'Choose the plan that\'s right for you';
    const finalBgColor = backgroundColor || (element.props?.backgroundColor as string) || tokens.colors.background;
    const finalAccentColor = accentColor || (element.props?.accentColor as string) || tokens.colors.accent;

    const defaultPlans = [
        { name: 'Starter', price: '$9', features: ['5 projects', 'Basic analytics', 'Email support'] },
        { name: 'Pro', price: '$29', features: ['Unlimited projects', 'Advanced analytics', 'Priority support'], popular: true },
        { name: 'Enterprise', price: 'Custom', features: ['Custom solutions', 'Dedicated support', 'SLA guarantee'] },
    ];
    const finalPlans = plans || (element.props?.plans as typeof defaultPlans) || defaultPlans;

    return (
        <section className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: finalBgColor, padding: '48px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, color: tokens.colors.text.primary, marginBottom: '12px' }}>{finalTitle}</h2>
            <p style={{ fontSize: '16px', color: tokens.colors.text.secondary, marginBottom: '40px' }}>{finalSubtitle}</p>
            <div className="grid grid-cols-3 gap-4 max-w-4xl">
                {finalPlans.map((plan, i) => (
                    <div key={i} className="rounded-xl p-6 relative" style={{ backgroundColor: plan.popular ? `${finalAccentColor}1a` : tokens.colors.surface, border: `1px solid ${plan.popular ? finalAccentColor : tokens.colors.border}` }}>
                        {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: finalAccentColor, color: 'white' }}>Popular</span>}
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: tokens.colors.text.primary, marginBottom: '8px' }}>{plan.name}</h3>
                        <p style={{ fontSize: '32px', fontWeight: 700, color: tokens.colors.text.primary, marginBottom: '16px' }}>{plan.price}<span style={{ fontSize: '14px', fontWeight: 400, color: tokens.colors.text.muted }}>/mo</span></p>
                        <ul className="space-y-2 mb-6">{plan.features.map((f, j) => <li key={j} style={{ fontSize: '14px', color: tokens.colors.text.secondary }}>✓ {f}</li>)}</ul>
                        <button className="w-full py-2.5 rounded-lg font-medium text-sm" style={{ backgroundColor: plan.popular ? finalAccentColor : 'transparent', color: plan.popular ? 'white' : tokens.colors.text.primary, border: plan.popular ? 'none' : `1px solid ${tokens.colors.border}` }}>Get started</button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export const InteractablePricing = withInteractable(PricingComponent, {
    componentName: 'Pricing',
    description: 'Pricing section with plans, prices, and features. Highlights popular plan.',
    propsSchema: pricingPropsSchema,
});

// ============================================================================
// FAQ COMPONENT
// ============================================================================

type FaqProps = z.infer<typeof faqPropsSchema> & InteractableComponentProps;

function FaqComponent({ element, title, subtitle, faqs, backgroundColor }: FaqProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);

    const finalTitle = title || (element.props?.title as string) || 'Frequently asked questions';
    const finalSubtitle = subtitle || (element.props?.subtitle as string) || 'Everything you need to know';
    const finalBgColor = backgroundColor || (element.props?.backgroundColor as string) || tokens.colors.background;

    const defaultFaqs = [
        { question: 'How does the free trial work?', answer: 'You get 14 days of full access with no credit card required.' },
        { question: 'Can I cancel anytime?', answer: 'Yes, you can cancel your subscription at any time.' },
        { question: 'Do you offer refunds?', answer: 'We offer a 30-day money back guarantee.' },
    ];
    const finalFaqs = faqs || (element.props?.faqs as typeof defaultFaqs) || defaultFaqs;

    return (
        <section className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: finalBgColor, padding: '48px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: tokens.colors.text.primary, marginBottom: '12px' }}>{finalTitle}</h2>
            <p style={{ fontSize: '16px', color: tokens.colors.text.secondary, marginBottom: '40px' }}>{finalSubtitle}</p>
            <div className="w-full max-w-2xl space-y-3">
                {finalFaqs.map((faq, i) => (
                    <div key={i} className="rounded-xl p-5" style={{ backgroundColor: tokens.colors.surface, border: `1px solid ${tokens.colors.border}` }}>
                        <div className="flex items-center justify-between">
                            <h3 style={{ fontSize: '15px', fontWeight: 600, color: tokens.colors.text.primary }}>{faq.question}</h3>
                            <span style={{ color: tokens.colors.text.muted }}>+</span>
                        </div>
                        <p style={{ fontSize: '14px', color: tokens.colors.text.secondary, marginTop: '12px' }}>{faq.answer}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export const InteractableFaq = withInteractable(FaqComponent, {
    componentName: 'FAQ',
    description: 'FAQ section with questions and answers.',
    propsSchema: faqPropsSchema,
});

// ============================================================================
// MARQUEE COMPONENT
// ============================================================================

type MarqueeProps = z.infer<typeof marqueePropsSchema> & InteractableComponentProps;

function MarqueeComponent({ element, title, logos, backgroundColor }: MarqueeProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);

    const finalTitle = title || (element.props?.title as string) || 'Trusted by leading companies';
    const finalBgColor = backgroundColor || (element.props?.backgroundColor as string) || tokens.colors.background;
    const finalLogos = logos || (element.props?.logos as string[]) || ['Vercel', 'Stripe', 'Notion', 'Linear', 'Figma', 'Framer'];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden" style={{ backgroundColor: finalBgColor, padding: '32px' }}>
            <p style={{ fontSize: '13px', color: tokens.colors.text.muted, marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{finalTitle}</p>
            <div className="flex items-center gap-12">
                {finalLogos.map((logo) => (
                    <div key={logo} className="flex items-center gap-2" style={{ opacity: 0.6 }}>
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: tokens.colors.accent + '33' }} />
                        <span style={{ fontSize: '16px', fontWeight: 600, color: tokens.colors.text.secondary }}>{logo}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export const InteractableMarquee = withInteractable(MarqueeComponent, {
    componentName: 'Marquee',
    description: 'Logo marquee section showing trusted companies or partners.',
    propsSchema: marqueePropsSchema,
});

// ============================================================================
// IMAGE COMPONENT
// ============================================================================

type ImageProps = z.infer<typeof imagePropsSchema> & InteractableComponentProps;

function ImageComponent({ element, src, alt, borderRadius, style }: ImageProps) {
    const { activeTheme } = useBuilder();
    const tokens = createDesignTokens(activeTheme);
    const variantStyle = style || (element.props?.style as string) || 'basic';

    const finalSrc = src || (element.props?.src as string);
    const finalAlt = alt || (element.props?.alt as string) || 'Image';

    const radiusMap: Record<string, string> = { basic: tokens.radius.lg, rounded: tokens.radius['2xl'], avatar: '50%' };
    const finalRadius = borderRadius ? `${borderRadius}px` : radiusMap[variantStyle];

    return (
        <div className="w-full h-full flex items-center justify-center overflow-hidden" style={{ borderRadius: finalRadius, backgroundColor: tokens.colors.surface, border: `1px solid ${tokens.colors.borderSubtle}` }}>
            {finalSrc ? <img src={finalSrc} alt={finalAlt} className="w-full h-full object-cover" style={{ borderRadius: finalRadius }} /> : (
                <div className="flex flex-col items-center gap-2">
                    <svg className="w-10 h-10" fill="none" stroke={tokens.colors.text.muted} strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    <span style={{ fontSize: '12px', color: tokens.colors.text.muted }}>{variantStyle === 'avatar' ? 'Avatar' : 'Image'}</span>
                </div>
            )}
        </div>
    );
}

export const InteractableImage = withInteractable(ImageComponent, {
    componentName: 'Image',
    description: 'Image component with customizable source, alt text, and border radius.',
    propsSchema: imagePropsSchema,
});

// ============================================================================
// COMPONENT REGISTRY - Maps element types to interactable components
// ============================================================================

export const interactableComponentMap = {
    navbar: InteractableNavbar,
    hero: InteractableHero,
    button: InteractableButton,
    text: InteractableText,
    card: InteractableCard,
    section: InteractableSection,
    footer: InteractableFooter,
    features: InteractableFeatures,
    testimonials: InteractableTestimonials,
    pricing: InteractablePricing,
    faq: InteractableFaq,
    marquee: InteractableMarquee,
    image: InteractableImage,
} as const;

export type InteractableComponentType = keyof typeof interactableComponentMap;
