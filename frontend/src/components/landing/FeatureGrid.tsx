import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  MousePointerClick,
  Command,
  Layers,
  Brain,
  Wand2,
  MessageSquare
} from 'lucide-react';

const features = [
  {
    icon: MousePointerClick,
    title: 'Infinite Canvas',
    description: 'Infinite workspace with precision snap-to-grid. Design without constraints.',
    accent: false,
  },
  {
    icon: Brain,
    title: 'AI Agent',
    description: 'Describe changes in natural language. Watch your design evolve in real-time.',
    accent: true,
  },
  {
    icon: Zap,
    title: 'Instant Preview',
    description: 'Every edit renders immediately. No waiting, no refreshing.',
    accent: false,
  },
  {
    icon: Command,
    title: 'Command Bar',
    description: 'Power user workflows at your fingertips. ⌘K to do anything.',
    accent: false,
  },
  {
    icon: Wand2,
    title: 'Smart Suggestions',
    description: 'Context-aware recommendations that understand your design intent.',
    accent: true,
  },
  {
    icon: Layers,
    title: 'Layer Control',
    description: 'Precise hierarchy management with visual depth indicators.',
    accent: false,
  },
];

const aiCapabilities = [
  {
    icon: MessageSquare,
    command: '"Make the hero section more impactful"',
    result: 'Increased heading size, added gradient, optimized spacing',
  },
  {
    icon: Sparkles,
    command: '"Add a testimonials grid below features"',
    result: 'Created responsive 3-column layout with avatar cards',
  },
  {
    icon: Wand2,
    command: '"Make it feel more like Linear"',
    result: 'Applied minimal aesthetics, subtle animations, refined typography',
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-[11px] font-medium text-primary tracking-widest uppercase mb-4">
            Capabilities
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter mb-4">
            Built for speed,<br />designed for clarity
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Every interaction is intentional. Every feature serves your creative flow.
          </p>
        </motion.div>

        {/* Feature grid - Bento style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className={`group relative p-6 rounded-2xl border transition-all duration-300 ${
                feature.accent 
                  ? 'bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 hover:border-primary/40' 
                  : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                feature.accent 
                  ? 'bg-primary/20' 
                  : 'bg-white/[0.04]'
              }`}>
                <feature.icon className={`w-5 h-5 ${feature.accent ? 'text-primary' : 'text-foreground/80'}`} />
              </div>
              <h3 className="text-base font-medium mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* AI Agent spotlight */}
        <motion.div
          id="ai"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mt-24"
        >
          <div className="relative rounded-3xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-transparent to-transparent p-8 md:p-12">
            {/* Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Description */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Brain className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[11px] font-medium text-primary">AI-Native</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-semibold tracking-tight mb-4">
                  Your intelligent<br />design partner
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  The AI Agent understands design intent, not just commands. Describe what you want 
                  in plain language and watch it materialize—with reasoning you can follow and 
                  results you can undo.
                </p>
                <ul className="space-y-3">
                  {['Natural language commands', 'Transparent reasoning', 'Instant undo/redo'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-foreground/80">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Terminal mockup */}
              <div className="relative">
                <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-black/60 backdrop-blur-sm">
                  {/* Terminal header */}
                  <div className="h-8 bg-white/[0.02] border-b border-white/[0.06] flex items-center px-3 gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <span className="ml-2 text-[10px] text-muted-foreground/60 font-mono">agent.log</span>
                  </div>
                  
                  {/* Terminal content */}
                  <div className="p-4 font-mono text-xs space-y-4">
                    {aiCapabilities.map((cap, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
                        className="space-y-1"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-primary">→</span>
                          <span className="text-foreground/90">{cap.command}</span>
                        </div>
                        <div className="pl-4 text-muted-foreground/60">
                          <span className="text-primary/60">// </span>{cap.result}
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Blinking cursor */}
                    <div className="flex items-center gap-2">
                      <span className="text-primary">→</span>
                      <span className="w-2 h-4 bg-primary/80 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
