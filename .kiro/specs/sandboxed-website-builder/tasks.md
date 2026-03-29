# Implementation Plan: Sandboxed Website Builder

## Overview

This implementation plan breaks down the sandboxed website builder into incremental coding tasks. The approach follows a bottom-up strategy: first establishing core data structures and state management, then building the component library, followed by the canvas interface, code generation, sandbox integration, and finally the properties panel and advanced features.

Each task builds on previous work, with checkpoints to validate functionality. Property-based tests are included as optional sub-tasks to verify correctness properties from the design document.

## Tasks

- [x] 1. Set up project structure and core types
  - Initialize React + TypeScript project with Vite
  - Install dependencies: react-dnd or @dnd-kit, tailwindcss, fast-check, jest, react-testing-library
  - Create directory structure: src/components, src/state, src/types, src/utils, src/lib
  - Define core TypeScript interfaces: ComponentInstance, CanvasState, ComponentSchema, PropDefinition
  - Set up Tailwind CSS with light theme configuration
  - _Requirements: 2.5, 7.1, 7.2_

- [ ] 2. Implement canvas state management
  - [x] 2.1 Create canvas state reducer with actions
    - Implement CanvasAction types: ADD_COMPONENT, UPDATE_COMPONENT_PROPS, DELETE_COMPONENT, REORDER_COMPONENT, SELECT_COMPONENT, SET_VIEWPORT_MODE, UNDO, REDO, LOAD_STATE
    - Implement canvasReducer function handling all action types
    - Create React Context for canvas state
    - Implement useCanvasState hook for state access
    - _Requirements: 1.4, 6.3, 13.1, 13.4, 14.2, 15.1_
  
  - [ ]* 2.2 Write property test for component addition preserves defaults
    - **Property 1: Component Addition Preserves Defaults**
    - **Validates: Requirements 1.3, 1.4**
  
  - [ ]* 2.3 Write property test for component reordering updates sequence
    - **Property 2: Component Reordering Updates Sequence**
    - **Validates: Requirements 1.5, 15.5**
  
  - [ ]* 2.4 Write property test for unique component identifiers
    - **Property 3: Unique Component Identifiers**
    - **Validates: Requirements 2.4**

- [ ] 3. Implement history management for undo/redo
  - [x] 3.1 Create history state wrapper with circular buffer
    - Implement HistoryState interface with past, present, future arrays
    - Implement history reducer wrapping canvas reducer
    - Add undo/redo logic with 50-state limit
    - Integrate keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
    - _Requirements: 12.1, 12.2, 12.3, 12.4_
  
  - [ ]* 3.2 Write property test for undo history size limit
    - **Property 18: Undo History Size Limit**
    - **Validates: Requirements 12.1**
  
  - [ ]* 3.3 Write property test for undo restores previous state
    - **Property 19: Undo Restores Previous State**
    - **Validates: Requirements 12.2**
  
  - [ ]* 3.4 Write property test for redo restores next state
    - **Property 20: Redo Restores Next State**
    - **Validates: Requirements 12.3**

- [ ] 4. Create component registry and schemas
  - [x] 4.1 Define schemas for all 10 academic components
    - Create ComponentSchema definitions for: GeneralInfo, PublicationsCarousel, PublicationsList, ResearchAreasGrid, TeachingTimeline, ImageGallery, ExternalLinksBar, ContactCard, EducationSection, BioSection
    - Define PropDefinition arrays for each component type
    - Define default props for each component type
    - Create ComponentRegistry class with getSchema, getComponent, createInstance methods
    - _Requirements: 2.1, 2.2, 2.5_
  
  - [ ]* 4.2 Write property test for component library completeness
    - **Property 4: Component Library Completeness**
    - **Validates: Requirements 2.2, 2.5**

