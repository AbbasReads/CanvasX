import React from 'react';
import { z } from 'zod';
import type { ComponentSchema, ComponentType, ComponentInstance } from '@/types/canvas';

// Button component props schema
export const ButtonPropsSchema = z.object({
    text: z.string().default('Click me'),
    backgroundColor: z.string().default('#3b82f6'),
    textColor: z.string().default('#ffffff'),
    borderRadius: z.number().default(8),
    fontSize: z.number().default(14),
    variant: z.enum(['primary', 'secondary', 'outline', 'ghost']).default('primary'),
});

export type ButtonProps = z.infer<typeof ButtonPropsSchema>;

// Text component props schema
export const TextPropsSchema = z.object({
    content: z.string().default('Enter your text here'),
    fontSize: z.number().default(16),
    fontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('normal'),
    color: z.string().default('#ffffff'),
    textAlign: z.enum(['left', 'center', 'right']).default('left'),
});

export type TextProps = z.infer<typeof TextPropsSchema>;

// Hero section props schema
export const HeroPropsSchema = z.object({
    title: z.string().default('Welcome to Our Platform'),
    subtitle: z.string().default('Build amazing things with our tools'),
    primaryButtonText: z.string().default('Get Started'),
    secondaryButtonText: z.string().default('Learn More'),
    backgroundGradient: z.string().default('linear-gradient(135deg, #667eea 0%, #764ba2 100%)'),
    textColor: z.string().default('#ffffff'),
});

export type HeroProps = z.infer<typeof HeroPropsSchema>;

// Navbar props schema
export const NavbarPropsSchema = z.object({
    brand: z.string().default('Brand'),
    links: z.array(z.string()).default(['Home', 'About', 'Services', 'Contact']),
    backgroundColor: z.string().default('#1a1a2e'),
    textColor: z.string().default('#ffffff'),
});

export type NavbarProps = z.infer<typeof NavbarPropsSchema>;

// Section props schema
export const SectionPropsSchema = z.object({
    backgroundColor: z.string().default('#1e1e2f'),
    padding: z.number().default(24),
    borderRadius: z.number().default(12),
    borderColor: z.string().default('rgba(255, 255, 255, 0.1)'),
});

export type SectionProps = z.infer<typeof SectionPropsSchema>;

// Image props schema
export const ImagePropsSchema = z.object({
    src: z.string().default('/placeholder.jpg'),
    alt: z.string().default('Image'),
    objectFit: z.enum(['cover', 'contain', 'fill', 'none']).default('cover'),
    borderRadius: z.number().default(8),
});

export type ImageProps = z.infer<typeof ImagePropsSchema>;

// Card props schema
export const CardPropsSchema = z.object({
    title: z.string().default('Card Title'),
    description: z.string().default('This is a card description'),
    buttonText: z.string().default('Learn More'),
    backgroundColor: z.string().default('#1e1e2f'),
    accentColor: z.string().default('#3b82f6'),
});

export type CardProps = z.infer<typeof CardPropsSchema>;

// Combined element properties type
export type ElementProperties = {
    button?: ButtonProps;
    text?: TextProps;
    hero?: HeroProps;
    navbar?: NavbarProps;
    section?: SectionProps;
    image?: ImageProps;
    card?: CardProps;
};

/**
 * Academic Portfolio Component Schemas
 * Complete schemas with propDefinitions for all 10 academic components
 */
