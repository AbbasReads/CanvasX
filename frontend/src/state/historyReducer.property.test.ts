import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

import type { ComponentType } from '@/types/canvas';
import { createInitialCanvasState } from './canvasReducer';
import { createInitialHistoryState, historyReducer } from './historyReducer';

const ACADEMIC_COMPONENT_TYPES: ComponentType[] = [
  'GeneralInfo',
  'PublicationsCarousel',
  'PublicationsList',
  'ResearchAreasGrid',
  'TeachingTimeline',
  'ImageGallery',
  'ExternalLinksBar',
  'ContactCard',
  'EducationSection',
  'BioSection',
];

const componentTypeArbitrary = fc.constantFrom(...ACADEMIC_COMPONENT_TYPES);

describe('historyReducer property tests', () => {
  it('Property 18: Undo history never exceeds 50 states', () => {
    fc.assert(
      fc.property(
        fc.array(componentTypeArbitrary, { minLength: 0, maxLength: 200 }),
        (types) => {
          let historyState = createInitialHistoryState(createInitialCanvasState());

          for (let i = 0; i < types.length; i += 1) {
            historyState = historyReducer(historyState, {
              type: 'ADD_COMPONENT',
              payload: { componentType: types[i], position: i },
            });
          }

          expect(historyState.past.length).toBeLessThanOrEqual(50);
        }
      ),
      { numRuns: 120 }
    );
  });

  it('Property 19: Undo restores the immediate previous state', () => {
    fc.assert(
      fc.property(
        fc.array(componentTypeArbitrary, { minLength: 1, maxLength: 60 }),
        (types) => {
          let historyState = createInitialHistoryState(createInitialCanvasState());

          for (let i = 0; i < types.length; i += 1) {
            historyState = historyReducer(historyState, {
              type: 'ADD_COMPONENT',
              payload: { componentType: types[i], position: i },
            });
          }

          const beforeUndo = historyState;
          const previousPresent = beforeUndo.past[beforeUndo.past.length - 1];
          const undone = historyReducer(beforeUndo, { type: 'UNDO' });

          expect(undone.present).toEqual(previousPresent);
          expect(undone.future[0]).toEqual(beforeUndo.present);
        }
      ),
      { numRuns: 120 }
    );
  });

  it('Property 20: Redo restores the state that was undone', () => {
    fc.assert(
      fc.property(
        fc.array(componentTypeArbitrary, { minLength: 1, maxLength: 60 }),
        (types) => {
          let historyState = createInitialHistoryState(createInitialCanvasState());

          for (let i = 0; i < types.length; i += 1) {
            historyState = historyReducer(historyState, {
              type: 'ADD_COMPONENT',
              payload: { componentType: types[i], position: i },
            });
          }

          const beforeUndo = historyState;
          const afterUndo = historyReducer(beforeUndo, { type: 'UNDO' });
          const afterRedo = historyReducer(afterUndo, { type: 'REDO' });

          expect(afterRedo.present).toEqual(beforeUndo.present);
          expect(afterRedo.past.length).toBe(beforeUndo.past.length);
          expect(afterRedo.future.length).toBe(beforeUndo.future.length);
        }
      ),
      { numRuns: 120 }
    );
  });
});
