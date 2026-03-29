# Sandboxed Website Builder - Project Structure

## Overview

This is a React + TypeScript + Vite application for building academic portfolio websites through drag-and-drop interactions.

## Directory Structure

```
src/
├── components/       # React components
│   ├── builder/     # Builder-specific components (canvas, palette, properties panel)
│   ├── landing/     # Landing page components
│   └── ui/          # Reusable UI components (shadcn/ui)
├── contexts/        # React contexts for state management
├── hooks/           # Custom React hooks
├── lib/             # Library code and utilities
├── pages/           # Page components (routing)
├── state/           # State management (reducers, actions)
├── test/            # Test files
├── types/           # TypeScript type definitions
│   ├── canvas.ts    # Core canvas and state types
│   ├── components.ts # Component-specific interfaces
│   └── index.ts     # Type exports
└── utils/           # Utility functions
    ├── constants.ts  # Configuration constants
    ├── idGenerator.ts # ID generation utilities
    └── index.ts      # Utility exports
```

## Key Technologies

- **React 18.3.1**: UI framework
- **TypeScript 5.8.3**: Type safety
- **Vite 7.3.1**: Build tool and dev server
- **Tailwind CSS 3.4.17**: Utility-first styling with light theme
- **@dnd-kit**: Drag and drop functionality
- **Vitest 3.2.4**: Testing framework
- **fast-check 4.6.0**: Property-based testing
- **@testing-library/react**: Component testing

## Theme Configuration

The application uses a **light theme** optimized for academic portfolios:

- Background: White (#ffffff)
- Foreground: Dark gray (#1a1a1a)
- Primary: Professional blue (#2563eb)
- Minimum contrast ratio: 4.5:1 (WCAG AA compliant)

Theme variables are defined in `src/index.css` and can be customized via CSS custom properties.

## Core Types

### Canvas State
- `CanvasState`: Complete application state
- `ComponentInstance`: Individual component on canvas
- `ComponentSchema`: Component definition and properties
- `PropDefinition`: Property metadata for components

### Component Types
- Academic portfolio components (10 types)
- Publications, Research Areas, Teaching Timeline, etc.
- See `src/types/components.ts` for full list

## Testing

Run tests with:
```bash
npm test          # Run once
npm run test:watch # Watch mode
```

Property-based tests use fast-check with minimum 100 iterations per test.

## Development

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # Run ESLint
```

## Next Steps

Task 1 is complete. The following tasks will implement:
- Canvas state management (Task 2)
- History management for undo/redo (Task 3)
- Component registry and schemas (Task 4)
- Academic portfolio components (Task 5)
- And more...
