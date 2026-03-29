# Requirements Document

## Introduction

This document specifies requirements for a sandboxed website builder that enables professors and academics to create single-page portfolio websites through drag-and-drop interactions. The system provides a visual canvas for component placement and a sandboxed preview environment that renders the exact code output in real-time. The builder includes pre-built UI components tailored for academic portfolios (publications, research areas, teaching experience, etc.) with a light theme design, ensuring visual parity between the canvas representation and the generated code execution.

## Glossary

- **Canvas**: The visual editing surface where professors arrange components
- **Sandbox**: An isolated iframe environment that executes generated code
- **Component_Library**: A collection of pre-built, drag-and-drop UI components tailored for academic portfolios
- **Preview_Renderer**: The system that renders generated code in the sandbox
- **Code_Generator**: The system that transforms canvas state into executable code
- **Component_Palette**: The left sidebar containing draggable academic portfolio components
- **Properties_Panel**: The right sidebar for editing selected component properties
- **Canvas_State**: The data structure representing all components and their properties
- **Light_Theme**: A color scheme with light backgrounds and dark text
- **Real_Time_Sync**: The mechanism that keeps canvas and sandbox in sync
- **Academic_Component**: A UI component specifically designed for academic portfolio content (publications, research, teaching, etc.)
- **Portfolio_Website**: A single-page website showcasing a professor's academic profile and work

## Requirements

### Requirement 1: Drag-and-Drop Component Placement

**User Story:** As a professor, I want to drag components from a palette onto the canvas, so that I can quickly build my portfolio website without writing code.

#### Acceptance Criteria

1. THE Component_Palette SHALL display all available Academic_Components with visual previews
2. WHEN a professor drags a component from the Component_Palette, THE Canvas SHALL show a visual indicator of the drop target
3. WHEN a professor drops a component onto the Canvas, THE Canvas SHALL add the component at the drop location
4. WHEN a component is added to the Canvas, THE Canvas_State SHALL update to include the new component with default properties
5. THE Canvas SHALL support repositioning components by dragging them to new locations
6. WHEN a professor drags a component on the Canvas, THE Canvas SHALL provide smooth vertical stacking without grid constraints

### Requirement 2: Academic Portfolio Component Library

**User Story:** As a professor, I want access to ready-to-use academic portfolio components, so that I can showcase my research, publications, and teaching experience professionally.

#### Acceptance Criteria

1. THE Component_Library SHALL include these Academic_Components: General Info Section, Publications Carousel, Publications List, Research Areas Grid, Teaching Experience Timeline, Image Gallery, External Links Bar (Google Scholar, ResearchGate, LinkedIn, ORCID), Contact Information Card, Education/Credentials Section, and Bio/About Section
2. THE Component_Library SHALL provide each Academic_Component with sensible default properties and placeholder content relevant to academic portfolios
3. THE Component_Library SHALL render each Academic_Component with the Light_Theme color scheme
4. WHEN an Academic_Component is instantiated, THE Component_Library SHALL assign it a unique identifier
5. THE Component_Library SHALL define a schema for each Academic_Component type specifying available properties and their types
6. THE Publications_Carousel SHALL support navigation between publication entries with previous/next controls
7. THE External_Links_Bar SHALL include icon buttons for common academic platforms with configurable URLs

### Requirement 3: Sandboxed Preview Environment

**User Story:** As a professor, I want to see my portfolio website rendered exactly as it will appear in production, so that I can verify the design before exporting.

#### Acceptance Criteria

1. THE Sandbox SHALL execute generated code in an isolated iframe environment
2. THE Sandbox SHALL prevent code execution from accessing parent window context
3. THE Sandbox SHALL apply the same styling system used by the Component_Library
4. WHEN the Canvas_State changes, THE Preview_Renderer SHALL regenerate code within 100 milliseconds
5. WHEN new code is generated, THE Sandbox SHALL reload and render the updated output within 500 milliseconds
6. THE Sandbox SHALL display runtime errors in a non-intrusive error overlay
7. THE Sandbox SHALL render Academic_Components with identical visual appearance to the Canvas representation

