import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Monitor,
    Tablet,
    Smartphone,
    RefreshCw,
    ExternalLink,
    Maximize2,
    Minimize2,
    Code,
    Eye,
    Copy,
    Check,
    RotateCcw
} from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { generateHTML, generateReactTailwind } from '@/lib/codeGenerator';

interface PreviewPanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';
type ViewMode = 'preview' | 'code' | 'split';
type CodeType = 'html' | 'react';

const viewportSizes: Record<ViewportSize, { width: number; label: string }> = {
    desktop: { width: 1280, label: 'Desktop' },
    tablet: { width: 768, label: 'Tablet' },
    mobile: { width: 375, label: 'Mobile' },
};

export function PreviewPanel({ open, onOpenChange }: PreviewPanelProps) {
    const { elements } = useBuilder();
    const [viewport, setViewport] = useState<ViewportSize>('desktop');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('split');
    const [codeType, setCodeType] = useState<CodeType>('html');
    const [copied, setCopied] = useState(false);

    // Generate the code content from canvas elements
    const generatedHtml = useMemo(() => generateHTML(elements), [elements]);
    const generatedReact = useMemo(() => generateReactTailwind(elements), [elements]);

    // Editable code state - starts with generated code
    const [editableCode, setEditableCode] = useState(generatedHtml);

    // The code that renders in the preview (custom HTML for preview, or generated)
    const previewHtml = useMemo(() => {
        if (codeType === 'html') {
            return editableCode;
        }
        // For React, we can't execute it directly, show the HTML preview instead
        return generatedHtml;
    }, [editableCode, codeType, generatedHtml]);

    // Update editable code when elements change or code type switches
    useEffect(() => {
        if (codeType === 'html') {
            setEditableCode(generatedHtml);
        } else {
            setEditableCode(generatedReact);
        }
    }, [elements, codeType, generatedHtml, generatedReact]);

    const handleResetCode = useCallback(() => {
        if (codeType === 'html') {
            setEditableCode(generatedHtml);
        } else {
            setEditableCode(generatedReact);
        }
    }, [codeType, generatedHtml, generatedReact]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(editableCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleOpenInNewTab = () => {
        const blob = new Blob([previewHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    if (!open) return null;

    return (
        <AnimatePresence>
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
                                        {elements.length} element{elements.length !== 1 ? 's' : ''} • {viewportSizes[viewport].label}
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

                            {/* Code type toggle */}
                            {(viewMode === 'code' || viewMode === 'split') && (
                                <div className="flex items-center gap-1 px-1 py-0.5 rounded-lg bg-secondary/50 border border-white/[0.04]">
                                    <Button
                                        variant={codeType === 'html' ? 'default' : 'ghost'}
                                        size="sm"
                                        className={`h-6 px-2 text-xs ${codeType === 'html' ? 'bg-orange-500/80 text-white' : ''}`}
                                        onClick={() => setCodeType('html')}
                                    >
                                        HTML
                                    </Button>
                                    <Button
                                        variant={codeType === 'react' ? 'default' : 'ghost'}
                                        size="sm"
                                        className={`h-6 px-2 text-xs ${codeType === 'react' ? 'bg-cyan-500/80 text-white' : ''}`}
                                        onClick={() => setCodeType('react')}
                                    >
                                        React/Tailwind
                                    </Button>
                                </div>
                            )}

                            {/* Viewport selector (only in preview mode) */}
                            {(viewMode === 'preview' || viewMode === 'split') && (
                                <div className="flex items-center gap-1 px-1 py-0.5 rounded-lg bg-secondary/50 border border-white/[0.04]">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant={viewport === 'desktop' ? 'default' : 'ghost'}
                                                size="icon"
                                                className={`h-7 w-7 ${viewport === 'desktop' ? 'bg-primary text-primary-foreground' : ''}`}
                                                onClick={() => setViewport('desktop')}
                                            >
                                                <Monitor className="w-3.5 h-3.5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Desktop</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant={viewport === 'tablet' ? 'default' : 'ghost'}
                                                size="icon"
                                                className={`h-7 w-7 ${viewport === 'tablet' ? 'bg-primary text-primary-foreground' : ''}`}
                                                onClick={() => setViewport('tablet')}
                                            >
                                                <Tablet className="w-3.5 h-3.5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Tablet</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant={viewport === 'mobile' ? 'default' : 'ghost'}
                                                size="icon"
                                                className={`h-7 w-7 ${viewport === 'mobile' ? 'bg-primary text-primary-foreground' : ''}`}
                                                onClick={() => setViewport('mobile')}
                                            >
                                                <Smartphone className="w-3.5 h-3.5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Mobile</TooltipContent>
                                    </Tooltip>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={handleResetCode}
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Reset to Generated Code</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={handleCopy}
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
                                        onClick={handleOpenInNewTab}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Open in New Tab</TooltipContent>
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
                                        {codeType === 'html' ? 'index.html' : 'GeneratedPage.tsx'}
                                    </span>
                                    <div className="ml-auto flex items-center gap-1">
                                        <span className="text-[10px] text-gray-600 px-2 py-0.5 rounded bg-gray-800">
                                            {codeType === 'html' ? 'HTML' : 'TSX'}
                                        </span>
                                    </div>
                                </div>
                                {/* Code textarea */}
                                <textarea
                                    value={editableCode}
                                    onChange={(e) => setEditableCode(e.target.value)}
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
                                        width: viewMode === 'split' ? '100%' : viewportSizes[viewport].width,
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

                                    {/* The actual iframe sandbox */}
                                    <iframe
                                        srcDoc={previewHtml}
                                        title="Preview"
                                        className="w-full border-0"
                                        style={{
                                            height: isFullscreen ? 'calc(100vh - 140px)' : '65vh',
                                            minHeight: '400px'
                                        }}
                                        sandbox="allow-scripts"
                                    />
                                </motion.div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.06] bg-card/50 shrink-0">
                        <p className="text-xs text-muted-foreground">
                            {codeType === 'html'
                                ? 'Edit HTML code and see changes live • HTML edits update preview instantly'
                                : 'React/Tailwind code for export • Preview shows HTML version'}
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
        </AnimatePresence>
    );
}