- [ ] 5. Implement academic portfolio components
  - [x] 5.1 Implement BioSection component
    - Create BioSection React component with heading, content, profileImageUrl, imagePosition, imageSize props
    - Style with Tailwind CSS light theme
    - Support image positioning (left, right, center, none)
    - _Requirements: 21.1, 21.2, 21.3, 21.4_
  
  - [~] 5.2 Implement PublicationsCarousel component
    - Create PublicationsCarousel with publications array, showAbstract, accentColor props
    - Implement navigation controls (previous/next buttons)
    - Display publication fields: title, authors, venue, year, DOI, abstract, links
    - _Requirements: 2.6, 16.1, 16.4_
  
  - [~] 5.3 Implement PublicationsList component
    - Create PublicationsList with publications array, showAbstract, groupByYear props
    - Display publications in vertical list format
    - Support optional PDF and external links
    - _Requirements: 16.1, 16.2, 16.7_
  
  - [~] 5.4 Implement ResearchAreasGrid component
    - Create ResearchAreasGrid with areas array, columns, showDescriptions props
    - Display research areas in grid layout
    - Style with light theme colors
    - _Requirements: 17.1, 17.2, 17.4_
  
  - [~] 5.5 Implement TeachingTimeline component
    - Create TeachingTimeline with entries array, sortOrder props
    - Display teaching entries in chronological order
    - Show course name, institution, semester, year, description
    - _Requirements: 18.1, 18.2, 18.4_
  
  - [~] 5.6 Implement ExternalLinksBar component
    - Create ExternalLinksBar with URL props for each platform (Google Scholar, ResearchGate, LinkedIn, ORCID, GitHub, personal website)
    - Display only icons for provided URLs
    - Add target="_blank" to all links
    - Support iconSize and alignment props
    - _Requirements: 2.7, 19.1, 19.2, 19.3, 19.4, 19.6_
  
  - [ ] 5.7 Implement ContactCard component
    - Create ContactCard with email, officeLocation, phoneNumber, officeHours, showIcons props
    - Display only provided contact fields
    - Format with icons and clear layout
    - _Requirements: 20.1, 20.2, 20.3, 20.4_
  
  - [~] 5.8 Implement EducationSection component
    - Create EducationSection with entries array, showHonors props
    - Display education entries in reverse chronological order
    - Show degree, field, institution, year, honors
    - _Requirements: 22.1, 22.2, 22.4_
  
  - [~] 5.9 Implement ImageGallery component
    - Create ImageGallery with images array, columns, imageAspectRatio props
    - Display images in grid layout with captions
    - Style with consistent sizing and spacing
    - _Requirements: 23.1, 23.2, 23.3, 23.6_
  
  - [ ]* 5.10 Write property test for light theme styling consistency
    - **Property 5: Light Theme Styling Consistency**
    - **Validates: Requirements 2.3, 7.3**
  
  - [ ]* 5.11 Write property test for accessibility contrast ratios
    - **Property 13: Accessibility Contrast Ratios**
    - **Validates: Requirements 7.5**
  
  - [ ]* 5.12 Write unit tests for each academic component
    - Test rendering with sample data
    - Test edge cases (empty arrays, single items)
    - Test conditional display logic

- [~] 6. Checkpoint - Ensure component library tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement code generator
  - [~] 7.1 Create code generation engine
    - Implement CodeGenerator class with generate method
    - Transform CanvasState to GeneratedCode (code, imports, componentDefinitions, mainComponent)
    - Generate valid React JSX with proper escaping
    - Include all necessary imports
    - Format code with consistent indentation
    - _Requirements: 5.1, 5.2, 5.3, 10.2, 10.3, 10.4_
  
  - [ ]* 7.2 Write property test for code generation produces valid React
    - **Property 9: Code Generation Produces Valid React**
    - **Validates: Requirements 5.1, 5.2, 5.3, 10.2, 10.3, 10.6**
  
  - [ ]* 7.3 Write property test for visual-code parity for props
    - **Property 7: Visual-Code Parity for Props**
    - **Validates: Requirements 4.3, 25.4**
  
  - [ ]* 7.4 Write property test for visual-code parity for styling
    - **Property 8: Visual-Code Parity for Styling**
    - **Validates: Requirements 4.4, 4.5, 25.3**
  
  - [ ]* 7.5 Write property test for export code formatting
    - **Property 17: Export Code Formatting**
    - **Validates: Requirements 10.4**
  
  - [ ]* 7.6 Write unit tests for code generator
    - Test generation with various canvas states
    - Test proper escaping of special characters
    - Test import generation

- [ ] 8. Implement sandbox environment
  - [~] 8.1 Create sandboxed iframe component
    - Create Sandbox React component with iframe element
    - Apply sandbox attributes: allow-scripts, no allow-same-origin, no allow-forms, no allow-popups, no allow-top-navigation
    - Implement postMessage communication protocol
    - Handle SandboxMessage (UPDATE_CODE) from parent
    - Send SandboxResponse (RENDER_COMPLETE, RENDER_ERROR) to parent
    - _Requirements: 3.1, 3.2, 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [~] 8.2 Implement sandbox error handling and display
    - Catch runtime errors in sandbox
    - Display errors in non-intrusive overlay
    - Implement retry logic for communication failures (3 retries with exponential backoff)
    - Handle resource loading errors gracefully
    - _Requirements: 3.6, 11.5_
  
  - [ ]* 8.3 Write property test for sandbox security isolation
    - **Property 6: Sandbox Security Isolation**
    - **Validates: Requirements 3.2, 11.2, 11.3, 11.4, 11.5**
  
  - [ ]* 8.4 Write unit tests for sandbox communication
    - Test postMessage protocol
    - Test error handling
    - Test retry logic

