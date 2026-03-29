/**
 * Canvas Context Tests
 * Unit tests for Canvas Context and hooks
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { CanvasProvider, useCanvasState, useCanvas, useCanvasDispatch } from './CanvasContext';

describe('CanvasContext', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <CanvasProvider>{children}</CanvasProvider>
  );

  describe('useCanvasState', () => {
    it('should provide state and dispatch', () => {
      const { result } = renderHook(() => useCanvasState(), { wrapper });

      expect(result.current.state).toBeDefined();
      expect(result.current.dispatch).toBeDefined();
      expect(result.current.state.components).toEqual([]);
      expect(result.current.state.viewportMode).toBe('desktop');
    });

    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useCanvasState());
      }).toThrow('useCanvasState must be used within a CanvasProvider');
    });
  });

  describe('useCanvas', () => {
    it('should provide only state', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.components).toEqual([]);
      expect(result.current.viewportMode).toBe('desktop');
    });
  });

  describe('useCanvasDispatch', () => {
    it('should provide only dispatch function', () => {
      const { result } = renderHook(() => useCanvasDispatch(), { wrapper });

      expect(typeof result.current).toBe('function');
    });
  });

  describe('state updates', () => {
    it('should update state when dispatching ADD_COMPONENT', () => {
      const { result } = renderHook(() => useCanvasState(), { wrapper });

      act(() => {
        result.current.dispatch({
          type: 'ADD_COMPONENT',
          payload: { componentType: 'BioSection', position: 0 },
        });
      });

      expect(result.current.state.components).toHaveLength(1);
      expect(result.current.state.components[0].type).toBe('BioSection');
    });

    it('should update state when dispatching SELECT_COMPONENT', () => {
      const { result } = renderHook(() => useCanvasState(), { wrapper });

      act(() => {
        result.current.dispatch({
          type: 'ADD_COMPONENT',
          payload: { componentType: 'BioSection', position: 0 },
        });
      });

      const componentId = result.current.state.components[0].id;

      act(() => {
        result.current.dispatch({
          type: 'SELECT_COMPONENT',
          payload: { componentId: null },
        });
      });

      expect(result.current.state.selectedComponentId).toBeNull();

      act(() => {
        result.current.dispatch({
          type: 'SELECT_COMPONENT',
          payload: { componentId },
        });
      });

      expect(result.current.state.selectedComponentId).toBe(componentId);
    });

    it('should update state when dispatching SET_VIEWPORT_MODE', () => {
      const { result } = renderHook(() => useCanvasState(), { wrapper });

      act(() => {
        result.current.dispatch({
          type: 'SET_VIEWPORT_MODE',
          payload: { mode: 'mobile' },
        });
      });

      expect(result.current.state.viewportMode).toBe('mobile');
    });
  });

  describe('CanvasProvider with initialState', () => {
    it('should initialize with provided state', () => {
      const initialState = {
        components: [
          {
            id: 'test-id',
            type: 'ContactCard' as const,
            props: { email: 'test@example.com' },
            order: 0,
          },
        ],
        selectedComponentId: 'test-id',
        viewportMode: 'tablet' as const,
        projectMetadata: {
          professorName: 'Test Professor',
          portfolioTitle: 'Test Portfolio',
          lastModified: Date.now(),
          projectId: 'test-project',
        },
      };

      const customWrapper = ({ children }: { children: ReactNode }) => (
        <CanvasProvider initialState={initialState}>{children}</CanvasProvider>
      );

      const { result } = renderHook(() => useCanvasState(), { wrapper: customWrapper });

      expect(result.current.state.components).toHaveLength(1);
      expect(result.current.state.components[0].type).toBe('ContactCard');
      expect(result.current.state.selectedComponentId).toBe('test-id');
      expect(result.current.state.viewportMode).toBe('tablet');
    });
  });
});
