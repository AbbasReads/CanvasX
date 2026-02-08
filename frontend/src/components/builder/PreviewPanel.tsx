import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Monitor,
    Maximize2,
    Minimize2,
    Copy,
    Check,
} from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { generateReactTailwind } from '@/lib/codeGenerator';
import { ElementRenderer } from './renderers';

interface PreviewPanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const desktopWidth = 1280;

export function PreviewPanel({ open, onOpenChange }: PreviewPanelProps) {
    const { elements } = useBuilder();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [copied, setCopied] = useState(false);

    const generatedCode = useMemo(() => generateReactTailwind(elements), [elements]);

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(generatedCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className={`fixed inset-0 z-50 flex ${isFullscreen ? '' : 'items-center justify-center p-4'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => onOpenChange(false)}
                    />

                    {/* Panel */}
                    <motion.div
                        className={`relative bg-card border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col ${isFullscreen
                            ? 'w-full h-full rounded-none'
                            : 'w-full max-w-7xl h-[90vh] rounded-xl'
                            }`}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-card/50 shrink-0">
                        <div className="flex items-center gap-4">
                            {/* Title */}
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                    <Monitor className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-foreground">Live Preview</h2>
                                    <p className="text-xs text-muted-foreground">
                                        {elements.length} element{elements.length !== 1 ? 's' : ''} • Desktop
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={handleCopyCode}
                                    >
                                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{copied ? 'Copied!' : 'Copy Code'}</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setIsFullscreen(!isFullscreen)}
                                    >
                                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</TooltipContent>
                            </Tooltip>
                            <div className="w-px h-6 bg-border mx-1" />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onOpenChange(false)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Main content area */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        {/* Preview */}
                        <div className="flex-1 overflow-auto bg-[#1a1a2e] p-4 flex items-start justify-center">
                            <motion.div
                                className="bg-white rounded-lg shadow-2xl overflow-hidden relative"
                                style={{
                                    width: desktopWidth,
                                    maxWidth: '100%'
                                }}
                                layout
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            >
                                {/* Browser chrome simulation */}
                                <div className="flex items-center gap-2 px-3 py-2 bg-[#2d2d3a] border-b border-white/10">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                    </div>
                                    <div className="flex-1 mx-2">
                                        <div className="bg-[#1a1a2e] rounded-md px-3 py-1 text-xs text-gray-400 font-mono">
                                            localhost:preview
                                        </div>
                                    </div>
                                </div>

                                {/* Preview content - renders actual canvas elements */}
                                <div 
                                    className="w-full bg-[#0f172a] relative overflow-auto"
                                    style={{
                                        height: isFullscreen ? 'calc(100vh - 140px)' : '65vh',
                                        minHeight: '400px'
                                    }}
                                >
                                    {/* Render all canvas elements in their positions */}
                                    {elements.map((element) => (
                                        <div
                                            key={element.id}
                                            style={{
                                                position: 'absolute',
                                                left: element.x,
                                                top: element.y,
                                                width: element.width,
                                                height: element.height,
                                            }}
                                        >
                                            <ElementRenderer element={element} isEditing={false} />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.06] bg-card/50 shrink-0">
                        <p className="text-xs text-muted-foreground">
                            Live preview of your canvas
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Live
                            </span>
                        </div>
                    </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
