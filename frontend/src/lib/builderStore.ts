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
}

// Global mutable store
let builderStore: BuilderStore = {
    updateElement: null,
    selectedElementId: null,
    selectedElementType: null,
    selectedElementProps: null,
    elements: [],
};

// Getters
export function getBuilderStore(): BuilderStore {
    return builderStore;
}

// Setters - called from BuilderContext to keep store in sync
export function setBuilderStore(updates: Partial<BuilderStore>) {
    builderStore = { ...builderStore, ...updates };
}

export function resetBuilderStore() {
    builderStore = {
        updateElement: null,
        selectedElementId: null,
        selectedElementType: null,
        selectedElementProps: null,
        elements: [],
    };
}
