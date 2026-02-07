import { useState, useCallback, useEffect, useRef } from 'react';
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
  X,
  Loader2
} from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';
import { useTamboThread } from '@tambo-ai/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AILogEntry {
  id: string;
  type: 'reasoning' | 'action' | 'success' | 'error';
  content: string;
  timestamp: Date;
}

export function RightSidebar() {
  const {
    elements,
    selectedId,
    updateElement,
    rightSidebarOpen,
    setRightSidebarOpen,
    rightSidebarWidth,
    setRightSidebarWidth
  } = useBuilder();

  const [aiInput, setAiInput] = useState('');
  // Store chat history per element ID
  const [chatHistoryByElement, setChatHistoryByElement] = useState<Record<string, AILogEntry[]>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const selectedElement = elements.find(el => el.id === selectedId);

  // Get current element's chat history, or create default for new elements
  const currentChatHistory = selectedId
    ? chatHistoryByElement[selectedId] || []
    : [];

  // Tambo thread for AI-powered modifications
  const { sendThreadMessage, thread, generationStage } = useTamboThread();

  // Track last processed message count to avoid duplicates
  const [lastMessageCount, setLastMessageCount] = useState(0);

  // Helper to add log entry for current element
  const addLogEntry = useCallback((entry: AILogEntry) => {
    if (!selectedId) return;
    setChatHistoryByElement(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), entry]
    }));
  }, [selectedId]);

  // Helper to extract text from message content
  const getTextFromContent = (content: unknown): string => {
    const extractTextPart = (value: unknown): string | null => {
      if (typeof value === 'string') {
        const text = value.trim();
        return text.length > 0 ? text : null;
      }

      if (!value || typeof value !== 'object') return null;

      const obj = value as { type?: unknown; text?: unknown };
      if (obj.type !== 'text') return null;
      if (typeof obj.text !== 'string') return null;

      const text = obj.text.trim();
      return text.length > 0 ? text : null;
    };

    if (Array.isArray(content)) {
      return content
        .map(extractTextPart)
        .filter((t): t is string => t !== null)
        .join(' ')
        .trim();
    }

    return extractTextPart(content) ?? '';
  };

  // Timeout ref to clear on unmount or when processing completes
  const processingTimeoutRef = useRef<number | null>(null);

  // Watch generationStage to reset processing state
  useEffect(() => {
    if (generationStage === 'IDLE' && isProcessing) {
      setIsProcessing(false);
      // Clear timeout if processing completed normally
      if (processingTimeoutRef.current) {
        window.clearTimeout(processingTimeoutRef.current);
        processingTimeoutRef.current = null;
      }
    }
  }, [generationStage, isProcessing]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        window.clearTimeout(processingTimeoutRef.current);
        processingTimeoutRef.current = null;
      }
    };
  }, []);

  // Watch thread messages for tool results and AI responses
  useEffect(() => {
    if (!thread?.messages || !selectedId) return;

    const messageCount = thread.messages.length;
    if (messageCount <= lastMessageCount) return;

    // Process new messages
    const newMessages = thread.messages.slice(lastMessageCount);

    for (const message of newMessages) {
      // Tool response messages (role='tool') contain our tool results
      if (message.role === 'tool') {
        const textContent = getTextFromContent(message.content);
        // Try to parse as JSON to get structured result
        try {
          const result = JSON.parse(textContent);
          if (result && typeof result === 'object') {
            // Clear timeout since we got a result
            if (processingTimeoutRef.current) {
              window.clearTimeout(processingTimeoutRef.current);
              processingTimeoutRef.current = null;
            }
            setIsProcessing(false);

            if (result.success) {
              addLogEntry({
                id: Date.now().toString() + Math.random(),
                type: 'success',
                content: `✓ ${result.message || 'Changes applied'}`,
                timestamp: new Date()
              });
            } else {
              addLogEntry({
                id: Date.now().toString() + Math.random(),
                type: 'error',
                content: `✗ ${result.message || 'Failed to apply changes'}`,
                timestamp: new Date()
              });
            }
          }
        } catch {
          // Not JSON, just show text if present
          if (textContent) {
            addLogEntry({
              id: Date.now().toString() + Math.random(),
              type: 'reasoning',
              content: textContent,
              timestamp: new Date()
            });
          }
        }
      }

      // Check for assistant text responses
      if (message.role === 'assistant') {
        const textContent = getTextFromContent(message.content);
        // Only show non-empty text that isn't just tool call markup
        if (textContent && !textContent.startsWith('{') && textContent.length > 0) {
          addLogEntry({
            id: Date.now().toString() + Math.random(),
            type: 'reasoning',
            content: `🤖 ${textContent}`,
            timestamp: new Date()
          });
        }
      }
    }

    setLastMessageCount(messageCount);
  }, [thread?.messages, lastMessageCount, selectedId, addLogEntry]);

  const handleAiSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || isProcessing) return;

    if (!selectedElement || !selectedId) {
      return;
    }

    const userPrompt = aiInput;
    setAiInput('');
    setIsProcessing(true);

    // Set a timeout to reset processing state in case of errors
    if (processingTimeoutRef.current) {
      window.clearTimeout(processingTimeoutRef.current);
    }
    processingTimeoutRef.current = window.setTimeout(() => {
      setIsProcessing(false);
      addLogEntry({
        id: Date.now().toString(),
        type: 'error',
        content: '✗ Request timed out. Please try again.',
        timestamp: new Date()
      });
    }, 30000); // 30 second timeout

    // Add user command to this element's chat history
    addLogEntry({ id: Date.now().toString(), type: 'action', content: `> ${userPrompt}`, timestamp: new Date() });
    addLogEntry({ id: (Date.now() + 1).toString(), type: 'reasoning', content: '🤖 Asking Tambo AI...', timestamp: new Date() });

    try {
      // Send to Tambo AI with context about the selected element
      const contextMessage = `The user has selected a ${selectedElement.type} element called "${selectedElement.label}". 
User request: ${userPrompt}

Use the modify_element tool to make the requested changes to this element.`;

      await sendThreadMessage(contextMessage, {
        streamResponse: true,
      });
    } catch (error) {
      // Clear timeout since we're handling the error
      if (processingTimeoutRef.current) {
        window.clearTimeout(processingTimeoutRef.current);
        processingTimeoutRef.current = null;
      }
      addLogEntry({
        id: (Date.now() + 2).toString(),
        type: 'error',
        content: `✗ ${error instanceof Error ? error.message : 'AI error'}`,
        timestamp: new Date()
      });
      setIsProcessing(false);
    }
  }, [aiInput, isProcessing, selectedElement, selectedId, addLogEntry, sendThreadMessage]);

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
    <div className="relative flex">
      {/* Resize handle */}
      <div
        className="w-1 cursor-col-resize hover:bg-primary/50 transition-colors absolute left-0 top-0 bottom-0 z-10"
        onMouseDown={(e) => {
          e.preventDefault();
          setIsResizing(true);
          const startX = e.clientX;
          const startWidth = rightSidebarWidth;

          const handleMouseMove = (moveEvent: MouseEvent) => {
            const newWidth = Math.max(240, Math.min(480, startWidth - (moveEvent.clientX - startX)));
            setRightSidebarWidth(newWidth);
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

      <motion.aside
        className="glass-panel border-l border-white/[0.06] flex flex-col overflow-hidden"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: rightSidebarWidth, opacity: 1 }}
        exit={{ width: 0, opacity: 0 }}
        transition={{ duration: isResizing ? 0 : 0.2 }}
        style={{ width: rightSidebarWidth }}
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

        {/* AI Chat - Per Element */}
        <div className="h-64 flex flex-col">
          {/* Chat Header - Shows which element we're editing */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.04]">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            {selectedElement ? (
              <span className="text-xs font-semibold text-primary truncate">
                {selectedElement.label || selectedElement.type} Chat
              </span>
            ) : (
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Select Element
              </span>
            )}
          </div>

          {/* Chat Messages for Current Element */}
          <div className="flex-1 overflow-y-auto p-3 ai-terminal space-y-2">
            {selectedElement ? (
              currentChatHistory.length > 0 ? (
                currentChatHistory.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={log.type}
                  >
                    {log.content}
                  </motion.div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground text-center py-4">
                  Ask me to modify this {selectedElement.type}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Sparkles className="w-6 h-6 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">Select an element to chat</p>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleAiSubmit} className="p-2 border-t border-white/[0.04]">
            <div className="flex gap-2">
              <Input
                placeholder={selectedElement ? `Modify ${selectedElement.type}...` : "Select element first..."}
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                disabled={!selectedElement || isProcessing}
                className="flex-1 h-8 text-xs bg-secondary/50 border-white/[0.04] focus:border-primary/30 disabled:opacity-50"
              />
              <Button
                type="submit"
                size="icon"
                className="h-8 w-8 shrink-0"
                disabled={!selectedElement || isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.aside>
    </div>
  );
}
