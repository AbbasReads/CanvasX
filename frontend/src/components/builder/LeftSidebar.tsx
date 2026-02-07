import { useState, useEffect, useLayoutEffect, useRef } from 'react';
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
  ArrowLeft,
  Quote,
  HelpCircle,
  DollarSign,
  Zap,
  Bot,
  LayoutGrid
} from 'lucide-react';
import { useBuilder, CanvasElement } from '@/contexts/BuilderContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// Component variants data - different styles for each component type
const componentVariants: Record<string, { id: string; label: string; props?: Record<string, unknown> }[]> = {
  navbar: [
    { id: 'navbar-minimal', label: 'Minimal', props: { style: 'minimal' } },
    { id: 'navbar-centered', label: 'Centered', props: { style: 'centered' } },
    { id: 'navbar-dark', label: 'Dark', props: { style: 'dark' } },
    { id: 'navbar-transparent', label: 'Transparent', props: { style: 'transparent' } },
  ],
  hero: [
    { id: 'hero-centered', label: 'Centered', props: { style: 'centered' } },
    { id: 'hero-split', label: 'Split', props: { style: 'split' } },
    { id: 'hero-gradient', label: 'Gradient', props: { style: 'gradient' } },
    { id: 'hero-minimal', label: 'Minimal', props: { style: 'minimal' } },
  ],
  section: [
    { id: 'section-basic', label: 'Basic', props: { style: 'basic' } },
    { id: 'section-features', label: 'Features', props: { style: 'features' } },
    { id: 'section-cta', label: 'CTA', props: { style: 'cta' } },
  ],
  button: [
    { id: 'button-primary', label: 'Primary', props: { style: 'primary' } },
    { id: 'button-secondary', label: 'Secondary', props: { style: 'secondary' } },
    { id: 'button-ghost', label: 'Ghost', props: { style: 'ghost' } },
    { id: 'button-gradient', label: 'Gradient', props: { style: 'gradient' } },
  ],
  text: [
    { id: 'text-heading', label: 'Heading', props: { style: 'heading' } },
    { id: 'text-paragraph', label: 'Paragraph', props: { style: 'paragraph' } },
    { id: 'text-caption', label: 'Caption', props: { style: 'caption' } },
  ],
  image: [
    { id: 'image-basic', label: 'Basic', props: { style: 'basic' } },
    { id: 'image-rounded', label: 'Rounded', props: { style: 'rounded' } },
    { id: 'image-avatar', label: 'Avatar', props: { style: 'avatar' } },
  ],
  card: [
    { id: 'card-basic', label: 'Basic', props: { style: 'basic' } },
    { id: 'card-horizontal', label: 'Horizontal', props: { style: 'horizontal' } },
    { id: 'card-overlay', label: 'Overlay', props: { style: 'overlay' } },
    { id: 'card-minimal', label: 'Minimal', props: { style: 'minimal' } },
  ],
  marquee: [
    { id: 'marquee-logos', label: 'Logo Cloud', props: { style: 'logos' } },
    { id: 'marquee-text', label: 'Text Only', props: { style: 'text' } },
  ],
  features: [
    { id: 'features-grid', label: 'Grid', props: { style: 'grid' } },
    { id: 'features-bento', label: 'Bento', props: { style: 'bento' } },
    { id: 'features-list', label: 'List', props: { style: 'list' } },
  ],
  testimonials: [
    { id: 'testimonials-cards', label: 'Cards', props: { style: 'cards' } },
    { id: 'testimonials-single', label: 'Single', props: { style: 'single' } },
  ],
  pricing: [
    { id: 'pricing-cards', label: 'Cards', props: { style: 'cards' } },
    { id: 'pricing-comparison', label: 'Comparison', props: { style: 'comparison' } },
  ],
  faq: [
    { id: 'faq-accordion', label: 'Accordion', props: { style: 'accordion' } },
    { id: 'faq-grid', label: 'Grid', props: { style: 'grid' } },
  ],
  footer: [
    { id: 'footer-simple', label: 'Simple', props: { style: 'simple' } },
    { id: 'footer-columns', label: 'Columns', props: { style: 'columns' } },
  ],
};

