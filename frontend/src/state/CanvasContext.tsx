/**
 * Canvas Context
 * Provides canvas state and dispatch function to the component tree
 * Implements React Context for canvas state management with history support
 */

import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import type { CanvasState, CanvasAction } from '@/types/canvas';
import { createInitialCanvasState } from './canvasReducer';
import { historyReducer, createInitialHistoryState } from './historyReducer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

/**
 * Canvas Context type
 */
interface CanvasContextType {
  state: CanvasState;
  dispatch: Dispatch<CanvasAction>;
}

/**
 * Canvas Context
 */
const CanvasContext = createContext<CanvasContextType | null>(null);

/**
 * Canvas Provider Props
 */
interface CanvasProviderProps {
  children: ReactNode;
  initialState?: CanvasState;
}

/**
 * Canvas Provider Component
 * Wraps the application and provides canvas state to all children
 * Includes history management for undo/redo functionality
 */
export function CanvasProvider({ children, initialState }: CanvasProviderProps) {
  const initialCanvasState = initialState ?? createInitialCanvasState();
  const [historyState, dispatch] = useReducer(
    historyReducer,
    createInitialHistoryState(initialCanvasState)
  );

  // Register keyboard shortcuts for undo/redo
  useKeyboardShortcuts(dispatch);

  return (
    <CanvasContext.Provider value={{ state: historyState.present, dispatch }}>
      {children}
    </CanvasContext.Provider>
  );
}

/**
 * useCanvasState Hook
 * Provides access to canvas state and dispatch function
 * Must be used within a CanvasProvider
 * 
 * @returns {CanvasContextType} Canvas state and dispatch function
 * @throws {Error} If used outside of CanvasProvider
 */
export function useCanvasState(): CanvasContextType {
  const context = useContext(CanvasContext);
  
  if (!context) {
    throw new Error('useCanvasState must be used within a CanvasProvider');
  }
  
  return context;
}

/**
 * Helper hook to get only the canvas state (without dispatch)
 * Useful for components that only need to read state
 */
export function useCanvas(): CanvasState {
  const { state } = useCanvasState();
  return state;
}

/**
 * Helper hook to get only the dispatch function
 * Useful for components that only need to dispatch actions
 */
export function useCanvasDispatch(): Dispatch<CanvasAction> {
  const { dispatch } = useCanvasState();
  return dispatch;
}
