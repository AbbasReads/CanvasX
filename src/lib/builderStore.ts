// Global store for Tambo tools to access Builder state
// This bridges the gap between Tambo tools (which don't have React context access)
// and the BuilderContext

import type { CanvasElement } from '@/contexts/BuilderContext';

interface BuilderStore {
    updateElement: ((id: string, updates: Partial<CanvasElement>) => void) | null;
    selectedElementId: string | null;
    selectedElementType: string | null;
    selectedElementProps: Record<string, unknown> | null;
    elements: CanvasElement[];
    getSelectedElement: () => CanvasElement | null;
}

// Global mutable store - initialized with defaults
const builderStore: BuilderStore = {
    updateElement: null,
    selectedElementId: null,
    selectedElementType: null,
    selectedElementProps: null,
    elements: [],
    getSelectedElement: () => {
        if (!builderStore.selectedElementId) return null;
        return builderStore.elements.find(el => el.id === builderStore.selectedElementId) || null;
    },
};

// Getters
export function getBuilderStore(): BuilderStore {
    return builderStore;
}

// Setters - called from BuilderContext to keep store in sync
export function setBuilderStore(updates: Partial<Omit<BuilderStore, 'getSelectedElement'>>) {
    Object.assign(builderStore, updates);
}

export function resetBuilderStore() {
    builderStore.updateElement = null;
    builderStore.selectedElementId = null;
    builderStore.selectedElementType = null;
    builderStore.selectedElementProps = null;
    builderStore.elements = [];
}
