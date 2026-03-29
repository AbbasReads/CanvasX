# Design Document: Sandboxed Website Builder

## Overview

The sandboxed website builder is a React-based application that enables professors to create single-page portfolio websites through visual drag-and-drop interactions. The system consists of three primary areas: a component palette (left sidebar), a visual canvas (center), and a properties panel (right sidebar), with a sandboxed preview environment that renders generated code in real-time.

The core architectural principle is **visual-code parity**: the canvas and sandbox must render identical output. This is achieved by using the same React component implementations in both environments, ensuring that what professors see on the canvas is exactly what will be generated and deployed.

The system targets academic users who need professional portfolio websites without coding knowledge. It provides pre-built components for publications, research areas, teaching experience, and other academic content, all styled with a light theme suitable for professional contexts.

### Key Design Goals

1. **Visual-Code Parity**: Canvas and sandbox must render identically using shared React components
2. **Real-Time Synchronization**: Changes propagate from canvas to sandbox within 500ms
3. **Sandbox Security**: Generated code executes in an isolated iframe with restricted capabilities
4. **Academic Focus**: Components and workflows tailored for professor portfolio needs
5. **Zero-Code Experience**: Professors build complete websites without writing any code

## Architecture

### System Components

The application follows a unidirectional data flow architecture:

```
┌─────────────────┐
│ Component       │
│ Palette         │
│ (Drag Source)   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│         Canvas State                │
│  (Single Source of Truth)           │
│  - Component tree                   │
│  - Properties                       │
│  - Layout metadata                  │
└──────┬──────────────────────┬───────┘
       │                      │
       ▼                      ▼
┌──────────────┐      ┌──────────────┐
│   Canvas     │      │     Code     │
│   Renderer   │      │  Generator   │
│              │      │              │
└──────────────┘      └──────┬───────┘
                             │
                             ▼
                      ┌──────────────┐
                      │   Sandbox    │
                      │   (iframe)   │
                      └──────────────┘
```

### Core Subsystems

1. **Canvas State Manager**: Maintains the authoritative representation of the portfolio website as a tree of components with properties. Implements undo/redo history and persistence to local storage.

2. **Canvas Renderer**: Renders the visual editing interface using the actual React components that will be generated. Handles drag-and-drop interactions, selection, and visual feedback.

3. **Code Generator**: Transforms canvas state into executable React code. Produces self-contained code with all imports and component definitions.

4. **Sandbox Environment**: Isolated iframe that executes generated code with security restrictions. Communicates with parent via postMessage for error reporting.

5. **Component Library**: Collection of pre-built academic portfolio components (Publications, Research Areas, Teaching Timeline, etc.) with defined schemas and default properties.

6. **Properties Panel**: Dynamic form interface that adapts to the selected component's schema, providing appropriate input controls for each property type.

### Technology Stack

- **Frontend Framework**: React 18+ with hooks
- **State Management**: React Context + useReducer for canvas state
- **Styling**: Tailwind CSS for utility-first styling with light theme configuration
- **Drag and Drop**: react-dnd or @dnd-kit for drag-and-drop interactions
- **Code Generation**: Template-based generation with proper escaping and formatting
- **Sandbox**: iframe with sandbox attributes for security isolation
- **Persistence**: Browser localStorage for project state
- **Build Tool**: Vite or Create React App for development and bundling

## Components and Interfaces

### Canvas State Structure

The canvas state is a tree structure representing the portfolio website:

```typescript
interface CanvasState {
  components: ComponentInstance[];
  selectedComponentId: string | null;
  viewportMode: 'desktop' | 'tablet' | 'mobile';
  projectMetadata: ProjectMetadata;
}

interface ComponentInstance {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  order: number;
}

interface ProjectMetadata {
  professorName: string;
  portfolioTitle: string;
  lastModified: number;
  projectId: string;
}

type ComponentType = 
  | 'GeneralInfo'
  | 'PublicationsCarousel'
  | 'PublicationsList'
  | 'ResearchAreasGrid'
  | 'TeachingTimeline'
  | 'ImageGallery'
  | 'ExternalLinksBar'
  | 'ContactCard'
  | 'EducationSection'
  | 'BioSection';
```

### Component Schema System

Each component type has a schema defining its properties:

