import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Layout, 
  Navigation2, 
  Type, 
  Image, 
  Square, 
  CreditCard,
  Sparkles,
  ChevronDown,
  GripVertical,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { useBuilder, CanvasElement } from '@/contexts/BuilderContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const componentLibrary = [
  { 
    category: 'Layout',
    items: [
      { type: 'section', icon: Layout, label: 'Section', width: 400, height: 200 },
      { type: 'navbar', icon: Navigation2, label: 'Navbar', width: 400, height: 60 },
      { type: 'hero', icon: Sparkles, label: 'Hero', width: 400, height: 300 },
    ]
  },
  {
    category: 'Elements',
    items: [
      { type: 'button', icon: Square, label: 'Button', width: 120, height: 40 },
      { type: 'text', icon: Type, label: 'Text', width: 200, height: 40 },
      { type: 'image', icon: Image, label: 'Image', width: 200, height: 150 },
      { type: 'card', icon: CreditCard, label: 'Card', width: 300, height: 200 },
    ]
  }
];

interface DraggableComponentProps {
  type: string;
  icon: React.ElementType;
  label: string;
  width: number;
  height: number;
}

function DraggableComponent({ type, icon: Icon, label, width, height }: DraggableComponentProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `library-${type}`,
    data: { type, label, width, height },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="component-card group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex flex-col items-center gap-1.5">
        <div className="w-8 h-8 rounded-md bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {label}
        </span>
      </div>
    </motion.div>
  );
}

interface LayerItemProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
}

function LayerItem({ element, isSelected, onSelect }: LayerItemProps) {
  const IconMap: Record<string, React.ElementType> = {
    section: Layout,
    navbar: Navigation2,
    hero: Sparkles,
    button: Square,
    text: Type,
    image: Image,
    card: CreditCard,
  };

  const Icon = IconMap[element.type] || Square;

  return (
    <motion.div
      className={`dense-list-item ${isSelected ? 'active' : ''}`}
      onClick={onSelect}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
    >
      <GripVertical className="w-3 h-3 text-muted-foreground/50 cursor-grab" />
      <Icon className="w-3.5 h-3.5" />
      <span className="text-xs truncate flex-1">{element.label}</span>
    </motion.div>
  );
}

export function LeftSidebar() {
  const { elements, selectedId, selectElement, leftSidebarOpen, setLeftSidebarOpen } = useBuilder();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Layout', 'Elements']);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  if (!leftSidebarOpen) {
    return (
      <motion.div 
        className="w-10 glass-panel border-r border-white/[0.06] flex flex-col items-center py-2"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 40, opacity: 1 }}
      >
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => setLeftSidebarOpen(true)}
        >
          <PanelLeft className="w-4 h-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.aside 
      className="w-56 glass-panel border-r border-white/[0.06] flex flex-col overflow-hidden"
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 224, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.04]">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Components</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={() => setLeftSidebarOpen(false)}
        >
          <PanelLeftClose className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input 
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs bg-secondary/50 border-white/[0.04] focus:border-primary/30"
          />
        </div>
      </div>

      {/* Component Library */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {componentLibrary.map((category) => (
          <div key={category.category} className="mb-3">
            <button
              className="w-full flex items-center justify-between px-1 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
              onClick={() => toggleCategory(category.category)}
            >
              {category.category}
              <ChevronDown 
                className={`w-3 h-3 transition-transform ${
                  expandedCategories.includes(category.category) ? '' : '-rotate-90'
                }`}
              />
            </button>
            <AnimatePresence>
              {expandedCategories.includes(category.category) && (
                <motion.div 
                  className="component-grid"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {category.items.map((item) => (
                    <DraggableComponent 
                      key={item.type}
                      type={item.type}
                      icon={item.icon}
                      label={item.label}
                      width={item.width}
                      height={item.height}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Layers section */}
      <div className="border-t border-white/[0.04]">
        <div className="px-3 py-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Layers</span>
        </div>
        <div className="px-1 pb-2 max-h-48 overflow-y-auto">
          {elements.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No elements yet</p>
          ) : (
            elements.map((element) => (
              <LayerItem
                key={element.id}
                element={element}
                isSelected={selectedId === element.id}
                onSelect={() => selectElement(element.id)}
              />
            ))
          )}
        </div>
      </div>
    </motion.aside>
  );
}
