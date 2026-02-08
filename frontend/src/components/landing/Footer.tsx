import { Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { withInteractable } from '@tambo-ai/react';
import { z } from 'zod';

interface FooterProps {
  brandName?: string;
  copyrightYear?: string;
  copyrightText?: string;
}

function FooterBase({
  brandName = 'CanvasX',
  copyrightYear = '2024',
  copyrightText,
}: FooterProps) {
  const displayCopyright = copyrightText || `© ${copyrightYear} ${brandName}`;

  return (
    <footer className="border-t border-white/[0.04] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-foreground flex items-center justify-center">
              <Layers className="w-2.5 h-2.5 text-background" />
            </div>
            <span className="font-medium text-xs text-muted-foreground">{brandName}</span>
          </Link>

          <div className="text-xs text-muted-foreground/40">
            {displayCopyright}
          </div>
        </div>
      </div>
    </footer>
  );
}

const FooterPropsSchema = z.object({
  brandName: z.string().optional().describe('The brand/company name displayed in the footer'),
  copyrightYear: z.string().optional().describe('The copyright year (e.g., "2024")'),
  copyrightText: z.string().optional().describe('Full copyright text (e.g., "© 2024 CanvasX"). If not provided, it will be generated from copyrightYear and brandName'),
});

export const Footer = withInteractable(FooterBase, {
  componentName: 'Footer',
  description: 'Footer component with brand name and copyright information.',
  propsSchema: FooterPropsSchema,
});
