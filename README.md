# CanvasX

A modern visual website builder with AI-powered design assistance. Build production-ready websites using natural language and intuitive drag-and-drop.

## Features

- **Infinite Canvas** - Unlimited workspace with precision snap-to-grid
- **AI Agent** - Natural language commands for design modifications
- **Live Preview** - Real-time rendering of your designs
- **Component Library** - Pre-built UI components powered by shadcn/ui
- **Export Code** - Generate clean React/Tailwind code
- **Theme System** - Multiple color palettes with instant switching

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **Routing**: React Router
- **AI Integration**: Tambo AI
- **State Management**: React Context + Zustand

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd canvasx

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── builder/      # Canvas builder components
│   │   ├── landing/      # Landing page components
│   │   └── ui/           # Reusable UI components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and helpers
│   ├── pages/            # Page components
│   └── main.tsx          # Application entry point
├── public/               # Static assets
└── package.json
```

## Deployment

Build the project for production:

```bash
npm run build
```

The optimized build will be in the `dist` folder. Deploy to:

- **Vercel**: Connect your repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **GitHub Pages**: Use the built-in GitHub Actions workflow

## License

MIT