### Requirement 4: Visual-Code Parity

**User Story:** As a website creator, I want the canvas representation to match the sandbox output exactly, so that I can trust what I see is what I get.

#### Acceptance Criteria

1. THE Canvas SHALL render components using the same React components as the Sandbox
2. WHEN a component property is modified, THE Canvas and Sandbox SHALL display identical visual changes
3. THE Code_Generator SHALL produce code that renders components with the exact same props as the Canvas
4. THE Canvas and Sandbox SHALL use identical CSS class names and Tailwind utility classes
5. WHEN a component has custom styling, THE Canvas and Sandbox SHALL apply the same inline styles and CSS classes

### Requirement 5: Code Generation and Synchronization

**User Story:** As a website creator, I want my canvas changes to automatically update the preview, so that I can see results immediately without manual refresh.

#### Acceptance Criteria

1. WHEN the Canvas_State changes, THE Code_Generator SHALL transform the state into valid React component code
2. THE Code_Generator SHALL produce self-contained code that includes all necessary imports
3. THE Code_Generator SHALL generate code that uses the same component implementations as the Canvas
4. THE Real_Time_Sync SHALL debounce Canvas_State changes by 100 milliseconds before triggering code generation
5. WHEN code generation completes, THE Real_Time_Sync SHALL inject the new code into the Sandbox

### Requirement 6: Component Property Editing

**User Story:** As a professor, I want to edit component properties through a visual interface, so that I can customize my portfolio content without writing code.

#### Acceptance Criteria

1. WHEN a professor selects a component on the Canvas, THE Properties_Panel SHALL display all editable properties for that Academic_Component
2. THE Properties_Panel SHALL provide appropriate input controls for each property type (text inputs for names and titles, text areas for descriptions, color pickers, number inputs, dropdowns, URL inputs for links)
3. WHEN a professor modifies a property in the Properties_Panel, THE Canvas SHALL update the component immediately
4. WHEN a property is modified, THE Sandbox SHALL reflect the change within 500 milliseconds
5. THE Properties_Panel SHALL validate property values and display error messages for invalid inputs
6. FOR Publications_Carousel and Publications_List components, THE Properties_Panel SHALL support adding, editing, and removing individual publication entries
7. FOR External_Links_Bar component, THE Properties_Panel SHALL provide URL inputs for each academic platform link

### Requirement 7: Light Theme Design

**User Story:** As a professor, I want the builder and generated portfolio website to use a light theme, so that the interface is bright, professional, and accessible.

#### Acceptance Criteria

1. THE Canvas SHALL use a light background color (white or near-white)
2. THE Component_Palette and Properties_Panel SHALL use light theme colors
3. THE Component_Library SHALL style all Academic_Components with light backgrounds and dark text by default
4. THE Sandbox SHALL render Portfolio_Websites with a light theme color scheme
5. THE Light_Theme SHALL maintain a minimum contrast ratio of 4.5:1 between text and backgrounds for accessibility
6. THE Academic_Components SHALL use professional color accents suitable for academic contexts (subtle blues, grays, or neutral tones)

### Requirement 8: Component Resizing and Layout Control

**User Story:** As a professor, I want to control component sizing and layout, so that I can create a custom portfolio design.

#### Acceptance Criteria

1. WHEN an Academic_Component is selected on the Canvas, THE Canvas SHALL display resize handles if the component supports custom dimensions
2. WHEN a professor drags a resize handle, THE Canvas SHALL update the component dimensions in real-time
3. THE Canvas SHALL enforce minimum dimensions appropriate for each Academic_Component type to maintain readability
4. WHEN a component is resized, THE Sandbox SHALL render the component with the new dimensions within 500 milliseconds
5. THE Properties_Panel SHALL display width settings (full-width, contained, custom) for applicable Academic_Components
6. THE Canvas SHALL support full-width components that span the entire viewport width

### Requirement 9: Project State Management

