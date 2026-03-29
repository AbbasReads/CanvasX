# Canvas State Management

This directory contains the state management implementation for the sandboxed website builder canvas.

## Overview

The canvas state management follows a unidirectional data flow pattern using React's `useReducer` hook and Context API. This provides a predictable state container for managing the portfolio website builder's canvas state.

## Files

### `canvasReducer.ts`
Core reducer function that handles all canvas state transitions.

**Exports:**
- `createInitialCanvasState()` - Creates the initial canvas state
- `canvasReducer(state, action)` - Reducer function for state updates

**Supported Actions:**
- `ADD_COMPONENT` - Adds a new component to the canvas at a specified position
- `UPDATE_COMPONENT_PROPS` - Updates properties of an existing component
- `DELETE_COMPONENT` - Removes a component from the canvas
- `REORDER_COMPONENT` - Changes the order/position of a component
- `SELECT_COMPONENT` - Sets the currently selected component
- `SET_VIEWPORT_MODE` - Changes the viewport mode (desktop/tablet/mobile)
- `LOAD_STATE` - Loads a complete canvas state (for persistence)
- `UNDO` / `REDO` - Handled by history wrapper (not implemented in this task)

### `CanvasContext.tsx`
React Context provider and hooks for accessing canvas state.

**Exports:**
- `CanvasProvider` - Context provider component
- `useCanvasState()` - Hook to access both state and dispatch
- `useCanvas()` - Hook to access only the state
- `useCanvasDispatch()` - Hook to access only the dispatch function

### `index.ts`
Central export point for all state management utilities.

## Usage

### Setting up the Provider

Wrap your application with the `CanvasProvider`:

```tsx
import { CanvasProvider } from '@/state';

function App() {
  return (
    <CanvasProvider>
      <YourComponents />
    </CanvasProvider>
  );
}
```

### Using the Hooks

```tsx
import { useCanvasState, useCanvas, useCanvasDispatch } from '@/state';

// Get both state and dispatch
function MyComponent() {
  const { state, dispatch } = useCanvasState();
  
  // Add a component
  dispatch({
    type: 'ADD_COMPONENT',
    payload: { componentType: 'BioSection', position: 0 }
  });
}

// Get only state (for read-only components)
function DisplayComponent() {
  const state = useCanvas();
  return <div>{state.components.length} components</div>;
}

// Get only dispatch (for action components)
function ActionButton() {
  const dispatch = useCanvasDispatch();
  
  const handleClick = () => {
    dispatch({
      type: 'SET_VIEWPORT_MODE',
      payload: { mode: 'mobile' }
    });
  };
  
  return <button onClick={handleClick}>Mobile View</button>;
}
```

## State Structure

```typescript
interface CanvasState {
  components: ComponentInstance[];      // Array of components on the canvas
  selectedComponentId: string | null;   // Currently selected component ID
  viewportMode: ViewportMode;           // Current viewport mode
  projectMetadata: ProjectMetadata;     // Project information
}
```

## Testing

Tests are located in:
- `canvasReducer.test.ts` - Unit tests for the reducer
- `CanvasContext.test.tsx` - Tests for Context and hooks

Run tests with:
```bash
npm test -- src/state --run
```

## Implementation Notes

- **Component Ordering**: Components maintain an `order` property that determines their vertical sequence on the canvas. When components are added, deleted, or reordered, the reducer automatically adjusts the order values to maintain sequential ordering (0, 1, 2, ...).

- **Default Props**: When adding a component, the reducer automatically applies default properties from the component's schema definition.

- **Immutability**: The reducer follows immutability principles, always returning new state objects rather than mutating existing state.

- **Selection Management**: When a component is deleted, if it was selected, the selection is automatically cleared.

- **Timestamp Updates**: The `lastModified` timestamp in project metadata is automatically updated on state-changing actions.

## Requirements Validated

This implementation validates the following requirements from the spec:
- **1.4**: Canvas state updates when components are added
- **6.3**: Property modifications update canvas state
- **13.1**: Component selection updates state
- **13.4**: Component deletion removes from state
- **14.2**: Viewport mode changes update state
- **15.1**: Component ordering is maintained in state

## Next Steps

This implementation provides the foundation for:
- Task 3: History management for undo/redo (wraps this reducer)
- Task 11: Canvas renderer (consumes this state)
- Task 15: Properties panel (dispatches UPDATE_COMPONENT_PROPS actions)
- Task 17: Local storage persistence (uses LOAD_STATE action)