- [ ] 9. Implement real-time synchronization
  - [~] 9.1 Create sync manager with debouncing
    - Implement useSyncManager hook
    - Debounce canvas state changes by 100ms
    - Trigger code generation on debounced changes
    - Inject generated code into sandbox via postMessage
    - Track sync timing and ensure <500ms canvas-to-sandbox updates
    - _Requirements: 3.4, 3.5, 5.4, 5.5, 25.1, 25.5_
  
  - [ ]* 9.2 Write unit tests for sync manager
    - Test debouncing behavior
    - Test code generation triggering
    - Test sandbox injection

- [~] 10. Checkpoint - Ensure code generation and sandbox tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement canvas renderer
  - [~] 11.1 Create canvas component with component rendering
    - Create Canvas React component
    - Render components from canvas state using actual React components
    - Apply viewport width based on viewportMode
    - Display components in order based on order property
    - Style with light theme background
    - _Requirements: 1.1, 4.1, 7.1, 14.1, 14.2, 15.2_
  
  - [~] 11.2 Implement component selection and visual feedback
    - Add click handlers to canvas components
    - Dispatch SELECT_COMPONENT action on click
    - Display selection indicator (border/highlight) for selected component
    - _Requirements: 13.1, 13.2_
  
  - [ ]* 11.3 Write property test for component selection updates state
    - **Property 21: Component Selection Updates State**
    - **Validates: Requirements 13.1**
  
  - [ ]* 11.4 Write property test for component rendering order
    - **Property 26: Component Rendering Order**
    - **Validates: Requirements 15.2**
  
  - [ ]* 11.5 Write unit tests for canvas renderer
    - Test component rendering
    - Test selection behavior
    - Test viewport resizing

- [ ] 12. Implement drag-and-drop system
  - [~] 12.1 Set up drag-and-drop provider and context
    - Install and configure react-dnd or @dnd-kit
    - Create DndProvider wrapper
    - Define DragItem and DropTarget types
    - _Requirements: 1.1, 1.2_
  
  - [~] 12.2 Implement component palette with drag sources
    - Create ComponentPalette component
    - Display all 10 academic components with previews
    - Make each palette item draggable
    - _Requirements: 1.1, 2.1_
  
  - [~] 12.3 Implement canvas drop targets
    - Make canvas a drop target for COMPONENT_FROM_PALETTE
    - Show visual drop indicator during drag
    - Dispatch ADD_COMPONENT action on drop
    - Calculate drop position in vertical sequence
    - _Requirements: 1.2, 1.3, 1.4_
  
  - [~] 12.4 Implement canvas component reordering
    - Make canvas components draggable
    - Implement drop targets between components for reordering
    - Show visual insertion indicator during drag
    - Dispatch REORDER_COMPONENT action on drop
    - _Requirements: 1.5, 1.6, 15.3, 15.5, 15.6_
  
  - [ ]* 12.5 Write unit tests for drag-and-drop
    - Test palette drag initiation
    - Test canvas drop handling
    - Test reordering logic
    - Test visual indicators

- [ ] 13. Implement component resizing
  - [~] 13.1 Add resize handles to selected components
    - Display resize handles when component is selected and supports resizing
    - Implement drag handlers for resize handles
    - Update component dimensions in real-time during resize
    - Dispatch UPDATE_COMPONENT_PROPS action with new dimensions
    - _Requirements: 8.1, 8.2_
  
  - [~] 13.2 Enforce minimum dimensions
    - Define minimum dimensions for each component type in schemas
    - Prevent resizing below minimum dimensions
    - _Requirements: 8.3_
  
  - [ ]* 13.3 Write property test for component minimum dimensions
    - **Property 14: Component Minimum Dimensions**
    - **Validates: Requirements 8.3**
  
  - [ ]* 13.4 Write unit tests for resizing
    - Test resize handle display
    - Test dimension updates
    - Test minimum dimension enforcement

