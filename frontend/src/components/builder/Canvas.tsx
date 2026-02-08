import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { useBuilder, CanvasElement } from '@/contexts/BuilderContext';
import { ElementRenderer } from './renderers';
import {
  Layout,
  Trash2,
  Upload
} from 'lucide-react';

// Element Renderer - Directly uses ElementRenderer for consistent rendering
interface CanvasElementRendererProps {
  element: CanvasElement;
  isEditing?: boolean;
}

function CanvasElementRenderer({ element, isEditing }: CanvasElementRendererProps) {
  // Simply use ElementRenderer for all components - same as preview
  return <ElementRenderer element={element} isEditing={isEditing} />;
}

interface CanvasItemProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  zoom: number;
}

function CanvasItem({ element, isSelected, onSelect, zoom }: CanvasItemProps) {
  const { updateElement, updateElementWithoutHistory, removeElement, previewMode } = useBuilder();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, mouseX: 0, mouseY: 0 });
  const [finalPosition, setFinalPosition] = useState<{ x: number; y: number } | null>(null);
  const [finalSize, setFinalSize] = useState<{ width: number; height: number } | null>(null);
  const [isEditingText, setIsEditingText] = useState(false);
  const [editingText, setEditingText] = useState('');
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const textInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // Only allow text editing for text-based elements
    const textElements = ['text', 'button', 'hero'];
    if (!previewMode && textElements.includes(element.type)) {
      const currentText = (element.props?.text as string) || element.label || '';
      setEditingText(currentText);
      setIsEditingText(true);
      setTimeout(() => textInputRef.current?.select(), 0);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingText(e.target.value);
  };

  const handleTextBlur = () => {
    if (editingText.trim()) {
      updateElement(element.id, {
        props: {
          ...element.props,
          text: editingText,
        },
      });
    }
    setIsEditingText(false);
  };

  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTextBlur();
    } else if (e.key === 'Escape') {
      setIsEditingText(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        updateElement(element.id, {
          props: {
            ...element.props,
            src: dataUrl,
          },
        });
        setShowImageDialog(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlSubmit = () => {
    if (imageUrl.trim()) {
      updateElement(element.id, {
        props: {
          ...element.props,
          src: imageUrl.trim(),
        },
      });
      setImageUrl('');
      setShowImageDialog(false);
    }
  };

  const handleImageUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleImageUrlSubmit();
    } else if (e.key === 'Escape') {
      setShowImageDialog(false);
      setImageUrl('');
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isResizing || isEditingText) return;
    e.preventDefault();
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
    e.preventDefault();
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
    // Add/remove dragging class to body to prevent text selection
    if (isDragging || isResizing) {
      document.body.classList.add('dragging');
    } else {
      document.body.classList.remove('dragging');
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = (e.clientX - dragStart.x) / zoom;
        const dy = (e.clientY - dragStart.y) / zoom;

        // Snap to grid (20px)
        const newX = Math.round((dragStart.elementX + dx) / 20) * 20;
        const newY = Math.round((dragStart.elementY + dy) / 20) * 20;

        // Update without history during drag
        updateElementWithoutHistory(element.id, { x: newX, y: newY });
        setFinalPosition({ x: newX, y: newY });
      }

      if (isResizing) {
        const dx = (e.clientX - resizeStart.mouseX) / zoom;
        const dy = (e.clientY - resizeStart.mouseY) / zoom;

        const newWidth = Math.max(40, Math.round((resizeStart.width + dx) / 20) * 20);
        const newHeight = Math.max(40, Math.round((resizeStart.height + dy) / 20) * 20);

        // Update without history during resize
        updateElementWithoutHistory(element.id, { width: newWidth, height: newHeight });
        setFinalSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      // Save final position/size to history
      if (isDragging && finalPosition) {
        updateElement(element.id, finalPosition);
        setFinalPosition(null);
      }
      if (isResizing && finalSize) {
        updateElement(element.id, finalSize);
        setFinalSize(null);
      }
      
      setIsDragging(false);
      setIsResizing(false);
      document.body.classList.remove('dragging');
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('dragging');
    };
  }, [isDragging, isResizing, dragStart, resizeStart, element.id, zoom, updateElement, updateElementWithoutHistory, finalPosition, finalSize]);

  return (
    <motion.div
      className={`absolute rounded-lg transition-colors select-none ${previewMode
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
      onDoubleClick={previewMode ? undefined : handleDoubleClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={previewMode ? undefined : { borderColor: isSelected ? undefined : 'hsl(var(--primary) / 0.5)' }}
    >
      {/* Element content - Live renderer with Tambo AI interactivity */}
      <div className="absolute inset-0 rounded-lg overflow-hidden" style={{ opacity: isEditingText ? 0.3 : 1 }}>
        <CanvasElementRenderer element={element} isEditing={!previewMode} />
      </div>

      {/* Inline text editor overlay */}
      {isEditingText && (
        <div className="absolute inset-0 flex items-center justify-center p-4 z-50">
          <input
            ref={textInputRef}
            type="text"
            value={editingText}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            onKeyDown={handleTextKeyDown}
            className="w-full h-full bg-transparent text-center outline-none"
            style={{
              color: 'white',
              fontSize: element.type === 'hero' ? '32px' : '16px',
              fontWeight: element.type === 'hero' ? 700 : 500,
            }}
            autoFocus
          />
        </div>
      )}

      {/* Selection overlay - Only in edit mode */}
      {!previewMode && isSelected && (
        <>
          {/* Action buttons - Positioned above */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {/* Upload Image button - For image elements and hero split variant */}
            {(element.type === 'image' || (element.type === 'hero' && element.props?.style === 'split')) && (
              <motion.button
                className="h-6 px-2 rounded-md flex items-center gap-1 text-xs font-medium"
                style={{
                  backgroundColor: '#1c1c2a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#3b82f6',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowImageDialog(true);
                }}
                whileHover={{ backgroundColor: '#3b82f6', color: 'white' }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload className="w-3 h-3" />
                <span>Image</span>
              </motion.button>
            )}
            
            {/* Delete button */}
            <motion.button
              className="h-6 px-2 rounded-md flex items-center gap-1 text-xs font-medium"
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
          </div>

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

      {/* Image upload dialog */}
      {showImageDialog && (element.type === 'image' || element.type === 'hero') && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            setShowImageDialog(false);
          }}
        >
          <div 
            className="bg-card border border-white/10 rounded-lg p-4 shadow-lg max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold mb-3">Add Image</h3>
            
            {/* File upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-10 mb-3 rounded-md border border-white/10 bg-secondary/50 hover:bg-secondary transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Upload className="w-4 h-4" />
              Upload from computer
            </button>
            
            {/* URL input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Or paste image URL..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={handleImageUrlKeyDown}
                className="w-full h-10 px-3 rounded-md border border-white/10 bg-secondary/50 text-sm outline-none focus:border-primary/50"
                autoFocus
              />
              {imageUrl && (
                <button
                  onClick={handleImageUrlSubmit}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 rounded bg-primary text-xs font-medium hover:bg-primary/90"
                >
                  Apply
                </button>
              )}
            </div>
          </div>
        </div>
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
