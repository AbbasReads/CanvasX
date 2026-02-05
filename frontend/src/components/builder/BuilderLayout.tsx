import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor, pointerWithin } from '@dnd-kit/core';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BuilderProvider, useBuilder, CanvasElement } from '@/contexts/BuilderContext';
import { TopBar } from './TopBar';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { Canvas } from './Canvas';
import { CommandPalette } from './CommandPalette';
import { ExportDialog } from './ExportDialog';
import {
  Layout,
  Navigation2,
  Type,
  Image,
  Square,
  CreditCard,
  Sparkles
} from 'lucide-react';

const IconMap: Record<string, React.ElementType> = {
  section: Layout,
  navbar: Navigation2,
  hero: Sparkles,
  button: Square,
  text: Type,
  image: Image,
  card: CreditCard,
};

function BuilderContent() {
  const { addElement, pan, exportDialogOpen, setExportDialogOpen } = useBuilder();
  const [activeDragData, setActiveDragData] = useState<{ type: string; label: string; width: number; height: number } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as { type: string; label: string; width: number; height: number } | undefined;
    if (data) {
      setActiveDragData(data);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, delta } = event;

    console.log('DragEnd:', { over, activeDragData, delta });

    // Always try to add element if we have drag data
    if (activeDragData) {
      const canvasRect = document.querySelector('[data-canvas]')?.getBoundingClientRect();
      console.log('Canvas rect:', canvasRect);

      if (canvasRect) {
        const mouseX = (event.activatorEvent as MouseEvent).clientX + delta.x;
        const mouseY = (event.activatorEvent as MouseEvent).clientY + delta.y;

        console.log('Mouse position:', { mouseX, mouseY });

        // Check if drop position is within or near the canvas area
        const isInCanvas =
          mouseX >= canvasRect.left &&
          mouseX <= canvasRect.right &&
          mouseY >= canvasRect.top &&
          mouseY <= canvasRect.bottom;

        console.log('isInCanvas:', isInCanvas, 'over:', over?.id);

        if (isInCanvas || over?.id === 'canvas') {
          // Calculate drop position relative to canvas
          const x = Math.max(0, Math.round((mouseX - canvasRect.left - pan.x) / 20) * 20);
          const y = Math.max(0, Math.round((mouseY - canvasRect.top - pan.y) / 20) * 20);

          console.log('Adding element at:', { x, y });

          const newElement: CanvasElement = {
            id: `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: activeDragData.type as CanvasElement['type'],
            x,
            y,
            width: activeDragData.width,
            height: activeDragData.height,
            label: activeDragData.label,
          };

          addElement(newElement);
          console.log('Element added:', newElement);
        }
      }
    }

    setActiveDragData(null);
  };

  const ActiveIcon = activeDragData ? IconMap[activeDragData.type] || Square : Square;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
        <TopBar />

        <div className="flex-1 flex overflow-hidden">
          <LeftSidebar />

          <div className="flex-1 flex flex-col relative" data-canvas>
            <Canvas />
          </div>

          <RightSidebar />
        </div>

        <CommandPalette />

        {/* Export Dialog */}
        <ExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} />


        {/* Drag overlay */}
        <DragOverlay>
          {activeDragData && (
            <motion.div
              className="w-24 h-20 rounded-lg bg-card/90 border border-primary/50 backdrop-blur-sm flex items-center justify-center shadow-glow"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex flex-col items-center gap-1.5">
                <ActiveIcon className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-medium text-foreground">{activeDragData.label}</span>
              </div>
            </motion.div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

export function BuilderLayout() {
  return (
    <BuilderProvider>
      <BuilderContent />
    </BuilderProvider>
  );
}
