import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
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
  PanelLeft,
  ArrowLeft
} from 'lucide-react';
import { useBuilder, CanvasElement } from '@/contexts/BuilderContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// Component variants data - different styles for each component type
const componentVariants: Record<string, { id: string; label: string; preview: string; props?: Record<string, unknown> }[]> = {
  navbar: [
    { id: 'navbar-minimal', label: 'Minimal', preview: 'Clean minimal navbar with logo and links' },
    { id: 'navbar-centered', label: 'Centered', preview: 'Logo centered with links on sides' },
    { id: 'navbar-dark', label: 'Dark', preview: 'Dark background with light text' },
    { id: 'navbar-transparent', label: 'Transparent', preview: 'Transparent with blur effect' },
  ],
  hero: [
    { id: 'hero-centered', label: 'Centered', preview: 'Text centered with CTA buttons' },
    { id: 'hero-split', label: 'Split', preview: 'Text left, image right' },
    { id: 'hero-gradient', label: 'Gradient', preview: 'Gradient background with overlay' },
    { id: 'hero-minimal', label: 'Minimal', preview: 'Simple text only hero' },
  ],
  section: [
    { id: 'section-basic', label: 'Basic', preview: 'Simple content section' },
    { id: 'section-features', label: 'Features', preview: 'Grid of feature cards' },
    { id: 'section-cta', label: 'CTA', preview: 'Call to action section' },
  ],
  button: [
    { id: 'button-primary', label: 'Primary', preview: 'Solid primary color' },
    { id: 'button-secondary', label: 'Secondary', preview: 'Outlined style' },
    { id: 'button-ghost', label: 'Ghost', preview: 'Transparent background' },
    { id: 'button-gradient', label: 'Gradient', preview: 'Gradient background' },
  ],
  text: [
    { id: 'text-heading', label: 'Heading', preview: 'Large heading text' },
    { id: 'text-paragraph', label: 'Paragraph', preview: 'Body text paragraph' },
    { id: 'text-caption', label: 'Caption', preview: 'Small caption text' },
  ],
  image: [
    { id: 'image-basic', label: 'Basic', preview: 'Simple image container' },
    { id: 'image-rounded', label: 'Rounded', preview: 'Rounded corners' },
    { id: 'image-avatar', label: 'Avatar', preview: 'Circular avatar style' },
  ],
  card: [
    { id: 'card-basic', label: 'Basic', preview: 'Image with text content' },
    { id: 'card-horizontal', label: 'Horizontal', preview: 'Side by side layout' },
    { id: 'card-overlay', label: 'Overlay', preview: 'Text over image' },
    { id: 'card-minimal', label: 'Minimal', preview: 'Simple text only' },
  ],
};

