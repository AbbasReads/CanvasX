import { defineTool } from '@tambo-ai/react';
import { z } from 'zod';
import { getBuilderStore } from './builderStore';
import { ensureFontLoaded } from './fontLoader';

// Tool for modifying element visual properties
export const modifyElementTool = defineTool({
    name: 'modify_element',
    description: `Modify ANY property of the currently selected canvas element. 
Supports ALL component types: button, text, navbar, hero, section, image, card, marquee, features, testimonials, pricing, faq, footer.
Use this to change colors, text, gradients, sizes, styles, variant styles, navigation links, and all content.
The tool will apply changes to the currently selected element in the canvas builder.`,
    inputSchema: z.object({
        // Component variant/style
        style: z.string().optional().describe('Component variant style (e.g., "primary", "secondary", "gradient", "minimal", "centered", "dark", "transparent", "grid", "bento", "list", "single", "simple")'),

        // Text content
        text: z.string().optional().describe('The text content for buttons, text elements, or brand names'),
        heading: z.string().optional().describe('Main heading text for hero sections'),
        subheading: z.string().optional().describe('Subheading or subtitle text'),
        title: z.string().optional().describe('Title text for cards or sections'),
        description: z.string().optional().describe('Description or body text'),
        alt: z.string().optional().describe('Alt text for images'),

        // Navbar-specific
        ctaText: z.string().optional().describe('Call-to-action button text (e.g., "Get Started", "Sign Up", "Let\'s Go")'),
        brandName: z.string().optional().describe('Brand/company name shown in navbar or footer'),
        signInText: z.string().optional().describe('Sign-in link text'),
        navLinks: z.array(z.string()).optional().describe('Array of navigation link labels (e.g., ["Products", "Solutions", "Pricing", "Company"])'),

        // Footer-specific
        copyrightYear: z.string().optional().describe('Copyright year for footer (e.g., "2024", "2026")'),
        copyrightText: z.string().optional().describe('Full copyright text for footer (e.g., "© 2024 Acme Inc. All rights reserved.")'),
        tagline: z.string().optional().describe('Tagline or slogan text for footer'),
        socialLinks: z.array(z.string()).optional().describe('Array of social media link labels (e.g., ["Twitter", "GitHub", "Discord"])'),

        // Image-specific
        src: z.string().optional().describe('Image source URL'),

        // Colors
        backgroundColor: z.string().optional().describe('Background color as hex (#ffffff) or CSS color name'),
        textColor: z.string().optional().describe('Text/foreground color as hex or CSS color name'),
        accentColor: z.string().optional().describe('Accent color for highlights, buttons, borders'),
        background: z.string().optional().describe('CSS background for gradients like "linear-gradient(...)"'),

        // Sizing & Spacing
        borderRadius: z.number().optional().describe('Border radius in pixels'),
        fontSize: z.number().optional().describe('Font size in pixels'),
        padding: z.number().optional().describe('Padding in pixels'),
        margin: z.number().optional().describe('Margin in pixels'),
        gap: z.number().optional().describe('Gap between elements in pixels'),

        // Typography
        fontFamily: z.string().optional().describe('Font family (e.g., "Roboto", "Inter", "Playfair Display"). Google Fonts will be loaded automatically.'),
        fontWeight: z.union([z.number(), z.string()]).optional().describe('Font weight (e.g., 400, 600, 700, "bold", "normal")'),
        lineHeight: z.union([z.number(), z.string()]).optional().describe('Line height (e.g., 1.5, "1.6")'),
        letterSpacing: z.string().optional().describe('Letter spacing (e.g., "-0.02em", "0.05em")'),
        textAlign: z.string().optional().describe('Text alignment (left, center, right, justify)'),
        textTransform: z.string().optional().describe('Text transform (uppercase, lowercase, capitalize, none)'),

        // Layout
        display: z.string().optional().describe('CSS display property (flex, grid, block, inline-block)'),
        flexDirection: z.string().optional().describe('Flex direction (row, column, row-reverse, column-reverse)'),
        alignItems: z.string().optional().describe('Align items (flex-start, center, flex-end, stretch)'),
        justifyContent: z.string().optional().describe('Justify content (flex-start, center, flex-end, space-between, space-around)'),
        gridTemplateColumns: z.string().optional().describe('Grid template columns (e.g., "repeat(3, 1fr)", "1fr 2fr")'),

        // Border & Shadow
        border: z.string().optional().describe('CSS border (e.g., "1px solid #ccc", "2px dashed red")'),
        borderColor: z.string().optional().describe('Border color'),
        borderWidth: z.string().optional().describe('Border width (e.g., "1px", "2px 4px")'),
        boxShadow: z.string().optional().describe('CSS box shadow'),

        // Effects
        opacity: z.number().optional().describe('Opacity (0-1)'),
        transform: z.string().optional().describe('CSS transform (e.g., "rotate(45deg)", "scale(1.1)")'),
        filter: z.string().optional().describe('CSS filter (e.g., "blur(5px)", "brightness(1.2)")'),
        backdropFilter: z.string().optional().describe('Backdrop filter (e.g., "blur(10px)")'),

        // Positioning
        position: z.string().optional().describe('CSS position (relative, absolute, fixed, sticky)'),
        top: z.string().optional().describe('Top position'),
        right: z.string().optional().describe('Right position'),
        bottom: z.string().optional().describe('Bottom position'),
        left: z.string().optional().describe('Left position'),
        zIndex: z.number().optional().describe('Z-index stacking order'),

        // Overflow
        overflow: z.string().optional().describe('Overflow behavior (visible, hidden, scroll, auto)'),
        overflowX: z.string().optional().describe('Horizontal overflow'),
        overflowY: z.string().optional().describe('Vertical overflow'),
    }),
    outputSchema: z.object({
        success: z.boolean(),
        message: z.string(),
        elementId: z.string().optional(),
        elementType: z.string().optional(),
        appliedChanges: z.array(z.string()).optional(),
    }),
    tool: async (input) => {
        // Access global builder store
        const store = getBuilderStore();

        if (!store.updateElement) {
            return {
                success: false,
                message: 'Builder context not available. Please make sure you are in the canvas editor.'
            };
        }

        if (!store.selectedElementId) {
            return {
                success: false,
                message: 'No element is currently selected. Please select an element on the canvas first.'
            };
        }

        const selectedElement = store.getSelectedElement();
        if (!selectedElement) {
            return {
                success: false,
                message: 'Could not find the selected element.'
            };
        }

        const elementId = store.selectedElementId;
        const elementType = selectedElement.type;
        const currentProps = selectedElement.props || {};
        const currentStyles = (currentProps.styles as Record<string, string | number>) || {};

        const updates: Record<string, unknown> = {};
        const styles: Record<string, string | number> = { ...currentStyles };
        const appliedChanges: string[] = [];

        // Component variant/style
        if (input.style !== undefined) {
            updates.style = input.style;
            appliedChanges.push(`variant style → "${input.style}"`);
        }

        // Text content properties
        if (input.text !== undefined) {
            updates.text = input.text;
            appliedChanges.push(`text → "${input.text}"`);
        }
        if (input.heading !== undefined) {
            updates.heading = input.heading;
            appliedChanges.push(`heading → "${input.heading}"`);
        }
        if (input.subheading !== undefined) {
            updates.subheading = input.subheading;
            appliedChanges.push(`subheading → "${input.subheading}"`);
        }
        if (input.title !== undefined) {
            updates.title = input.title;
            appliedChanges.push(`title → "${input.title}"`);
        }
        if (input.description !== undefined) {
            updates.description = input.description;
            appliedChanges.push(`description → "${input.description}"`);
        }
        if (input.alt !== undefined) {
            updates.alt = input.alt;
            appliedChanges.push(`alt text → "${input.alt}"`);
        }

        // Navbar-specific properties
        if (input.ctaText !== undefined) {
            updates.ctaText = input.ctaText;
            updates.text = input.ctaText; // Also set as text for compatibility
            appliedChanges.push(`CTA button text → "${input.ctaText}"`);
        }
        if (input.brandName !== undefined) {
            updates.brandName = input.brandName;
            appliedChanges.push(`brand name → "${input.brandName}"`);
        }
        if (input.signInText !== undefined) {
            updates.signInText = input.signInText;
            appliedChanges.push(`sign-in text → "${input.signInText}"`);
        }
        if (input.navLinks !== undefined) {
            updates.navLinks = input.navLinks;
            appliedChanges.push(`navigation links → [${input.navLinks.join(', ')}]`);
        }

        // Image-specific
        if (input.src !== undefined) {
            updates.src = input.src;
            appliedChanges.push(`image source → "${input.src}"`);
        }

        // Color properties
        // Apply style updates - colors go as direct props for interactable components
        if (input.backgroundColor !== undefined) {
            updates.backgroundColor = input.backgroundColor;
            appliedChanges.push(`background color → ${input.backgroundColor}`);
        }
        if (input.textColor !== undefined) {
            updates.textColor = input.textColor;
            appliedChanges.push(`text color → ${input.textColor}`);
        }
        
        // Font family with dynamic loading
        if (input.fontFamily !== undefined) {
            styles.fontFamily = input.fontFamily;
            ensureFontLoaded(input.fontFamily);
            appliedChanges.push(`font family → ${input.fontFamily}`);
        }
        if (input.accentColor !== undefined) {
            updates.accentColor = input.accentColor;
            appliedChanges.push(`accent color → ${input.accentColor}`);
        }
        if (input.background !== undefined) {
            updates.background = input.background;
            appliedChanges.push(`background → ${input.background}`);
        }

        // Sizing & Spacing
        if (input.borderRadius !== undefined) {
            styles.borderRadius = `${input.borderRadius}px`;
            appliedChanges.push(`border radius → ${input.borderRadius}px`);
        }
        if (input.fontSize !== undefined) {
            styles.fontSize = `${input.fontSize}px`;
            appliedChanges.push(`font size → ${input.fontSize}px`);
        }
        if (input.padding !== undefined) {
            styles.padding = `${input.padding}px`;
            appliedChanges.push(`padding → ${input.padding}px`);
        }
        if (input.margin !== undefined) {
            styles.margin = `${input.margin}px`;
            appliedChanges.push(`margin → ${input.margin}px`);
        }
        if (input.gap !== undefined) {
            styles.gap = `${input.gap}px`;
            appliedChanges.push(`gap → ${input.gap}px`);
        }

        // Typography
        if (input.fontWeight !== undefined) {
            styles.fontWeight = input.fontWeight;
            appliedChanges.push(`font weight → ${input.fontWeight}`);
        }
        if (input.lineHeight !== undefined) {
            styles.lineHeight = input.lineHeight;
            appliedChanges.push(`line height → ${input.lineHeight}`);
        }
        if (input.letterSpacing !== undefined) {
            styles.letterSpacing = input.letterSpacing;
            appliedChanges.push(`letter spacing → ${input.letterSpacing}`);
        }
        if (input.textAlign !== undefined) {
            styles.textAlign = input.textAlign;
            appliedChanges.push(`text align → ${input.textAlign}`);
        }
        if (input.textTransform !== undefined) {
            styles.textTransform = input.textTransform;
            appliedChanges.push(`text transform → ${input.textTransform}`);
        }

        // Layout
        if (input.display !== undefined) {
            styles.display = input.display;
            appliedChanges.push(`display → ${input.display}`);
        }
        if (input.flexDirection !== undefined) {
            styles.flexDirection = input.flexDirection;
            appliedChanges.push(`flex direction → ${input.flexDirection}`);
        }
        if (input.alignItems !== undefined) {
            styles.alignItems = input.alignItems;
            appliedChanges.push(`align items → ${input.alignItems}`);
        }
        if (input.justifyContent !== undefined) {
            styles.justifyContent = input.justifyContent;
            appliedChanges.push(`justify content → ${input.justifyContent}`);
        }
        if (input.gridTemplateColumns !== undefined) {
            styles.gridTemplateColumns = input.gridTemplateColumns;
            appliedChanges.push(`grid columns → ${input.gridTemplateColumns}`);
        }

        // Border & Shadow
        if (input.border !== undefined) {
            styles.border = input.border;
            appliedChanges.push(`border → ${input.border}`);
        }
        if (input.borderColor !== undefined) {
            styles.borderColor = input.borderColor;
            appliedChanges.push(`border color → ${input.borderColor}`);
        }
        if (input.borderWidth !== undefined) {
            styles.borderWidth = input.borderWidth;
            appliedChanges.push(`border width → ${input.borderWidth}`);
        }
        if (input.boxShadow !== undefined) {
            styles.boxShadow = input.boxShadow;
            appliedChanges.push(`box shadow → ${input.boxShadow}`);
        }

        // Effects
        if (input.opacity !== undefined) {
            styles.opacity = input.opacity;
            appliedChanges.push(`opacity → ${input.opacity}`);
        }
        if (input.transform !== undefined) {
            styles.transform = input.transform;
            appliedChanges.push(`transform → ${input.transform}`);
        }
        if (input.filter !== undefined) {
            styles.filter = input.filter;
            appliedChanges.push(`filter → ${input.filter}`);
        }
        if (input.backdropFilter !== undefined) {
            styles.backdropFilter = input.backdropFilter;
            appliedChanges.push(`backdrop filter → ${input.backdropFilter}`);
        }

        // Positioning
        if (input.position !== undefined) {
            styles.position = input.position;
            appliedChanges.push(`position → ${input.position}`);
        }
        if (input.top !== undefined) {
            styles.top = input.top;
            appliedChanges.push(`top → ${input.top}`);
        }
        if (input.right !== undefined) {
            styles.right = input.right;
            appliedChanges.push(`right → ${input.right}`);
        }
        if (input.bottom !== undefined) {
            styles.bottom = input.bottom;
            appliedChanges.push(`bottom → ${input.bottom}`);
        }
        if (input.left !== undefined) {
            styles.left = input.left;
            appliedChanges.push(`left → ${input.left}`);
        }
        if (input.zIndex !== undefined) {
            styles.zIndex = input.zIndex;
            appliedChanges.push(`z-index → ${input.zIndex}`);
        }

        // Overflow
        if (input.overflow !== undefined) {
            styles.overflow = input.overflow;
            appliedChanges.push(`overflow → ${input.overflow}`);
        }
        if (input.overflowX !== undefined) {
            styles.overflowX = input.overflowX;
            appliedChanges.push(`overflow-x → ${input.overflowX}`);
        }
        if (input.overflowY !== undefined) {
            styles.overflowY = input.overflowY;
            appliedChanges.push(`overflow-y → ${input.overflowY}`);
        }

        if (appliedChanges.length === 0) {
            return {
                success: false,
                message: 'No valid properties were provided to update. Try specifying properties like backgroundColor, textColor, text, heading, style, navLinks, or any CSS property.',
            };
        }

        // Apply the update
        store.updateElement(elementId, {
            props: {
                ...currentProps,
                ...updates,
                styles
            }
        });

        return {
            success: true,
            message: `Updated ${elementType} element: ${appliedChanges.join(', ')}`,
            elementId,
            elementType,
            appliedChanges,
        };
    },
});

// Export all tools as array
export const tamboTools = [modifyElementTool];