**User Story:** As a professor, I want my portfolio work to be automatically saved, so that I don't lose progress if I close the browser.

#### Acceptance Criteria

1. WHEN the Canvas_State changes, THE System SHALL save the state to browser local storage within 2 seconds
2. WHEN the application loads, THE System SHALL restore the most recent Canvas_State from local storage
3. THE System SHALL store project metadata including professor name, portfolio title, and last modified timestamp
4. THE System SHALL support multiple saved portfolio projects with unique identifiers
5. WHEN local storage is unavailable, THE System SHALL display a warning message to the professor

### Requirement 10: Code Export

**User Story:** As a professor, I want to export my portfolio website as code, so that I can deploy it to a web server or hosting platform.

#### Acceptance Criteria

1. THE System SHALL provide an export function accessible from the main interface
2. WHEN a professor triggers export, THE Code_Generator SHALL produce a complete React component file for the Portfolio_Website
3. THE Code_Generator SHALL include all necessary imports and dependencies in the exported code
4. THE exported code SHALL be formatted with proper indentation and readable structure
5. THE System SHALL provide the exported code in a copyable text format or downloadable file
6. THE exported code SHALL include all Academic_Component implementations needed to render the portfolio independently

### Requirement 11: Sandbox Security Isolation

**User Story:** As a professor, I want the preview environment to be secure, so that generated code cannot access my builder data or perform malicious actions.

#### Acceptance Criteria

1. THE Sandbox SHALL use iframe sandbox attributes to restrict capabilities
2. THE Sandbox SHALL disable access to parent window, cookies, and local storage
3. THE Sandbox SHALL prevent navigation away from the preview page
4. THE Sandbox SHALL block form submissions and popup windows
5. WHEN generated code attempts restricted operations, THE Sandbox SHALL silently block the operation without crashing
6. THE Sandbox SHALL allow rendering of external academic platform icons and images from trusted CDNs

### Requirement 12: Undo and Redo Operations

**User Story:** As a professor, I want to undo and redo my actions, so that I can experiment freely with my portfolio design and recover from mistakes.

#### Acceptance Criteria

1. THE System SHALL maintain a history of Canvas_State changes with a maximum of 50 states
2. WHEN a professor triggers undo, THE System SHALL restore the previous Canvas_State
3. WHEN a professor triggers redo, THE System SHALL restore the next Canvas_State in history
4. THE System SHALL provide keyboard shortcuts (Ctrl+Z for undo, Ctrl+Shift+Z for redo)
5. WHEN the Canvas_State is restored via undo or redo, THE Sandbox SHALL update to match the restored state within 500 milliseconds

### Requirement 13: Component Selection and Deletion

**User Story:** As a professor, I want to select and delete components, so that I can remove unwanted elements from my portfolio website.

#### Acceptance Criteria

1. WHEN a professor clicks an Academic_Component on the Canvas, THE Canvas SHALL mark that component as selected
2. WHEN a component is selected, THE Canvas SHALL display a visual selection indicator (border or highlight)
3. THE System SHALL provide a delete button or keyboard shortcut (Delete or Backspace) to remove selected components
4. WHEN a component is deleted, THE Canvas_State SHALL update to remove the component
5. WHEN a component is deleted, THE Sandbox SHALL update to reflect the removal within 500 milliseconds

### Requirement 14: Responsive Canvas Viewport

**User Story:** As a professor, I want to preview my portfolio at different screen sizes, so that I can ensure it looks good on desktop and mobile devices.

#### Acceptance Criteria

1. THE Canvas SHALL support viewport preview modes for desktop (1920px), tablet (768px), and mobile (375px) widths
2. WHEN a professor selects a viewport mode, THE Canvas SHALL resize to display the Portfolio_Website at that width
3. THE Sandbox SHALL render the Portfolio_Website at the same viewport width as the Canvas
4. THE Canvas SHALL display the current viewport mode and width
5. THE Academic_Components SHALL adapt their layout responsively based on viewport width
6. WHEN the viewport mode changes, component interactions (drag, resize, select) SHALL remain accurate

