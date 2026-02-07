import { defineTool } from '@tambo-ai/react';
import { z } from 'zod';
import { getBuilderStore } from './builderStore';

// Tool for modifying element visual properties
export const modifyElementTool = defineTool({
    name: 'modify_element',
    description: `Modify the visual properties of the currently selected canvas element. 
Use this to change colors, text, gradients, sizes, and styles based on user requests.
The tool will apply changes to the currently selected element in the canvas builder.`,
    inputSchema: z.object({
        // Text content
        text: z.string().optional().describe('The text content for buttons or text elements'),
        heading: z.string().optional().describe('Main heading text for hero sections'),
        subheading: z.string().optional().describe('Subheading or subtitle text'),
        title: z.string().optional().describe('Title text for cards or sections'),
        description: z.string().optional().describe('Description or body text'),

        // Navbar-specific
        ctaText: z.string().optional().describe('Call-to-action button text (e.g., "Get Started", "Sign Up", "Let\'s Go")'),
        brandName: z.string().optional().describe('Brand/company name shown in navbar'),
        signInText: z.string().optional().describe('Sign-in link text'),

        // Colors
        backgroundColor: z.string().optional().describe('Background color as hex (#ffffff) or CSS color name'),
        textColor: z.string().optional().describe('Text/foreground color as hex or CSS color name'),
        accentColor: z.string().optional().describe('Accent color for highlights, buttons'),
        background: z.string().optional().describe('CSS background for gradients like "linear-gradient(...)"'),

        // Sizing & Spacing
        borderRadius: z.number().optional().describe('Border radius in pixels'),
        fontSize: z.number().optional().describe('Font size in pixels'),
        padding: z.number().optional().describe('Padding in pixels'),
        width: z.number().optional().describe('Width in pixels'),
        height: z.number().optional().describe('Height in pixels'),
    }),
    outputSchema: z.object({
        success: z.boolean(),
        message: z.string(),
        elementId: z.string().optional(),
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
        const currentProps = selectedElement.props || {};
        const currentStyles = (currentProps.styles as Record<string, string>) || {};

        const updates: Record<string, unknown> = {};
        const styles: Record<string, string> = { ...currentStyles };
        const appliedChanges: string[] = [];

        // Apply property updates
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

        // Navbar-specific properties
        if (input.ctaText !== undefined) {
            updates.ctaText = input.ctaText;
            updates.text = input.ctaText; // Also set as text for compatibility
            appliedChanges.push(`button text → "${input.ctaText}"`);
        }
        if (input.brandName !== undefined) {
            updates.brandName = input.brandName;
            appliedChanges.push(`brand name → "${input.brandName}"`);
        }
        if (input.signInText !== undefined) {
            updates.signInText = input.signInText;
            appliedChanges.push(`sign-in text → "${input.signInText}"`);
        }

        // Apply style updates
        if (input.backgroundColor !== undefined) {
            styles.backgroundColor = input.backgroundColor;
            appliedChanges.push(`background color → ${input.backgroundColor}`);
        }
        if (input.textColor !== undefined) {
            styles.color = input.textColor;
            appliedChanges.push(`text color → ${input.textColor}`);
        }
        if (input.accentColor !== undefined) {
            updates.accentColor = input.accentColor;
            appliedChanges.push(`accent color → ${input.accentColor}`);
        }
        if (input.background !== undefined) {
            styles.background = input.background;
            appliedChanges.push(`background → ${input.background}`);
        }
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
        if (input.width !== undefined) {
            styles.width = `${input.width}px`;
            appliedChanges.push(`width → ${input.width}px`);
        }
        if (input.height !== undefined) {
            styles.height = `${input.height}px`;
            appliedChanges.push(`height → ${input.height}px`);
        }

        if (appliedChanges.length === 0) {
            return {
                success: false,
                message: 'No valid properties were provided to update. Try specifying backgroundColor, textColor, text, or other properties.',
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
            message: `Updated ${selectedElement.type} element: ${appliedChanges.join(', ')}`,
            elementId,
            appliedChanges,
        };
    },
});

// Export all tools as array
export const tamboTools = [modifyElementTool];
