/**
 * History Reducer Tests
 * Tests for undo/redo functionality with circular buffer
 */

import { describe, it, expect } from 'vitest';
import { historyReducer, createInitialHistoryState } from './historyReducer';
import { createInitialCanvasState } from './canvasReducer';
import type { CanvasState, HistoryState } from '@/types/canvas';

describe('historyReducer', () => {
  describe('createInitialHistoryState', () => {
    it('should create initial history state with empty past and future', () => {
      const canvasState = createInitialCanvasState();
      const historyState = createInitialHistoryState(canvasState);

      expect(historyState.past).toEqual([]);
      expect(historyState.present).toBe(canvasState);
      expect(historyState.future).toEqual([]);
      expect(historyState.maxSize).toBe(50);
    });
  });

  describe('UNDO action', () => {
    it('should restore previous state when undo is called', () => {
      const initialCanvas = createInitialCanvasState();
      let historyState = createInitialHistoryState(initialCanvas);

      // Add a component
      historyState = historyReducer(historyState, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      });

      // Verify component was added
      expect(historyState.present.components).toHaveLength(1);
      expect(historyState.past).toHaveLength(1);

      // Undo
      historyState = historyReducer(historyState, { type: 'UNDO' });

      // Verify state was restored
      expect(historyState.present.components).toHaveLength(0);
      expect(historyState.past).toHaveLength(0);
      expect(historyState.future).toHaveLength(1);
    });

    it('should not change state when there is no past', () => {
      const initialCanvas = createInitialCanvasState();
      const historyState = createInitialHistoryState(initialCanvas);

      const result = historyReducer(historyState, { type: 'UNDO' });

      expect(result).toBe(historyState);
    });

    it('should handle multiple undo operations', () => {
      const initialCanvas = createInitialCanvasState();
      let historyState = createInitialHistoryState(initialCanvas);

      // Add three components
      historyState = historyReducer(historyState, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      });
      historyState = historyReducer(historyState, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'ContactCard', position: 1 },
      });
      historyState = historyReducer(historyState, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'PublicationsList', position: 2 },
      });

      expect(historyState.present.components).toHaveLength(3);
      expect(historyState.past).toHaveLength(3);

      // Undo twice
      historyState = historyReducer(historyState, { type: 'UNDO' });
      historyState = historyReducer(historyState, { type: 'UNDO' });

      expect(historyState.present.components).toHaveLength(1);
      expect(historyState.past).toHaveLength(1);
      expect(historyState.future).toHaveLength(2);
    });
  });

  describe('REDO action', () => {
    it('should restore next state when redo is called', () => {
      const initialCanvas = createInitialCanvasState();
      let historyState = createInitialHistoryState(initialCanvas);

      // Add a component
      historyState = historyReducer(historyState, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      });

      // Undo
      historyState = historyReducer(historyState, { type: 'UNDO' });

      // Redo
      historyState = historyReducer(historyState, { type: 'REDO' });

      // Verify state was restored
      expect(historyState.present.components).toHaveLength(1);
      expect(historyState.past).toHaveLength(1);
      expect(historyState.future).toHaveLength(0);
    });

    it('should not change state when there is no future', () => {
      const initialCanvas = createInitialCanvasState();
      const historyState = createInitialHistoryState(initialCanvas);

      const result = historyReducer(historyState, { type: 'REDO' });

      expect(result).toBe(historyState);
    });

    it('should handle multiple redo operations', () => {
      const initialCanvas = createInitialCanvasState();
      let historyState = createInitialHistoryState(initialCanvas);

      // Add three components
      historyState = historyReducer(historyState, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      });
      historyState = historyReducer(historyState, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'ContactCard', position: 1 },
      });
      historyState = historyReducer(historyState, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'PublicationsList', position: 2 },
      });

      // Undo three times
      historyState = historyReducer(historyState, { type: 'UNDO' });
      historyState = historyReducer(historyState, { type: 'UNDO' });
      historyState = historyReducer(historyState, { type: 'UNDO' });

      expect(historyState.present.components).toHaveLength(0);

      // Redo twice
      historyState = historyReducer(historyState, { type: 'REDO' });
      historyState = historyReducer(historyState, { type: 'REDO' });

      expect(historyState.present.components).toHaveLength(2);
      expect(historyState.past).toHaveLength(2);
      expect(historyState.future).toHaveLength(1);
    });
  });

  describe('Circular buffer with 50-state limit', () => {
    it('should maintain maximum of 50 states in past', () => {
      const initialCanvas = createInitialCanvasState();
      let historyState = createInitialHistoryState(initialCanvas);

      // Add 60 components (exceeds limit)
      for (let i = 0; i < 60; i++) {
        historyState = historyReducer(historyState, {
          type: 'ADD_COMPONENT',
          payload: { componentType: 'BioSection', position: i },
        });
      }

      // Past should be capped at 50
      expect(historyState.past.length).toBe(50);
      expect(historyState.present.components).toHaveLength(60);
    });

    it('should discard oldest states when limit is exceeded', () => {
      const initialCanvas = createInitialCanvasState();
      let historyState = createInitialHistoryState(initialCanvas);

      // Add 52 components
      for (let i = 0; i < 52; i++) {
        historyState = historyReducer(historyState, {
          type: 'ADD_COMPONENT',
          payload: { componentType: 'BioSection', position: i },
        });
      }

      // Past should be capped at 50
      expect(historyState.past.length).toBe(50);

      // The oldest state (with 0 components) should be discarded
      // The oldest state in past should have 2 components (state after 2 additions)
      expect(historyState.past[0].components.length).toBe(2);
    });
  });

  describe('Action recording', () => {
    it('should record ADD_COMPONENT in history', () => {
      const initialCanvas = createInitialCanvasState();
      let historyState = createInitialHistoryState(initialCanvas);

      historyState = historyReducer(historyState, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      });

      expect(historyState.past).toHaveLength(1);
    });

    it('should record UPDATE_COMPONENT_PROPS in history', () => {
      const initialCanvas = createInitialCanvasState();
      let historyState = createInitialHistoryState(initialCanvas);

      // Add a component first
      historyState = historyReducer(historyState, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      });

      const componentId = historyState.present.components[0].id;

      // Update props
      historyState = historyReducer(historyState, {
        type: 'UPDATE_COMPONENT_PROPS',
        payload: { componentId, props: { heading: 'New Heading' } },
      });

      expect(historyState.past).toHaveLength(2);
    });

    it('should record DELETE_COMPONENT in history', () => {
      const initialCanvas = createInitialCanvasState();
      let historyState = createInitialHistoryState(initialCanvas);

      // Add a component
      historyState = historyReducer(historyState, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      });

      const componentId = historyState.present.components[0].id;

      // Delete component
      historyState = historyReducer(historyState, {
        type: 'DELETE_COMPONENT',
        payload: { componentId },
      });

      expect(historyState.past).toHaveLength(2);
    });

    it('should record REORDER_COMPONENT in history', () => {
      const initialCanvas = createInitialCanvasState();
      let historyState = createInitialHistoryState(initialCanvas);

      // Add two components
      historyState = historyReducer(historyState, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      });
      historyState = historyReducer(historyState, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'ContactCard', position: 1 },
      });

      const componentId = historyState.present.components[0].id;

      // Reorder component
      historyState = historyReducer(historyState, {
        type: 'REORDER_COMPONENT',
        payload: { componentId, newPosition: 1 },
      });

      expect(historyState.past).toHaveLength(3);
    });

    it('should NOT record SELECT_COMPONENT in history', () => {
      const initialCanvas = createInitialCanvasState();
      let historyState = createInitialHistoryState(initialCanvas);

      // Add a component
      historyState = historyReducer(historyState, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      });

      const pastLength = historyState.past.length;
      const componentId = historyState.present.components[0].id;

      // Select component
      historyState = historyReducer(historyState, {
        type: 'SELECT_COMPONENT',
        payload: { componentId },
      });

      // Past should not have changed
      expect(historyState.past).toHaveLength(pastLength);
    });

    it('should NOT record SET_VIEWPORT_MODE in history', () => {
      const initialCanvas = createInitialCanvasState();
      let historyState = createInitialHistoryState(initialCanvas);

      const pastLength = historyState.past.length;

      // Change viewport mode
      historyState = historyReducer(historyState, {
        type: 'SET_VIEWPORT_MODE',
        payload: { mode: 'tablet' },
      });

      // Past should not have changed
      expect(historyState.past).toHaveLength(pastLength);
    });
  });

  describe('Future clearing', () => {
    it('should clear future when a new action is performed after undo', () => {
      const initialCanvas = createInitialCanvasState();
      let historyState = createInitialHistoryState(initialCanvas);

      // Add two components
      historyState = historyReducer(historyState, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      });
      historyState = historyReducer(historyState, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'ContactCard', position: 1 },
      });

      // Undo
      historyState = historyReducer(historyState, { type: 'UNDO' });

      expect(historyState.future).toHaveLength(1);

      // Add a new component
      historyState = historyReducer(historyState, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'PublicationsList', position: 1 },
      });

      // Future should be cleared
      expect(historyState.future).toHaveLength(0);
    });
  });

  describe('LOAD_STATE action', () => {
    it('should clear history when loading a new state', () => {
      const initialCanvas = createInitialCanvasState();
      let historyState = createInitialHistoryState(initialCanvas);

      // Add components and create history
      historyState = historyReducer(historyState, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      });
      historyState = historyReducer(historyState, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'ContactCard', position: 1 },
      });

      // Undo to create future
      historyState = historyReducer(historyState, { type: 'UNDO' });

      expect(historyState.past.length).toBeGreaterThan(0);
      expect(historyState.future.length).toBeGreaterThan(0);

      // Load a new state
      const newState = createInitialCanvasState();
      historyState = historyReducer(historyState, {
        type: 'LOAD_STATE',
        payload: { state: newState },
      });

      // History should be cleared
      expect(historyState.past).toHaveLength(0);
      expect(historyState.future).toHaveLength(0);
    });
  });
});