export const COMPONENT_SCHEMAS: Record<ComponentType, ComponentSchema> = {
  GeneralInfo: {
    type: 'GeneralInfo',
    displayName: 'General Info',
    description: 'Basic profile information section',
    defaultProps: {
      name: 'Professor Name',
      title: 'Professor',
      institution: 'University Name',
      department: 'Department',
      profileImageUrl: '',
    },
    propDefinitions: [
      {
        name: 'name',
        type: 'text',
        label: 'Name',
        defaultValue: 'Professor Name',
        validation: [{ type: 'required', message: 'Name is required' }],
      },
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        defaultValue: 'Professor',
        validation: [{ type: 'required', message: 'Title is required' }],
      },
      {
        name: 'institution',
        type: 'text',
        label: 'Institution',
        defaultValue: 'University Name',
        validation: [{ type: 'required', message: 'Institution is required' }],
      },
      {
        name: 'department',
        type: 'text',
        label: 'Department',
        defaultValue: 'Department',
      },
      {
        name: 'profileImageUrl',
        type: 'url',
        label: 'Profile Image URL',
        defaultValue: '',
        validation: [{ type: 'url', message: 'Must be a valid URL' }],
      },
    ],
    supportsResize: false,
  },
  PublicationsCarousel: {
    type: 'PublicationsCarousel',
    displayName: 'Publications Carousel',
    description: 'Carousel display for publications',
    defaultProps: {
      publications: [],
      showAbstract: false,
      accentColor: '#3b82f6',
    },
    propDefinitions: [
      {
        name: 'publications',
        type: 'array',
        label: 'Publications',
        defaultValue: [],
        arrayItemSchema: [
          {
            name: 'title',
            type: 'text',
            label: 'Title',
            defaultValue: '',
            validation: [{ type: 'required', message: 'Title is required' }],
          },
          {
            name: 'authors',
            type: 'text',
            label: 'Authors',
            defaultValue: '',
            validation: [{ type: 'required', message: 'Authors are required' }],
          },
          {
            name: 'venue',
            type: 'text',
            label: 'Venue',
            defaultValue: '',
            validation: [{ type: 'required', message: 'Venue is required' }],
          },
          {
            name: 'year',
            type: 'number',
            label: 'Year',
            defaultValue: new Date().getFullYear(),
            validation: [
              { type: 'required', message: 'Year is required' },
              { type: 'min', value: 1900, message: 'Year must be after 1900' },
            ],
          },
          {
            name: 'doi',
            type: 'text',
            label: 'DOI',
            defaultValue: '',
          },
          {
            name: 'abstract',
            type: 'textarea',
            label: 'Abstract',
            defaultValue: '',
          },
          {
            name: 'pdfUrl',
            type: 'url',
            label: 'PDF URL',
            defaultValue: '',
            validation: [{ type: 'url', message: 'Must be a valid URL' }],
          },
          {
            name: 'externalUrl',
            type: 'url',
            label: 'External URL',
            defaultValue: '',
            validation: [{ type: 'url', message: 'Must be a valid URL' }],
          },
        ],
      },
      {
        name: 'showAbstract',
        type: 'select',
        label: 'Show Abstract',
        defaultValue: false,
      },
      {
        name: 'accentColor',
        type: 'color',
        label: 'Accent Color',
        defaultValue: '#3b82f6',
      },
    ],
    supportsResize: false,
  },
  PublicationsList: {
    type: 'PublicationsList',
    displayName: 'Publications List',
    description: 'List display for publications',
    defaultProps: {
      publications: [],
      showAbstract: false,
      groupByYear: true,
    },
    propDefinitions: [
      {
        name: 'publications',
        type: 'array',
        label: 'Publications',
        defaultValue: [],
        arrayItemSchema: [
          {
            name: 'title',
            type: 'text',
            label: 'Title',
            defaultValue: '',
            validation: [{ type: 'required', message: 'Title is required' }],
          },
          {
            name: 'authors',
            type: 'text',
            label: 'Authors',
            defaultValue: '',
            validation: [{ type: 'required', message: 'Authors are required' }],
          },
          {
            name: 'venue',
            type: 'text',
            label: 'Venue',
            defaultValue: '',
            validation: [{ type: 'required', message: 'Venue is required' }],
          },
          {
            name: 'year',
            type: 'number',
            label: 'Year',
            defaultValue: new Date().getFullYear(),
            validation: [
              { type: 'required', message: 'Year is required' },
              { type: 'min', value: 1900, message: 'Year must be after 1900' },
            ],
          },
          {
            name: 'doi',
            type: 'text',
            label: 'DOI',
            defaultValue: '',
          },
          {
            name: 'abstract',
            type: 'textarea',
            label: 'Abstract',
            defaultValue: '',
          },
          {
            name: 'pdfUrl',
            type: 'url',
            label: 'PDF URL',
            defaultValue: '',
            validation: [{ type: 'url', message: 'Must be a valid URL' }],
          },
          {
            name: 'externalUrl',
            type: 'url',
            label: 'External URL',
            defaultValue: '',
            validation: [{ type: 'url', message: 'Must be a valid URL' }],
          },
        ],
      },
      {
        name: 'showAbstract',
        type: 'select',
        label: 'Show Abstract',
        defaultValue: false,
      },
      {
        name: 'groupByYear',
        type: 'select',
        label: 'Group By Year',
        defaultValue: true,
      },
    ],
    supportsResize: false,
  },
  ResearchAreasGrid: {
    type: 'ResearchAreasGrid',
    displayName: 'Research Areas Grid',
    description: 'Grid display for research areas',
    defaultProps: {
      areas: [],
      columns: 3,
      showDescriptions: true,
    },
    propDefinitions: [
      {
        name: 'areas',
        type: 'array',
        label: 'Research Areas',
        defaultValue: [],
        arrayItemSchema: [
          {
            name: 'name',
            type: 'text',
            label: 'Area Name',
            defaultValue: '',
            validation: [{ type: 'required', message: 'Area name is required' }],
          },
          {
            name: 'description',
            type: 'textarea',
            label: 'Description',
            defaultValue: '',
          },
        ],
      },
      {
        name: 'columns',
        type: 'select',
        label: 'Columns',
        defaultValue: 3,
      },
      {
        name: 'showDescriptions',
        type: 'select',
        label: 'Show Descriptions',
        defaultValue: true,
      },
    ],
    supportsResize: false,
  },
  TeachingTimeline: {
    type: 'TeachingTimeline',
    displayName: 'Teaching Timeline',
    description: 'Timeline display for teaching experience',
    defaultProps: {
      entries: [],
      sortOrder: 'reverse-chronological',
    },
    propDefinitions: [
      {
        name: 'entries',
        type: 'array',
        label: 'Teaching Entries',
        defaultValue: [],
        arrayItemSchema: [
          {
            name: 'courseName',
            type: 'text',
            label: 'Course Name',
            defaultValue: '',
            validation: [{ type: 'required', message: 'Course name is required' }],
          },
          {
            name: 'institution',
            type: 'text',
            label: 'Institution',
            defaultValue: '',
            validation: [{ type: 'required', message: 'Institution is required' }],
          },
          {
            name: 'semester',
            type: 'text',
            label: 'Semester',
            defaultValue: '',
            validation: [{ type: 'required', message: 'Semester is required' }],
          },
          {
            name: 'year',
            type: 'number',
            label: 'Year',
            defaultValue: new Date().getFullYear(),
            validation: [
              { type: 'required', message: 'Year is required' },
              { type: 'min', value: 1900, message: 'Year must be after 1900' },
            ],
          },
          {
            name: 'description',
            type: 'textarea',
            label: 'Description',
            defaultValue: '',
          },
        ],
      },
      {
        name: 'sortOrder',
        type: 'select',
        label: 'Sort Order',
        defaultValue: 'reverse-chronological',
      },
    ],
    supportsResize: false,
  },
  ImageGallery: {
    type: 'ImageGallery',
    displayName: 'Image Gallery',
    description: 'Gallery display for images',
    defaultProps: {
      images: [],
      columns: 3,
      imageAspectRatio: 'square',
    },
    propDefinitions: [
      {
        name: 'images',
        type: 'array',
        label: 'Images',
        defaultValue: [],
        arrayItemSchema: [
          {
            name: 'url',
            type: 'url',
            label: 'Image URL',
            defaultValue: '',
            validation: [
              { type: 'required', message: 'Image URL is required' },
              { type: 'url', message: 'Must be a valid URL' },
            ],
          },
          {
            name: 'caption',
            type: 'text',
            label: 'Caption',
            defaultValue: '',
          },
        ],
      },
      {
        name: 'columns',
        type: 'select',
        label: 'Columns',
        defaultValue: 3,
      },
      {
        name: 'imageAspectRatio',
        type: 'select',
        label: 'Image Aspect Ratio',
        defaultValue: 'square',
      },
    ],
    supportsResize: false,
  },
  ExternalLinksBar: {
    type: 'ExternalLinksBar',
    displayName: 'External Links Bar',
    description: 'Bar with links to external academic profiles',
    defaultProps: {
      googleScholarUrl: '',
      researchGateUrl: '',
      linkedInUrl: '',
      orcidUrl: '',
      githubUrl: '',
      personalWebsiteUrl: '',
      iconSize: 'medium',
      alignment: 'center',
    },
    propDefinitions: [
      {
        name: 'googleScholarUrl',
        type: 'url',
        label: 'Google Scholar URL',
        defaultValue: '',
        validation: [{ type: 'url', message: 'Must be a valid URL' }],
      },
      {
        name: 'researchGateUrl',
        type: 'url',
        label: 'ResearchGate URL',
        defaultValue: '',
        validation: [{ type: 'url', message: 'Must be a valid URL' }],
      },
      {
        name: 'linkedInUrl',
        type: 'url',
        label: 'LinkedIn URL',
        defaultValue: '',
        validation: [{ type: 'url', message: 'Must be a valid URL' }],
      },
      {
        name: 'orcidUrl',
        type: 'url',
        label: 'ORCID URL',
        defaultValue: '',
        validation: [{ type: 'url', message: 'Must be a valid URL' }],
      },
      {
        name: 'githubUrl',
        type: 'url',
        label: 'GitHub URL',
        defaultValue: '',
        validation: [{ type: 'url', message: 'Must be a valid URL' }],
      },
      {
        name: 'personalWebsiteUrl',
        type: 'url',
        label: 'Personal Website URL',
        defaultValue: '',
        validation: [{ type: 'url', message: 'Must be a valid URL' }],
      },
      {
        name: 'iconSize',
        type: 'select',
        label: 'Icon Size',
        defaultValue: 'medium',
      },
      {
        name: 'alignment',
        type: 'select',
        label: 'Alignment',
        defaultValue: 'center',
      },
    ],
    supportsResize: false,
  },
  ContactCard: {
    type: 'ContactCard',
    displayName: 'Contact Card',
    description: 'Contact information display',
    defaultProps: {
      email: '',
      officeLocation: '',
      phoneNumber: '',
      officeHours: '',
      showIcons: true,
    },
    propDefinitions: [
      {
        name: 'email',
        type: 'text',
        label: 'Email',
        defaultValue: '',
        validation: [{ type: 'email', message: 'Must be a valid email address' }],
      },
      {
        name: 'officeLocation',
        type: 'text',
        label: 'Office Location',
        defaultValue: '',
      },
      {
        name: 'phoneNumber',
        type: 'text',
        label: 'Phone Number',
        defaultValue: '',
      },
      {
        name: 'officeHours',
        type: 'textarea',
        label: 'Office Hours',
        defaultValue: '',
      },
      {
        name: 'showIcons',
        type: 'select',
        label: 'Show Icons',
        defaultValue: true,
      },
    ],
    supportsResize: false,
  },
  EducationSection: {
    type: 'EducationSection',
    displayName: 'Education Section',
    description: 'Display for educational background',
    defaultProps: {
      entries: [],
      showHonors: true,
    },
    propDefinitions: [
      {
        name: 'entries',
        type: 'array',
        label: 'Education Entries',
        defaultValue: [],
        arrayItemSchema: [
          {
            name: 'degree',
            type: 'text',
            label: 'Degree',
            defaultValue: '',
            validation: [{ type: 'required', message: 'Degree is required' }],
          },
          {
            name: 'field',
            type: 'text',
            label: 'Field',
            defaultValue: '',
            validation: [{ type: 'required', message: 'Field is required' }],
          },
          {
            name: 'institution',
            type: 'text',
            label: 'Institution',
            defaultValue: '',
            validation: [{ type: 'required', message: 'Institution is required' }],
          },
          {
            name: 'year',
            type: 'number',
            label: 'Year',
            defaultValue: new Date().getFullYear(),
            validation: [
              { type: 'required', message: 'Year is required' },
              { type: 'min', value: 1900, message: 'Year must be after 1900' },
            ],
          },
          {
            name: 'honors',
            type: 'text',
            label: 'Honors',
            defaultValue: '',
          },
        ],
      },
      {
        name: 'showHonors',
        type: 'select',
        label: 'Show Honors',
        defaultValue: true,
      },
    ],
    supportsResize: false,
  },
  BioSection: {
    type: 'BioSection',
    displayName: 'Bio Section',
    description: 'Biographical information section',
    defaultProps: {
      heading: 'About Me',
      content: 'Enter your biographical information here.',
      profileImageUrl: '',
      imagePosition: 'left',
      imageSize: 'medium',
    },
    propDefinitions: [
      {
        name: 'heading',
        type: 'text',
        label: 'Heading',
        defaultValue: 'About Me',
        validation: [{ type: 'required', message: 'Heading is required' }],
      },
      {
        name: 'content',
        type: 'textarea',
        label: 'Content',
        defaultValue: 'Enter your biographical information here.',
        validation: [{ type: 'required', message: 'Content is required' }],
      },
      {
        name: 'profileImageUrl',
        type: 'url',
        label: 'Profile Image URL',
        defaultValue: '',
        validation: [{ type: 'url', message: 'Must be a valid URL' }],
      },
      {
        name: 'imagePosition',
        type: 'select',
        label: 'Image Position',
        defaultValue: 'left',
      },
      {
        name: 'imageSize',
        type: 'select',
        label: 'Image Size',
        defaultValue: 'medium',
      },
    ],
    supportsResize: false,
  },
};


