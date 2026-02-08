import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function CTASection() {
  return (
    <section className="relative py-32">
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
            Jump right in and start creating with CanvasX.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
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
        </motion.div>
      </div>
    </section>
  );
}
