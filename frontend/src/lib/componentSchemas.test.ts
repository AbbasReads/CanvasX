import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { COMPONENT_SCHEMAS, ComponentRegistry, componentRegistry } from './componentSchemas';
import type { ComponentType } from '@/types/canvas';

describe('Component Schemas', () => {
  describe('COMPONENT_SCHEMAS', () => {
    it('should have schemas for all 10 academic components', () => {
      const expectedTypes: ComponentType[] = [
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

      expectedTypes.forEach((type) => {
        expect(COMPONENT_SCHEMAS[type]).toBeDefined();
        expect(COMPONENT_SCHEMAS[type].type).toBe(type);
      });
    });

    it('should have non-empty propDefinitions for all components', () => {
      Object.values(COMPONENT_SCHEMAS).forEach((schema) => {
        expect(schema.propDefinitions).toBeDefined();
        expect(schema.propDefinitions.length).toBeGreaterThan(0);
      });
    });

    it('should have defaultProps matching propDefinitions', () => {
      Object.values(COMPONENT_SCHEMAS).forEach((schema) => {
        const propNames = schema.propDefinitions.map((p) => p.name);
        const defaultPropKeys = Object.keys(schema.defaultProps);

        // All propDefinitions should have corresponding defaultProps
        propNames.forEach((name) => {
          expect(defaultPropKeys).toContain(name);
        });
      });
    });

    it('should have valid array schemas for array-type properties', () => {
      const schemasWithArrays = [
        'PublicationsCarousel',
        'PublicationsList',
        'ResearchAreasGrid',
        'TeachingTimeline',
        'ImageGallery',
        'EducationSection',
      ];

      schemasWithArrays.forEach((type) => {
        const schema = COMPONENT_SCHEMAS[type as ComponentType];
        const arrayProps = schema.propDefinitions.filter((p) => p.type === 'array');
        
        expect(arrayProps.length).toBeGreaterThan(0);
        
        arrayProps.forEach((prop) => {
          expect(prop.arrayItemSchema).toBeDefined();
          expect(prop.arrayItemSchema!.length).toBeGreaterThan(0);
        });
      });
    });

    it('Property 4: Component library completeness', () => {
      const expectedTypes: ComponentType[] = [
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

      fc.assert(
        fc.property(fc.constantFrom(...expectedTypes), (componentType) => {
          const schema = COMPONENT_SCHEMAS[componentType];

          expect(schema).toBeDefined();
          expect(schema.type).toBe(componentType);
          expect(schema.displayName.length).toBeGreaterThan(0);
          expect(schema.description.length).toBeGreaterThan(0);
          expect(Object.keys(schema.defaultProps).length).toBeGreaterThan(0);
          expect(schema.propDefinitions.length).toBeGreaterThan(0);
        }),
        { numRuns: 120 }
      );
    });
  });

  describe('ComponentRegistry', () => {
    let registry: ComponentRegistry;

    beforeEach(() => {
      registry = new ComponentRegistry();
    });

    it('should initialize with all schemas', () => {
      const allTypes = registry.getAllTypes();
      expect(allTypes).toHaveLength(10);
    });

    it('should get schema for valid component type', () => {
      const schema = registry.getSchema('BioSection');
      expect(schema).toBeDefined();
      expect(schema.type).toBe('BioSection');
      expect(schema.displayName).toBe('Bio Section');
    });

    it('should throw error for invalid component type', () => {
      expect(() => {
        registry.getSchema('InvalidType' as ComponentType);
      }).toThrow('Schema not found for component type: InvalidType');
    });

    it('should create instance with unique ID and default props', () => {
      const instance1 = registry.createInstance('BioSection');
      const instance2 = registry.createInstance('BioSection');

      expect(instance1.id).not.toBe(instance2.id);
      expect(instance1.type).toBe('BioSection');
      expect(instance1.props).toEqual(COMPONENT_SCHEMAS.BioSection.defaultProps);
      expect(instance1.order).toBe(0);
    });

    it('should check if component type exists', () => {
      expect(registry.hasType('BioSection')).toBe(true);
      expect(registry.hasType('InvalidType' as ComponentType)).toBe(false);
    });

    it('should get all schemas', () => {
      const schemas = registry.getAllSchemas();
      expect(schemas).toHaveLength(10);
      schemas.forEach((schema) => {
        expect(schema.type).toBeDefined();
        expect(schema.displayName).toBeDefined();
        expect(schema.propDefinitions).toBeDefined();
      });
    });
  });

  describe('Singleton componentRegistry', () => {
    it('should export a singleton instance', () => {
      expect(componentRegistry).toBeInstanceOf(ComponentRegistry);
      expect(componentRegistry.getAllTypes()).toHaveLength(10);
    });
  });

  describe('Specific Component Schemas', () => {
    it('GeneralInfo should have correct structure', () => {
      const schema = COMPONENT_SCHEMAS.GeneralInfo;
      expect(schema.defaultProps.name).toBe('Professor Name');
      expect(schema.propDefinitions.find((p) => p.name === 'name')).toBeDefined();
      expect(schema.propDefinitions.find((p) => p.name === 'institution')).toBeDefined();
    });

    it('PublicationsCarousel should have publications array with correct schema', () => {
      const schema = COMPONENT_SCHEMAS.PublicationsCarousel;
      const publicationsProp = schema.propDefinitions.find((p) => p.name === 'publications');
      
      expect(publicationsProp).toBeDefined();
      expect(publicationsProp!.type).toBe('array');
      expect(publicationsProp!.arrayItemSchema).toBeDefined();
      
      const itemSchema = publicationsProp!.arrayItemSchema!;
      expect(itemSchema.find((p) => p.name === 'title')).toBeDefined();
      expect(itemSchema.find((p) => p.name === 'authors')).toBeDefined();
      expect(itemSchema.find((p) => p.name === 'venue')).toBeDefined();
      expect(itemSchema.find((p) => p.name === 'year')).toBeDefined();
    });

    it('ExternalLinksBar should have URL fields for all platforms', () => {
      const schema = COMPONENT_SCHEMAS.ExternalLinksBar;
      const urlFields = [
        'googleScholarUrl',
        'researchGateUrl',
        'linkedInUrl',
        'orcidUrl',
        'githubUrl',
        'personalWebsiteUrl',
      ];

      urlFields.forEach((field) => {
        const prop = schema.propDefinitions.find((p) => p.name === field);
        expect(prop).toBeDefined();
        expect(prop!.type).toBe('url');
      });
    });

    it('ContactCard should have email validation', () => {
      const schema = COMPONENT_SCHEMAS.ContactCard;
      const emailProp = schema.propDefinitions.find((p) => p.name === 'email');
      
      expect(emailProp).toBeDefined();
      expect(emailProp!.validation).toBeDefined();
      expect(emailProp!.validation!.some((v) => v.type === 'email')).toBe(true);
    });

    it('TeachingTimeline should have sortOrder property', () => {
      const schema = COMPONENT_SCHEMAS.TeachingTimeline;
      const sortOrderProp = schema.propDefinitions.find((p) => p.name === 'sortOrder');
      
      expect(sortOrderProp).toBeDefined();
      expect(schema.defaultProps.sortOrder).toBe('reverse-chronological');
    });

    it('BioSection should have imagePosition and imageSize properties', () => {
      const schema = COMPONENT_SCHEMAS.BioSection;
      
      expect(schema.propDefinitions.find((p) => p.name === 'imagePosition')).toBeDefined();
      expect(schema.propDefinitions.find((p) => p.name === 'imageSize')).toBeDefined();
      expect(schema.defaultProps.imagePosition).toBe('left');
      expect(schema.defaultProps.imageSize).toBe('medium');
    });
  });
});
