import { useState, createContext, useContext, useCallback, ReactNode, useEffect } from 'react';
import { useTamboContextHelpers } from '@tambo-ai/react';

// Types for canvas elements
export interface CanvasElement {
  id: string;
  type: 'section' | 'navbar' | 'hero' | 'button' | 'text' | 'image' | 'card';
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  props?: Record<string, unknown>;
}

interface HistoryState {
  elements: CanvasElement[];
  timestamp: number;
}

interface BuilderContextType {
  // Canvas state
  elements: CanvasElement[];
  selectedId: string | null;
  zoom: number;
  pan: { x: number; y: number };

  // Actions
  setElements: (elements: CanvasElement[]) => void;
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;

  // History
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // UI state
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  leftSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
  rightSidebarOpen: boolean;
  setRightSidebarOpen: (open: boolean) => void;

  // Preview & Export
  previewMode: boolean;
  setPreviewMode: (preview: boolean) => void;
  exportDialogOpen: boolean;
  setExportDialogOpen: (open: boolean) => void;
}

const BuilderContext = createContext<BuilderContextType | null>(null);

export function BuilderProvider({ children }: { children: ReactNode }) {
  // Canvas state
  const [elements, setElementsInternal] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([{ elements: [], timestamp: Date.now() }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // UI state
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  // Preview & Export
  const [previewMode, setPreviewMode] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // Tambo context helpers - expose updateElement to AI tools
  const { addContextHelper, removeContextHelper } = useTamboContextHelpers();

  // We need to define updateElement before the useEffect but also need pushHistory
  // So we'll move the Tambo registration after all callbacks are defined

  const pushHistory = useCallback((newElements: CanvasElement[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ elements: newElements, timestamp: Date.now() });
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const setElements = useCallback((newElements: CanvasElement[]) => {
    setElementsInternal(newElements);
    pushHistory(newElements);
  }, [pushHistory]);

  const addElement = useCallback((element: CanvasElement) => {
    const newElements = [...elements, element];
    setElementsInternal(newElements);
    pushHistory(newElements);
  }, [elements, pushHistory]);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    const newElements = elements.map(el =>
      el.id === id ? { ...el, ...updates } : el
    );
    setElementsInternal(newElements);
    pushHistory(newElements);
  }, [elements, pushHistory]);

  const removeElement = useCallback((id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElementsInternal(newElements);
    pushHistory(newElements);
    if (selectedId === id) setSelectedId(null);
  }, [elements, selectedId, pushHistory]);

  const selectElement = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElementsInternal(history[newIndex].elements);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElementsInternal(history[newIndex].elements);
    }
  }, [historyIndex, history]);

  // Register builder actions with Tambo for AI tool access
  const selectedElement = elements.find(el => el.id === selectedId);

  useEffect(() => {
    addContextHelper('builderActions', () => ({
      updateElement,
      selectedElementId: selectedId,
      selectedElementType: selectedElement?.type,
      selectedElementProps: selectedElement?.props,
      availableElements: elements.map(el => ({ id: el.id, type: el.type, label: el.label })),
    }));

    return () => {
      removeContextHelper('builderActions');
    };
  }, [updateElement, selectedId, selectedElement, elements, addContextHelper, removeContextHelper]);

  const value: BuilderContextType = {
    elements,
    selectedId,
    zoom,
    pan,
    setElements,
    addElement,
    updateElement,
    removeElement,
    selectElement,
    setZoom,
    setPan,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    commandPaletteOpen,
    setCommandPaletteOpen,
    leftSidebarOpen,
    setLeftSidebarOpen,
    rightSidebarOpen,
    setRightSidebarOpen,
    previewMode,
    setPreviewMode,
    exportDialogOpen,
    setExportDialogOpen,
  };

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}
