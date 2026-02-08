import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { useBuilder, CanvasElement } from '@/contexts/BuilderContext';
import { ElementRenderer } from './renderers';
import { interactableComponentMap, InteractableComponentType } from './interactableComponents';
import {
  Layout,
  Trash2
} from 'lucide-react';

// Interactable Element Renderer - Uses withInteractable wrapped components
interface InteractableElementRendererProps {
  element: CanvasElement;
  isEditing?: boolean;
}

function InteractableElementRenderer({ element, isEditing }: InteractableElementRendererProps) {
  const { updateElement, activeTheme } = useBuilder();

  // Handle prop updates from Tambo AI
  const handlePropsUpdate = useCallback((newProps: Record<string, unknown>) => {
    updateElement(element.id, {
      props: {
        ...element.props,
        ...newProps,
      }
    });
  }, [element.id, element.props, updateElement]);

  // Check if we have an interactable component for this type
  const InteractableComponent = interactableComponentMap[element.type as InteractableComponentType];

  if (InteractableComponent) {
    // Use interactable component with full Tambo AI edit support
    return (
      <InteractableComponent
        element={element}
        onPropsUpdate={handlePropsUpdate}
        {...(element.props as Record<string, unknown>)}
      />
    );
  }

  // Fallback to original ElementRenderer for unsupported types
  return <ElementRenderer element={element} isEditing={isEditing} />;
}

interface CanvasItemProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  zoom: number;
}