```typescript
interface ComponentSchema {
  type: ComponentType;
  displayName: string;
  description: string;
  defaultProps: Record<string, any>;
  propDefinitions: PropDefinition[];
  minWidth?: number;
  minHeight?: number;
  supportsResize: boolean;
}

interface PropDefinition {
  name: string;
  type: 'text' | 'textarea' | 'number' | 'color' | 'url' | 'image' | 'select' | 'array';
  label: string;
  defaultValue: any;
  validation?: ValidationRule[];
  arrayItemSchema?: PropDefinition[]; // For array properties like publications
}
```

### Academic Component Interfaces

#### Publications Component

```typescript
interface PublicationEntry {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  doi?: string;
  abstract?: string;
  pdfUrl?: string;
  externalUrl?: string;
}

interface PublicationsCarouselProps {
  publications: PublicationEntry[];
  showAbstract: boolean;
  accentColor: string;
}

interface PublicationsListProps {
  publications: PublicationEntry[];
  showAbstract: boolean;
  groupByYear: boolean;
}
```

#### Research Areas Component

```typescript
interface ResearchArea {
  id: string;
  name: string;
  description?: string;
}

interface ResearchAreasGridProps {
  areas: ResearchArea[];
  columns: 2 | 3 | 4;
  showDescriptions: boolean;
}
```

#### Teaching Timeline Component

```typescript
interface TeachingEntry {
  id: string;
  courseName: string;
  institution: string;
  semester: string;
  year: number;
  description?: string;
}

interface TeachingTimelineProps {
  entries: TeachingEntry[];
  sortOrder: 'chronological' | 'reverse-chronological';
}
```

#### External Links Component

```typescript
interface ExternalLinksBarProps {
  googleScholarUrl?: string;
  researchGateUrl?: string;
  linkedInUrl?: string;
  orcidUrl?: string;
  githubUrl?: string;
  personalWebsiteUrl?: string;
  iconSize: 'small' | 'medium' | 'large';
  alignment: 'left' | 'center' | 'right';
}
```

#### Contact Information Component

```typescript
interface ContactCardProps {
  email?: string;
  officeLocation?: string;
  phoneNumber?: string;
  officeHours?: string;
  showIcons: boolean;
}
```

#### Bio Section Component

```typescript
interface BioSectionProps {
  heading: string;
  content: string;
  profileImageUrl?: string;
  imagePosition: 'left' | 'right' | 'center' | 'none';
  imageSize: 'small' | 'medium' | 'large';
}
```

#### Education Section Component

```typescript
interface EducationEntry {
  id: string;
  degree: string;
  field: string;
  institution: string;
  year: number;
  honors?: string;
}

interface EducationSectionProps {
  entries: EducationEntry[];
  showHonors: boolean;
}
```

#### Image Gallery Component

```typescript
interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  columns: 2 | 3 | 4;
  imageAspectRatio: 'square' | '16:9' | '4:3' | 'auto';
}
```

### Code Generator Interface

The code generator transforms canvas state into executable code:

```typescript
interface CodeGenerator {
  generate(state: CanvasState): GeneratedCode;
}

interface GeneratedCode {
  code: string;
  imports: string[];
  componentDefinitions: string[];
  mainComponent: string;
}
```

The generated code structure:

```javascript
// Generated output structure
import React from 'react';
import { PublicationsCarousel, BioSection, ContactCard } from './components';

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-white">
      <BioSection 
        heading="About Me"
        content="..."
        profileImageUrl="..."
        imagePosition="left"
      />
      <PublicationsCarousel 
        publications={[...]}
        showAbstract={true}
      />
      <ContactCard 
        email="..."
        officeLocation="..."
      />
    </div>
  );
}
```

### Sandbox Communication Protocol

The sandbox communicates with the parent via postMessage:

```typescript
// Parent to Sandbox
interface SandboxMessage {
  type: 'UPDATE_CODE';
  payload: {
    code: string;
    timestamp: number;
  };
}

// Sandbox to Parent
interface SandboxResponse {
  type: 'RENDER_COMPLETE' | 'RENDER_ERROR';
  payload: {
    timestamp: number;
    error?: {
      message: string;
      stack: string;
    };
  };
}
```

### Drag and Drop System

The drag-and-drop system uses a provider-consumer pattern:

```typescript
interface DragItem {
  type: 'COMPONENT_FROM_PALETTE' | 'COMPONENT_ON_CANVAS';
  componentType?: ComponentType;
  componentId?: string;
}

interface DropTarget {
  type: 'CANVAS' | 'REORDER_POSITION';
  position?: number; // For reordering
}
```

