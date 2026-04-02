/**
 * Keyboard Shortcuts Hook Tests
 * Tests for undo/redo keyboard shortcuts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import type { Dispatch } from 'react';
import type { CanvasAction } from '@/types/canvas';

describe('useKeyboardShortcuts', () => {
  let dispatch: Dispatch<CanvasAction>;

  beforeEach(() => {
    dispatch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Undo shortcut (Ctrl+Z)', () => {
    it('should dispatch UNDO action when Ctrl+Z is pressed', () => {
      renderHook(() => useKeyboardShortcuts(dispatch));

      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true,
      });

      window.dispatchEvent(event);

      expect(dispatch).toHaveBeenCalledWith({ type: 'UNDO' });
    });

    it('should dispatch UNDO action when Cmd+Z is pressed (Mac)', () => {
      renderHook(() => useKeyboardShortcuts(dispatch));

      const event = new KeyboardEvent('keydown', {
        key: 'z',
        metaKey: true,
      });

      window.dispatchEvent(event);

      expect(dispatch).toHaveBeenCalledWith({ type: 'UNDO' });
    });

    it('should handle uppercase Z', () => {
      renderHook(() => useKeyboardShortcuts(dispatch));

      const event = new KeyboardEvent('keydown', {
        key: 'Z',
        ctrlKey: true,
      });

      window.dispatchEvent(event);

      expect(dispatch).toHaveBeenCalledWith({ type: 'UNDO' });
    });

    it('should not dispatch UNDO when Z is pressed without modifier', () => {
      renderHook(() => useKeyboardShortcuts(dispatch));

      const event = new KeyboardEvent('keydown', {
        key: 'z',
      });

      window.dispatchEvent(event);

      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe('Redo shortcut (Ctrl+Shift+Z)', () => {
    it('should dispatch REDO action when Ctrl+Shift+Z is pressed', () => {
      renderHook(() => useKeyboardShortcuts(dispatch));

      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true,
        shiftKey: true,
      });

      window.dispatchEvent(event);

      expect(dispatch).toHaveBeenCalledWith({ type: 'REDO' });
    });

    it('should dispatch REDO action when Cmd+Shift+Z is pressed (Mac)', () => {
      renderHook(() => useKeyboardShortcuts(dispatch));

      const event = new KeyboardEvent('keydown', {
        key: 'z',
        metaKey: true,
        shiftKey: true,
      });

      window.dispatchEvent(event);

      expect(dispatch).toHaveBeenCalledWith({ type: 'REDO' });
    });

    it('should handle uppercase Z with Shift', () => {
      renderHook(() => useKeyboardShortcuts(dispatch));

      const event = new KeyboardEvent('keydown', {
        key: 'Z',
        ctrlKey: true,
        shiftKey: true,
      });

      window.dispatchEvent(event);

      expect(dispatch).toHaveBeenCalledWith({ type: 'REDO' });
    });

    it('should prioritize REDO over UNDO when Shift is pressed', () => {
      renderHook(() => useKeyboardShortcuts(dispatch));

      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true,
        shiftKey: true,
      });

      window.dispatchEvent(event);

      expect(dispatch).toHaveBeenCalledWith({ type: 'REDO' });
      expect(dispatch).not.toHaveBeenCalledWith({ type: 'UNDO' });
    });
  });

  describe('Event listener cleanup', () => {
    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useKeyboardShortcuts(dispatch));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Other keys', () => {
    it('should not dispatch actions for other keys with Ctrl', () => {
      renderHook(() => useKeyboardShortcuts(dispatch));

      const event = new KeyboardEvent('keydown', {
        key: 'a',
        ctrlKey: true,
      });

      window.dispatchEvent(event);

      expect(dispatch).not.toHaveBeenCalled();
    });

    it('should not dispatch actions for keys without modifier', () => {
      renderHook(() => useKeyboardShortcuts(dispatch));

      const event = new KeyboardEvent('keydown', {
        key: 'z',
      });

      window.dispatchEvent(event);

      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
