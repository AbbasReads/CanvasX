import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Users,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Command,
  Layers,
  Settings,
  Eye,
  EyeOff,
  Code,
  Hand,
  MousePointer2,
  Palette,
  Check
} from 'lucide-react';
import { useBuilder, themePalettes } from '@/contexts/BuilderContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const mockAvatars = [
  { id: 1, name: 'Alex', color: 'bg-emerald-500' },
  { id: 2, name: 'Jordan', color: 'bg-violet-500' },
  { id: 3, name: 'Sam', color: 'bg-amber-500' },
];

export function TopBar() {
  const {
    zoom,
    setZoom,
    undo,
    redo,
    canUndo,
    canRedo,
    setCommandPaletteOpen,
    previewMode,
    setPreviewMode,
    setExportDialogOpen,
    activeTool,
    setActiveTool,
    activeTheme,
    setActiveTheme,
    setPreviewPanelOpen
  } = useBuilder();

  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  return (
    <motion.header
      className="h-12 glass-panel border-b border-white/[0.06] flex items-center justify-between px-4 z-50 relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left section: Logo + Breadcrumbs */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm tracking-tight">CanvasX</span>
        </div>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <span className="hover:text-foreground cursor-pointer transition-colors">Workspace</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="hover:text-foreground cursor-pointer transition-colors">My Project</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">Homepage</span>
        </nav>
      </div>

      {/* Center section: Tools */}
      <div className="flex items-center gap-1">
        {/* Tool selection */}
        <div className="flex items-center gap-0.5 mr-2 px-1 py-0.5 rounded-md bg-secondary/50 border border-white/[0.04]">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeTool === 'select' ? 'default' : 'ghost'}
                size="icon"
                className={`h-7 w-7 ${activeTool === 'select' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTool('select')}
              >
                <MousePointer2 className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Select Tool (V)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeTool === 'hand' ? 'default' : 'ghost'}
                size="icon"
                className={`h-7 w-7 ${activeTool === 'hand' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTool('hand')}
              >
                <Hand className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Hand Tool (H)</TooltipContent>
          </Tooltip>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5 mr-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={undo}
                disabled={!canUndo}
              >
                <Undo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (⌘Z)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={redo}
                disabled={!canRedo}
              >
                <Redo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (⌘⇧Z)</TooltipContent>
          </Tooltip>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/50 border border-white/[0.04]">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <span className="text-xs font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setZoom(Math.min(2, zoom + 0.25))}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Command palette trigger */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 ml-2"
              onClick={() => setCommandPaletteOpen(true)}
            >
              <Command className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Command Palette (⌘K)</TooltipContent>
        </Tooltip>

        {/* Theme/Palette selector */}
        <div className="relative ml-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              >
                <Palette className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Color Theme</TooltipContent>
          </Tooltip>

          <AnimatePresence>
            {themeDropdownOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setThemeDropdownOpen(false)}
                />
                {/* Dropdown */}
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-48 rounded-lg glass-panel border border-white/[0.08] shadow-xl z-50 p-2"
                >
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1 mb-1">
                    Color Palette
                  </div>
                  {themePalettes.map((theme) => (
                    <button
                      key={theme.id}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-white/[0.06] transition-colors ${activeTheme.id === theme.id ? 'bg-white/[0.08]' : ''
                        }`}
                      onClick={() => {
                        setActiveTheme(theme);
                        setThemeDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.primary }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accent }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.secondary }} />
                      </div>
                      <span className="flex-1 text-left">{theme.name}</span>
                      {activeTheme.id === theme.id && (
                        <Check className="w-3.5 h-3.5 text-primary" />
                      )}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right section: Actions */}
      <div className="flex items-center gap-3">
        {/* Preview toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={previewMode ? 'default' : 'ghost'}
              size="icon"
              className={`h-8 w-8 ${previewMode ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{previewMode ? 'Exit Preview' : 'Preview'}</TooltipContent>
        </Tooltip>

        {/* Live Preview Panel */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 hover:text-emerald-300"
              onClick={() => setPreviewPanelOpen(true)}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Live Preview</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open Live Preview</TooltipContent>
        </Tooltip>

        {/* Export Code */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setExportDialogOpen(true)}
            >
              <Code className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export Code</TooltipContent>
        </Tooltip>
      </div>
    </motion.header>
  );
}
