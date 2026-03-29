/**
 * Keyboard Shortcuts Hook
 * Implements keyboard shortcuts for undo/redo operations
 * Ctrl+Z for undo, Ctrl+Shift+Z for redo
 */

import { useEffect } from 'react';
import type { Dispatch } from 'react';
import type { CanvasAction } from '@/types/canvas';

/**
 * Hook to register keyboard shortcuts for undo/redo
 * 
 * @param dispatch - Canvas action dispatch function
 */
export function useKeyboardShortcuts(dispatch: Dispatch<CanvasAction>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl (Windows/Linux) or Cmd (Mac)
      const isModifierPressed = event.ctrlKey || event.metaKey;

      if (!isModifierPressed) {
        return;
      }

      // Ctrl+Shift+Z or Cmd+Shift+Z for redo
      if (event.shiftKey && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        dispatch({ type: 'REDO' });
        return;
      }

      // Ctrl+Z or Cmd+Z for undo
      if (event.key.toLowerCase() === 'z') {
        event.preventDefault();
        dispatch({ type: 'UNDO' });
        return;
      }
    };

    // Register event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);
}
