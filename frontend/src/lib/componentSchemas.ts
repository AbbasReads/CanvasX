import { z } from 'zod';

// Button component props schema
export const ButtonPropsSchema = z.object({
    text: z.string().default('Click me'),
    backgroundColor: z.string().default('#3b82f6'),
    textColor: z.string().default('#ffffff'),
    borderRadius: z.number().default(8),
    fontSize: z.number().default(14),
    variant: z.enum(['primary', 'secondary', 'outline', 'ghost']).default('primary'),
});

export type ButtonProps = z.infer<typeof ButtonPropsSchema>;

// Text component props schema
export const TextPropsSchema = z.object({
    content: z.string().default('Enter your text here'),
    fontSize: z.number().default(16),
    fontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('normal'),
    color: z.string().default('#ffffff'),
    textAlign: z.enum(['left', 'center', 'right']).default('left'),
});

export type TextProps = z.infer<typeof TextPropsSchema>;

// Hero section props schema
export const HeroPropsSchema = z.object({
    title: z.string().default('Welcome to Our Platform'),
    subtitle: z.string().default('Build amazing things with our tools'),
    primaryButtonText: z.string().default('Get Started'),
    secondaryButtonText: z.string().default('Learn More'),
    backgroundGradient: z.string().default('linear-gradient(135deg, #667eea 0%, #764ba2 100%)'),
    textColor: z.string().default('#ffffff'),
});

export type HeroProps = z.infer<typeof HeroPropsSchema>;

// Navbar props schema
export const NavbarPropsSchema = z.object({
    brand: z.string().default('Brand'),
    links: z.array(z.string()).default(['Home', 'About', 'Services', 'Contact']),
    backgroundColor: z.string().default('#1a1a2e'),
    textColor: z.string().default('#ffffff'),
});

export type NavbarProps = z.infer<typeof NavbarPropsSchema>;

// Section props schema
export const SectionPropsSchema = z.object({
    backgroundColor: z.string().default('#1e1e2f'),
    padding: z.number().default(24),
    borderRadius: z.number().default(12),
    borderColor: z.string().default('rgba(255, 255, 255, 0.1)'),
});

export type SectionProps = z.infer<typeof SectionPropsSchema>;

// Image props schema
export const ImagePropsSchema = z.object({
    src: z.string().default('/placeholder.jpg'),
    alt: z.string().default('Image'),
    objectFit: z.enum(['cover', 'contain', 'fill', 'none']).default('cover'),
    borderRadius: z.number().default(8),
});

export type ImageProps = z.infer<typeof ImagePropsSchema>;

// Card props schema
export const CardPropsSchema = z.object({
    title: z.string().default('Card Title'),
    description: z.string().default('This is a card description'),
    buttonText: z.string().default('Learn More'),
    backgroundColor: z.string().default('#1e1e2f'),
    accentColor: z.string().default('#3b82f6'),
});

export type CardProps = z.infer<typeof CardPropsSchema>;

// Combined element properties type
export type ElementProperties = {
    button?: ButtonProps;
    text?: TextProps;
    hero?: HeroProps;
    navbar?: NavbarProps;
    section?: SectionProps;
    image?: ImageProps;
    card?: CardProps;
};
