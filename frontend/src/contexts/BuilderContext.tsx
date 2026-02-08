import { useState, createContext, useContext, useCallback, ReactNode, useEffect } from 'react';
import { setBuilderStore, resetBuilderStore } from '@/lib/builderStore';

// Types for canvas elements
export interface CanvasElement {
  id: string;
  type: 'section' | 'navbar' | 'hero' | 'button' | 'text' | 'image' | 'card' | 'marquee' | 'faq' | 'footer' | 'testimonials' | 'pricing' | 'features';
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

type ToolType = 'select' | 'hand';

// Theme/Color palette types
export interface ThemePalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

export const themePalettes: ThemePalette[] = [
  { id: 'midnight', name: 'Midnight', primary: '#3b82f6', secondary: '#1e293b', accent: '#8b5cf6', background: '#0f172a', foreground: '#f8fafc' },
  { id: 'ocean', name: 'Ocean', primary: '#0ea5e9', secondary: '#0c4a6e', accent: '#06b6d4', background: '#082f49', foreground: '#f0f9ff' },
  { id: 'forest', name: 'Forest', primary: '#22c55e', secondary: '#14532d', accent: '#84cc16', background: '#052e16', foreground: '#f0fdf4' },
  { id: 'sunset', name: 'Sunset', primary: '#f97316', secondary: '#431407', accent: '#eab308', background: '#1c1917', foreground: '#fef3c7' },
  { id: 'rose', name: 'Rose', primary: '#f43f5e', secondary: '#4c0519', accent: '#ec4899', background: '#1f1f1f', foreground: '#ffe4e6' },
  { id: 'neutral', name: 'Neutral', primary: '#6b7280', secondary: '#1f2937', accent: '#9ca3af', background: '#111827', foreground: '#f9fafb' },
];

interface BuilderContextType {
  // Canvas state
  elements: CanvasElement[];
  selectedId: string | null;
  zoom: number;
  pan: { x: number; y: number };
  activeTool: ToolType;

  // Actions
  setElements: (elements: CanvasElement[]) => void;
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  updateElementWithoutHistory: (id: string, updates: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  reorderElements: (fromIndex: number, toIndex: number) => void;
  selectElement: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  setActiveTool: (tool: ToolType) => void;

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
  previewPanelOpen: boolean;
  setPreviewPanelOpen: (open: boolean) => void;

  // Theme
  activeTheme: ThemePalette;
  setActiveTheme: (theme: ThemePalette) => void;

  // Sidebar widths
  leftSidebarWidth: number;
  setLeftSidebarWidth: (width: number) => void;
  rightSidebarWidth: number;
  setRightSidebarWidth: (width: number) => void;
}

const BuilderContext = createContext<BuilderContextType | null>(null);

export function BuilderProvider({ children }: { children: ReactNode }) {
  // Canvas state
  const [elements, setElementsInternal] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [activeTool, setActiveTool] = useState<ToolType>('select');

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
  const [previewPanelOpen, setPreviewPanelOpen] = useState(false);

  // Theme
  const [activeTheme, setActiveTheme] = useState<ThemePalette>(themePalettes[0]);

  // Sidebar widths
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(224);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(280);

  // History and element management callbacks

  const pushHistory = useCallback((newElements: CanvasElement[]) => {
    setHistory(prev => {
      // Remove any future history when making a new change
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ elements: newElements, timestamp: Date.now() });
      // Keep last 50 states
      const trimmedHistory = newHistory.slice(-50);
      // Calculate new index based on trimmed history length
      const newIndex = trimmedHistory.length - 1;
      setHistoryIndex(newIndex);
      return trimmedHistory;
    });
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
    const newElements = elements.map(el => {
      if (el.id !== id) return el;

      // Deep merge props if both exist
      const mergedProps = updates.props
        ? { ...(el.props || {}), ...updates.props }
        : el.props;

      return {
        ...el,
        ...updates,
        props: mergedProps
      };
    });
    setElementsInternal(newElements);
    pushHistory(newElements);
  }, [elements, pushHistory]);

  // Update element without adding to history (for intermediate drag/resize states)
  const updateElementWithoutHistory = useCallback((id: string, updates: Partial<CanvasElement>) => {
    const newElements = elements.map(el => {
      if (el.id !== id) return el;

      // Deep merge props if both exist
      const mergedProps = updates.props
        ? { ...(el.props || {}), ...updates.props }
        : el.props;

      return {
        ...el,
        ...updates,
        props: mergedProps
      };
    });
    setElementsInternal(newElements);
  }, [elements]);

  const removeElement = useCallback((id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElementsInternal(newElements);
    pushHistory(newElements);
    if (selectedId === id) setSelectedId(null);
  }, [elements, selectedId, pushHistory]);

  const reorderElements = useCallback((fromIndex: number, toIndex: number) => {
    const newElements = [...elements];
    const [movedElement] = newElements.splice(fromIndex, 1);
    newElements.splice(toIndex, 0, movedElement);
    setElementsInternal(newElements);
    pushHistory(newElements);
  }, [elements, pushHistory]);

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

  // Sync builder state to global store for Tambo AI tool access
  const selectedElement = elements.find(el => el.id === selectedId);

  useEffect(() => {
    setBuilderStore({
      updateElement,
      selectedElementId: selectedId,
      selectedElementType: selectedElement?.type || null,
      selectedElementProps: selectedElement?.props || null,
      elements,
    });
  }, [updateElement, selectedId, selectedElement, elements]);

  // Cleanup on unmount
  useEffect(() => {
    return () => resetBuilderStore();
  }, []);

  const value: BuilderContextType = {
    elements,
    selectedId,
    zoom,
    pan,
    activeTool,
    setElements,
    addElement,
    updateElement,
    updateElementWithoutHistory,
    removeElement,
    reorderElements,
    selectElement,
    setZoom,
    setPan,
    setActiveTool,
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
    previewPanelOpen,
    setPreviewPanelOpen,
    activeTheme,
    setActiveTheme,
    leftSidebarWidth,
    setLeftSidebarWidth,
    rightSidebarWidth,
    setRightSidebarWidth,
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
