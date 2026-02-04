import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-14 pb-20 overflow-hidden">
      {/* Ambient gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/[0.08] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/[0.04] rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="mb-16"></div>
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-[clamp(2.5rem,8vw,5.5rem)] font-semibold tracking-tighter leading-[0.95] mb-6"
        >
          <span className="block text-foreground">Design without</span>
          <span className="block bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
            boundaries
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed"
        >
          The spatial canvas that thinks with you. Build production-ready websites 
          using natural language and intuitive drag-and-drop.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link to="/builder">
            <Button 
              size="lg" 
              className="h-11 px-6 text-sm bg-foreground text-background hover:bg-foreground/90 rounded-full group"
            >
              Start Building — Free
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="lg" 
            className="h-11 px-6 text-sm text-muted-foreground hover:text-foreground"
          >
            Watch Demo
          </Button>
        </motion.div>

        {/* Keyboard hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-12 flex items-center justify-center gap-2 text-xs text-muted-foreground/60"
        >
          <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] font-mono text-[10px]">⌘K</kbd>
          <span>to command anywhere</span>
        </motion.div>
      </div>

      {/* 3D Perspective Dashboard Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 mt-16"
        style={{ perspective: '2000px' }}
      >
        <motion.div
          className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: 'rotateX(8deg)',
          }}
          whileHover={{ 
            transform: 'rotateX(2deg) translateY(-8px)',
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Glow effect behind the mockup */}
          <div className="absolute -inset-4 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-2xl opacity-60" />
          
          {/* Browser chrome */}
          <div className="relative h-10 bg-card/90 border-b border-white/[0.06] flex items-center px-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-1 rounded-md bg-white/[0.03] text-[11px] text-muted-foreground/60 font-mono">
                spatial.app/builder
              </div>
            </div>
          </div>
          
          {/* Dashboard preview */}
          <div className="relative aspect-[16/9] bg-canvas overflow-hidden">
            {/* Grid */}
            <div className="absolute inset-0 canvas-grid-pattern opacity-20" />
            
            {/* Left sidebar mockup */}
            <div className="absolute left-0 top-0 bottom-0 w-56 bg-card/80 border-r border-white/[0.04] backdrop-blur-sm">
              <div className="p-3 border-b border-white/[0.04]">
                <div className="h-6 w-20 rounded bg-white/[0.04]" />
              </div>
              <div className="p-3 space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-10 rounded-lg bg-white/[0.02] border border-white/[0.04]" />
                ))}
              </div>
            </div>
            
            {/* Right sidebar mockup */}
            <div className="absolute right-0 top-0 bottom-0 w-64 bg-card/80 border-l border-white/[0.04] backdrop-blur-sm">
              <div className="p-3 border-b border-white/[0.04]">
                <div className="h-6 w-24 rounded bg-white/[0.04]" />
              </div>
              <div className="p-3 space-y-3">
                <div className="space-y-2">
                  <div className="h-3 w-12 rounded bg-white/[0.04]" />
                  <div className="h-8 rounded bg-white/[0.02] border border-white/[0.04]" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-16 rounded bg-white/[0.04]" />
                  <div className="h-8 rounded bg-white/[0.02] border border-white/[0.04]" />
                </div>
              </div>
              {/* AI Terminal */}
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-black/40 border-t border-white/[0.06]">
                <div className="p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <div className="h-3 w-20 rounded bg-primary/20" />
                  </div>
                  <div className="h-2 w-full rounded bg-white/[0.02]" />
                  <div className="h-2 w-3/4 rounded bg-white/[0.02]" />
                  <div className="h-2 w-5/6 rounded bg-white/[0.02]" />
                </div>
              </div>
            </div>
            
            {/* Canvas elements */}
            <motion.div 
              className="absolute left-64 top-16 right-72 h-48 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            />
            <motion.div 
              className="absolute left-72 top-72 w-72 h-36 rounded-xl bg-card/90 border border-white/[0.08]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            />
            <motion.div 
              className="absolute left-[360px] top-72 w-48 h-36 rounded-xl bg-card/90 border border-white/[0.08]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