const componentLibrary = [
  {
    category: 'Layout',
    items: [
      { type: 'section', icon: Layout, label: 'Section', width: 400, height: 200 },
      { type: 'navbar', icon: Navigation2, label: 'Navbar', width: 800, height: 60 },
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

interface ComponentCardProps {
  type: string;
  icon: React.ElementType;
  label: string;
  width: number;
  height: number;
  onClick: () => void;
}

function ComponentCard({ type, icon: Icon, label, onClick }: ComponentCardProps) {
  return (
    <motion.div
      className="component-card group cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
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

interface VariantCardProps {
  variant: { id: string; label: string; preview: string; props?: Record<string, unknown> };
  componentType: string;
  componentConfig: { width: number; height: number; label: string };
  onSelect: () => void;
}

function VariantCard({ variant, componentType, componentConfig, onSelect }: VariantCardProps) {
  const { addElement, pan } = useBuilder();

  const handleSelect = () => {
    const canvasRect = document.querySelector('[data-canvas]')?.getBoundingClientRect();
    if (canvasRect) {
      const centerX = Math.round((canvasRect.width / 2 - componentConfig.width / 2 - pan.x) / 20) * 20;
      const centerY = Math.round((canvasRect.height / 2 - componentConfig.height / 2 - pan.y) / 20) * 20;

      addElement({
        id: `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: componentType as any,
        x: centerX,
        y: centerY,
        width: componentConfig.width,
        height: componentConfig.height,
        label: `${componentConfig.label} - ${variant.label}`,
        props: {
          variant: variant.id,
          ...variant.props,
        },
      });
      onSelect();
    }
  };

  return (
    <motion.div
      className="p-3 rounded-lg bg-secondary/50 border border-white/[0.06] cursor-pointer hover:border-primary/30 hover:bg-secondary transition-all"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleSelect}
    >
      <div className="aspect-video rounded-md bg-background/50 mb-2 flex items-center justify-center overflow-hidden">
        <div className="text-[10px] text-muted-foreground/60 text-center px-2">
          {variant.preview}
        </div>
      </div>
      <span className="text-xs font-medium text-foreground">{variant.label}</span>
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
    <Reorder.Item
      value={element}
      id={element.id}
      className={`dense-list-item ${isSelected ? 'active' : ''} cursor-grab active:cursor-grabbing`}
      onClick={onSelect}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      whileDrag={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
    >
      <GripVertical className="w-3 h-3 text-muted-foreground/50" />
      <Icon className="w-3.5 h-3.5" />
      <span className="text-xs truncate flex-1">{element.label}</span>
    </Reorder.Item>
  );
}

export function LeftSidebar() {
  const { elements, selectedId, selectElement, leftSidebarOpen, setLeftSidebarOpen, setElements, leftSidebarWidth, setLeftSidebarWidth } = useBuilder();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Layout', 'Elements']);
  const [selectedComponentType, setSelectedComponentType] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Find the component config for the selected type
  const getComponentConfig = (type: string) => {
    for (const category of componentLibrary) {
      const item = category.items.find(i => i.type === type);
      if (item) return item;
    }
    return null;
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
    <div className="relative flex">
      <motion.aside
        className="glass-panel border-r border-white/[0.06] flex flex-col overflow-hidden"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: leftSidebarWidth, opacity: 1 }}
        exit={{ width: 0, opacity: 0 }}
        transition={{ duration: isResizing ? 0 : 0.2 }}
        style={{ width: leftSidebarWidth }}
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

      <AnimatePresence mode="wait">
        {selectedComponentType ? (
          /* Variants View */
          <motion.div
            key="variants"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Back button */}
            <div className="px-3 py-2 border-b border-white/[0.04]">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs gap-1"
                onClick={() => setSelectedComponentType(null)}
              >
                <ArrowLeft className="w-3 h-3" />
                Back
              </Button>
              <h3 className="text-sm font-medium mt-2 capitalize">{selectedComponentType} Styles</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Choose a style to add</p>
            </div>

            {/* Variants grid */}
            <div className="flex-1 overflow-y-auto p-2">
              <div className="grid grid-cols-1 gap-2">
                {componentVariants[selectedComponentType]?.map((variant) => {
                  const config = getComponentConfig(selectedComponentType);
                  if (!config) return null;
                  return (
                    <VariantCard
                      key={variant.id}
                      variant={variant}
                      componentType={selectedComponentType}
                      componentConfig={config}
                      onSelect={() => setSelectedComponentType(null)}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Default Component Library View */
          <motion.div
            key="library"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
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
            <div className="flex-1 overflow-y-auto px-2 pb-2 min-h-0">
              {componentLibrary.map((category) => (
                <div key={category.category} className="mb-3">
                  <button
                    className="w-full flex items-center justify-between px-1 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                    onClick={() => toggleCategory(category.category)}
                  >
                    {category.category}
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${expandedCategories.includes(category.category) ? '' : '-rotate-90'
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
                          <ComponentCard
                            key={item.type}
                            type={item.type}
                            icon={item.icon}
                            label={item.label}
                            width={item.width}
                            height={item.height}
                            onClick={() => setSelectedComponentType(item.type)}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layers section */}
      <div className="border-t border-white/[0.04]">
        <div className="px-3 py-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Layers</span>
        </div>
        <div className="px-1 pb-2 max-h-40 overflow-y-auto">
          {elements.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No elements yet</p>
          ) : (
            <Reorder.Group
              axis="y"
              values={[...elements].reverse()}
              onReorder={(newOrder) => {
                // Reverse back to get the correct order for canvas rendering
                setElements([...newOrder].reverse());
              }}
              className="space-y-0.5"
            >
              {[...elements].reverse().map((element) => (
                <LayerItem
                  key={element.id}
                  element={element}
                  isSelected={selectedId === element.id}
                  onSelect={() => selectElement(element.id)}
                />
              ))}
            </Reorder.Group>
          )}
        </div>
      </div>
    </motion.aside>
    
    {/* Resize handle */}
    <div
      className="w-1 cursor-col-resize hover:bg-primary/50 transition-colors absolute right-0 top-0 bottom-0 z-10"
      onMouseDown={(e) => {
        e.preventDefault();
        setIsResizing(true);
        const startX = e.clientX;
        const startWidth = leftSidebarWidth;
        
        const handleMouseMove = (moveEvent: MouseEvent) => {
          const newWidth = Math.max(180, Math.min(400, startWidth + moveEvent.clientX - startX));
          setLeftSidebarWidth(newWidth);
        };
        
        const handleMouseUp = () => {
          setIsResizing(false);
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }}
    />
  </div>
  );
}
