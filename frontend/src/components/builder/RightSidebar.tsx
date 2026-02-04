import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PanelRightClose,
  PanelRight,
  Palette,
  Type,
  Move,
  Box,
  Send,
  Sparkles,
  ChevronDown,
  X
} from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AILogEntry {
  id: string;
  type: 'reasoning' | 'action' | 'success';
  content: string;
  timestamp: Date;
}

export function RightSidebar() {
  const { 
    elements, 
    selectedId, 
    updateElement,
    rightSidebarOpen, 
    setRightSidebarOpen 
  } = useBuilder();

  const [aiInput, setAiInput] = useState('');
  const [aiLogs, setAiLogs] = useState<AILogEntry[]>([
    { id: '1', type: 'reasoning', content: 'Analyzing current canvas structure...', timestamp: new Date() },
    { id: '2', type: 'action', content: 'Ready for commands. Try "Add a hero section with gradient background"', timestamp: new Date() },
  ]);

  const selectedElement = elements.find(el => el.id === selectedId);

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    // Add user command
    const newLogs: AILogEntry[] = [
      ...aiLogs,
      { id: Date.now().toString(), type: 'action', content: `> ${aiInput}`, timestamp: new Date() },
      { id: (Date.now() + 1).toString(), type: 'reasoning', content: 'Processing request...', timestamp: new Date() },
    ];

    setAiLogs(newLogs);
    setAiInput('');

    // Simulate AI response
    setTimeout(() => {
      setAiLogs(prev => [
        ...prev,
        { id: (Date.now() + 2).toString(), type: 'success', content: '✓ Command executed successfully', timestamp: new Date() },
      ]);
    }, 1500);
  };

  if (!rightSidebarOpen) {
    return (
      <motion.div 
        className="w-10 glass-panel border-l border-white/[0.06] flex flex-col items-center py-2"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 40, opacity: 1 }}
      >
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => setRightSidebarOpen(true)}
        >
          <PanelRight className="w-4 h-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.aside 
      className="w-72 glass-panel border-l border-white/[0.06] flex flex-col overflow-hidden"
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 288, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Property Inspector - Top Half */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.04]">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {selectedElement ? 'Properties' : 'Inspector'}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => setRightSidebarOpen(false)}
          >
            <PanelRightClose className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Properties Content */}
        <div className="flex-1 overflow-y-auto p-3">
          <AnimatePresence mode="wait">
            {selectedElement ? (
              <motion.div
                key={selectedElement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Element info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                      <Box className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{selectedElement.label}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase">{selectedElement.type}</span>
                </div>

                <Separator className="bg-white/[0.04]" />

                {/* Tabs for different property sections */}
                <Tabs defaultValue="layout" className="w-full">
                  <TabsList className="w-full h-8 bg-secondary/50 p-0.5">
                    <TabsTrigger value="layout" className="flex-1 h-7 text-xs">
                      <Move className="w-3 h-3 mr-1" />
                      Layout
                    </TabsTrigger>
                    <TabsTrigger value="style" className="flex-1 h-7 text-xs">
                      <Palette className="w-3 h-3 mr-1" />
                      Style
                    </TabsTrigger>
                    <TabsTrigger value="text" className="flex-1 h-7 text-xs">
                      <Type className="w-3 h-3 mr-1" />
                      Text
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="layout" className="mt-3 space-y-3">
                    {/* Position */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="property-label">X</Label>
                        <Input 
                          type="number"
                          value={Math.round(selectedElement.x)}
                          onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value) || 0 })}
                          className="property-input"
                        />
                      </div>
                      <div>
                        <Label className="property-label">Y</Label>
                        <Input 
                          type="number"
                          value={Math.round(selectedElement.y)}
                          onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value) || 0 })}
                          className="property-input"
                        />
                      </div>
                    </div>

                    {/* Size */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="property-label">Width</Label>
                        <Input 
                          type="number"
                          value={Math.round(selectedElement.width)}
                          onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value) || 100 })}
                          className="property-input"
                        />
                      </div>
                      <div>
                        <Label className="property-label">Height</Label>
                        <Input 
                          type="number"
                          value={Math.round(selectedElement.height)}
                          onChange={(e) => updateElement(selectedElement.id, { height: parseInt(e.target.value) || 100 })}
                          className="property-input"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="style" className="mt-3 space-y-3">
                    <div>
                      <Label className="property-label">Opacity</Label>
                      <Slider 
                        defaultValue={[100]} 
                        max={100} 
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="property-label">Background</Label>
                      <div className="flex gap-2 mt-1.5">
                        <div className="w-7 h-7 rounded bg-primary cursor-pointer hover:ring-2 ring-white/20 transition-all" />
                        <div className="w-7 h-7 rounded bg-secondary cursor-pointer hover:ring-2 ring-white/20 transition-all" />
                        <div className="w-7 h-7 rounded bg-muted cursor-pointer hover:ring-2 ring-white/20 transition-all" />
                        <div className="w-7 h-7 rounded bg-white cursor-pointer hover:ring-2 ring-white/20 transition-all" />
                      </div>
                    </div>
                    <div>
                      <Label className="property-label">Border Radius</Label>
                      <Slider 
                        defaultValue={[8]} 
                        max={32} 
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="text" className="mt-3 space-y-3">
                    <div>
                      <Label className="property-label">Content</Label>
                      <Input 
                        value={selectedElement.label}
                        onChange={(e) => updateElement(selectedElement.id, { label: e.target.value })}
                        className="property-input mt-1"
                      />
                    </div>
                    <div>
                      <Label className="property-label">Font Size</Label>
                      <Slider 
                        defaultValue={[16]} 
                        min={10}
                        max={72} 
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="property-label">Font Weight</Label>
                      <div className="flex gap-1 mt-1.5">
                        {['Light', 'Regular', 'Medium', 'Bold'].map((weight) => (
                          <button
                            key={weight}
                            className="flex-1 py-1 text-[10px] rounded bg-secondary/50 hover:bg-secondary transition-colors"
                          >
                            {weight}
                          </button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-32 text-center"
              >
                <Box className="w-8 h-8 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">Select an element to edit properties</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Separator className="bg-white/[0.04]" />

      {/* AI Terminal - Bottom Half */}
      <div className="h-64 flex flex-col">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.04]">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Agent</span>
        </div>

        {/* Terminal Logs */}
        <div className="flex-1 overflow-y-auto p-3 ai-terminal space-y-2">
          {aiLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={log.type}
            >
              {log.content}
            </motion.div>
          ))}
        </div>

        {/* Terminal Input */}
        <form onSubmit={handleAiSubmit} className="p-2 border-t border-white/[0.04]">
          <div className="flex gap-2">
            <Input 
              placeholder="Ask AI to modify the canvas..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              className="flex-1 h-8 text-xs bg-secondary/50 border-white/[0.04] focus:border-primary/30"
            />
            <Button type="submit" size="icon" className="h-8 w-8 shrink-0">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </motion.aside>
  );
}
