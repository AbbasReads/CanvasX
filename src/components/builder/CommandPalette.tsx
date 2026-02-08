import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Layout,
  Type,
  Image,
  Square,
  Settings,
  Undo2,
  Redo2,
  Trash2,
  Copy,
  Clipboard,
  Download,
  Upload,
  Sparkles,
  Navigation2,
  CreditCard,
  Command,
  Eye,
  Code2,
  ZoomIn,
  ZoomOut,
  Maximize,
  PanelLeft,
  PanelRight,
  Hand,
  MousePointer2,
  Eraser,
  LayoutGrid,
  MessageSquareQuote,
  DollarSign,
  HelpCircle,
  Footprints,
  Users,
  XCircle
} from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Input } from '@/components/ui/input';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  category: 'action' | 'element' | 'navigation' | 'view';
  shortcut?: string;
  action: () => void;
}

export function CommandPalette() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    addElement,
    undo,
    redo,
    canUndo,
    canRedo,
    selectedId,
    removeElement,
    elements,
    setElements,
    selectElement,
    setPreviewPanelOpen,
    setExportDialogOpen,
    setZoom,
    zoom,
    setLeftSidebarOpen,
    leftSidebarOpen,
    setRightSidebarOpen,
    rightSidebarOpen,
    setActiveTool,
    activeTool,
    setPreviewMode,
    previewMode
  } = useBuilder();

  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const generateId = () => `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const commands: CommandItem[] = useMemo(() => [
    // Actions
    {
      id: 'undo',
      label: 'Undo',
      icon: Undo2,
      category: 'action',
      shortcut: '⌘Z',
      action: () => canUndo && undo()
    },
    {
      id: 'redo',
      label: 'Redo',
      icon: Redo2,
      category: 'action',
      shortcut: '⌘⇧Z',
      action: () => canRedo && redo()
    },
    {
      id: 'delete',
      label: 'Delete Selected',
      icon: Trash2,
      category: 'action',
      shortcut: '⌫',
      action: () => selectedId && removeElement(selectedId)
    },
    {
      id: 'duplicate',
      label: 'Duplicate Selected',
      icon: Copy,
      category: 'action',
      shortcut: '⌘D',
      action: () => {
        if (selectedId) {
          const el = elements.find(e => e.id === selectedId);
          if (el) {
            addElement({
              ...el,
              id: generateId(),
              x: el.x + 20,
              y: el.y + 20,
            });
          }
        }
      }
    },
    // Elements
    {
      id: 'add-section',
      label: 'Add Section',
      description: 'Container for content',
      icon: Layout,
      category: 'element',
      action: () => addElement({
        id: generateId(),
        type: 'section',
        x: 100,
        y: 100,
        width: 400,
        height: 200,
        label: 'Section',
      })
    },
    {
      id: 'add-navbar',
      label: 'Add Navbar',
      description: 'Navigation bar component',
      icon: Navigation2,
      category: 'element',
      action: () => addElement({
        id: generateId(),
        type: 'navbar',
        x: 100,
        y: 50,
        width: 800,
        height: 60,
        label: 'Navbar',
      })
    },
    {
      id: 'add-hero',
      label: 'Add Hero Section',
      description: 'Large hero banner',
      icon: Sparkles,
      category: 'element',
      action: () => addElement({
        id: generateId(),
        type: 'hero',
        x: 100,
        y: 120,
        width: 800,
        height: 400,
        label: 'Hero',
      })
    },
    {
      id: 'add-button',
      label: 'Add Button',
      description: 'Interactive button',
      icon: Square,
      category: 'element',
      action: () => addElement({
        id: generateId(),
        type: 'button',
        x: 200,
        y: 200,
        width: 120,
        height: 40,
        label: 'Button',
      })
    },
    {
      id: 'add-text',
      label: 'Add Text Block',
      description: 'Text content area',
      icon: Type,
      category: 'element',
      action: () => addElement({
        id: generateId(),
        type: 'text',
        x: 200,
        y: 200,
        width: 300,
        height: 100,
        label: 'Text Block',
      })
    },
    {
      id: 'add-image',
      label: 'Add Image',
      description: 'Image placeholder',
      icon: Image,
      category: 'element',
      action: () => addElement({
        id: generateId(),
        type: 'image',
        x: 200,
        y: 200,
        width: 300,
        height: 200,
        label: 'Image',
      })
    },
    {
      id: 'add-card',
      label: 'Add Card',
      description: 'Content card component',
      icon: CreditCard,
      category: 'element',
      action: () => addElement({
        id: generateId(),
        type: 'card',
        x: 200,
        y: 200,
        width: 320,
        height: 240,
        label: 'Card',
      })
    },
    // Missing Elements - Marquee, Features, Testimonials, Pricing, FAQ, Footer
    {
      id: 'add-marquee',
      label: 'Add Marquee',
      description: 'Logo cloud / scrolling marquee',
      icon: Users,
      category: 'element',
      action: () => addElement({
        id: generateId(),
        type: 'marquee',
        x: 100,
        y: 300,
        width: 800,
        height: 100,
        label: 'Marquee',
      })
    },
    {
      id: 'add-features',
      label: 'Add Features Section',
      description: 'Feature grid with icons',
      icon: LayoutGrid,
      category: 'element',
      action: () => addElement({
        id: generateId(),
        type: 'features',
        x: 100,
        y: 400,
        width: 800,
        height: 400,
        label: 'Features',
      })
    },
    {
      id: 'add-testimonials',
      label: 'Add Testimonials',
      description: 'Customer testimonials section',
      icon: MessageSquareQuote,
      category: 'element',
      action: () => addElement({
        id: generateId(),
        type: 'testimonials',
        x: 100,
        y: 500,
        width: 800,
        height: 300,
        label: 'Testimonials',
      })
    },
    {
      id: 'add-pricing',
      label: 'Add Pricing Section',
      description: 'Pricing cards and plans',
      icon: DollarSign,
      category: 'element',
      action: () => addElement({
        id: generateId(),
        type: 'pricing',
        x: 100,
        y: 600,
        width: 800,
        height: 500,
        label: 'Pricing',
      })
    },
    {
      id: 'add-faq',
      label: 'Add FAQ Section',
      description: 'Frequently asked questions',
      icon: HelpCircle,
      category: 'element',
      action: () => addElement({
        id: generateId(),
        type: 'faq',
        x: 100,
        y: 700,
        width: 800,
        height: 400,
        label: 'FAQ',
      })
    },
    {
      id: 'add-footer',
      label: 'Add Footer',
      description: 'Page footer component',
      icon: Footprints,
      category: 'element',
      action: () => addElement({
        id: generateId(),
        type: 'footer',
        x: 100,
        y: 800,
        width: 800,
        height: 200,
        label: 'Footer',
      })
    },
    // View Actions
    {
      id: 'open-preview',
      label: 'Open Preview',
      description: 'Open live preview panel',
      icon: Eye,
      category: 'view',
      shortcut: '⌘P',
      action: () => setPreviewPanelOpen(true)
    },
    {
      id: 'export-code',
      label: 'Export Code',
      description: 'Export project as code',
      icon: Code2,
      category: 'view',
      shortcut: '⌘E',
      action: () => setExportDialogOpen(true)
    },
    {
      id: 'zoom-in',
      label: 'Zoom In',
      description: 'Increase canvas zoom',
      icon: ZoomIn,
      category: 'view',
      shortcut: '⌘+',
      action: () => setZoom(Math.min(zoom + 0.25, 3))
    },
    {
      id: 'zoom-out',
      label: 'Zoom Out',
      description: 'Decrease canvas zoom',
      icon: ZoomOut,
      category: 'view',
      shortcut: '⌘-',
      action: () => setZoom(Math.max(zoom - 0.25, 0.25))
    },
    {
      id: 'zoom-reset',
      label: 'Reset Zoom',
      description: 'Reset zoom to 100%',
      icon: Maximize,
      category: 'view',
      shortcut: '⌘0',
      action: () => setZoom(1)
    },
    {
      id: 'toggle-left-sidebar',
      label: 'Toggle Left Sidebar',
      description: 'Show/hide component library',
      icon: PanelLeft,
      category: 'view',
      shortcut: '⌘[',
      action: () => setLeftSidebarOpen(!leftSidebarOpen)
    },
    {
      id: 'toggle-right-sidebar',
      label: 'Toggle Right Sidebar',
      description: 'Show/hide properties panel',
      icon: PanelRight,
      category: 'view',
      shortcut: '⌘]',
      action: () => setRightSidebarOpen(!rightSidebarOpen)
    },
    {
      id: 'toggle-preview-mode',
      label: 'Toggle Preview Mode',
      description: 'Switch between edit and preview',
      icon: Eye,
      category: 'view',
      action: () => setPreviewMode(!previewMode)
    },
    {
      id: 'select-tool',
      label: 'Select Tool',
      description: 'Switch to selection mode',
      icon: MousePointer2,
      category: 'view',
      shortcut: 'V',
      action: () => setActiveTool('select')
    },
    {
      id: 'hand-tool',
      label: 'Hand Tool',
      description: 'Switch to pan mode',
      icon: Hand,
      category: 'view',
      shortcut: 'H',
      action: () => setActiveTool('hand')
    },
    {
      id: 'clear-canvas',
      label: 'Clear Canvas',
      description: 'Remove all elements',
      icon: Eraser,
      category: 'action',
      action: () => {
        if (elements.length > 0 && confirm('Are you sure you want to clear the canvas?')) {
          setElements([]);
        }
      }
    },
    {
      id: 'deselect-all',
      label: 'Deselect All',
      description: 'Clear current selection',
      icon: XCircle,
      category: 'action',
      shortcut: 'Esc',
      action: () => selectElement(null)
    },
    // Navigation
    {
      id: 'settings',
      label: 'Open Settings',
      icon: Settings,
      category: 'navigation',
      action: () => console.log('Open settings')
    },
  ], [canUndo, canRedo, undo, redo, selectedId, removeElement, elements, addElement, setPreviewPanelOpen, setExportDialogOpen, setZoom, zoom, setLeftSidebarOpen, leftSidebarOpen, setRightSidebarOpen, rightSidebarOpen, setActiveTool, setPreviewMode, previewMode, setElements, selectElement]);

  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    const query = search.toLowerCase();
    return commands.filter(cmd =>
      cmd.label.toLowerCase().includes(query) ||
      cmd.description?.toLowerCase().includes(query)
    );
  }, [commands, search]);

  // Keyboard navigation and global shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (!commandPaletteOpen) {
        // Open with Cmd+K
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          setCommandPaletteOpen(true);
          return;
        }

        // Global shortcuts (only when not typing in an input)
        if (!isTyping) {
          // Tool shortcuts
          if (e.key === 'v' || e.key === 'V') {
            e.preventDefault();
            setActiveTool('select');
            return;
          }
          if (e.key === 'h' || e.key === 'H') {
            e.preventDefault();
            setActiveTool('hand');
            return;
          }
        }

        // Cmd/Ctrl shortcuts (work even when typing)
        if (e.metaKey || e.ctrlKey) {
          switch (e.key) {
            case 'z':
            case 'Z':
              e.preventDefault();
              if (e.shiftKey) {
                // Cmd+Shift+Z = Redo
                if (canRedo) redo();
              } else {
                // Cmd+Z = Undo
                if (canUndo) undo();
              }
              return;
            case 'd':
            case 'D':
              e.preventDefault();
              // Duplicate selected element
              if (selectedId) {
                const el = elements.find(e => e.id === selectedId);
                if (el) {
                  addElement({
                    ...el,
                    id: `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    x: el.x + 20,
                    y: el.y + 20,
                  });
                }
              }
              return;
            case 'p':
            case 'P':
              e.preventDefault();
              setPreviewPanelOpen(true);
              return;
            case 'e':
            case 'E':
              e.preventDefault();
              setExportDialogOpen(true);
              return;
            case '=':
            case '+':
              e.preventDefault();
              setZoom(Math.min(zoom + 0.25, 3));
              return;
            case '-':
            case '_':
              e.preventDefault();
              setZoom(Math.max(zoom - 0.25, 0.25));
              return;
            case '0':
              e.preventDefault();
              setZoom(1);
              return;
            case '[':
              e.preventDefault();
              setLeftSidebarOpen(!leftSidebarOpen);
              return;
            case ']':
              e.preventDefault();
              setRightSidebarOpen(!rightSidebarOpen);
              return;
          }
        }

        // Non-Cmd shortcuts (only when not typing)
        if (!isTyping) {
          // Delete/Backspace to remove selected element
          if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            if (selectedId) removeElement(selectedId);
            return;
          }

          // Escape to deselect
          if (e.key === 'Escape') {
            e.preventDefault();
            selectElement(null);
            return;
          }
        }

        return;
      }

      // Command palette navigation
      switch (e.key) {
        case 'Escape':
          setCommandPaletteOpen(false);
          setSearch('');
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            setCommandPaletteOpen(false);
            setSearch('');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen, filteredCommands, selectedIndex, setActiveTool, setPreviewPanelOpen, setExportDialogOpen, setZoom, zoom, setLeftSidebarOpen, leftSidebarOpen, setRightSidebarOpen, rightSidebarOpen, undo, redo, canUndo, canRedo, removeElement, addElement, elements, selectedId, selectElement]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {
      action: [],
      element: [],
      view: [],
      navigation: [],
    };
    filteredCommands.forEach(cmd => {
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="command-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setCommandPaletteOpen(false);
              setSearch('');
            }}
          />

          {/* Dialog */}
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="command-dialog"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
                <Command className="w-4 h-4 text-muted-foreground shrink-0" />
                <Input
                  placeholder="Type a command or search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 h-8 border-0 bg-transparent focus-visible:ring-0 text-sm placeholder:text-muted-foreground"
                  autoFocus
                />
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/[0.1] bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  ESC
                </kbd>
              </div>

              {/* Commands list */}
              <div className="max-h-80 overflow-y-auto py-2">
                {filteredCommands.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No commands found
                  </div>
                ) : (
                  <>
                    {/* Actions */}
                    {groupedCommands.action.length > 0 && (
                      <div className="mb-2">
                        <div className="px-4 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Actions
                        </div>
                        {groupedCommands.action.map((cmd, i) => {
                          const globalIndex = filteredCommands.indexOf(cmd);
                          return (
                            <CommandRow
                              key={cmd.id}
                              command={cmd}
                              isSelected={globalIndex === selectedIndex}
                              onSelect={() => {
                                cmd.action();
                                setCommandPaletteOpen(false);
                                setSearch('');
                              }}
                              onHover={() => setSelectedIndex(globalIndex)}
                            />
                          );
                        })}
                      </div>
                    )}

                    {/* Elements */}
                    {groupedCommands.element.length > 0 && (
                      <div className="mb-2">
                        <div className="px-4 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Add Element
                        </div>
                        {groupedCommands.element.map((cmd) => {
                          const globalIndex = filteredCommands.indexOf(cmd);
                          return (
                            <CommandRow
                              key={cmd.id}
                              command={cmd}
                              isSelected={globalIndex === selectedIndex}
                              onSelect={() => {
                                cmd.action();
                                setCommandPaletteOpen(false);
                                setSearch('');
                              }}
                              onHover={() => setSelectedIndex(globalIndex)}
                            />
                          );
                        })}
                      </div>
                    )}

                    {/* View Actions */}
                    {groupedCommands.view.length > 0 && (
                      <div className="mb-2">
                        <div className="px-4 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                          View
                        </div>
                        {groupedCommands.view.map((cmd) => {
                          const globalIndex = filteredCommands.indexOf(cmd);
                          return (
                            <CommandRow
                              key={cmd.id}
                              command={cmd}
                              isSelected={globalIndex === selectedIndex}
                              onSelect={() => {
                                cmd.action();
                                setCommandPaletteOpen(false);
                                setSearch('');
                              }}
                              onHover={() => setSelectedIndex(globalIndex)}
                            />
                          );
                        })}
                      </div>
                    )}

                    {/* Navigation */}
                    {groupedCommands.navigation.length > 0 && (
                      <div>
                        <div className="px-4 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Navigation
                        </div>
                        {groupedCommands.navigation.map((cmd) => {
                          const globalIndex = filteredCommands.indexOf(cmd);
                          return (
                            <CommandRow
                              key={cmd.id}
                              command={cmd}
                              isSelected={globalIndex === selectedIndex}
                              onSelect={() => {
                                cmd.action();
                                setCommandPaletteOpen(false);
                                setSearch('');
                              }}
                              onHover={() => setSelectedIndex(globalIndex)}
                            />
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer hints */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.06] text-[10px] text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-muted/50 border border-white/[0.1]">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-muted/50 border border-white/[0.1]">↵</kbd>
                    Select
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-muted/50 border border-white/[0.1]">⌘K</kbd>
                  to open
                </span>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface CommandRowProps {
  command: CommandItem;
  isSelected: boolean;
  onSelect: () => void;
  onHover: () => void;
}

function CommandRow({ command, isSelected, onSelect, onHover }: CommandRowProps) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-all active:scale-[0.99] ${isSelected ? 'bg-primary/10 text-foreground' : 'text-foreground/80 hover:bg-white/[0.04]'
        }`}
      onClick={onSelect}
      onMouseEnter={onHover}
    >
      <div className={`w-7 h-7 rounded-md flex items-center justify-center ${isSelected ? 'bg-primary/20' : 'bg-muted/50'
        }`}>
        <command.icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{command.label}</div>
        {command.description && (
          <div className="text-xs text-muted-foreground truncate">{command.description}</div>
        )}
      </div>
      {command.shortcut && (
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/[0.1] bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          {command.shortcut}
        </kbd>
      )}
    </button>
  );
}