// Mini preview components for variant cards
function NavbarPreview({ variantId }: { variantId: string }) {
  const styles: Record<string, React.CSSProperties> = {
    'navbar-minimal': { background: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,0.1)' },
    'navbar-centered': { background: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,0.1)' },
    'navbar-dark': { background: '#0a0a0f', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    'navbar-transparent': { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' },
  };
  const isCentered = variantId === 'navbar-centered';

  return (
    <div className="w-full h-full flex items-center px-2 rounded" style={styles[variantId]}>
      <div className={`flex items-center gap-1 ${isCentered ? 'flex-1' : ''}`}>
        <div className="w-3 h-3 rounded bg-primary/80" />
        {!isCentered && <div className="w-8 h-1.5 rounded bg-white/60" />}
      </div>
      {isCentered && (
        <div className="flex items-center gap-1">
          <div className="w-6 h-1.5 rounded bg-white/40" />
          <div className="w-3 h-3 rounded bg-primary/80" />
          <div className="w-6 h-1.5 rounded bg-white/40" />
        </div>
      )}
      <div className={`flex items-center gap-1 ${isCentered ? 'flex-1 justify-end' : 'ml-auto'}`}>
        <div className="w-4 h-1 rounded bg-white/40" />
        <div className="w-4 h-1 rounded bg-white/40" />
        <div className="w-4 h-1 rounded bg-white/40" />
      </div>
    </div>
  );
}

function HeroPreview({ variantId }: { variantId: string }) {
  const isGradient = variantId === 'hero-gradient';
  const isSplit = variantId === 'hero-split';
  const isMinimal = variantId === 'hero-minimal';

  return (
    <div
      className={`w-full h-full rounded flex items-center justify-center p-2 ${isSplit ? 'flex-row' : 'flex-col'}`}
      style={isGradient ? { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' } : { background: '#1a1a2e' }}
    >
      <div className={`flex flex-col items-center gap-1 ${isSplit ? 'flex-1 items-start' : ''}`}>
        <div className="w-12 h-1.5 rounded bg-white/80" />
        <div className="w-8 h-1 rounded bg-white/50" />
        {!isMinimal && (
          <div className="flex gap-1 mt-1">
            <div className="w-6 h-2 rounded bg-primary" />
            <div className="w-6 h-2 rounded border border-white/40" />
          </div>
        )}
      </div>
      {isSplit && (
        <div className="flex-1 flex justify-end">
          <div className="w-8 h-8 rounded bg-white/20" />
        </div>
      )}
    </div>
  );
}

function SectionPreview({ variantId }: { variantId: string }) {
  const isFeatures = variantId === 'section-features';
  const isCta = variantId === 'section-cta';

  return (
    <div className="w-full h-full rounded bg-[#1a1a2e] p-2 flex flex-col items-center justify-center gap-1">
      <div className="w-8 h-1 rounded bg-white/60" />
      {isFeatures ? (
        <div className="flex gap-1 mt-1">
          <div className="w-4 h-4 rounded bg-white/10 border border-white/20" />
          <div className="w-4 h-4 rounded bg-white/10 border border-white/20" />
          <div className="w-4 h-4 rounded bg-white/10 border border-white/20" />
        </div>
      ) : isCta ? (
        <div className="flex items-center gap-1 mt-1">
          <div className="w-10 h-1 rounded bg-white/40" />
          <div className="w-5 h-2 rounded bg-primary" />
        </div>
      ) : (
        <div className="w-12 h-1 rounded bg-white/30 mt-1" />
      )}
    </div>
  );
}

function ButtonPreview({ variantId }: { variantId: string }) {
  const styles: Record<string, React.CSSProperties> = {
    'button-primary': { background: '#3b82f6', color: 'white' },
    'button-secondary': { background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6' },
    'button-ghost': { background: 'transparent', color: 'white' },
    'button-gradient': { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' },
  };

  return (
    <div className="w-full h-full rounded bg-[#1a1a2e] flex items-center justify-center">
      <div
        className="px-3 py-1 rounded text-[8px] font-medium"
        style={styles[variantId]}
      >
        Button
      </div>
    </div>
  );
}

function TextPreview({ variantId }: { variantId: string }) {
  return (
    <div className="w-full h-full rounded bg-[#1a1a2e] flex items-center justify-center p-2">
      {variantId === 'text-heading' && <div className="w-12 h-2 rounded bg-white/80" />}
      {variantId === 'text-paragraph' && (
        <div className="flex flex-col gap-0.5">
          <div className="w-14 h-1 rounded bg-white/60" />
          <div className="w-10 h-1 rounded bg-white/40" />
        </div>
      )}
      {variantId === 'text-caption' && <div className="w-10 h-0.5 rounded bg-white/50" />}
    </div>
  );
}

function ImagePreview({ variantId }: { variantId: string }) {
  const isAvatar = variantId === 'image-avatar';
  const isRounded = variantId === 'image-rounded';

  return (
    <div className="w-full h-full rounded bg-[#1a1a2e] flex items-center justify-center">
      <div
        className={`bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center ${isAvatar ? 'w-6 h-6 rounded-full' : isRounded ? 'w-10 h-6 rounded-lg' : 'w-10 h-6 rounded'
          }`}
      >
        <Image className="w-2 h-2 text-white/50" />
      </div>
    </div>
  );
}

function CardPreview({ variantId }: { variantId: string }) {
  const isHorizontal = variantId === 'card-horizontal';
  const isOverlay = variantId === 'card-overlay';
  const isMinimal = variantId === 'card-minimal';

  return (
    <div className="w-full h-full rounded bg-[#1a1a2e] flex items-center justify-center p-1">
      <div
        className={`bg-white/5 border border-white/10 rounded overflow-hidden ${isHorizontal ? 'flex flex-row w-full h-6' : 'flex flex-col w-10'
          }`}
      >
        {!isMinimal && !isOverlay && (
          <div className={`bg-white/10 ${isHorizontal ? 'w-6 h-full' : 'w-full h-4'}`} />
        )}
        {isOverlay && (
          <div className="w-full h-6 bg-gradient-to-t from-black/80 to-transparent relative">
            <div className="absolute bottom-1 left-1 w-4 h-0.5 bg-white/80 rounded" />
          </div>
        )}
        <div className={`p-0.5 ${isHorizontal ? 'flex-1' : ''}`}>
          <div className="w-4 h-0.5 bg-white/60 rounded mb-0.5" />
          <div className="w-6 h-0.5 bg-white/30 rounded" />
        </div>
      </div>
    </div>
  );
}

function MarqueePreview() {
  return (
    <div className="w-full h-full rounded bg-[#09090b] flex items-center justify-center gap-2 px-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-white/20" />
          <div className="w-4 h-1 rounded bg-white/30" />
        </div>
      ))}
    </div>
  );
}

function FeaturesPreview({ variantId }: { variantId: string }) {
  const isBento = variantId === 'features-bento';
  const isList = variantId === 'features-list';

  return (
    <div className="w-full h-full rounded bg-[#09090b] p-2 flex flex-col items-center gap-1">
      <div className="w-8 h-1 rounded bg-white/60 mb-1" />
      <div className={`flex gap-1 ${isList ? 'flex-col' : 'flex-row'}`}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`rounded bg-white/5 border border-white/10 p-1 ${isBento && i === 1 ? 'col-span-2 w-8' : 'w-4'} ${isList ? 'w-full h-2' : 'h-4'}`}
          >
            <div className="w-2 h-1 rounded bg-primary/60 mb-0.5" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialsPreview({ variantId }: { variantId: string }) {
  const isSingle = variantId === 'testimonials-single';

  return (
    <div className="w-full h-full rounded bg-[#09090b] p-2 flex items-center justify-center gap-1">
      {(isSingle ? [1] : [1, 2, 3]).map((i) => (
        <div key={i} className="rounded bg-white/5 border border-white/10 p-1" style={{ width: isSingle ? '70%' : '25%' }}>
          <div className="flex items-center gap-0.5 mb-1">
            <div className="w-2 h-2 rounded-full bg-primary/60" />
            <div className="w-3 h-0.5 rounded bg-white/40" />
          </div>
          <div className="w-full h-0.5 rounded bg-white/20" />
        </div>
      ))}
    </div>
  );
}

function PricingPreview() {
  return (
    <div className="w-full h-full rounded bg-[#09090b] p-2 flex items-center justify-center gap-1">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`rounded p-1 w-5 h-7 ${i === 2 ? 'bg-primary/20 border border-primary/40' : 'bg-white/5 border border-white/10'}`}>
          <div className="w-3 h-0.5 rounded bg-white/40 mb-0.5" />
          <div className="w-4 h-1 rounded bg-white/60 mb-1" />
          <div className="w-3 h-0.5 rounded bg-white/20 mb-0.5" />
          <div className="w-3 h-0.5 rounded bg-white/20" />
        </div>
      ))}
    </div>
  );
}

