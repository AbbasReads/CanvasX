/**
 * Canvas Reducer Tests
 * Unit tests for canvas state reducer
 */

import { describe, it, expect } from 'vitest';
import { canvasReducer, createInitialCanvasState } from './canvasReducer';
import type { CanvasState, CanvasAction } from '@/types/canvas';

describe('canvasReducer', () => {
  describe('createInitialCanvasState', () => {
    it('should create initial state with empty components', () => {
      const state = createInitialCanvasState();
      
      expect(state.components).toEqual([]);
      expect(state.selectedComponentId).toBeNull();
      expect(state.viewportMode).toBe('desktop');
      expect(state.projectMetadata.portfolioTitle).toBe('Untitled Portfolio');
    });
  });

  describe('ADD_COMPONENT', () => {
    it('should add a component with default props at specified position', () => {
      const state = createInitialCanvasState();
      const action: CanvasAction = {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      };

      const newState = canvasReducer(state, action);

      expect(newState.components).toHaveLength(1);
      expect(newState.components[0].type).toBe('BioSection');
      expect(newState.components[0].order).toBe(0);
      expect(newState.components[0].props).toHaveProperty('heading');
      expect(newState.selectedComponentId).toBe(newState.components[0].id);
    });

    it('should adjust order of existing components when inserting', () => {
      let state = createInitialCanvasState();
      
      // Add first component at position 0
      state = canvasReducer(state, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      });

      // Add second component at position 1
      state = canvasReducer(state, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'ContactCard', position: 1 },
      });

      // Insert component at position 1 (should push ContactCard to position 2)
      state = canvasReducer(state, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'PublicationsList', position: 1 },
      });

      expect(state.components).toHaveLength(3);
      
      const bioSection = state.components.find(c => c.type === 'BioSection');
      const publicationsList = state.components.find(c => c.type === 'PublicationsList');
      const contactCard = state.components.find(c => c.type === 'ContactCard');

      expect(bioSection?.order).toBe(0);
      expect(publicationsList?.order).toBe(1);
      expect(contactCard?.order).toBe(2);
    });
  });

  describe('UPDATE_COMPONENT_PROPS', () => {
    it('should update component props', () => {
      let state = createInitialCanvasState();
      
      state = canvasReducer(state, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      });

      const componentId = state.components[0].id;

      state = canvasReducer(state, {
        type: 'UPDATE_COMPONENT_PROPS',
        payload: {
          componentId,
          props: { heading: 'New Heading', content: 'New Content' },
        },
      });

      expect(state.components[0].props.heading).toBe('New Heading');
      expect(state.components[0].props.content).toBe('New Content');
    });

    it('should merge props without removing existing ones', () => {
      let state = createInitialCanvasState();
      
      state = canvasReducer(state, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      });

      const componentId = state.components[0].id;
      const originalProps = { ...state.components[0].props };

      state = canvasReducer(state, {
        type: 'UPDATE_COMPONENT_PROPS',
        payload: {
          componentId,
          props: { heading: 'Updated Heading' },
        },
      });

      expect(state.components[0].props.heading).toBe('Updated Heading');
      expect(state.components[0].props.content).toBe(originalProps.content);
      expect(state.components[0].props.imagePosition).toBe(originalProps.imagePosition);
    });
  });

  describe('DELETE_COMPONENT', () => {
    it('should remove component and adjust order', () => {
      let state = createInitialCanvasState();
      
      // Add three components
      state = canvasReducer(state, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      });
      state = canvasReducer(state, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'ContactCard', position: 1 },
      });
      state = canvasReducer(state, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'PublicationsList', position: 2 },
      });

      const middleComponentId = state.components.find(c => c.order === 1)!.id;

      state = canvasReducer(state, {
        type: 'DELETE_COMPONENT',
        payload: { componentId: middleComponentId },
      });

      expect(state.components).toHaveLength(2);
      expect(state.components.find(c => c.order === 0)).toBeDefined();
      expect(state.components.find(c => c.order === 1)).toBeDefined();
      expect(state.components.find(c => c.order === 2)).toBeUndefined();
    });

    it('should clear selection if deleted component was selected', () => {
      let state = createInitialCanvasState();
      
      state = canvasReducer(state, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      });

      const componentId = state.components[0].id;
      expect(state.selectedComponentId).toBe(componentId);

      state = canvasReducer(state, {
        type: 'DELETE_COMPONENT',
        payload: { componentId },
      });

      expect(state.selectedComponentId).toBeNull();
    });
  });

  describe('REORDER_COMPONENT', () => {
    it('should move component to new position', () => {
      let state = createInitialCanvasState();
      
      // Add three components
      state = canvasReducer(state, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      });
      const firstId = state.components[0].id;

      state = canvasReducer(state, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'ContactCard', position: 1 },
      });
      state = canvasReducer(state, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'PublicationsList', position: 2 },
      });

      // Move first component to position 2
      state = canvasReducer(state, {
        type: 'REORDER_COMPONENT',
        payload: { componentId: firstId, newPosition: 2 },
      });

      const movedComponent = state.components.find(c => c.id === firstId);
      expect(movedComponent?.order).toBe(2);

      // Check that other components adjusted
      const orders = state.components.map(c => c.order).sort();
      expect(orders).toEqual([0, 1, 2]);
    });

    it('should handle moving component up in order', () => {
      let state = createInitialCanvasState();
      
      // Add three components
      state = canvasReducer(state, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      });
      state = canvasReducer(state, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'ContactCard', position: 1 },
      });
      state = canvasReducer(state, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'PublicationsList', position: 2 },
      });

      const lastId = state.components.find(c => c.order === 2)!.id;

      // Move last component to position 0
      state = canvasReducer(state, {
        type: 'REORDER_COMPONENT',
        payload: { componentId: lastId, newPosition: 0 },
      });

      const movedComponent = state.components.find(c => c.id === lastId);
      expect(movedComponent?.order).toBe(0);

      // Verify all orders are sequential
      const orders = state.components.map(c => c.order).sort();
      expect(orders).toEqual([0, 1, 2]);
    });
  });

  describe('SELECT_COMPONENT', () => {
    it('should set selected component id', () => {
      let state = createInitialCanvasState();
      
      state = canvasReducer(state, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      });

      const componentId = state.components[0].id;

      state = canvasReducer(state, {
        type: 'SELECT_COMPONENT',
        payload: { componentId: null },
      });

      expect(state.selectedComponentId).toBeNull();

      state = canvasReducer(state, {
        type: 'SELECT_COMPONENT',
        payload: { componentId },
      });

      expect(state.selectedComponentId).toBe(componentId);
    });
  });

  describe('SET_VIEWPORT_MODE', () => {
    it('should update viewport mode', () => {
      let state = createInitialCanvasState();

      state = canvasReducer(state, {
        type: 'SET_VIEWPORT_MODE',
        payload: { mode: 'mobile' },
      });

      expect(state.viewportMode).toBe('mobile');

      state = canvasReducer(state, {
        type: 'SET_VIEWPORT_MODE',
        payload: { mode: 'tablet' },
      });

      expect(state.viewportMode).toBe('tablet');
    });
  });

  describe('LOAD_STATE', () => {
    it('should replace entire state', () => {
      let state = createInitialCanvasState();
      
      state = canvasReducer(state, {
        type: 'ADD_COMPONENT',
        payload: { componentType: 'BioSection', position: 0 },
      });

      const newState: CanvasState = {
        components: [
          {
            id: 'test-id',
            type: 'ContactCard',
            props: { email: 'test@example.com' },
            order: 0,
          },
        ],
        selectedComponentId: 'test-id',
        viewportMode: 'tablet',
        projectMetadata: {
          professorName: 'Test Professor',
          portfolioTitle: 'Test Portfolio',
          lastModified: Date.now(),
          projectId: 'test-project',
        },
      };

      state = canvasReducer(state, {
        type: 'LOAD_STATE',
        payload: { state: newState },
      });

      expect(state.components).toHaveLength(1);
      expect(state.components[0].type).toBe('ContactCard');
      expect(state.selectedComponentId).toBe('test-id');
      expect(state.viewportMode).toBe('tablet');
      expect(state.projectMetadata.professorName).toBe('Test Professor');
    });
  });
});
