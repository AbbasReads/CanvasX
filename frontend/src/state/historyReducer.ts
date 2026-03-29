/**
 * History Reducer
 * Implements undo/redo functionality with circular buffer
 * Wraps the canvas reducer to provide history management
 * Maintains a maximum of 50 states in history
 */

import type { CanvasState, CanvasAction, HistoryState } from '@/types/canvas';
import { canvasReducer } from './canvasReducer';

/**
 * Maximum number of states to keep in history
 */
const MAX_HISTORY_SIZE = 50;

/**
 * Create initial history state
 */
export function createInitialHistoryState(initialCanvasState: CanvasState): HistoryState {
  return {
    past: [],
    present: initialCanvasState,
    future: [],
    maxSize: MAX_HISTORY_SIZE,
  };
}

/**
 * Actions that should be recorded in history
 * These actions modify the canvas state in meaningful ways
 */
const RECORDABLE_ACTIONS = new Set([
  'ADD_COMPONENT',
  'UPDATE_COMPONENT_PROPS',
  'DELETE_COMPONENT',
  'REORDER_COMPONENT',
]);

/**
 * Actions that should not be recorded in history
 * These are either navigation actions or already handled by history
 */
const NON_RECORDABLE_ACTIONS = new Set([
  'SELECT_COMPONENT',
  'SET_VIEWPORT_MODE',
  'UNDO',
  'REDO',
  'LOAD_STATE',
]);

/**
 * Check if an action should be recorded in history
 */
function shouldRecordAction(action: CanvasAction): boolean {
  return RECORDABLE_ACTIONS.has(action.type);
}

/**
 * History reducer function
 * Wraps the canvas reducer and adds undo/redo functionality
 */
export function historyReducer(
  historyState: HistoryState,
  action: CanvasAction
): HistoryState {
  const { past, present, future } = historyState;

  switch (action.type) {
    case 'UNDO': {
      // Cannot undo if there's no past
      if (past.length === 0) {
        return historyState;
      }

      // Move the current state to future and restore the previous state
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        ...historyState,
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    }

    case 'REDO': {
      // Cannot redo if there's no future
      if (future.length === 0) {
        return historyState;
      }

      // Move the current state to past and restore the next state
      const next = future[0];
      const newFuture = future.slice(1);

      return {
        ...historyState,
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    }

    case 'LOAD_STATE': {
      // When loading a state, clear history and start fresh
      const newPresent = canvasReducer(present, action);
      return {
        ...historyState,
        past: [],
        present: newPresent,
        future: [],
      };
    }

    default: {
      // Apply the action to the present state
      const newPresent = canvasReducer(present, action);

      // If the state didn't change, don't record it
      if (newPresent === present) {
        return historyState;
      }

      // If this action should not be recorded, just update present
      if (NON_RECORDABLE_ACTIONS.has(action.type)) {
        return {
          ...historyState,
          present: newPresent,
        };
      }

      // If this action should be recorded, add current state to past
      if (shouldRecordAction(action)) {
        let newPast = [...past, present];

        // Implement circular buffer: if past exceeds max size, remove oldest
        if (newPast.length > MAX_HISTORY_SIZE) {
          newPast = newPast.slice(newPast.length - MAX_HISTORY_SIZE);
        }

        return {
          ...historyState,
          past: newPast,
          present: newPresent,
          future: [], // Clear future when a new action is performed
        };
      }

      // Default: just update present without recording
      return {
        ...historyState,
        present: newPresent,
      };
    }
  }
}
