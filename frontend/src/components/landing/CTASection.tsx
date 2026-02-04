import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function CTASection() {
  return (
    <section id="pricing" className="relative py-32">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter mb-4">
            Start building today
          </h2>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto">
            Free to start. No credit card required. Scale when you're ready.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link to="/builder">
              <Button 
                size="lg" 
                className="h-12 px-8 text-sm bg-foreground text-background hover:bg-foreground/90 rounded-full group"
              >
                Open Builder
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground/60">
            <span>Free tier included</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
            <span>No setup required</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
            <span>Cancel anytime</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