- [~] 14. Checkpoint - Ensure canvas interaction tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Implement properties panel
  - [~] 15.1 Create properties panel component with dynamic form generation
    - Create PropertiesPanel React component
    - Display panel when a component is selected
    - Generate input controls based on selected component's schema
    - Support input types: text, textarea, number, color, url, image, select, array
    - _Requirements: 6.1, 6.2_
  
  - [~] 15.2 Implement property value updates
    - Add onChange handlers to input controls
    - Dispatch UPDATE_COMPONENT_PROPS action on property change
    - Update canvas immediately on property change
    - _Requirements: 6.3_
  
  - [~] 15.3 Implement property validation
    - Validate property values against ValidationRule definitions
    - Display inline error messages for invalid values
    - Prevent invalid values from being applied to canvas state
    - _Requirements: 6.5_
  
  - [~] 15.4 Implement array property editors
    - Create array editor UI for publications, research areas, teaching entries, education entries, gallery images
    - Support adding, editing, removing array items
    - Support reordering array items
    - _Requirements: 6.6, 6.7, 16.3, 16.5, 17.3, 18.3, 22.3, 23.4_
  
  - [ ]* 15.5 Write property test for properties panel reflects selection
    - **Property 10: Properties Panel Reflects Selection**
    - **Validates: Requirements 6.1, 6.2**
  
  - [ ]* 15.6 Write property test for property modifications update canvas
    - **Property 11: Property Modifications Update Canvas**
    - **Validates: Requirements 6.3**
  
  - [ ]* 15.7 Write property test for property validation rejects invalid values
    - **Property 12: Property Validation Rejects Invalid Values**
    - **Validates: Requirements 6.5**
  
  - [ ]* 15.8 Write unit tests for properties panel
    - Test form generation for each component type
    - Test property updates
    - Test validation behavior
    - Test array editors

- [ ] 16. Implement viewport mode controls
  - [~] 16.1 Create viewport mode selector
    - Create ViewportSelector component with desktop/tablet/mobile buttons
    - Dispatch SET_VIEWPORT_MODE action on mode selection
    - Display current viewport mode and width
    - _Requirements: 14.1, 14.4_
  
  - [~] 16.2 Apply viewport width to canvas and sandbox
    - Update canvas width based on viewport mode
    - Update sandbox iframe width to match canvas
    - Ensure components adapt responsively
    - _Requirements: 14.2, 14.3, 14.5_
  
  - [ ]* 16.3 Write property test for viewport mode updates canvas width
    - **Property 23: Viewport Mode Updates Canvas Width**
    - **Validates: Requirements 14.2**
  
  - [ ]* 16.4 Write property test for canvas-sandbox viewport parity
    - **Property 24: Canvas-Sandbox Viewport Parity**
    - **Validates: Requirements 14.3**
  
  - [ ]* 16.5 Write property test for component responsive adaptation
    - **Property 25: Component Responsive Adaptation**
    - **Validates: Requirements 14.5**
  
  - [ ]* 16.6 Write unit tests for viewport controls
    - Test mode switching
    - Test width updates
    - Test responsive behavior

- [ ] 17. Implement local storage persistence
  - [~] 17.1 Create persistence layer
    - Implement saveProject function to save CanvasState to localStorage
    - Implement loadProject function to restore CanvasState from localStorage
    - Implement project index management (list of all projects)
    - Use storage keys: portfolio-builder:index, portfolio-builder:project:{projectId}, portfolio-builder:current
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  
  - [~] 17.2 Implement auto-save with debouncing
    - Debounce canvas state changes by 2 seconds
    - Automatically save to localStorage on debounced changes
    - Handle localStorage unavailable scenario with warning message
    - _Requirements: 9.1, 9.5_
  
  - [~] 17.3 Implement project loading on app initialization
    - Load most recent project on app startup
    - Handle corrupted state data gracefully
    - Initialize with blank canvas if no saved project exists
    - _Requirements: 9.2_
  
  - [ ]* 17.4 Write property test for state persistence round-trip
    - **Property 15: State Persistence Round-Trip**
    - **Validates: Requirements 9.2**
  
  - [ ]* 17.5 Write property test for project identifier uniqueness
    - **Property 16: Project Identifier Uniqueness**
    - **Validates: Requirements 9.4**
  
  - [ ]* 17.6 Write unit tests for persistence
    - Test save and load operations
    - Test corrupted data handling
    - Test localStorage unavailable scenario

- [ ] 18. Implement component deletion
  - [~] 18.1 Add delete functionality
    - Add delete button to selected component UI
    - Implement keyboard shortcut (Delete/Backspace)
    - Dispatch DELETE_COMPONENT action
    - Update sandbox after deletion
    - _Requirements: 13.3, 13.4, 13.5_
  
  - [ ]* 18.2 Write property test for component deletion removes from state
    - **Property 22: Component Deletion Removes from State**
    - **Validates: Requirements 13.4**
  
  - [ ]* 18.3 Write unit tests for deletion
    - Test delete button
    - Test keyboard shortcut
    - Test state updates