### State Management Actions

Canvas state updates via reducer actions:

```typescript
type CanvasAction =
  | { type: 'ADD_COMPONENT'; payload: { componentType: ComponentType; position: number } }
  | { type: 'UPDATE_COMPONENT_PROPS'; payload: { componentId: string; props: Record<string, any> } }
  | { type: 'DELETE_COMPONENT'; payload: { componentId: string } }
  | { type: 'REORDER_COMPONENT'; payload: { componentId: string; newPosition: number } }
  | { type: 'SELECT_COMPONENT'; payload: { componentId: string | null } }
  | { type: 'SET_VIEWPORT_MODE'; payload: { mode: 'desktop' | 'tablet' | 'mobile' } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'LOAD_STATE'; payload: { state: CanvasState } };
```

## Data Models

### Persistence Layer

Projects are stored in browser localStorage with the following structure:

```typescript
interface StoredProject {
  projectId: string;
  version: string; // Schema version for migrations
  state: CanvasState;
  createdAt: number;
  updatedAt: number;
}

interface ProjectIndex {
  projects: {
    projectId: string;
    professorName: string;
    portfolioTitle: string;
    lastModified: number;
  }[];
}
```

Storage keys:
- `portfolio-builder:index` - List of all projects
- `portfolio-builder:project:{projectId}` - Individual project data
- `portfolio-builder:current` - Currently active project ID

### History Management

Undo/redo uses a circular buffer:

```typescript
interface HistoryState {
  past: CanvasState[];
  present: CanvasState;
  future: CanvasState[];
  maxSize: number; // 50
}
```

### Component Registry

The component library maintains a registry of available components:

```typescript
interface ComponentRegistry {
  schemas: Map<ComponentType, ComponentSchema>;
  components: Map<ComponentType, React.ComponentType<any>>;
  
  getSchema(type: ComponentType): ComponentSchema;
  getComponent(type: ComponentType): React.ComponentType<any>;
  createInstance(type: ComponentType): ComponentInstance;
}
```

### Validation Rules

Property validation system:

```typescript
interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'url' | 'email';
  value?: any;
  message: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}
```

### Template Definitions

Pre-built templates for quick start:

```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  components: ComponentInstance[];
}

const TEMPLATES: Template[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Basic profile with bio and contact info',
    components: [/* BioSection, ContactCard, ExternalLinksBar */]
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Complete academic profile',
    components: [/* BioSection, ResearchAreasGrid, PublicationsList, ContactCard */]
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive',
    description: 'Full portfolio with all components',
    components: [/* All component types */]
  }
];
```

### Viewport Configuration

Responsive preview modes:

```typescript
interface ViewportConfig {
  mode: 'desktop' | 'tablet' | 'mobile';
  width: number;
  label: string;
}

const VIEWPORTS: ViewportConfig[] = [
  { mode: 'desktop', width: 1920, label: 'Desktop (1920px)' },
  { mode: 'tablet', width: 768, label: 'Tablet (768px)' },
  { mode: 'mobile', width: 375, label: 'Mobile (375px)' }
];
```

### Theme Configuration

Light theme color system:

