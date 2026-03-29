import fc from 'fast-check';

import { COMPONENT_SCHEMAS } from '@/lib/componentSchemas';
import type {
  CanvasState,
  ComponentInstance,
  ComponentType,
  PropDefinition,
  ViewportMode,
} from '@/types/canvas';
import type { PublicationEntry } from '@/types/components';

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

function hexColorArbitrary(): fc.Arbitrary<string> {
  return fc
    .tuple(fc.integer({ min: 0, max: 255 }), fc.integer({ min: 0, max: 255 }), fc.integer({ min: 0, max: 255 }))
    .map(([r, g, b]) => {
      const toHex = (value: number) => value.toString(16).padStart(2, '0');
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    });
}

export function arbitraryComponentType(): fc.Arbitrary<ComponentType> {
  return fc.constantFrom(...ACADEMIC_COMPONENT_TYPES);
}

export function arbitraryViewportMode(): fc.Arbitrary<ViewportMode> {
  return fc.constantFrom('desktop', 'tablet', 'mobile');
}

export function arbitraryPublicationEntry(): fc.Arbitrary<PublicationEntry> {
  return fc.record({
    id: fc.uuid(),
    title: fc.string({ minLength: 1, maxLength: 120 }),
    authors: fc.string({ minLength: 1, maxLength: 160 }),
    venue: fc.string({ minLength: 1, maxLength: 120 }),
    year: fc.integer({ min: 1900, max: 2100 }),
    doi: fc.option(fc.string({ minLength: 1, maxLength: 120 }), { nil: undefined }),
    abstract: fc.option(fc.string({ minLength: 1, maxLength: 2000 }), { nil: undefined }),
    pdfUrl: fc.option(fc.webUrl(), { nil: undefined }),
    externalUrl: fc.option(fc.webUrl(), { nil: undefined }),
  });
}

export function arbitraryColorPair(): fc.Arbitrary<{ textColor: string; backgroundColor: string }> {
  return fc.record({
    textColor: hexColorArbitrary(),
    backgroundColor: hexColorArbitrary(),
  });
}

export function arbitraryPropertyValue(propDef: PropDefinition): fc.Arbitrary<unknown> {
  switch (propDef.type) {
    case 'text':
      return fc.string({ minLength: 0, maxLength: 240 });
    case 'textarea':
      return fc.string({ minLength: 0, maxLength: 2000 });
    case 'number': {
      const minRule = propDef.validation?.find(rule => rule.type === 'min');
      const maxRule = propDef.validation?.find(rule => rule.type === 'max');
      const min = typeof minRule?.value === 'number' ? minRule.value : -10000;
      const max = typeof maxRule?.value === 'number' ? maxRule.value : 10000;
      return fc.integer({ min, max });
    }
    case 'color':
      return hexColorArbitrary();
    case 'url':
    case 'image':
      return fc.oneof(fc.constant(''), fc.webUrl());
    case 'select': {
      const defaultValue = propDef.defaultValue;
      if (typeof defaultValue === 'boolean') {
        return fc.boolean();
      }
      if (typeof defaultValue === 'number') {
        return fc.integer({ min: -1000, max: 1000 });
      }
      if (typeof defaultValue === 'string') {
        return fc.oneof(fc.constant(defaultValue), fc.string({ minLength: 0, maxLength: 120 }));
      }
      return fc.anything();
    }
    case 'array': {
      const schema = propDef.arrayItemSchema ?? [];
      if (schema.length === 0) {
        return fc.array(fc.anything(), { maxLength: 8 });
      }

      const recordShape: Record<string, fc.Arbitrary<unknown>> = {};
      for (const itemDef of schema) {
        recordShape[itemDef.name] = arbitraryPropertyValue(itemDef);
      }

      return fc.array(fc.record(recordShape), { maxLength: 8 });
    }
    default:
      return fc.anything();
  }
}

function componentPropsArbitrary(type: ComponentType): fc.Arbitrary<Record<string, unknown>> {
  const schema = COMPONENT_SCHEMAS[type];
  const recordShape: Record<string, fc.Arbitrary<unknown>> = {};

  for (const propDef of schema.propDefinitions) {
    recordShape[propDef.name] = arbitraryPropertyValue(propDef);
  }

  return fc.record(recordShape).map(props => ({
    ...schema.defaultProps,
    ...props,
  }));
}

export function arbitraryComponentInstance(type?: ComponentType): fc.Arbitrary<ComponentInstance> {
  const typeArbitrary = type ? fc.constant(type) : arbitraryComponentType();

  return typeArbitrary.chain((nextType) =>
    fc.record({
      id: fc.uuid(),
      type: fc.constant(nextType),
      props: componentPropsArbitrary(nextType),
      order: fc.nat(200),
    })
  );
}

export function arbitraryCanvasState(): fc.Arbitrary<CanvasState> {
  const componentArbitrary = arbitraryComponentType().chain(type => arbitraryComponentInstance(type));

  return fc.array(componentArbitrary, { minLength: 0, maxLength: 12 }).chain((components) => {
    const normalizedComponents = components.map((component, index) => ({
      ...component,
      id: `${component.id}-${index}`,
      order: index,
    }));

    const selectedIdArbitrary =
      normalizedComponents.length === 0
        ? fc.constant<string | null>(null)
        : fc.option(fc.constantFrom(...normalizedComponents.map(component => component.id)), { nil: null });

    return fc
      .tuple(
        selectedIdArbitrary,
        arbitraryViewportMode(),
        fc.string({ maxLength: 80 }),
        fc.string({ maxLength: 120 }),
        fc.uuid(),
        fc.integer({ min: 0, max: Number.MAX_SAFE_INTEGER })
      )
      .map(([selectedComponentId, viewportMode, professorName, portfolioTitle, projectId, lastModified]) => ({
        components: normalizedComponents,
        selectedComponentId,
        viewportMode,
        projectMetadata: {
          professorName,
          portfolioTitle,
          projectId,
          lastModified,
        },
      }));
  });
}
