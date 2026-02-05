import { defineTool } from '@tambo-ai/react';
import { z } from 'zod';
import { getBuilderStore } from './builderStore';

// Tool for modifying element visual properties
export const modifyElementTool = defineTool({
    name: 'modify_element',
    description: 'Modify the visual properties of the currently selected canvas element. Use this to change colors, text, gradients, sizes, and styles based on user requests.',
    tool: async (input) => {
        // Access global builder store
        const store = getBuilderStore();

        if (!store.updateElement) {
            return { success: false, message: 'Builder context not available' };
        }

        if (!store.selectedElementId) {
            return { success: false, message: 'No element selected' };
        }

        const elementId = store.selectedElementId;
        const currentProps = store.selectedElementProps || {};
        const currentStyles = (currentProps.styles as Record<string, string>) || {};

        const updates: Record<string, unknown> = {};
        const styles: Record<string, string> = { ...currentStyles };

        // Apply property updates
        if (input.text) updates.text = input.text;
        if (input.heading) updates.heading = input.heading;
        if (input.subheading) updates.subheading = input.subheading;
        if (input.title) updates.title = input.title;
        if (input.description) updates.description = input.description;

        // Apply style updates
        if (input.backgroundColor) styles.backgroundColor = input.backgroundColor;
        if (input.textColor) styles.color = input.textColor;
        if (input.background) styles.background = input.background;
        if (input.borderRadius) styles.borderRadius = `${input.borderRadius}px`;
        if (input.fontSize) styles.fontSize = `${input.fontSize}px`;
        if (input.padding) styles.padding = `${input.padding}px`;

        store.updateElement(elementId, {
            props: {
                ...currentProps,
                ...updates,
                styles
            }
        });

        return {
            success: true,
            message: `Updated element with: ${Object.keys({ ...updates, ...styles }).join(', ')}`,
            elementId
        };
    },
    inputSchema: z.object({
        text: z.string().optional().describe('The text content to display on buttons or text elements'),
        backgroundColor: z.string().optional().describe('Background color as hex (#ffffff) or CSS color name'),
        textColor: z.string().optional().describe('Text/foreground color as hex or CSS color name'),
        borderRadius: z.number().optional().describe('Border radius in pixels for rounded corners'),
        fontSize: z.number().optional().describe('Font size in pixels'),
        heading: z.string().optional().describe('Main heading text for hero sections'),
        subheading: z.string().optional().describe('Subheading or subtitle text'),
        title: z.string().optional().describe('Title text for cards or sections'),
        description: z.string().optional().describe('Description or body text'),
        background: z.string().optional().describe('CSS background value, use for gradients like "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"'),
        padding: z.number().optional().describe('Padding in pixels'),
    }),
    outputSchema: z.object({
        success: z.boolean(),
        message: z.string(),
        elementId: z.string().optional(),
    }),
});

// Export all tools as array
export const tamboTools = [modifyElementTool];
