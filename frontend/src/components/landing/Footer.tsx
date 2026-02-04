import { Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-foreground flex items-center justify-center">
              <Layers className="w-2.5 h-2.5 text-background" />
            </div>
            <span className="font-medium text-xs text-muted-foreground">Spatial</span>
          </Link>

          <div className="flex items-center gap-6 text-xs text-muted-foreground/60">
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Docs</a>
          </div>

          <div className="text-xs text-muted-foreground/40">
            © 2024 Spatial
          </div>
        </div>
      </div>
    </footer>
  );
}