### Requirement 15: Component Ordering and Reordering

**User Story:** As a professor, I want to reorder components on my portfolio page, so that I can organize content in the most effective sequence.

#### Acceptance Criteria

1. THE Canvas_State SHALL maintain an ordered list of Academic_Components representing their vertical sequence
2. THE Canvas SHALL render components in sequence order from top to bottom
3. THE System SHALL provide controls to move selected components up or down in the sequence
4. WHEN component order changes, THE Sandbox SHALL render components in the same sequence within 500 milliseconds
5. THE Canvas SHALL support drag-and-drop reordering by dragging a component to a new position in the vertical sequence
6. WHEN a component is dragged between other components, THE Canvas SHALL display a visual insertion indicator


### Requirement 16: Publications Management

**User Story:** As a professor, I want to add and manage my publications, so that I can showcase my research output on my portfolio website.

#### Acceptance Criteria

1. THE Publications_Carousel SHALL display publication entries with title, authors, venue, year, and optional abstract
2. THE Publications_List SHALL display publications in a vertical list format with the same information fields
3. WHEN a professor adds a publication entry, THE Properties_Panel SHALL provide input fields for title, authors, venue, year, DOI, and abstract
4. THE Publications_Carousel SHALL support navigation between entries with previous and next buttons
5. THE Publications_Carousel and Publications_List SHALL support reordering publications by drag-and-drop or manual ordering controls
6. WHEN publication data is modified, THE Sandbox SHALL reflect the changes within 500 milliseconds
7. THE Publications components SHALL support optional links to PDF files or external publication pages

### Requirement 17: Research Areas Display

**User Story:** As a professor, I want to display my research areas and interests, so that visitors understand my academic focus.

#### Acceptance Criteria

1. THE Research_Areas_Grid SHALL display research topics in a grid or tag-based layout
2. WHEN a professor adds a research area, THE Properties_Panel SHALL provide an input field for the area name and optional description
3. THE Research_Areas_Grid SHALL support adding, editing, and removing individual research areas
4. THE Research_Areas_Grid SHALL display each research area with consistent styling in the Light_Theme
5. WHEN research areas are modified, THE Sandbox SHALL reflect the changes within 500 milliseconds

### Requirement 18: Teaching Experience Timeline

**User Story:** As a professor, I want to display my teaching history, so that I can showcase my educational contributions.

#### Acceptance Criteria

1. THE Teaching_Experience_Timeline SHALL display teaching positions in chronological order
2. WHEN a professor adds a teaching entry, THE Properties_Panel SHALL provide input fields for course name, institution, semester/year, and optional description
3. THE Teaching_Experience_Timeline SHALL support adding, editing, and removing individual teaching entries
4. THE Teaching_Experience_Timeline SHALL display entries with clear visual separation and chronological indicators
5. WHEN teaching data is modified, THE Sandbox SHALL reflect the changes within 500 milliseconds

### Requirement 19: External Academic Links Integration

**User Story:** As a professor, I want to link to my profiles on academic platforms, so that visitors can find my work on Google Scholar, ResearchGate, and other services.

#### Acceptance Criteria

1. THE External_Links_Bar SHALL include icon buttons for Google Scholar, ResearchGate, LinkedIn, ORCID, GitHub, and personal website
2. WHEN a professor configures the External_Links_Bar, THE Properties_Panel SHALL provide URL input fields for each platform
3. THE External_Links_Bar SHALL display only the icons for platforms where URLs have been provided
4. THE External_Links_Bar SHALL use recognizable icons or logos for each academic platform
5. WHEN a URL is added or modified, THE Sandbox SHALL update the links within 500 milliseconds
6. THE External_Links_Bar SHALL open links in a new tab when clicked in the exported Portfolio_Website

### Requirement 20: Contact Information Component

**User Story:** As a professor, I want to display my contact information, so that students and colleagues can reach me.

#### Acceptance Criteria