function FaqPreview() {
  return (
    <div className="w-full h-full rounded bg-[#09090b] p-2 flex flex-col items-center gap-0.5">
      <div className="w-8 h-1 rounded bg-white/60 mb-1" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-full rounded bg-white/5 border border-white/10 p-1 flex justify-between items-center">
          <div className="w-6 h-0.5 rounded bg-white/40" />
          <div className="w-1 h-1 rounded bg-white/30" />
        </div>
      ))}
    </div>
  );
}

function FooterPreview({ variantId }: { variantId: string }) {
  const isSimple = variantId === 'footer-simple';

  return (
    <div className="w-full h-full rounded bg-[#18181b] border-t border-white/10 p-2 flex items-center">
      {isSimple ? (
        <div className="w-full flex justify-between items-center">
          <div className="w-4 h-2 rounded bg-primary/60" />
          <div className="w-10 h-0.5 rounded bg-white/30" />
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded bg-white/20" />
            <div className="w-2 h-2 rounded bg-white/20" />
          </div>
        </div>
      ) : (
        <div className="w-full flex gap-2">
          <div className="flex-1">
            <div className="w-4 h-2 rounded bg-primary/60 mb-1" />
            <div className="w-6 h-0.5 rounded bg-white/20" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1">
              <div className="w-4 h-0.5 rounded bg-white/40 mb-0.5" />
              <div className="w-3 h-0.5 rounded bg-white/20" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Variant preview renderer
function VariantPreview({ componentType, variantId }: { componentType: string; variantId: string }) {
  switch (componentType) {
    case 'navbar': return <NavbarPreview variantId={variantId} />;
    case 'hero': return <HeroPreview variantId={variantId} />;
    case 'section': return <SectionPreview variantId={variantId} />;
    case 'button': return <ButtonPreview variantId={variantId} />;
    case 'text': return <TextPreview variantId={variantId} />;
    case 'image': return <ImagePreview variantId={variantId} />;
    case 'card': return <CardPreview variantId={variantId} />;
    case 'marquee': return <MarqueePreview />;
    case 'features': return <FeaturesPreview variantId={variantId} />;
    case 'testimonials': return <TestimonialsPreview variantId={variantId} />;
    case 'pricing': return <PricingPreview />;
    case 'faq': return <FaqPreview />;
    case 'footer': return <FooterPreview variantId={variantId} />;
    default: return <div className="w-full h-full bg-white/10 rounded" />;
  }
}

const componentLibrary = [
  {
    category: 'Layout',
    items: [
      { type: 'navbar', icon: Navigation2, label: 'Navbar', width: 800, height: 64 },
      { type: 'hero', icon: Sparkles, label: 'Hero', width: 800, height: 400 },
      { type: 'section', icon: Layout, label: 'Section', width: 800, height: 300 },
      { type: 'footer', icon: LayoutGrid, label: 'Footer', width: 800, height: 120 },
    ]
  },
  {
    category: 'Sections',
    items: [
      { type: 'features', icon: Zap, label: 'Features', width: 800, height: 400 },
      { type: 'testimonials', icon: Quote, label: 'Testimonials', width: 800, height: 320 },
      { type: 'pricing', icon: DollarSign, label: 'Pricing', width: 800, height: 450 },
      { type: 'faq', icon: HelpCircle, label: 'FAQ', width: 800, height: 350 },
      { type: 'marquee', icon: Bot, label: 'Marquee', width: 800, height: 100 },
    ]
  },
  {
    category: 'Elements',
    items: [
      { type: 'button', icon: Square, label: 'Button', width: 160, height: 48 },
      { type: 'text', icon: Type, label: 'Text', width: 300, height: 48 },
      { type: 'image', icon: Image, label: 'Image', width: 300, height: 200 },
      { type: 'card', icon: CreditCard, label: 'Card', width: 320, height: 280 },
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

function DraggableComponentCard({ type, icon: Icon, label, width, height, onClick }: ComponentCardProps) {
  const dragId = `draggable-${type}`;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: dragId,
    data: { type, label, width, height },
  });

  // Track if drag happened to prevent click after drag
  const didDrag = useRef(false);

  useLayoutEffect(() => {
    if (isDragging) {
      didDrag.current = true;
    }
  }, [isDragging]);

  useEffect(() => {
    if (!isDragging) {
      didDrag.current = false;
    }
  }, [isDragging]);

  // Handle click - only fire if no drag occurred
  const handleClick = (e: React.MouseEvent) => {
    if (didDrag.current) {
      didDrag.current = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick();
  };

  const style = transform
    ? {
      transform: CSS.Translate.toString(transform),
      zIndex: isDragging ? 100 : undefined,
      opacity: isDragging ? 0.8 : 1,
    }
    : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`component-card group cursor-grab active:cursor-grabbing ${isDragging ? 'ring-2 ring-primary shadow-lg' : ''}`}
      whileHover={{ scale: isDragging ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      {...listeners}
      {...attributes}
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
  variant: { id: string; label: string; props?: Record<string, unknown> };
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
      className="p-2 rounded-lg bg-secondary/50 border border-white/[0.06] cursor-pointer hover:border-primary/30 hover:bg-secondary transition-all"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleSelect}
    >
      <div className="aspect-video rounded-md overflow-hidden mb-2">
        <VariantPreview componentType={componentType} variantId={variant.id} />
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
    marquee: Bot,
    features: Zap,
    testimonials: Quote,
    pricing: DollarSign,
    faq: HelpCircle,
    footer: LayoutGrid,
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
                            <DraggableComponentCard
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