function CanvasItem({ element, isSelected, onSelect, zoom }: CanvasItemProps) {
  const { updateElement, removeElement, previewMode } = useBuilder();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, mouseX: 0, mouseY: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isResizing) return;
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      elementX: element.x,
      elementY: element.y,
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent, corner: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      width: element.width,
      height: element.height,
      mouseX: e.clientX,
      mouseY: e.clientY,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = (e.clientX - dragStart.x) / zoom;
        const dy = (e.clientY - dragStart.y) / zoom;

        // Snap to grid (20px)
        const newX = Math.round((dragStart.elementX + dx) / 20) * 20;
        const newY = Math.round((dragStart.elementY + dy) / 20) * 20;

        updateElement(element.id, { x: newX, y: newY });
      }

      if (isResizing) {
        const dx = (e.clientX - resizeStart.mouseX) / zoom;
        const dy = (e.clientY - resizeStart.mouseY) / zoom;

        const newWidth = Math.max(40, Math.round((resizeStart.width + dx) / 20) * 20);
        const newHeight = Math.max(40, Math.round((resizeStart.height + dy) / 20) * 20);

        updateElement(element.id, { width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, element.id, zoom, updateElement]);

  return (
    <motion.div
      className={`absolute rounded-lg transition-colors ${previewMode
        ? 'border-transparent'
        : isSelected
          ? 'border-2 border-primary shadow-glow-sm'
          : 'border border-white/[0.08] hover:border-primary/50'
        } ${!previewMode && (isDragging ? 'cursor-grabbing' : 'cursor-grab')}`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
      }}
      onMouseDown={previewMode ? undefined : handleMouseDown}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={previewMode ? undefined : { borderColor: isSelected ? undefined : 'hsl(var(--primary) / 0.5)' }}
    >
      {/* Element content - Live renderer with Tambo AI interactivity */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <InteractableElementRenderer element={element} isEditing={!previewMode} />
      </div>

      {/* Selection overlay - Only in edit mode */}
      {!previewMode && isSelected && (
        <>
          {/* Delete button - Positioned above with proper styling */}
          <motion.button
            className="absolute -top-8 left-1/2 -translate-x-1/2 h-6 px-2 rounded-md flex items-center gap-1 text-xs font-medium z-20"
            style={{
              backgroundColor: '#1c1c2a',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#ef4444',
            }}
            onClick={(e) => {
              e.stopPropagation();
              removeElement(element.id);
            }}
            whileHover={{ backgroundColor: '#ef4444', color: 'white' }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 className="w-3 h-3" />
            <span>Delete</span>
          </motion.button>

          {/* Resize handles */}
          {['nw', 'ne', 'sw', 'se'].map((corner) => (
            <div
              key={corner}
              className="resize-handle z-10"
              style={{
                top: corner.includes('n') ? -5 : 'auto',
                bottom: corner.includes('s') ? -5 : 'auto',
                left: corner.includes('w') ? -5 : 'auto',
                right: corner.includes('e') ? -5 : 'auto',
                cursor: `${corner}-resize`,
              }}
              onMouseDown={(e) => handleResizeMouseDown(e, corner)}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}

export function Canvas() {
  const { elements, selectedId, selectElement, zoom, setZoom, pan, setPan, addElement, activeTool } = useBuilder();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: 'canvas',
  });

  // Combine refs for droppable area
  const combinedRef = useCallback((node: HTMLDivElement | null) => {
    setDroppableRef(node);
    (canvasRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
  }, [setDroppableRef]);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Hand tool panning or middle click
    const shouldPan = activeTool === 'hand' || e.button === 1;

    if (e.button === 0 && e.target === canvasRef.current) {
      selectElement(null);
    }

    if (shouldPan) {
      setIsPanning(true);
      setPanStart({
        x: e.clientX,
        y: e.clientY,
        panX: pan.x,
        panY: pan.y,
      });
    }
  };

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      // Pinch-to-zoom support
      const delta = -e.deltaY * 0.001;
      const newZoom = Math.max(0.25, Math.min(2, zoom + delta));
      setZoom(newZoom);
    } else {
      // Pan with scroll
      setPan({
        x: pan.x - e.deltaX,
        y: pan.y - e.deltaY,
      });
    }
  }, [pan, setPan, zoom, setZoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      return () => canvas.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        setPan({
          x: panStart.panX + dx,
          y: panStart.panY + dy,
        });
      }
    };

    const handleMouseUp = () => {
      setIsPanning(false);
    };

    if (isPanning) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning, panStart, setPan]);

  return (
    <div
      ref={combinedRef}
      className={`flex-1 relative overflow-hidden bg-canvas ${isOver ? 'ring-2 ring-primary/50 ring-inset' : ''}`}
      data-canvas
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 canvas-grid-pattern opacity-30 pointer-events-none"
        style={{
          backgroundPosition: `${pan.x % 20}px ${pan.y % 20}px`,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
        }}
      />

      {/* Canvas workspace */}
      <div
        className={`absolute inset-0 ${activeTool === 'hand' ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}`}
        onMouseDown={handleCanvasMouseDown}
      >
        <motion.div
          className="absolute origin-top-left"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          {/* Desktop Frame */}
          <div
            className="desktop-frame"
            style={{
              width: 1440,
              height: 5000,
              position: 'relative',
            }}
          >
            {/* Browser Chrome */}
            <div className="desktop-frame-chrome">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--chrome-red))]" />
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--chrome-yellow))]" />
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--chrome-green))]" />
                </div>
              </div>
              <div className="flex-1 mx-4">
                <div className="h-6 bg-white/[0.06] rounded-md flex items-center px-3">
                  <span className="text-[10px] text-muted-foreground/60">https://preview.yoursite.com</span>
                </div>
              </div>
              <div className="w-16" />
            </div>

            {/* Desktop Content Area */}
            <div className="desktop-frame-content">
              {/* Canvas elements */}
              {elements.map((element) => (
                <CanvasItem
                  key={element.id}
                  element={element}
                  isSelected={selectedId === element.id}
                  onSelect={() => selectElement(element.id)}
                  zoom={zoom}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Drop indicator */}
      {isOver && (
        <div className="absolute inset-0 border-2 border-dashed border-primary/50 bg-primary/5 pointer-events-none" />
      )}

      {/* Canvas info */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="px-2 py-1 rounded bg-card/80 backdrop-blur-sm border border-white/[0.06]">
          {elements.length} elements
        </span>
        <span className="px-2 py-1 rounded bg-card/80 backdrop-blur-sm border border-white/[0.06]">
          Pan: {Math.round(pan.x)}, {Math.round(pan.y)}
        </span>
      </div>

      {/* Empty state */}
      {elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Layout className="w-8 h-8 text-primary/50" />
            </div>
            <h3 className="text-lg font-medium text-foreground/80 mb-1">Start Building</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Drag components from the left panel or use ⌘K to add elements
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
