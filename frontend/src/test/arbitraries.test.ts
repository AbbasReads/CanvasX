import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

import { COMPONENT_SCHEMAS } from '@/lib/componentSchemas';
import type { PropDefinition } from '@/types/canvas';
import {
  arbitraryCanvasState,
  arbitraryColorPair,
  arbitraryComponentInstance,
  arbitraryComponentType,
  arbitraryPropertyValue,
  arbitraryPublicationEntry,
  arbitraryViewportMode,
} from './arbitraries';

describe('fast-check arbitraries', () => {
  it('arbitraryComponentType generates only supported component types', () => {
    fc.assert(
      fc.property(arbitraryComponentType(), (componentType) => {
        expect(COMPONENT_SCHEMAS[componentType]).toBeDefined();
      }),
      { numRuns: 120 }
    );
  });

  it('arbitraryViewportMode generates valid viewport modes', () => {
    fc.assert(
      fc.property(arbitraryViewportMode(), (viewportMode) => {
        expect(['desktop', 'tablet', 'mobile']).toContain(viewportMode);
      }),
      { numRuns: 120 }
    );
  });

  it('arbitraryPublicationEntry respects required publication constraints', () => {
    fc.assert(
      fc.property(arbitraryPublicationEntry(), (publication) => {
        expect(publication.id.length).toBeGreaterThan(0);
        expect(publication.title.length).toBeGreaterThan(0);
        expect(publication.authors.length).toBeGreaterThan(0);
        expect(publication.venue.length).toBeGreaterThan(0);
        expect(publication.year).toBeGreaterThanOrEqual(1900);
      }),
      { numRuns: 120 }
    );
  });

  it('arbitraryColorPair generates hex color strings', () => {
    const hexPattern = /^#[0-9a-fA-F]{6}$/;

    fc.assert(
      fc.property(arbitraryColorPair(), (colors) => {
        expect(hexPattern.test(colors.textColor)).toBe(true);
        expect(hexPattern.test(colors.backgroundColor)).toBe(true);
      }),
      { numRuns: 120 }
    );
  });

  it('arbitraryComponentInstance contains schema-defined props', () => {
    fc.assert(
      fc.property(arbitraryComponentInstance(), (instance) => {
        const schema = COMPONENT_SCHEMAS[instance.type];
        const propNames = schema.propDefinitions.map(prop => prop.name);

        for (const propName of propNames) {
          expect(instance.props).toHaveProperty(propName);
        }
      }),
      { numRuns: 120 }
    );
  });

  it('arbitraryCanvasState generates sequential orders and valid selection', () => {
    fc.assert(
      fc.property(arbitraryCanvasState(), (state) => {
        const orders = state.components.map(component => component.order);
        expect(orders).toEqual([...Array(state.components.length).keys()]);

        const ids = state.components.map(component => component.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);

        if (state.selectedComponentId !== null) {
          expect(ids).toContain(state.selectedComponentId);
        }
      }),
      { numRuns: 120 }
    );
  });

  it('arbitraryPropertyValue respects number min/max rules', () => {
    const numberProp: PropDefinition = {
      name: 'year',
      type: 'number',
      label: 'Year',
      defaultValue: 2026,
      validation: [
        { type: 'min', value: 1900, message: 'min year' },
        { type: 'max', value: 2100, message: 'max year' },
      ],
    };

    fc.assert(
      fc.property(arbitraryPropertyValue(numberProp), (value) => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThanOrEqual(1900);
        expect(value).toBeLessThanOrEqual(2100);
      }),
      { numRuns: 120 }
    );
  });
});