1. THE Contact_Information_Card SHALL display email, office location, phone number, and office hours
2. WHEN a professor configures the Contact_Information_Card, THE Properties_Panel SHALL provide input fields for each contact detail
3. THE Contact_Information_Card SHALL support optional fields, displaying only the information provided
4. THE Contact_Information_Card SHALL format contact information in a clear, readable layout with appropriate icons
5. WHEN contact information is modified, THE Sandbox SHALL reflect the changes within 500 milliseconds

### Requirement 21: Bio and About Section

**User Story:** As a professor, I want to write a biographical section, so that visitors can learn about my background and interests.

#### Acceptance Criteria

1. THE Bio_Section SHALL display a heading, profile image, and rich text content
2. WHEN a professor configures the Bio_Section, THE Properties_Panel SHALL provide a text area for biographical content and an image upload or URL input
3. THE Bio_Section SHALL support multi-paragraph text with basic formatting (line breaks)
4. THE Bio_Section SHALL display the profile image with appropriate sizing and positioning (left, right, or centered)
5. WHEN bio content or image is modified, THE Sandbox SHALL reflect the changes within 500 milliseconds

### Requirement 22: Education and Credentials Display

**User Story:** As a professor, I want to display my educational background and credentials, so that visitors can see my qualifications.

#### Acceptance Criteria

1. THE Education_Section SHALL display degree entries with degree type, field, institution, and year
2. WHEN a professor adds an education entry, THE Properties_Panel SHALL provide input fields for degree, field, institution, year, and optional honors or notes
3. THE Education_Section SHALL support adding, editing, and removing individual education entries
4. THE Education_Section SHALL display entries in reverse chronological order (most recent first)
5. WHEN education data is modified, THE Sandbox SHALL reflect the changes within 500 milliseconds

### Requirement 23: Image Gallery Component

**User Story:** As a professor, I want to display images from my research or academic activities, so that I can visually showcase my work.

#### Acceptance Criteria

1. THE Image_Gallery SHALL display multiple images in a grid layout
2. WHEN a professor configures the Image_Gallery, THE Properties_Panel SHALL provide controls to add images via URL or upload
3. THE Image_Gallery SHALL support adding captions to individual images
4. THE Image_Gallery SHALL support removing images from the gallery
5. WHEN images or captions are modified, THE Sandbox SHALL reflect the changes within 500 milliseconds
6. THE Image_Gallery SHALL display images with consistent sizing and spacing in the Light_Theme

### Requirement 24: Component Templates and Quick Start

**User Story:** As a professor, I want to start with a pre-populated template, so that I can quickly create a portfolio by filling in my information.

#### Acceptance Criteria

1. WHEN a professor creates a new portfolio project, THE System SHALL offer template options (minimal, standard, comprehensive)
2. THE minimal template SHALL include Bio_Section, Contact_Information_Card, and External_Links_Bar
3. THE standard template SHALL include Bio_Section, Research_Areas_Grid, Publications_List, and Contact_Information_Card
4. THE comprehensive template SHALL include all available Academic_Components with placeholder content
5. WHEN a professor selects a template, THE Canvas_State SHALL initialize with the template components
6. THE Sandbox SHALL render the selected template immediately upon project creation

### Requirement 25: Real-Time Canvas-Sandbox Synchronization

**User Story:** As a professor, I want the preview to update instantly as I make changes, so that I can see exactly how my portfolio will look without delays.

#### Acceptance Criteria

1. WHEN any Academic_Component property changes, THE Real_Time_Sync SHALL trigger code regeneration within 100 milliseconds
2. THE Code_Generator SHALL produce code that uses identical React components as the Canvas
3. THE Sandbox SHALL apply the same CSS classes and inline styles as the Canvas for each Academic_Component
4. WHEN the Canvas renders an Academic_Component with specific props, THE Sandbox SHALL render the same component with identical props
5. THE Real_Time_Sync SHALL debounce rapid changes to prevent excessive regeneration
6. FOR ALL Academic_Components, the visual appearance in the Canvas SHALL match the Sandbox output exactly (pixel-perfect parity)
