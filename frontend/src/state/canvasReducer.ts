/**
 * Canvas State Reducer
 * Implements state management for the sandboxed website builder canvas
 * Handles all canvas actions: ADD_COMPONENT, UPDATE_COMPONENT_PROPS, DELETE_COMPONENT,
 * REORDER_COMPONENT, SELECT_COMPONENT, SET_VIEWPORT_MODE, UNDO, REDO, LOAD_STATE
 */

import type { CanvasState, CanvasAction, ComponentInstance } from '@/types/canvas';
import { generateComponentId, generateProjectId } from '@/utils/idGenerator';
import { COMPONENT_SCHEMAS } from '@/lib/componentSchemas';

/**
 * Initial canvas state
 */
export function createInitialCanvasState(): CanvasState {
  return {
    components: [],
    selectedComponentId: null,
    viewportMode: 'desktop',
    projectMetadata: {
      professorName: '',
      portfolioTitle: 'Untitled Portfolio',
      lastModified: Date.now(),
      projectId: generateProjectId(),
    },
  };
}

/**
 * Canvas reducer function
 * Handles all canvas state transitions
 */
export function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case 'ADD_COMPONENT': {
      const { componentType, position } = action.payload;
      
      // Get schema for the component type
      const schema = COMPONENT_SCHEMAS[componentType];
      if (!schema) {
        console.error(`Unknown component type: ${componentType}`);
        return state;
      }

      // Create new component instance with default props
      const newComponent: ComponentInstance = {
        id: generateComponentId(),
        type: componentType,
        props: { ...schema.defaultProps },
        order: position,
      };

      // Insert component at the specified position and adjust order of other components
      const updatedComponents = [...state.components];
      
      // Increment order of components at or after the insertion position
      updatedComponents.forEach(component => {
        if (component.order >= position) {
          component.order += 1;
        }
      });

      updatedComponents.push(newComponent);

      return {
        ...state,
        components: updatedComponents,
        selectedComponentId: newComponent.id,
        projectMetadata: {
          ...state.projectMetadata,
          lastModified: Date.now(),
        },
      };
    }

    case 'UPDATE_COMPONENT_PROPS': {
      const { componentId, props } = action.payload;

      const updatedComponents = state.components.map(component => {
        if (component.id === componentId) {
          return {
            ...component,
            props: {
              ...component.props,
              ...props,
            },
          };
        }
        return component;
      });

      return {
        ...state,
        components: updatedComponents,
        projectMetadata: {
          ...state.projectMetadata,
          lastModified: Date.now(),
        },
      };
    }

    case 'DELETE_COMPONENT': {
      const { componentId } = action.payload;

      // Find the component to delete
      const componentToDelete = state.components.find(c => c.id === componentId);
      if (!componentToDelete) {
        return state;
      }

      // Remove component and adjust order of remaining components
      const updatedComponents = state.components
        .filter(component => component.id !== componentId)
        .map(component => {
          if (component.order > componentToDelete.order) {
            return {
              ...component,
              order: component.order - 1,
            };
          }
          return component;
        });

      return {
        ...state,
        components: updatedComponents,
        selectedComponentId: state.selectedComponentId === componentId ? null : state.selectedComponentId,
        projectMetadata: {
          ...state.projectMetadata,
          lastModified: Date.now(),
        },
      };
    }

    case 'REORDER_COMPONENT': {
      const { componentId, newPosition } = action.payload;

      const component = state.components.find(c => c.id === componentId);
      if (!component) {
        return state;
      }

      const oldPosition = component.order;
      if (oldPosition === newPosition) {
        return state;
      }

      // Update order of all affected components
      const updatedComponents = state.components.map(c => {
        if (c.id === componentId) {
          return { ...c, order: newPosition };
        }

        // Moving down: increment order of components between old and new position
        if (oldPosition < newPosition && c.order > oldPosition && c.order <= newPosition) {
          return { ...c, order: c.order - 1 };
        }

        // Moving up: decrement order of components between new and old position
        if (oldPosition > newPosition && c.order >= newPosition && c.order < oldPosition) {
          return { ...c, order: c.order + 1 };
        }

        return c;
      });

      return {
        ...state,
        components: updatedComponents,
        projectMetadata: {
          ...state.projectMetadata,
          lastModified: Date.now(),
        },
      };
    }

    case 'SELECT_COMPONENT': {
      const { componentId } = action.payload;

      return {
        ...state,
        selectedComponentId: componentId,
      };
    }

    case 'SET_VIEWPORT_MODE': {
      const { mode } = action.payload;

      return {
        ...state,
        viewportMode: mode,
      };
    }

    case 'LOAD_STATE': {
      const { state: newState } = action.payload;

      return {
        ...newState,
        projectMetadata: {
          ...newState.projectMetadata,
          lastModified: Date.now(),
        },
      };
    }

    case 'UNDO':
    case 'REDO':
      // These actions are handled by the history wrapper
      // They should not reach this reducer
      console.warn(`${action.type} should be handled by history wrapper`);
      return state;

    default:
      return state;
  }
}