/**
 * ComponentRegistry class for managing component schemas and instances
 * Provides methods to retrieve schemas, components, and create new instances
 */
export class ComponentRegistry {
  private schemas: Map<ComponentType, ComponentSchema>;
  private components: Map<ComponentType, React.ComponentType<any>>;

  constructor() {
    this.schemas = new Map();
    this.components = new Map();
    
    // Initialize schemas map
    Object.entries(COMPONENT_SCHEMAS).forEach(([type, schema]) => {
      this.schemas.set(type as ComponentType, schema);
    });
  }

  /**
   * Get the schema for a specific component type
   * @param type - The component type
   * @returns The component schema
   * @throws Error if schema not found
   */
  getSchema(type: ComponentType): ComponentSchema {
    const schema = this.schemas.get(type);
    if (!schema) {
      throw new Error(`Schema not found for component type: ${type}`);
    }
    return schema;
  }

  /**
   * Get the React component for a specific component type
   * @param type - The component type
   * @returns The React component
   * @throws Error if component not found
   */
  getComponent(type: ComponentType): React.ComponentType<any> {
    const component = this.components.get(type);
    if (!component) {
      throw new Error(`Component not found for type: ${type}`);
    }
    return component;
  }

  /**
   * Register a React component for a specific type
   * @param type - The component type
   * @param component - The React component
   */
  registerComponent(type: ComponentType, component: React.ComponentType<any>): void {
    this.components.set(type, component);
  }

  /**
   * Create a new component instance with default properties
   * @param type - The component type
   * @returns A new component instance with unique ID and default props
   */
  createInstance(type: ComponentType): ComponentInstance {
    const schema = this.getSchema(type);
    const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id,
      type,
      props: { ...schema.defaultProps },
      order: 0, // Will be set by the canvas state manager
    };
  }

  /**
   * Get all available component types
   * @returns Array of all component types
   */
  getAllTypes(): ComponentType[] {
    return Array.from(this.schemas.keys());
  }

  /**
   * Get all component schemas
   * @returns Array of all component schemas
   */
  getAllSchemas(): ComponentSchema[] {
    return Array.from(this.schemas.values());
  }

  /**
   * Check if a component type exists
   * @param type - The component type to check
   * @returns True if the type exists
   */
  hasType(type: ComponentType): boolean {
    return this.schemas.has(type);
  }
}

// Export a singleton instance
export const componentRegistry = new ComponentRegistry();
