import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Code,
    FileCode2,
    Copy,
    Check,
    Download,
    FileText
} from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateHTML, generateReactCode, generateCSS, generateReactTailwind } from '@/lib/codeGenerator';

interface ExportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
    const { elements } = useBuilder();
    const [copiedTab, setCopiedTab] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('html');

    const htmlCode = generateHTML(elements);
    const reactCode = generateReactCode(elements);
    const cssCode = generateCSS(elements);
    const tailwindCode = generateReactTailwind(elements);

    const handleCopy = async (code: string, tab: string) => {
        await navigator.clipboard.writeText(code);
        setCopiedTab(tab);
        setTimeout(() => setCopiedTab(null), 2000);
    };

    const handleDownload = (code: string, filename: string) => {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getCodeForTab = () => {
        switch (activeTab) {
            case 'html': return htmlCode;
            case 'react': return reactCode;
            case 'css': return cssCode;
            case 'tailwind': return tailwindCode;
            default: return htmlCode;
        }
    };

    const getFilenameForTab = () => {
        switch (activeTab) {
            case 'html': return 'index.html';
            case 'react': return 'MyPage.tsx';
            case 'css': return 'styles.css';
            case 'tailwind': return 'GeneratedPage.tsx';
            default: return 'code.txt';
        }
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => onOpenChange(false)}
            >
                <motion.div
                    className="w-full max-w-4xl max-h-[80vh] bg-card border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden flex flex-col"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Code className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">Export Code</h2>
                                <p className="text-sm text-muted-foreground">
                                    {elements.length} element{elements.length !== 1 ? 's' : ''} ready to export
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                            <div className="px-6 pt-4">
                                <TabsList className="w-full h-10 bg-secondary/50 p-1">
                                    <TabsTrigger value="html" className="flex-1 gap-2">
                                        <FileText className="w-4 h-4" />
                                        HTML
                                    </TabsTrigger>
                                    <TabsTrigger value="react" className="flex-1 gap-2">
                                        <FileCode2 className="w-4 h-4" />
                                        React
                                    </TabsTrigger>
                                    <TabsTrigger value="tailwind" className="flex-1 gap-2">
                                        <Code className="w-4 h-4" />
                                        Tailwind
                                    </TabsTrigger>
                                    <TabsTrigger value="css" className="flex-1 gap-2">
                                        <Code className="w-4 h-4" />
                                        CSS
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 overflow-hidden p-6 pt-4">
                                <TabsContent value="html" className="h-full m-0">
                                    <CodeBlock code={htmlCode} />
                                </TabsContent>
                                <TabsContent value="react" className="h-full m-0">
                                    <CodeBlock code={reactCode} />
                                </TabsContent>
                                <TabsContent value="tailwind" className="h-full m-0">
                                    <CodeBlock code={tailwindCode} />
                                </TabsContent>
                                <TabsContent value="css" className="h-full m-0">
                                    <CodeBlock code={cssCode} />
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06] bg-card/50">
                        <p className="text-xs text-muted-foreground">
                            Generated code is ready to use in your project
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => handleCopy(getCodeForTab(), activeTab)}
                            >
                                {copiedTab === activeTab ? (
                                    <>
                                        <Check className="w-4 h-4 text-green-500" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copy Code
                                    </>
                                )}
                            </Button>
                            <Button
                                size="sm"
                                className="gap-2"
                                onClick={() => handleDownload(getCodeForTab(), getFilenameForTab())}
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// Code block component with syntax highlighting appearance
function CodeBlock({ code }: { code: string }) {
    return (
        <div className="h-full max-h-[400px] rounded-lg bg-[#0d1117] border border-white/[0.06] flex flex-col">
            {/* Code header */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-white/[0.06] shrink-0">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
            </div>
            {/* Code content */}
            <pre className="flex-1 p-4 overflow-auto text-sm">
                <code className="text-gray-300 font-mono whitespace-pre">
                    {code}
                </code>
            </pre>
        </div>
    );
}