- [~] 19. Checkpoint - Ensure persistence and UI interaction tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 20. Implement code export functionality
  - [~] 20.1 Create export UI and logic
    - Add export button to main interface
    - Generate complete React component file on export
    - Include all component implementations in exported code
    - Format exported code with proper indentation
    - Provide copyable text format or downloadable file
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_
  
  - [~] 20.2 Implement clipboard copy with fallback
    - Copy exported code to clipboard
    - Fall back to text area display if clipboard access denied
    - _Requirements: 10.5_
  
  - [ ]* 20.3 Write unit tests for export
    - Test export generation
    - Test clipboard copy
    - Test fallback behavior

- [ ] 21. Implement template system
  - [~] 21.1 Create template definitions
    - Define minimal template (BioSection, ContactCard, ExternalLinksBar)
    - Define standard template (BioSection, ResearchAreasGrid, PublicationsList, ContactCard)
    - Define comprehensive template (all components)
    - _Requirements: 24.1, 24.2, 24.3, 24.4_
  
  - [~] 21.2 Implement template selection UI
    - Create new project modal with template options
    - Display template descriptions
    - Initialize canvas state with selected template
    - Render template in sandbox immediately
    - _Requirements: 24.1, 24.5, 24.6_
  
  - [ ]* 21.3 Write property test for template initialization loads components
    - **Property 33: Template Initialization Loads Components**
    - **Validates: Requirements 24.5**
  
  - [ ]* 21.4 Write unit tests for templates
    - Test template initialization
    - Test each template configuration

- [ ] 22. Implement component-specific property tests
  - [ ]* 22.1 Write property test for publication reordering updates sequence
    - **Property 27: Publication Reordering Updates Sequence**
    - **Validates: Requirements 16.5**
  
  - [ ]* 22.2 Write property test for teaching timeline chronological order
    - **Property 28: Teaching Timeline Chronological Order**
    - **Validates: Requirements 18.1**
  
  - [ ]* 22.3 Write property test for external links conditional display
    - **Property 29: External Links Conditional Display**
    - **Validates: Requirements 19.3**
  
  - [ ]* 22.4 Write property test for external links open in new tab
    - **Property 30: External Links Open in New Tab**
    - **Validates: Requirements 19.6**
  
  - [ ]* 22.5 Write property test for contact card conditional display
    - **Property 31: Contact Card Conditional Display**
    - **Validates: Requirements 20.3**
  
  - [ ]* 22.6 Write property test for education reverse chronological order
    - **Property 32: Education Reverse Chronological Order**
    - **Validates: Requirements 22.4**

- [ ] 23. Implement fast-check generators for property testing
  - [~] 23.1 Create custom fast-check arbitraries
    - Implement arbitraryComponentType() for random component types
    - Implement arbitraryComponentInstance() for random component instances
    - Implement arbitraryCanvasState() for random canvas states
    - Implement arbitraryPublicationEntry() for random publications
    - Implement arbitraryColorPair() for random color combinations
    - Implement arbitraryViewportMode() for random viewport modes
    - Implement arbitraryPropertyValue(propDef) for random property values
    - _Requirements: All property tests_
  
  - [ ]* 23.2 Write unit tests for generators
    - Test each generator produces valid values
    - Test generators respect constraints

- [ ] 24. Final integration and polish
  - [~] 24.1 Wire all components together in main App
    - Create App component with layout (palette, canvas, properties panel, sandbox)
    - Integrate all subsystems
    - Add viewport selector and export button to toolbar
    - Apply light theme styling to entire application
    - _Requirements: 7.1, 7.2_
  
  - [~] 24.2 Implement error boundaries
    - Add React error boundaries around canvas and sandbox
    - Display user-friendly error messages
    - Prevent errors from crashing entire application
    - _Requirements: 3.6_
  
  - [ ]* 24.3 Write integration tests
    - Test complete flow: drag component, edit properties, verify sandbox update
    - Test undo/redo with property changes
    - Test save/load with complete canvas state
    - Test export with multiple components
    - Test template initialization and customization

- [~] 25. Final checkpoint - Ensure all tests pass
  - Run full test suite (unit tests, property tests, integration tests)
  - Verify all 33 correctness properties pass with 100+ iterations
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP
- Each property test must run minimum 100 iterations using fast-check
- Property tests include comment tags referencing design document properties
- All components use TypeScript with React 18+ and Tailwind CSS
- Visual-code parity is critical: canvas and sandbox must render identically
- Real-time sync must complete within 500ms from canvas change to sandbox update
- Sandbox security isolation is enforced via iframe sandbox attributes
- Light theme is applied consistently across all components and UI
