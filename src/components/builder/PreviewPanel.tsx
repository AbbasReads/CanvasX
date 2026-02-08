import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Monitor,
    ExternalLink,
    Maximize2,
    Minimize2,
    Code,
    Eye,
    Download,
    Check,
    RotateCcw
} from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { generateHTML, generateReactTailwind } from '@/lib/codeGenerator';
import { ElementRenderer } from './renderers';

interface PreviewPanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type ViewMode = 'preview' | 'code' | 'split';

const desktopWidth = 1280;

export function PreviewPanel({ open, onOpenChange }: PreviewPanelProps) {
    const { elements, setElements } = useBuilder();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('split');
    const [exported, setExported] = useState(false);
    const [showSyncWarning, setShowSyncWarning] = useState(false);

    const exportTimer = useRef<number | null>(null);
    const previewBlobUrl = useRef<string | null>(null);
    const openInNewTabTimer = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (exportTimer.current) {
                window.clearTimeout(exportTimer.current);
                exportTimer.current = null;
            }

            if (previewBlobUrl.current) {
                URL.revokeObjectURL(previewBlobUrl.current);
                previewBlobUrl.current = null;
            }

            if (openInNewTabTimer.current) {
                window.clearTimeout(openInNewTabTimer.current);
                openInNewTabTimer.current = null;
            }
        };
    }, []);

    // Generate the code content from canvas elements
    const generatedReact = useMemo(() => generateReactTailwind(elements), [elements]);

    const [editableReact, setEditableReact] = useState(generatedReact);
    const [isReactDirty, setIsReactDirty] = useState(false);

    useEffect(() => {
        if (!isReactDirty) {
            setEditableReact(generatedReact);
        }
    }, [generatedReact, isReactDirty]);

    const handleResetCode = useCallback(() => {
        setEditableReact(generatedReact);
        setIsReactDirty(false);
        setShowSyncWarning(false);
    }, [generatedReact]);

    const handleExport = () => {
        try {
            // Create a blob with the code content
            const blob = new Blob([editableReact], { type: 'text/typescript' });
            const url = URL.createObjectURL(blob);
            
            // Create a temporary download link
            const a = document.createElement('a');
            a.href = url;
            a.download = 'GeneratedPage.tsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Show success state
            setExported(true);
            if (exportTimer.current) {
                window.clearTimeout(exportTimer.current);
                exportTimer.current = null;
            }
            exportTimer.current = window.setTimeout(() => setExported(false), 2000);
        } catch {
            setExported(false);
        }
    };

    const handleOpenInNewTab = () => {
        try {
            if (previewBlobUrl.current) {
                URL.revokeObjectURL(previewBlobUrl.current);
                previewBlobUrl.current = null;
            }

            if (openInNewTabTimer.current) {
                window.clearTimeout(openInNewTabTimer.current);
                openInNewTabTimer.current = null;
            }

            // Generate HTML from canvas elements
            const htmlContent = generateHTML(elements);

            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            previewBlobUrl.current = url;

            const newTab = window.open(url, '_blank', 'noopener,noreferrer');
            if (!newTab) {
                URL.revokeObjectURL(url);
                previewBlobUrl.current = null;
                return;
            }

            openInNewTabTimer.current = window.setTimeout(() => {
                if (previewBlobUrl.current !== url) return;
                URL.revokeObjectURL(url);
                previewBlobUrl.current = null;
                openInNewTabTimer.current = null;
            }, 60000);
        } catch {
            if (previewBlobUrl.current) {
                URL.revokeObjectURL(previewBlobUrl.current);
                previewBlobUrl.current = null;
            }
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
                                    <h2 className="text-sm font-semibold text-foreground">Live Preview & Code Editor</h2>
                                    <p className="text-xs text-muted-foreground">
                                        {elements.length} element{elements.length !== 1 ? 's' : ''} • Desktop
                                    </p>
                                </div>
                            </div>

                            {/* View mode toggle */}
                            <div className="flex items-center gap-1 px-1 py-0.5 rounded-lg bg-secondary/50 border border-white/[0.04]">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant={viewMode === 'code' ? 'default' : 'ghost'}
                                            size="sm"
                                            className={`h-7 px-2 gap-1 ${viewMode === 'code' ? 'bg-primary text-primary-foreground' : ''}`}
                                            onClick={() => setViewMode('code')}
                                        >
                                            <Code className="w-3.5 h-3.5" />
                                            <span className="text-xs">Code</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Code Only</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant={viewMode === 'split' ? 'default' : 'ghost'}
                                            size="sm"
                                            className={`h-7 px-2 gap-1 ${viewMode === 'split' ? 'bg-primary text-primary-foreground' : ''}`}
                                            onClick={() => setViewMode('split')}
                                        >
                                            <span className="text-xs">Split</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Split View</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant={viewMode === 'preview' ? 'default' : 'ghost'}
                                            size="sm"
                                            className={`h-7 px-2 gap-1 ${viewMode === 'preview' ? 'bg-primary text-primary-foreground' : ''}`}
                                            onClick={() => setViewMode('preview')}
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            <span className="text-xs">Preview</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Preview Only</TooltipContent>
                                </Tooltip>
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
                                        onClick={handleExport}
                                    >
                                        {exported ? <Check className="w-4 h-4 text-green-500" /> : <Download className="w-4 h-4" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{exported ? 'Exported!' : 'Export Code'}</TooltipContent>
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
                        {/* Code Sync Warning */}
                        {showSyncWarning && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 p-3 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span className="text-sm text-yellow-800 dark:text-yellow-200">
                                        Code has been modified manually. Note: Code edits are for export only and won't update the canvas.
                                    </span>
                                </div>
                                <button
                                    onClick={handleResetCode}
                                    className="px-3 py-1 text-sm bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors"
                                >
                                    Sync from Canvas
                                </button>
                            </div>
                        )}
                        
                        <div className="flex-1 overflow-hidden flex">
                        {/* Code Editor */}
                        {(viewMode === 'code' || viewMode === 'split') && (
                            <div className={`flex flex-col bg-[#0d1117] ${viewMode === 'split' ? 'w-1/2 border-r border-white/[0.06]' : 'w-full'}`}>
                                {/* Code header */}
                                <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-white/[0.06] shrink-0">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                    </div>
                                    <span className="text-xs text-gray-500 ml-2">
                                        GeneratedPage.tsx
                                    </span>
                                    <div className="ml-auto flex items-center gap-1">
                                        <span className="text-[10px] text-gray-600 px-2 py-0.5 rounded bg-gray-800">
                                            TSX
                                        </span>
                                    </div>
                                </div>
                                {/* Code textarea */}
                                <textarea
                                    value={editableReact}
                                    onChange={(e) => {
                                        setEditableReact(e.target.value);
                                        setIsReactDirty(true);
                                        setShowSyncWarning(true);
                                    }}
                                    className="flex-1 w-full p-4 bg-[#0d1117] text-gray-300 font-mono text-sm resize-none focus:outline-none leading-relaxed"
                                    spellCheck={false}
                                    placeholder="Edit your code here..."
                                />
                            </div>
                        )}

                        {/* Preview */}
                        {(viewMode === 'preview' || viewMode === 'split') && (
                            <div className={`flex-1 overflow-auto bg-[#1a1a2e] p-4 flex items-start justify-center ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                                <motion.div
                                    className="bg-white rounded-lg shadow-2xl overflow-hidden relative"
                                    style={{
                                        width: viewMode === 'split' ? '100%' : desktopWidth,
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

                                    {/* Preview content - shows canvas elements or React edit message */}
                                    {isReactDirty ? (
                                        /* React code is edited - show message */
                                        <div 
                                            className="w-full bg-[#0f172a] relative overflow-auto flex items-center justify-center"
                                            style={{
                                                height: isFullscreen ? 'calc(100vh - 140px)' : '65vh',
                                                minHeight: '400px'
                                            }}
                                        >
                                            <div className="text-center p-8 max-w-md">
                                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                    <Code className="w-8 h-8 text-blue-500" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-white mb-2">React Code Preview</h3>
                                                <p className="text-sm text-gray-400 mb-4">
                                                    React/TSX code cannot be previewed in real-time. Click "Sync from Canvas" to see the canvas state, or export the code to use in your project.
                                                </p>
                                                <Button
                                                    onClick={handleResetCode}
                                                    size="sm"
                                                    className="gap-2"
                                                >
                                                    <RotateCcw className="w-4 h-4" />
                                                    Sync from Canvas
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Default: Direct React preview - renders actual canvas elements */
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
                                    )}
                                </motion.div>
                            </div>
                        )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.06] bg-card/50 shrink-0">
                        <p className="text-xs text-muted-foreground">
                            React/Tailwind code for export • Preview shows canvas elements
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