```typescript
interface ThemeConfig {
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    border: string;
  };
  spacing: {
    componentGap: string;
    sectionPadding: string;
  };
  typography: {
    fontFamily: string;
    headingSizes: Record<string, string>;
  };
}

const LIGHT_THEME: ThemeConfig = {
  colors: {
    background: '#ffffff',
    foreground: '#1a1a1a',
    primary: '#2563eb', // Blue
    secondary: '#64748b', // Slate
    accent: '#3b82f6',
    muted: '#f1f5f9',
    border: '#e2e8f0'
  },
  spacing: {
    componentGap: '2rem',
    sectionPadding: '3rem'
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    headingSizes: {
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.5rem'
    }
  }
};
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Component Addition Preserves Defaults

*For any* component type from the component library, when a component is added to the canvas, the canvas state should include that component with its schema-defined default properties.

**Validates: Requirements 1.3, 1.4**

### Property 2: Component Reordering Updates Sequence

*For any* component in the canvas and any valid target position, when the component is moved to that position, the canvas state's component order should reflect the new sequence with the component at the target position.

**Validates: Requirements 1.5, 15.5**

### Property 3: Unique Component Identifiers

*For any* sequence of component instantiations, each created component should have a unique identifier that differs from all previously created components in the same session.

**Validates: Requirements 2.4**

### Property 4: Component Library Completeness

*For any* component type in the component library, that component type should have both a defined schema specifying its properties and default property values.

**Validates: Requirements 2.2, 2.5**

### Property 5: Light Theme Styling Consistency

*For any* academic component rendered by the component library, the component should use light background colors (luminance > 0.9) and dark text colors (luminance < 0.3) by default.

**Validates: Requirements 2.3, 7.3**

### Property 6: Sandbox Security Isolation

*For any* generated code executed in the sandbox, attempts to access parent window context, cookies, local storage, navigate away from the page, submit forms, or open popups should be blocked without causing the sandbox to crash.

**Validates: Requirements 3.2, 11.2, 11.3, 11.4, 11.5**

### Property 7: Visual-Code Parity for Props

*For any* canvas state containing components with specific properties, the code generator should produce code where each component is rendered with props that exactly match the canvas state properties (same keys, same values, same types).

**Validates: Requirements 4.3, 25.4**

### Property 8: Visual-Code Parity for Styling

*For any* component rendered on the canvas with specific CSS classes and inline styles, the generated code for that component should include identical CSS class names and inline style attributes.

**Validates: Requirements 4.4, 4.5, 25.3**

### Property 9: Code Generation Produces Valid React

*For any* valid canvas state, the code generator should produce syntactically valid React code that includes all necessary imports, uses the same component implementations as the canvas, and is self-contained.

**Validates: Requirements 5.1, 5.2, 5.3, 10.2, 10.3, 10.6**

### Property 10: Properties Panel Reflects Selection

*For any* component type, when a component of that type is selected on the canvas, the properties panel should display input controls for all editable properties defined in that component's schema.

**Validates: Requirements 6.1, 6.2**

### Property 11: Property Modifications Update Canvas

*For any* component property and any valid new value for that property, when the property is modified through the properties panel, the canvas state should immediately reflect the updated value.

**Validates: Requirements 6.3**

### Property 12: Property Validation Rejects Invalid Values

*For any* component property with validation rules and any value that violates those rules, the properties panel should reject the invalid value and display an appropriate error message.

**Validates: Requirements 6.5**

### Property 13: Accessibility Contrast Ratios

*For any* text-background color combination used in the light theme, the contrast ratio should be at least 4.5:1 to meet WCAG AA accessibility standards.

**Validates: Requirements 7.5**

### Property 14: Component Minimum Dimensions

*For any* component type that supports resizing, the canvas should enforce minimum width and height values appropriate for that component type, preventing dimensions below the defined minimums.

**Validates: Requirements 8.3**

### Property 15: State Persistence Round-Trip

*For any* canvas state, saving the state to local storage and then loading it back should produce an equivalent canvas state with the same components, properties, and ordering.

**Validates: Requirements 9.2**

### Property 16: Project Identifier Uniqueness

*For any* set of saved portfolio projects, each project should have a unique project identifier that differs from all other projects in the system.

**Validates: Requirements 9.4**

### Property 17: Export Code Formatting

*For any* canvas state, the exported code should be properly formatted with consistent indentation (2 or 4 spaces), readable structure, and no syntax errors.

**Validates: Requirements 10.4**

### Property 18: Undo History Size Limit

*For any* sequence of canvas state changes, the undo history should never exceed 50 stored states, discarding the oldest states when the limit is reached.

**Validates: Requirements 12.1**

### Property 19: Undo Restores Previous State

*For any* canvas state change, triggering undo should restore the canvas to the state immediately before that change.

**Validates: Requirements 12.2**

### Property 20: Redo Restores Next State

*For any* undo operation, triggering redo should restore the canvas to the state that existed before the undo was performed.

**Validates: Requirements 12.3**

### Property 21: Component Selection Updates State

*For any* component on the canvas, when that component is clicked, the canvas state should update to mark that component as selected (selectedComponentId should equal the component's ID).

**Validates: Requirements 13.1**

### Property 22: Component Deletion Removes from State

*For any* selected component, when the delete action is triggered, the canvas state should no longer contain that component in its components array.

**Validates: Requirements 13.4**

### Property 23: Viewport Mode Updates Canvas Width

*For any* viewport mode (desktop, tablet, mobile), when that mode is selected, the canvas should resize to display the portfolio at the width defined for that mode.

**Validates: Requirements 14.2**

### Property 24: Canvas-Sandbox Viewport Parity

*For any* viewport width set on the canvas, the sandbox should render the portfolio at the same viewport width.

**Validates: Requirements 14.3**

### Property 25: Component Responsive Adaptation

*For any* academic component and any viewport width, the component should adapt its layout appropriately for that width (e.g., stacking on mobile, side-by-side on desktop).

**Validates: Requirements 14.5**

### Property 26: Component Rendering Order

*For any* canvas state with multiple components, the canvas and sandbox should render components in the same vertical sequence as defined by the order property in the canvas state.

**Validates: Requirements 15.2**

### Property 27: Publication Reordering Updates Sequence

*For any* publications carousel or list component with multiple publication entries, when publications are reordered, the component's publications array should reflect the new sequence.

**Validates: Requirements 16.5**

### Property 28: Teaching Timeline Chronological Order

*For any* teaching timeline component with multiple entries, the entries should be displayed in chronological order based on year and semester.

**Validates: Requirements 18.1**

### Property 29: External Links Conditional Display

*For any* external links bar component, only the platform icons for which URLs have been provided should be rendered in the output.

**Validates: Requirements 19.3**

### Property 30: External Links Open in New Tab

*For any* external links bar component in the generated code, all link elements should include the target="_blank" attribute to open in a new tab.

**Validates: Requirements 19.6**

### Property 31: Contact Card Conditional Display

*For any* contact information card component, only the contact fields that have been provided with values should be rendered in the output.

**Validates: Requirements 20.3**

### Property 32: Education Reverse Chronological Order

*For any* education section component with multiple entries, the entries should be displayed in reverse chronological order (most recent first) based on year.

**Validates: Requirements 22.4**

### Property 33: Template Initialization Loads Components

*For any* template (minimal, standard, comprehensive), when that template is selected for a new project, the canvas state should initialize with exactly the components defined in that template's specification.

**Validates: Requirements 24.5**

## Error Handling

### Canvas Error Handling

1. **Invalid Component Drops**: When a component is dropped at an invalid location, the system should show a visual error indicator and revert to the previous state without modifying canvas state.

2. **Property Validation Errors**: When invalid property values are entered, the properties panel should display inline error messages and prevent the invalid value from being applied to the canvas state.

3. **Drag Operation Failures**: If a drag operation fails (e.g., due to browser issues), the system should gracefully cancel the operation and restore the component to its original position.

4. **Component Schema Errors**: If a component type lacks a required schema definition, the system should log an error to the console and prevent that component from being added to the palette.

### Sandbox Error Handling

1. **Code Generation Errors**: If code generation fails due to invalid canvas state, the system should display an error message in the sandbox and retain the previous working code.

2. **Runtime Errors**: When generated code throws runtime errors in the sandbox, the system should catch the error, display it in a non-intrusive overlay, and prevent the error from affecting the parent application.

3. **Sandbox Communication Failures**: If postMessage communication between parent and sandbox fails, the system should retry up to 3 times with exponential backoff before displaying an error message.

4. **Resource Loading Errors**: When external resources (images, icons) fail to load in the sandbox, the system should display placeholder content and log the error without crashing.

### Persistence Error Handling

1. **Local Storage Unavailable**: When local storage is unavailable or quota exceeded, the system should display a prominent warning message and continue operating in memory-only mode.

2. **Corrupted State Data**: When loading corrupted state data from local storage, the system should catch the parsing error, clear the corrupted data, and initialize with a blank canvas.

3. **Save Failures**: If saving to local storage fails, the system should retry once and display a warning message if the retry also fails.

### Export Error Handling

1. **Export Generation Failures**: If code export fails, the system should display an error modal with details about what went wrong and offer to retry.

2. **Clipboard Access Denied**: When clipboard access is denied for copying exported code, the system should fall back to displaying the code in a text area for manual copying.

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit tests** verify specific examples, edge cases, error conditions, and integration points between components
- **Property tests** verify universal properties across all inputs through randomized testing
- Together, these approaches provide comprehensive coverage: unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across the input space

### Property-Based Testing

Property-based testing will be implemented using **fast-check** (for JavaScript/TypeScript), which is the standard property-based testing library for the React ecosystem.

**Configuration**:
- Each property test must run a minimum of 100 iterations to ensure adequate randomization coverage
- Each test must include a comment tag referencing the design document property
- Tag format: `// Feature: sandboxed-website-builder, Property {number}: {property_text}`

