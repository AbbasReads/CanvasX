import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

import { COMPONENT_SCHEMAS } from '@/lib/componentSchemas';
import type { ComponentType } from '@/types/canvas';
import { canvasReducer, createInitialCanvasState } from './canvasReducer';

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

function getOrderedIds(state: ReturnType<typeof createInitialCanvasState>): string[] {
  return [...state.components]
    .sort((a, b) => a.order - b.order)
    .map(component => component.id);
}

describe('canvasReducer property tests', () => {
  it('Property 1: Component addition preserves default props', () => {
    fc.assert(
      fc.property(componentTypeArbitrary, (componentType) => {
        const state = createInitialCanvasState();

        const nextState = canvasReducer(state, {
          type: 'ADD_COMPONENT',
          payload: { componentType, position: 0 },
        });

        expect(nextState.components).toHaveLength(1);
        expect(nextState.components[0].props).toEqual(COMPONENT_SCHEMAS[componentType].defaultProps);
      }),
      { numRuns: 120 }
    );
  });

  it('Property 2: Reordering updates sequence without losing components', () => {
    fc.assert(
      fc.property(
        fc.array(componentTypeArbitrary, { minLength: 2, maxLength: 20 }),
        fc.nat(),
        fc.nat(),
        (types, rawFrom, rawTo) => {
          let state = createInitialCanvasState();

          for (let i = 0; i < types.length; i += 1) {
            state = canvasReducer(state, {
              type: 'ADD_COMPONENT',
              payload: { componentType: types[i], position: i },
            });
          }

          const beforeOrderedIds = getOrderedIds(state);
          const from = rawFrom % types.length;
          const to = rawTo % types.length;
          const movingId = beforeOrderedIds[from];

          const reorderedState = canvasReducer(state, {
            type: 'REORDER_COMPONENT',
            payload: { componentId: movingId, newPosition: to },
          });

          const afterOrderedIds = getOrderedIds(reorderedState);
          const expectedOrder = [...beforeOrderedIds];
          const [moved] = expectedOrder.splice(from, 1);
          expectedOrder.splice(to, 0, moved);

          expect(afterOrderedIds).toEqual(expectedOrder);

          const orders = reorderedState.components
            .map(component => component.order)
            .sort((a, b) => a - b);
          expect(orders).toEqual([...Array(types.length).keys()]);
        }
      ),
      { numRuns: 120 }
    );
  });

  it('Property 3: Added components always receive unique identifiers', () => {
    fc.assert(
      fc.property(
        fc.array(componentTypeArbitrary, { minLength: 1, maxLength: 100 }),
        (types) => {
          let state = createInitialCanvasState();

          for (let i = 0; i < types.length; i += 1) {
            state = canvasReducer(state, {
              type: 'ADD_COMPONENT',
              payload: { componentType: types[i], position: i },
            });
          }

          const ids = state.components.map(component => component.id);
          const uniqueIds = new Set(ids);

          expect(uniqueIds.size).toBe(ids.length);
        }
      ),
      { numRuns: 120 }
    );
  });

  it('Property 22: Component deletion removes item and keeps sequence contiguous', () => {
    fc.assert(
      fc.property(
        fc.array(componentTypeArbitrary, { minLength: 1, maxLength: 40 }),
        fc.nat(),
        (types, rawDeleteIndex) => {
          let state = createInitialCanvasState();

          for (let i = 0; i < types.length; i += 1) {
            state = canvasReducer(state, {
              type: 'ADD_COMPONENT',
              payload: { componentType: types[i], position: i },
            });
          }

          const orderedBefore = [...state.components].sort((a, b) => a.order - b.order);
          const deleteIndex = rawDeleteIndex % types.length;
          const toDelete = orderedBefore[deleteIndex];

          const deletedState = canvasReducer(state, {
            type: 'DELETE_COMPONENT',
            payload: { componentId: toDelete.id },
          });

          expect(deletedState.components).toHaveLength(types.length - 1);
          expect(deletedState.components.some(component => component.id === toDelete.id)).toBe(false);

          const orders = deletedState.components
            .map(component => component.order)
            .sort((a, b) => a - b);
          expect(orders).toEqual([...Array(types.length - 1).keys()]);
        }
      ),
      { numRuns: 120 }
    );
  });
});
