import { motion } from 'framer-motion';
import { Layers, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Navigation() {
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04]"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 bg-background/60 backdrop-blur-2xl" />
      
      <div className="relative max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center group-hover:scale-105 transition-transform">
            <Layers className="w-3.5 h-3.5 text-background" />
          </div>
          <span className="font-semibold text-sm tracking-tight">CanvasX</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#ai" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
            AI Agent
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/builder">
            <Button 
              size="sm" 
              className="h-8 px-4 text-[13px] bg-foreground text-background hover:bg-foreground/90 rounded-full group"
            >
              Open Builder
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