**Example Property Test Structure**:

```typescript
import fc from 'fast-check';

// Feature: sandboxed-website-builder, Property 1: Component Addition Preserves Defaults
test('adding any component type preserves default properties', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...Object.keys(COMPONENT_SCHEMAS)),
      (componentType) => {
        const canvas = createEmptyCanvas();
        const component = addComponent(canvas, componentType);
        const schema = COMPONENT_SCHEMAS[componentType];
        
        expect(component.props).toEqual(schema.defaultProps);
      }
    ),
    { numRuns: 100 }
  );
});
```

**Generators for Property Testing**:

The following custom generators will be created for fast-check:

1. `arbitraryComponentType()` - Generates random component types from the library
2. `arbitraryComponentInstance()` - Generates random component instances with valid props
3. `arbitraryCanvasState()` - Generates random valid canvas states
4. `arbitraryPublicationEntry()` - Generates random publication data
5. `arbitraryColorPair()` - Generates random text-background color combinations
6. `arbitraryViewportMode()` - Generates random viewport modes
7. `arbitraryPropertyValue(propDef)` - Generates random values for a property definition

### Unit Testing

Unit tests will use **Jest** and **React Testing Library** for component testing.

**Focus Areas**:
1. Specific component rendering examples (e.g., Publications Carousel with 3 publications)
2. Edge cases (empty component lists, single items, maximum items)
3. Error conditions (invalid props, missing required fields)
4. Integration between canvas, code generator, and sandbox
5. User interaction flows (drag-drop, select, edit, delete)
6. Template initialization with specific templates
7. Keyboard shortcuts and accessibility features

