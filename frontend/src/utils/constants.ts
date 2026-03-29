/**
 * Constants and configuration for the Sandboxed Website Builder
 */

import { ThemeConfig, ViewportConfig } from '../types';

/**
 * Light theme configuration for academic portfolios
 * Ensures professional appearance with high contrast ratios (4.5:1 minimum)
 */
export const LIGHT_THEME: ThemeConfig = {
  colors: {
    background: '#ffffff',
    foreground: '#1a1a1a',
    primary: '#2563eb', // Blue
    secondary: '#64748b', // Slate
    accent: '#3b82f6',
    muted: '#f1f5f9',
    border: '#e2e8f0',
  },
  spacing: {
    componentGap: '2rem',
    sectionPadding: '3rem',
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    headingSizes: {
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.5rem',
    },
  },
};

/**
 * Viewport configurations for responsive preview
 */
export const VIEWPORTS: ViewportConfig[] = [
  { mode: 'desktop', width: 1920, label: 'Desktop (1920px)' },
  { mode: 'tablet', width: 768, label: 'Tablet (768px)' },
  { mode: 'mobile', width: 375, label: 'Mobile (375px)' },
];

/**
 * Maximum number of undo/redo states to maintain
 */
export const MAX_HISTORY_SIZE = 50;

/**
 * Debounce delay for canvas state changes (milliseconds)
 */
export const CANVAS_DEBOUNCE_DELAY = 100;

/**
 * Auto-save delay for local storage persistence (milliseconds)
 */
export const AUTO_SAVE_DELAY = 2000;

/**
 * Maximum time for canvas-to-sandbox sync (milliseconds)
 */
export const MAX_SYNC_TIME = 500;

/**
 * Storage keys for local storage
 */
export const STORAGE_KEYS = {
  INDEX: 'portfolio-builder:index',
  PROJECT_PREFIX: 'portfolio-builder:project:',
  CURRENT: 'portfolio-builder:current',
} as const;

/**
 * Schema version for migrations
 */
export const SCHEMA_VERSION = '1.0.0';
