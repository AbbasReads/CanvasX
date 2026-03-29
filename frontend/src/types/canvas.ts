/**
 * Core TypeScript interfaces for the Sandboxed Website Builder
 * Defines the data structures for canvas state, components, and schemas
 */

/**
 * Component types available in the academic portfolio builder
 */
export type ComponentType =
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

/**
 * Viewport modes for responsive preview
 */
export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

/**
 * Project metadata for persistence
 */
export interface ProjectMetadata {
  professorName: string;
  portfolioTitle: string;
  lastModified: number;
  projectId: string;
}

/**
 * A single component instance on the canvas
 */
export interface ComponentInstance {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  order: number;
}

/**
 * The complete canvas state - single source of truth
 */
export interface CanvasState {
  components: ComponentInstance[];
  selectedComponentId: string | null;
  viewportMode: ViewportMode;
  projectMetadata: ProjectMetadata;
}

/**
 * Property definition types
 */
export type PropType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'color'
  | 'url'
  | 'image'
  | 'select'
  | 'array';

/**
 * Validation rule types
 */
export type ValidationRuleType =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'min'
  | 'max'
  | 'url'
  | 'email';

/**
 * Validation rule definition
 */
export interface ValidationRule {
  type: ValidationRuleType;
  value?: any;
  message: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Property definition for component schemas
 */
export interface PropDefinition {
  name: string;
  type: PropType;
  label: string;
  defaultValue: any;
  validation?: ValidationRule[];
  arrayItemSchema?: PropDefinition[]; // For array properties
}

/**
 * Component schema defining structure and properties
 */
export interface ComponentSchema {
  type: ComponentType;
  displayName: string;
  description: string;
  defaultProps: Record<string, any>;
  propDefinitions: PropDefinition[];
  minWidth?: number;
  minHeight?: number;
  supportsResize: boolean;
}

/**
 * Generated code structure
 */
export interface GeneratedCode {
  code: string;
  imports: string[];
  componentDefinitions: string[];
  mainComponent: string;
}

/**
 * Viewport configuration
 */
export interface ViewportConfig {
  mode: ViewportMode;
  width: number;
  label: string;
}

/**
 * Theme configuration for light theme
 */
export interface ThemeConfig {
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

/**
 * Stored project structure for persistence
 */
export interface StoredProject {
  projectId: string;
  version: string;
  state: CanvasState;
  createdAt: number;
  updatedAt: number;
}

/**
 * Project index for managing multiple projects
 */
export interface ProjectIndex {
  projects: {
    projectId: string;
    professorName: string;
    portfolioTitle: string;
    lastModified: number;
  }[];
}

/**
 * History state for undo/redo
 */
export interface HistoryState {
  past: CanvasState[];
  present: CanvasState;
  future: CanvasState[];
  maxSize: number;
}

/**
 * Canvas actions for state management
 */
export type CanvasAction =
  | { type: 'ADD_COMPONENT'; payload: { componentType: ComponentType; position: number } }
  | { type: 'UPDATE_COMPONENT_PROPS'; payload: { componentId: string; props: Record<string, any> } }
  | { type: 'DELETE_COMPONENT'; payload: { componentId: string } }
  | { type: 'REORDER_COMPONENT'; payload: { componentId: string; newPosition: number } }
  | { type: 'SELECT_COMPONENT'; payload: { componentId: string | null } }
  | { type: 'SET_VIEWPORT_MODE'; payload: { mode: ViewportMode } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'LOAD_STATE'; payload: { state: CanvasState } };

/**
 * Drag and drop types
 */
export interface DragItem {
  type: 'COMPONENT_FROM_PALETTE' | 'COMPONENT_ON_CANVAS';
  componentType?: ComponentType;
  componentId?: string;
}

export interface DropTarget {
  type: 'CANVAS' | 'REORDER_POSITION';
  position?: number;
}

/**
 * Sandbox communication protocol
 */
export interface SandboxMessage {
  type: 'UPDATE_CODE';
  payload: {
    code: string;
    timestamp: number;
  };
}

export interface SandboxResponse {
  type: 'RENDER_COMPLETE' | 'RENDER_ERROR';
  payload: {
    timestamp: number;
    error?: {
      message: string;
      stack: string;
    };
  };
}
