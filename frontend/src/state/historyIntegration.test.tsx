/**
 * History Integration Tests
 * Tests the complete integration of history management with CanvasContext
 */

import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CanvasProvider, useCanvasState } from './CanvasContext';
import { ComponentType } from '@/types/canvas';

// Test component that uses the canvas context
function TestComponent() {
  const { state, dispatch } = useCanvasState();

  return (
    <div>
      <div data-testid="component-count">{state.components.length}</div>
      <button
        data-testid="add-component"
        onClick={() =>
          dispatch({
            type: 'ADD_COMPONENT',
            payload: { componentType: 'BioSection', position: 0 },
          })
        }
      >
        Add Component
      </button>
      <button
        data-testid="undo"
        onClick={() => dispatch({ type: 'UNDO' })}
      >
        Undo
      </button>
      <button
        data-testid="redo"
        onClick={() => dispatch({ type: 'REDO' })}
      >
        Redo
      </button>
    </div>
  );
}

describe('History Integration', () => {
  it('should integrate history with CanvasProvider', async () => {
    const { getByTestId } = render(
      <CanvasProvider>
        <TestComponent />
      </CanvasProvider>
    );

    const componentCount = getByTestId('component-count');
    const addButton = getByTestId('add-component');
    const undoButton = getByTestId('undo');
    const redoButton = getByTestId('redo');

    // Initial state
    expect(componentCount.textContent).toBe('0');

    // Add a component
    addButton.click();
    await waitFor(() => {
      expect(componentCount.textContent).toBe('1');
    });

    // Add another component
    addButton.click();
    await waitFor(() => {
      expect(componentCount.textContent).toBe('2');
    });

    // Undo
    undoButton.click();
    await waitFor(() => {
      expect(componentCount.textContent).toBe('1');
    });

    // Undo again
    undoButton.click();
    await waitFor(() => {
      expect(componentCount.textContent).toBe('0');
    });

    // Redo
    redoButton.click();
    await waitFor(() => {
      expect(componentCount.textContent).toBe('1');
    });

    // Redo again
    redoButton.click();
    await waitFor(() => {
      expect(componentCount.textContent).toBe('2');
    });
  });

  it('should clear future when new action is performed after undo', async () => {
    const { getByTestId } = render(
      <CanvasProvider>
        <TestComponent />
      </CanvasProvider>
    );

    const componentCount = getByTestId('component-count');
    const addButton = getByTestId('add-component');
    const undoButton = getByTestId('undo');
    const redoButton = getByTestId('redo');

    // Add two components
    addButton.click();
    await waitFor(() => {
      expect(componentCount.textContent).toBe('1');
    });

    addButton.click();
    await waitFor(() => {
      expect(componentCount.textContent).toBe('2');
    });

    // Undo
    undoButton.click();
    await waitFor(() => {
      expect(componentCount.textContent).toBe('1');
    });

    // Add a new component (should clear future)
    addButton.click();
    await waitFor(() => {
      expect(componentCount.textContent).toBe('2');
    });

    // Redo should not work (future was cleared)
    redoButton.click();
    await waitFor(() => {
      // Should still be 2
      expect(componentCount.textContent).toBe('2');
    });
  });

  it('should handle multiple undo/redo operations', async () => {
    const { getByTestId } = render(
      <CanvasProvider>
        <TestComponent />
      </CanvasProvider>
    );

    const componentCount = getByTestId('component-count');
    const addButton = getByTestId('add-component');
    const undoButton = getByTestId('undo');
    const redoButton = getByTestId('redo');

    // Add 5 components
    for (let i = 0; i < 5; i++) {
      addButton.click();
      await waitFor(() => {
        expect(componentCount.textContent).toBe(String(i + 1));
      });
    }

    // Undo 3 times
    for (let i = 0; i < 3; i++) {
      undoButton.click();
      await waitFor(() => {
        expect(componentCount.textContent).toBe(String(5 - i - 1));
      });
    }

    expect(componentCount.textContent).toBe('2');

    // Redo 2 times
    for (let i = 0; i < 2; i++) {
      redoButton.click();
      await waitFor(() => {
        expect(componentCount.textContent).toBe(String(2 + i + 1));
      });
    }

    expect(componentCount.textContent).toBe('4');
  });

  it('should not undo beyond initial state', async () => {
    const { getByTestId } = render(
      <CanvasProvider>
        <TestComponent />
      </CanvasProvider>
    );

    const componentCount = getByTestId('component-count');
    const addButton = getByTestId('add-component');
    const undoButton = getByTestId('undo');

    // Initial state
    expect(componentCount.textContent).toBe('0');

    // Try to undo (should have no effect)
    undoButton.click();
    await waitFor(() => {
      expect(componentCount.textContent).toBe('0');
    });

    // Add a component
    addButton.click();
    await waitFor(() => {
      expect(componentCount.textContent).toBe('1');
    });

    // Undo
    undoButton.click();
    await waitFor(() => {
      expect(componentCount.textContent).toBe('0');
    });

    // Try to undo again (should have no effect)
    undoButton.click();
    await waitFor(() => {
      expect(componentCount.textContent).toBe('0');
    });
  });

  it('should not redo when there is no future', async () => {
    const { getByTestId } = render(
      <CanvasProvider>
        <TestComponent />
      </CanvasProvider>
    );

    const componentCount = getByTestId('component-count');
    const addButton = getByTestId('add-component');
    const redoButton = getByTestId('redo');

    // Initial state
    expect(componentCount.textContent).toBe('0');

    // Try to redo (should have no effect)
    redoButton.click();
    await waitFor(() => {
      expect(componentCount.textContent).toBe('0');
    });

    // Add a component
    addButton.click();
    await waitFor(() => {
      expect(componentCount.textContent).toBe('1');
    });

    // Try to redo (should have no effect)
    redoButton.click();
    await waitFor(() => {
      expect(componentCount.textContent).toBe('1');
    });
  });
});