**Example Unit Test**:

```typescript
import { render, screen } from '@testing-library/react';
import { PublicationsCarousel } from './PublicationsCarousel';

test('renders publications carousel with navigation controls', () => {
  const publications = [
    { id: '1', title: 'Paper 1', authors: 'Author A', venue: 'Venue X', year: 2023 },
    { id: '2', title: 'Paper 2', authors: 'Author B', venue: 'Venue Y', year: 2024 }
  ];
  
  render(<PublicationsCarousel publications={publications} showAbstract={false} />);
  
  expect(screen.getByText('Paper 1')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
});
```

### Integration Testing

Integration tests will verify the complete flow from canvas interaction to sandbox rendering:

1. **Canvas-to-Sandbox Flow**: Test that canvas changes trigger code generation and sandbox updates
2. **Properties Panel Integration**: Test that property edits update both canvas and sandbox
3. **Drag-Drop Integration**: Test complete drag-drop flows from palette to canvas
4. **Persistence Integration**: Test save/load cycles preserve complete application state
5. **Export Integration**: Test that exported code can be executed independently

### Visual Regression Testing

Given the critical requirement for visual-code parity, visual regression testing should be considered:

1. Use **Playwright** or **Cypress** for visual snapshot testing
2. Capture screenshots of canvas and sandbox side-by-side for each component type
3. Detect visual differences between canvas and sandbox rendering
4. Run visual tests on multiple viewport sizes

### Security Testing

Security tests will verify sandbox isolation:

1. Test that sandbox cannot access parent window
2. Test that sandbox cannot access localStorage/cookies
3. Test that navigation is blocked
4. Test that form submissions are blocked
5. Test that popup windows are blocked
6. Test that malicious code attempts are safely contained

### Performance Testing

While timing requirements are not tested in property tests, performance should be monitored:

1. Measure code generation time for various canvas state sizes
2. Measure sandbox reload time
3. Measure debounce effectiveness for rapid changes
4. Monitor memory usage during extended editing sessions

### Accessibility Testing

Accessibility tests will verify WCAG compliance:

1. Automated testing with **axe-core** or **jest-axe**
2. Keyboard navigation testing for all interactive elements
3. Screen reader testing for component labels and descriptions
4. Color contrast verification (automated via Property 13)
5. Focus management testing for modal dialogs and panels

### Test Coverage Goals

- **Unit test coverage**: Minimum 80% line coverage for all components
- **Property test coverage**: All 33 correctness properties must have corresponding property tests
- **Integration test coverage**: All major user flows must have integration tests
- **Accessibility coverage**: All interactive components must pass axe-core audits

